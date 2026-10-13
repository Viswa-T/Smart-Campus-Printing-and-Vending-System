import {
  ApiResponse,
  CheckoutResponse,
  CollectionValidationResult,
  College,
  Machine,
  Order,
  PagedResponse,
  PricingQuote,
  UploadedDocument,
  User,
} from '../types';

interface AuthResponseData {
  token: string;
  tokenType: string;
  user: User;
}



const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api/v1`
  : '/api/v1';

function getToken(): string | null {
  return localStorage.getItem('xeroxgo_token');
}

export function setToken(token: string) {
  localStorage.setItem('xeroxgo_token', token);
}

export function removeToken() {
  localStorage.removeItem('xeroxgo_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data: ApiResponse<T> = await response.json().catch(() => ({
    success: false,
    message: 'Failed to parse response from server',
    data: null as unknown as T,
  }));

  if (!response.ok || !data.success) {
    const errorMsg = data?.message || `HTTP ${response.status}: Request failed`;
    throw new Error(errorMsg);
  }

  return data.data;
}

// Authentication API
export const authApi = {
  register: (payload: { fullName: string; email: string; password: string; confirmPassword: string; collegeId?: number }) =>
    request<AuthResponseData>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }) =>
    request<AuthResponseData>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

    googleLogin: (credential: string) =>
  request<AuthResponseData>('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ credential }),
  }),

  getMe: () => request<User>('/auth/me'),

  logout: () => {
    removeToken();
    return request<void>('/auth/logout', { method: 'POST' }).catch(() => {});
  },

  verifyEmail: (token: string) =>
    request<void>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),

  resendVerification: (email: string) =>
    request<{ token: string }>('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  forgotPassword: (email: string) =>
    request<{ status: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (payload: { token: string; newPassword: string }) =>
    request<void>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateProfile: (payload: { fullName?: string; selectedCollegeId?: number }) =>
    request<User>('/profile', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
};

// College Directory API
export const collegeApi = {
  searchColleges: (params: { search?: string; city?: string; state?: string; page?: number; size?: number } = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.city) query.set('city', params.city);
    if (params.state) query.set('state', params.state);
    if (params.page !== undefined) query.set('page', params.page.toString());
    if (params.size !== undefined) query.set('size', params.size.toString());

    return request<PagedResponse<College>>(`/colleges?${query.toString()}`);
  },

  getCollegeById: (id: number) =>
    request<{ college: College; machines: Machine[] }>(`/colleges/${id}`),

  getMachinesForCollege: (collegeId: number) =>
    request<Machine[]>(`/colleges/${collegeId}/machines`),
};

// Machine Directory API
export const machineApi = {
  getMachines: (collegeId?: number) => {
    const query = collegeId ? `?collegeId=${collegeId}` : '';
    return request<Machine[]>(`/machines${query}`);
  },

  getMachineById: (id: number) => request<Machine>(`/machines/${id}`),
};

// Document Management API
export const documentApi = {
  uploadDocument: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return request<UploadedDocument>('/documents', {
      method: 'POST',
      body: formData,
    });
  },

  getUserDocuments: () => request<UploadedDocument[]>('/documents'),

  getDocumentContentUrl: (docId: number) => `${API_BASE_URL}/documents/${docId}/content`,

  deleteDocument: (docId: number) =>
    request<void>(`/documents/${docId}`, {
      method: 'DELETE',
    }),
};

// Authoritative Pricing API
export const pricingApi = {
  getQuote: (payload: {
    documentIds: number[];
    colorMode: 'BW' | 'COLOR';
    printSides: 'SINGLE' | 'DOUBLE';
    copies: number;
  }) =>
    request<PricingQuote>('/pricing/quote', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

// Order Workflow API
export const orderApi = {
  createOrder: (payload: {
    collegeId: number;
    machineId: number;
    documentIds: number[];
    colorMode: 'BW' | 'COLOR';
    printSides: 'SINGLE' | 'DOUBLE';
    copies: number;
  }) =>
    request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getUserOrders: (params: { status?: string; page?: number; size?: number } = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.page !== undefined) query.set('page', params.page.toString());
    if (params.size !== undefined) query.set('size', params.size.toString());

    return request<PagedResponse<Order>>(`/orders?${query.toString()}`);
  },

  getOrderById: (orderId: number) => request<Order>(`/orders/${orderId}`),

  getOrderByRef: (reference: string) => request<Order>(`/orders/ref/${reference}`),

  cancelOrder: (orderId: number) =>
    request<Order>(`/orders/${orderId}/cancel`, {
      method: 'POST',
    }),
};

// Payment Integration API
export const paymentApi = {
  checkout: (payload: { orderId: number; paymentMethod: string }) =>
    request<CheckoutResponse>('/payments/checkout', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

// Collection & Kiosk Validation API
export const collectionApi = {
  validateCode: (code: string, machineCode?: string) =>
    request<CollectionValidationResult>('/collection/validate', {
      method: 'POST',
      body: JSON.stringify({ code, machineCode }),
    }),

  completeCollection: (code: string, machineCode?: string) =>
    request<void>('/collection/complete', {
      method: 'POST',
      body: JSON.stringify({ code, machineCode }),
    }),
};

// System Health API
export const healthApi = {
  getHealth: () => request<{ status: string; databaseConnected: boolean; timestamp: string }>('/health'),
};
