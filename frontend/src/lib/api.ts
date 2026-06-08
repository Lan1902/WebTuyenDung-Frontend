import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { TokenResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// A07:2021 - Request interceptor: attach access token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// A07:2021 - Response interceptor: auto-refresh token on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Only attempt refresh for 401 errors, and not on auth endpoints themselves
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url &&
      !originalRequest.url.includes('/api/auth/login') &&
      !originalRequest.url.includes('/api/auth/refresh') &&
      !originalRequest.url.includes('/api/auth/register')
    ) {
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        // No refresh token - force logout
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const accessToken = localStorage.getItem('token');
        const response = await axios.post<TokenResponse>(
          `${API_URL}/api/auth/refresh`,
          {
            accessToken,
            refreshToken,
          }
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem('token', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Refresh failed - force logout
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Job Postings API
export const jobApi = {
  getAll: () => apiClient.get('/api/jobs'),
  getById: (id: string) => apiClient.get(`/api/jobs/${id}`),
  create: (data: unknown) => apiClient.post('/api/jobs', data),
  update: (id: string, data: unknown) => apiClient.put(`/api/jobs/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/jobs/${id}`),
  search: (query: string) => apiClient.get('/api/jobs/search', { params: { q: query } }),
};

// Applications API
export const applicationApi = {
  getAll: () => apiClient.get('/api/applications'),
  getById: (id: string) => apiClient.get(`/api/applications/${id}`),
  create: (data: unknown) => apiClient.post('/api/applications', data),
  updateStatus: (id: string, status: string) =>
    apiClient.patch(`/api/applications/${id}/status`, { status }),
  delete: (id: string) => apiClient.delete(`/api/applications/${id}`),
};

// Auth API
export const authApi = {
  login: (username: string, password: string) =>
    apiClient.post('/api/auth/login', { username, password }),
  register: (data: { username: string; email: string; password: string; fullName: string; role: string }) =>
    apiClient.post('/api/auth/register', data),
  refresh: (accessToken: string, refreshToken: string) =>
    apiClient.post('/api/auth/refresh', { accessToken, refreshToken }),
  logout: () => apiClient.post('/api/auth/logout'),
};

// Companies API
export const companyApi = {
  getAll: () => apiClient.get('/api/companies'),
  getById: (id: string) => apiClient.get(`/api/companies/${id}`),
  create: (data: unknown) => apiClient.post('/api/companies', data),
  update: (id: string, data: unknown) => apiClient.put(`/api/companies/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/companies/${id}`),
};

// Resume API
export const resumeApi = {
  getAll: () => apiClient.get('/api/resumes'),
  getById: (id: string) => apiClient.get(`/api/resumes/${id}`),
  create: (data: unknown) => apiClient.post('/api/resumes', data),
  update: (id: string, data: unknown) => apiClient.put(`/api/resumes/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/resumes/${id}`),
};

export default apiClient;
