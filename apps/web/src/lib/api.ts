/**
 * Hunar API Client — Centralized HTTP client with interceptors
 * Handles JWT auth, token refresh, and error normalization
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor: Attach JWT ────────
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('hunar_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ─── Response Interceptor: Handle 401 & errors ──
let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: any) => void; reject: (e: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('hunar_refresh_token');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        const newToken = data.accessToken;

        localStorage.setItem('hunar_token', newToken);
        if (data.refreshToken) {
          localStorage.setItem('hunar_refresh_token', data.refreshToken);
        }

        processQueue(null, newToken);
        isRefreshing = false;

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        // Clear auth and redirect to login
        localStorage.removeItem('hunar_token');
        localStorage.removeItem('hunar_refresh_token');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ─── Typed API Methods ──────────────────────
export const authAPI = {
  sendOtp: (phone: string) => api.post('/auth/request-otp', { phone }),
  verifyOtp: (phone: string, otp: string, otpId?: string, role?: string) =>
    api.post('/auth/verify-otp', { phone, otp, ...(otpId ? { otpId } : {}), ...(role ? { role } : {}) }),
  refresh: (refreshToken: string) => api.post('/auth/refresh', { refreshToken }),
  me: () => api.get('/auth/me'),
};

export const workerAPI = {
  getProfile: () => api.get('/workers/me'),
  updateProfile: (data: any) => api.patch('/workers/me', data),
  toggleAvailability: () => api.patch('/workers/me/availability'),
  getEarnings: (params?: any) => api.get('/workers/me/earnings', { params }),
  getApplications: (params?: any) => api.get('/workers/me/applications', { params }),
};

export const jobAPI = {
  list: (params?: any) => api.get('/jobs', { params }),
  get: (id: string) => api.get(`/jobs/${id}`),
  apply: (jobId: string) => api.post(`/jobs/${jobId}/apply`),
  create: (data: any) => api.post('/jobs', data),
  update: (id: string, data: any) => api.patch(`/jobs/${id}`, data),
  delete: (id: string) => api.delete(`/jobs/${id}`),
  getApplicants: (id: string) => api.get(`/jobs/${id}/applicants`),
};

export const employerAPI = {
  getProfile: () => api.get('/employers/me'),
  updateProfile: (data: any) => api.patch('/employers/me', data),
  getJobs: (params?: any) => api.get('/employers/me/jobs', { params }),
  getAnalytics: () => api.get('/employers/analytics'),
};

export const customerAPI = {
  getProfile: () => api.get('/customers/me'),
  updateProfile: (data: any) => api.patch('/customers/me', data),
  getBookings: (params?: any) => api.get('/customers/me/bookings', { params }),
  createBooking: (data: any) => api.post('/customers/me/bookings', data),
  generateOtp: (bookingId: string) => api.post(`/customers/me/bookings/${bookingId}/otp`),
};

export const ratingAPI = {
  create: (data: any) => api.post('/ratings', data),
  getForWorker: (workerId: string) => api.get(`/ratings/worker/${workerId}`),
};

export const paymentAPI = {
  createOrder: (data: any) => api.post('/payments/initiate', data),
  verify: (data: any) => api.post('/payments/verify', data),
};

export const aiAPI = {
  recommend: (data: any) => api.post('/ai/recommend', data),
  extractSkills: (text: string) => api.post('/ai/extract-skills', { text }),
  predictSalary: (data: any) => api.post('/ai/predict-salary', data),
  rankApplicants: (data: any) => api.post('/ai/rank-applicants', data),
};

// ─── Notification API ──────────────────────
export const notificationAPI = {
  list: (params?: any) => api.get('/notifications', { params }),
  markRead: (id: string) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
};

export default api;
