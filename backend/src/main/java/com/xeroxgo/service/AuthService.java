package com.xeroxgo.service;

import com.xeroxgo.dto.*;
import com.xeroxgo.entity.College;
import com.xeroxgo.entity.User;
import com.xeroxgo.entity.UserCollegeMembership;
import com.xeroxgo.entity.VerificationToken;
import com.xeroxgo.exception.BadRequestException;
import com.xeroxgo.exception.ResourceNotFoundException;
import com.xeroxgo.exception.UnauthorizedException;
import com.xeroxgo.repository.CollegeRepository;
import com.xeroxgo.repository.UserCollegeMembershipRepository;
import com.xeroxgo.repository.UserRepository;
import com.xeroxgo.repository.VerificationTokenRepository;
import com.xeroxgo.security.JwtTokenProvider;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;


import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;


@Service
public class AuthService {

    private final UserRepository userRepository;
    private final CollegeRepository collegeRepository;
    private final UserCollegeMembershipRepository membershipRepository;
    private final VerificationTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final SecureRandom secureRandom = new SecureRandom();


    @Value("${google.oauth.client-id}")
    private String googleClientId;

    @Transactional
    public AuthResponse loginWithGoogle(String credential) {

        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    GsonFactory.getDefaultInstance()
            )
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(credential);

            if (idToken == null) {
                throw new UnauthorizedException(
                        "Invalid Google credential"
                );
            }

            GoogleIdToken.Payload payload = idToken.getPayload();

            // Require Google's verified-email claim.
            if (!Boolean.TRUE.equals(payload.getEmailVerified())) {
                throw new UnauthorizedException(
                        "Google email is not verified"
                );
            }

            String email = payload.getEmail();

            if (email == null || email.isBlank()) {
                throw new UnauthorizedException(
                        "Google account email is unavailable"
                );
            }

            email = email.trim().toLowerCase();

