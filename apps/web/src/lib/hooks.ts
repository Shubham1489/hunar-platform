/**
 * React Query Hooks — Typed hooks for all API endpoints
 * Use these in components instead of calling API directly
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  workerAPI, jobAPI, employerAPI, customerAPI,
  ratingAPI, aiAPI, notificationAPI, paymentAPI,
} from './api';

// ─── Query Keys (centralized) ──────────────
export const queryKeys = {
  // Worker
  workerProfile: ['worker', 'profile'] as const,
  workerEarnings: (params?: any) => ['worker', 'earnings', params] as const,
  workerApplications: (params?: any) => ['worker', 'applications', params] as const,

  // Jobs
  jobs: (params?: any) => ['jobs', params] as const,
  job: (id: string) => ['jobs', id] as const,
  jobApplicants: (id: string) => ['jobs', id, 'applicants'] as const,

  // Employer
  employerProfile: ['employer', 'profile'] as const,
  employerJobs: (params?: any) => ['employer', 'jobs', params] as const,
  employerAnalytics: ['employer', 'analytics'] as const,

  // Customer
  customerProfile: ['customer', 'profile'] as const,
  customerBookings: (params?: any) => ['customer', 'bookings', params] as const,

  // Notifications
  notifications: (params?: any) => ['notifications', params] as const,
};

// ─── Worker Hooks ──────────────────────────
export function useWorkerProfile() {
  return useQuery({
    queryKey: queryKeys.workerProfile,
    queryFn: () => workerAPI.getProfile().then(r => r.data),
  });
}

export function useUpdateWorkerProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => workerAPI.updateProfile(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.workerProfile }),
  });
}

export function useToggleAvailability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => workerAPI.toggleAvailability(),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.workerProfile }),
  });
}

export function useWorkerEarnings(params?: any) {
  return useQuery({
    queryKey: queryKeys.workerEarnings(params),
    queryFn: () => workerAPI.getEarnings(params).then(r => r.data),
  });
}

export function useWorkerApplications(params?: any) {
  return useQuery({
    queryKey: queryKeys.workerApplications(params),
    queryFn: () => workerAPI.getApplications(params).then(r => r.data),
  });
}

// ─── Job Hooks ─────────────────────────────
export function useJobs(params?: any) {
  return useQuery({
    queryKey: queryKeys.jobs(params),
    queryFn: () => jobAPI.list(params).then(r => r.data),
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: queryKeys.job(id),
    queryFn: () => jobAPI.get(id).then(r => r.data),
    enabled: !!id,
  });
}

export function useApplyJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => jobAPI.apply(jobId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['worker', 'applications'] });
    },
  });
}

export function useCreateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => jobAPI.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['employer', 'jobs'] }),
  });
}

export function useJobApplicants(id: string) {
  return useQuery({
    queryKey: queryKeys.jobApplicants(id),
    queryFn: () => jobAPI.getApplicants(id).then(r => r.data),
    enabled: !!id,
  });
}

// ─── Employer Hooks ────────────────────────
export function useEmployerProfile() {
  return useQuery({
    queryKey: queryKeys.employerProfile,
    queryFn: () => employerAPI.getProfile().then(r => r.data),
  });
}

export function useEmployerJobs(params?: any) {
  return useQuery({
    queryKey: queryKeys.employerJobs(params),
    queryFn: () => employerAPI.getJobs(params).then(r => r.data),
  });
}

export function useEmployerAnalytics() {
  return useQuery({
    queryKey: queryKeys.employerAnalytics,
    queryFn: () => employerAPI.getAnalytics().then(r => r.data),
  });
}

// ─── Customer Hooks ────────────────────────
export function useCustomerProfile() {
  return useQuery({
    queryKey: queryKeys.customerProfile,
    queryFn: () => customerAPI.getProfile().then(r => r.data),
  });
}

export function useCustomerBookings(params?: any) {
  return useQuery({
    queryKey: queryKeys.customerBookings(params),
    queryFn: () => customerAPI.getBookings(params).then(r => r.data),
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => customerAPI.createBooking(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['customer', 'bookings'] }),
  });
}

export function useGenerateCompletionOtp() {
  return useMutation({
    mutationFn: (bookingId: string) => customerAPI.generateOtp(bookingId),
  });
}

// ─── Rating Hooks ──────────────────────────
export function useCreateRating() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => ratingAPI.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customer', 'bookings'] });
    },
  });
}

// ─── AI Hooks ──────────────────────────────
export function useAIRecommendations() {
  return useMutation({
    mutationFn: (data: any) => aiAPI.recommend(data).then(r => r.data),
  });
}

export function useExtractSkills() {
  return useMutation({
    mutationFn: (text: string) => aiAPI.extractSkills(text).then(r => r.data),
  });
}

export function usePredictSalary() {
  return useMutation({
    mutationFn: (data: any) => aiAPI.predictSalary(data).then(r => r.data),
  });
}

export function useRankApplicants() {
  return useMutation({
    mutationFn: (data: any) => aiAPI.rankApplicants(data).then(r => r.data),
  });
}

// ─── Notification Hooks ────────────────────
export function useNotifications(params?: any) {
  return useQuery({
    queryKey: queryKeys.notifications(params),
    queryFn: () => notificationAPI.list(params).then(r => r.data),
    refetchInterval: 30000, // Poll every 30s
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationAPI.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

// ─── Payment Hooks ─────────────────────────
export function useCreatePaymentOrder() {
  return useMutation({
    mutationFn: (data: any) => paymentAPI.createOrder(data).then(r => r.data),
  });
}

export function useVerifyPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => paymentAPI.verify(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['customer', 'bookings'] }),
  });
}
