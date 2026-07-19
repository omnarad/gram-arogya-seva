const BASE = '/api';

function getToken() {
  return localStorage.getItem('gram_token');
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong. Please try again.');
  }
  return data;
}

export const api = {
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  me: () => request('/auth/me', { auth: true }),

  listDoctors: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/doctors${qs ? `?${qs}` : ''}`);
  },
  specializations: () => request('/doctors/specializations'),
  getDoctor: (userId) => request(`/doctors/${userId}`),
  updateDoctorProfile: (payload) => request('/doctors/me/profile', { method: 'PUT', body: payload, auth: true }),

  bookAppointment: (payload) => request('/appointments', { method: 'POST', body: payload, auth: true }),
  myAppointments: () => request('/appointments/mine', { auth: true }),
  setAppointmentStatus: (id, status) => request(`/appointments/${id}/status`, { method: 'PUT', body: { status }, auth: true }),

  createPrescription: (payload) => request('/prescriptions', { method: 'POST', body: payload, auth: true }),
  getPrescription: (appointmentId) => request(`/prescriptions/${appointmentId}`, { auth: true }),

  submitFeedback: (payload) => request('/feedback', { method: 'POST', body: payload, auth: true }),
  doctorFeedback: (doctorId) => request(`/feedback/doctor/${doctorId}`)
};

export { getToken };
