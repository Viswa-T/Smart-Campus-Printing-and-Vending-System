import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrintOrderProvider } from './context/PrintOrderContext';
import { SplashScreen } from './pages/SplashScreen';
import { LoginScreen } from './pages/LoginScreen';
import { RegisterScreen } from './pages/RegisterScreen';
import { CollegeSearchScreen } from './pages/CollegeSearchScreen';
import { HomeScreen } from './pages/HomeScreen';
import { UploadScreen } from './pages/UploadScreen';
import { OptionsScreen } from './pages/OptionsScreen';
import { ReviewPayScreen } from './pages/ReviewPayScreen';
import { ProcessingPaymentScreen } from './pages/ProcessingPaymentScreen';
import { PaymentSuccessScreen } from './pages/PaymentSuccessScreen';
import { OrderHistoryScreen } from './pages/OrderHistoryScreen';
import { ProfileScreen } from './pages/ProfileScreen';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PrintOrderProvider>
          <div className="min-h-screen bg-[#F8F9FD] text-[#101735] flex justify-center selection:bg-[#5835F5] selection:text-white">
            <div className="w-full max-w-md min-h-screen bg-white shadow-2xl relative flex flex-col">
              <Routes>
                <Route path="/" element={<SplashScreen />} />
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/register" element={<RegisterScreen />} />
                <Route path="/colleges" element={<CollegeSearchScreen />} />
                <Route path="/home" element={<HomeScreen />} />
                <Route path="/upload" element={<UploadScreen />} />
                <Route path="/options" element={<OptionsScreen />} />
                <Route path="/review" element={<ReviewPayScreen />} />
                <Route path="/processing" element={<ProcessingPaymentScreen />} />
                <Route path="/success" element={<PaymentSuccessScreen />} />
                <Route path="/history" element={<OrderHistoryScreen />} />
                <Route path="/orders" element={<OrderHistoryScreen />} />
                <Route path="/profile" element={<ProfileScreen />} />
                <Route path="*" element={<Navigate to="/home" replace />} />
              </Routes>
            </div>
          </div>
        </PrintOrderProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
