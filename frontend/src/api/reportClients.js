import api from "./axios";

export const fetchReportClients = () => api.get("/report-clients");
export const fetchReportClient = (id) => api.get(`/report-clients/${id}`);
export const createReportClient = (data) => api.post("/report-clients", data);
export const updateReportClient = (id, data) => api.patch(`/report-clients/${id}`, data);
export const deleteReportClient = (id) => api.delete(`/report-clients/${id}`);
