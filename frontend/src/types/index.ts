export interface User {
  id: number;
  fullName: string;
  email: string;
  emailVerified: boolean;
  accountStatus: string;
  selectedCollegeId: number | null;
  selectedCollegeName: string | null;
}

export interface College {
  id: number;
  collegeName: string;
  abbreviation: string | null;
  city: string;
  state: string;
  country: string;
  address: string | null;
  logoUrl: string | null;
  activeMachineCount: number;
}

export interface Machine {
  id: number;
  collegeId: number;
  collegeName: string;
  machineCode: string;
  machineName: string;
  locationDescription: string;
  address: string | null;
  operationalStatus: 'ACTIVE' | 'BUSY' | 'OFFLINE' | 'MAINTENANCE';
  availableSlots: number;
  totalSlots: number;
  distanceKm: number;
  supportedColorModes: string;
  supportedPrintSides: string;
  active: boolean;
}

export interface UploadedDocument {
  id: number;
  originalFilename: string;
  detectedMimeType: string;
  fileSizeBytes: number;
  formattedSize: string;
  pageCount: number;
  processingStatus: string;
  createdAt: string;
}

export interface PricingQuote {
  documentCount: number;
  totalPages: number;
  copies: number;
  totalChargeablePages: number;
  colorMode: 'BW' | 'COLOR';
  printSides: 'SINGLE' | 'DOUBLE';
  ratePerPage: number;
  baseAmount: number;
  discountPercentage: number;
  discountAmount: number;
  finalAmount: number;
  currency: string;
  pricingVersion: string;
}

export interface Order {
  id: number;
  publicOrderReference: string;
  collegeId: number;
  collegeName: string;
  machineId: number;
  machineName: string;
  machineLocation: string;
  orderStatus: string;
  totalPages: number;
  copies: number;
  colorMode: 'BW' | 'COLOR';
  printSides: 'SINGLE' | 'DOUBLE';
  baseAmount: number;
  discountAmount: number;
  finalAmount: number;
  currency: string;
  createdAt: string;
  paidAt: string | null;
  collectedAt: string | null;
  accessCode: string | null;
  documents: UploadedDocument[];
}

export interface CheckoutResponse {
  paymentId: number;
  orderId: number;
  publicOrderReference: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  paymentProvider: string;
  providerReference: string;
  accessCode: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PagedResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface CollectionValidationResult {
  valid: boolean;
  message: string;
  orderReference?: string;
  machineName?: string;
  totalPages?: number;
  copies?: number;
  colorMode?: string;
  printSides?: string;
  documentNames?: string[];
}
