import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://newstylegym-back.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ===================== GYM MODULE =====================

export const gymApi = {
  // Gym Profiles
  createProfile: (data) => api.post('/gym/profiles', data),
  getProfile: (userId) => api.get(`/gym/profiles/user/${userId}`),
  getAllProfiles: () => api.get('/gym/profiles'),
  updateProfile: (userId, data) => api.put(`/gym/profiles/user/${userId}`, data),
  deleteProfile: (id) => api.delete(`/gym/profiles/${id}`),

  // Membership Plans
  createPlan: (data) => api.post('/gym/plans', data),
  getAllPlans: () => api.get('/gym/plans'),
  getPlan: (id) => api.get(`/gym/plans/${id}`),
  updatePlan: (id, data) => api.put(`/gym/plans/${id}`, data),
  deletePlan: (id) => api.delete(`/gym/plans/${id}`),

  // Subscriptions
  createSubscription: (data) => api.post('/gym/subscriptions', data),
  getAllSubscriptions: () => api.get('/gym/subscriptions'),
  getUserSubscriptions: (userId) => api.get(`/gym/subscriptions/user/${userId}`),
  getUserActiveSubscription: (userId) => api.get(`/gym/subscriptions/user/${userId}/active`),
  getExpiredSubscriptions: () => api.get('/gym/subscriptions/expired'),
  getDelinquentUsers: () => api.get('/gym/subscriptions/delinquent-users'),
  updateSubscription: (id, data) => api.put(`/gym/subscriptions/${id}`, data),
  cancelSubscription: (id) => api.put(`/gym/subscriptions/${id}/cancel`),
  deleteSubscription: (id) => api.delete(`/gym/subscriptions/${id}`),

  // Payments
  createPayment: (data) => api.post('/gym/payments', data),
  getAllPayments: () => api.get('/gym/payments'),
  getUserPayments: (userId) => api.get(`/gym/payments/user/${userId}`),
  getRevenueByMonth: () => api.get('/gym/payments/revenue'),
  deletePayment: (id) => api.delete(`/gym/payments/${id}`),

  // Attendance
  checkIn: (data) => api.post('/gym/attendance/checkin', data),
  checkOut: (id) => api.put(`/gym/attendance/checkout/${id}`),
  getCurrentlyPresent: () => api.get('/gym/attendance/present'),
  getDailyCount: (date) => api.get(`/gym/attendance/daily-count/${date}`),
  getUserAttendance: (userId) => api.get(`/gym/attendance/user/${userId}`),
  getAttendanceByRange: (startDate, endDate) => api.get(`/gym/attendance?startDate=${startDate}&endDate=${endDate}`),

  // Classes
  createClass: (data) => api.post('/gym/classes', data),
  getAllClasses: () => api.get('/gym/classes'),
  getClass: (id) => api.get(`/gym/classes/${id}`),
  updateClass: (id, data) => api.put(`/gym/classes/${id}`, data),
  deleteClass: (id) => api.delete(`/gym/classes/${id}`),

  // Schedules
  createSchedule: (data) => api.post('/gym/classes/schedules', data),
  getWeeklySchedule: () => api.get('/gym/classes/schedules/weekly'),
  getScheduleByDay: (day) => api.get(`/gym/classes/schedules/day/${day}`),
  getScheduleByClass: (classId) => api.get(`/gym/classes/schedules/class/${classId}`),
  updateSchedule: (id, data) => api.put(`/gym/classes/schedules/${id}`, data),
  deleteSchedule: (id) => api.delete(`/gym/classes/schedules/${id}`),

  // Bookings
  bookClass: (data) => api.post('/gym/bookings', data),
  getUserBookings: (userId) => api.get(`/gym/bookings/user/${userId}`),
  getBookingsBySchedule: (scheduleId, fechaClase) => api.get(`/gym/bookings/schedule/${scheduleId}?fechaClase=${fechaClase}`),
  cancelBooking: (id) => api.put(`/gym/bookings/${id}/cancel`),
  markAttendance: (id) => api.put(`/gym/bookings/${id}/attend`),
  markNoShow: (id) => api.put(`/gym/bookings/${id}/no-show`),

  // Progress
  createProgressRecord: (data) => api.post('/gym/progress', data),
  getUserProgress: (userId) => api.get(`/gym/progress/user/${userId}`),
  getLatestProgress: (userId) => api.get(`/gym/progress/user/${userId}/latest`),
  updateProgress: (id, data) => api.put(`/gym/progress/${id}`, data),
  deleteProgress: (id) => api.delete(`/gym/progress/${id}`),

  // Notifications
  createNotification: (data) => api.post('/gym/notifications', data),
  createBulkNotifications: (data) => api.post('/gym/notifications/bulk', data),
  getUserNotifications: (userId, limit = 20) => api.get(`/gym/notifications/user/${userId}?limit=${limit}`),
  getUnreadCount: (userId) => api.get(`/gym/notifications/user/${userId}/unread-count`),
  markAsRead: (id) => api.put(`/gym/notifications/${id}/read`),
  markAllAsRead: (userId) => api.put(`/gym/notifications/user/${userId}/read-all`),
  deleteNotification: (id) => api.delete(`/gym/notifications/${id}`),
  runExpiringNotifications: () => api.post('/gym/notifications/auto/expiring'),
  runExpiredNotifications: () => api.post('/gym/notifications/auto/expired'),

  // Trainer-Client Assignments
  assignTrainer: (data) => api.post('/gym/trainer-clients', data),
  getAllAssignments: () => api.get('/gym/trainer-clients'),
  getClientsByTrainer: (trainerId) => api.get(`/gym/trainer-clients/trainer/${trainerId}`),
  getTrainersByClient: (clientId) => api.get(`/gym/trainer-clients/client/${clientId}`),
  getTrainerStats: (trainerId) => api.get(`/gym/trainer-clients/trainer/${trainerId}/stats`),
  updateAssignment: (id, data) => api.put(`/gym/trainer-clients/${id}`, data),
  removeAssignment: (id) => api.delete(`/gym/trainer-clients/${id}`),
};

export default api;
