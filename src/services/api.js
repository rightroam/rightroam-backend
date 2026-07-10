import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // En production : votre URL de serveur

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Injecter le token JWT automatiquement
api.interceptors.request.use(config => {
  const token = global.authToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── AUTH ──
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  lawyerRegister: (data) => api.post('/auth/lawyer/register', data),
  lawyerLogin: (data) => api.post('/auth/lawyer/login', data),
};

// ── UTILISATEUR ──
export const userService = {
  getMe: () => api.get('/users/me'),
  completeProfile: (data) => api.post('/users/complete-profile', data),
  registerTrip: (data) => api.post('/users/trips/register', data),
  getTrips: () => api.get('/users/trips'),
  activateTrip: (id) => api.patch(`/users/trips/${id}/activate`),
  endTrip: (id) => api.patch(`/users/trips/${id}/end`),
};

// ── AVOCATS ──
export const lawyerService = {
  searchByCity: (city, language) => api.get('/lawyers/search', { params: { city, language } }),
  getProfile: (id) => api.get(`/lawyers/${id}`),
  updateCities: (data) => api.patch('/lawyers/cities', data),
  updateAvailability: (is_available) => api.patch('/lawyers/availability', { is_available }),
};

// ── DOSSIERS ──
export const caseService = {
  create: (data) => api.post('/cases', data),
  getMyCases: () => api.get('/cases/my'),
  getLawyerCases: () => api.get('/cases/lawyer/my'),
  updateStatus: (id, status) => api.patch(`/cases/${id}/status`, { status }),
  addReview: (id, data) => api.post(`/cases/${id}/review`, data),
};

// ── PAIEMENT ──
export const paymentService = {
  getPlans: () => api.get('/payment/plans'),
  createStripeIntent: (plan_type) => api.post('/payment/stripe/create-intent', { plan_type }),
  createPaypalOrder: (plan_type) => api.post('/payment/paypal/create-order', { plan_type }),
  capturePaypal: (orderId) => api.post(`/payment/paypal/capture/${orderId}`),
};