            // Only existing XeroxGo accounts can sign in.
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() ->
                            new UnauthorizedException(
                                    "No XeroxGo account exists for this Google email. Please register first."
                            )
                    );

            if (!"ACTIVE".equalsIgnoreCase(user.getAccountStatus())) {
                throw new UnauthorizedException(
                        "Your account is suspended or inactive"
                );
            }

            user.setLastLoginAt(LocalDateTime.now());
            userRepository.save(user);

            // Reuse your existing JWT authentication.
            String token = tokenProvider.generateToken(
                    user.getEmail(),
                    user.getId()
            );

            return new AuthResponse(
                    token,
                    mapToUserDto(user)
            );

        } catch (IOException | GeneralSecurityException e) {
            throw new UnauthorizedException(
                    "Unable to verify your Google account"
            );
        }
    }

    
    public AuthService(UserRepository userRepository,
                       CollegeRepository collegeRepository,
                       UserCollegeMembershipRepository membershipRepository,
                       VerificationTokenRepository tokenRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.collegeRepository = collegeRepository;
        this.membershipRepository = membershipRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("An account with this email already exists");
        }

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setEmailVerified(false);
        user.setAccountStatus("ACTIVE");

        if (request.getCollegeId() != null) {
            College college = collegeRepository.findById(request.getCollegeId())
                    .orElseThrow(() -> new BadRequestException("Selected college does not exist"));
            user.setSelectedCollegeId(college.getId());
        }

        user = userRepository.save(user);

        if (request.getCollegeId() != null) {
            UserCollegeMembership membership = new UserCollegeMembership(user.getId(), request.getCollegeId());
            membership.setVerificationStatus("UNVERIFIED");
            membershipRepository.save(membership);
        }

        // Generate email verification token
        generateVerificationToken(user.getId(), "EMAIL_VERIFY");

        String token = tokenProvider.generateToken(user.getEmail(), user.getId());
        return new AuthResponse(token, mapToUserDto(user));
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        if (!"ACTIVE".equalsIgnoreCase(user.getAccountStatus())) {
            throw new UnauthorizedException("Account is suspended or inactive");
        }

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        String token = tokenProvider.generateToken(user.getEmail(), user.getId());
        return new AuthResponse(token, mapToUserDto(user));
    }

    public User getCurrentAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof org.springframework.security.core.userdetails.UserDetails userDetails) {
            return userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new UnauthorizedException("Authenticated user not found"));
        }
        throw new UnauthorizedException("No authenticated user in context");
    }

    public UserDto getCurrentUserProfile() {
        User user = getCurrentAuthenticatedUser();
        return mapToUserDto(user);
    }

    @Transactional
    public UserDto updateProfile(UpdateProfileRequest request) {
        User user = getCurrentAuthenticatedUser();

        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            user.setFullName(request.getFullName().trim());
        }

        if (request.getSelectedCollegeId() != null) {
            College college = collegeRepository.findById(request.getSelectedCollegeId())
                    .orElseThrow(() -> new BadRequestException("Selected college does not exist"));
            user.setSelectedCollegeId(college.getId());

            Long currentUserId = user.getId();
            Long selectedCollegeId = college.getId();
            membershipRepository.findByUserIdAndCollegeId(currentUserId, selectedCollegeId)
                    .orElseGet(() -> membershipRepository.save(new UserCollegeMembership(currentUserId, selectedCollegeId)));
        }

        User savedUser = userRepository.save(user);
        return mapToUserDto(savedUser);
    }

    @Transactional
    public void verifyEmail(String rawToken) {
        String tokenHash = hashToken(rawToken);
        VerificationToken token = tokenRepository
                .findByTokenHashAndTokenTypeAndUsedAtIsNull(tokenHash, "EMAIL_VERIFY")
                .orElseThrow(() -> new BadRequestException("Invalid or expired verification token"));

        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Verification token has expired");
        }

        token.setUsedAt(LocalDateTime.now());
        tokenRepository.save(token);

        User user = userRepository.findById(token.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setEmailVerified(true);
        userRepository.save(user);

        // Update college membership status to VERIFIED
        membershipRepository.findByUserId(user.getId()).ifPresent(membership -> {
            membership.setVerificationStatus("VERIFIED");
            membership.setVerifiedAt(LocalDateTime.now());
            membershipRepository.save(membership);
        });
    }

    @Transactional
    public String resendVerification(String email) {
        String cleanEmail = email.trim().toLowerCase();
        User user = userRepository.findByEmail(cleanEmail)
                .orElseThrow(() -> new BadRequestException("User with specified email does not exist"));

        if (user.isEmailVerified()) {
            throw new BadRequestException("Account email is already verified");
        }

        return generateVerificationToken(user.getId(), "EMAIL_VERIFY");
    }

    @Transactional
    public String forgotPassword(String email) {
        String cleanEmail = email.trim().toLowerCase();
        User user = userRepository.findByEmail(cleanEmail).orElse(null);
        if (user != null) {
            return generateVerificationToken(user.getId(), "PASSWORD_RESET");
        }
        return "If your email is registered, a reset link has been dispatched";
    }

    @Transactional
    public void resetPassword(String rawToken, String newPassword) {
        String tokenHash = hashToken(rawToken);
        VerificationToken token = tokenRepository
                .findByTokenHashAndTokenTypeAndUsedAtIsNull(tokenHash, "PASSWORD_RESET")
                .orElseThrow(() -> new BadRequestException("Invalid or expired reset token"));

        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Reset token has expired");
        }

        token.setUsedAt(LocalDateTime.now());
        tokenRepository.save(token);

        User user = userRepository.findById(token.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public String generateVerificationToken(Long userId, String type) {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        String tokenHash = hashToken(rawToken);

        VerificationToken token = new VerificationToken(
                userId,
                tokenHash,
                type,
                LocalDateTime.now().plusHours(24)
        );
        tokenRepository.save(token);
        return rawToken;
    }

    public String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 not available", e);
        }
    }

    public UserDto mapToUserDto(User user) {
        String collegeName = null;
        if (user.getSelectedCollegeId() != null) {
            collegeName = collegeRepository.findById(user.getSelectedCollegeId())
                    .map(College::getCollegeName)
                    .orElse(null);
        }

        return new UserDto(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.isEmailVerified(),
                user.getAccountStatus(),
                user.getSelectedCollegeId(),
                collegeName
        );
    }
}
