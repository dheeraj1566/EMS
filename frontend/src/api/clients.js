import api from "./axios";

export const fetchClients = (params) => api.get("/clients", { params });
export const fetchClient = (clientId) => api.get(`/clients/${clientId}`);
export const createClient = (data) => api.post("/clients", data);
export const updateClient = (clientId, data) => api.patch(`/clients/${clientId}`, data);
export const deleteClient = (clientId) => api.delete(`/clients/${clientId}`);
