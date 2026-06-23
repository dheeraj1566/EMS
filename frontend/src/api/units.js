import api from "./axios";

export const fetchUnits = (clientId) => api.get(`/clients/${clientId}/units`);
export const fetchUnit = (clientId, unitId) => api.get(`/clients/${clientId}/units/${unitId}`);
export const addUnit = (clientId, data) => api.post(`/clients/${clientId}/units`, data);
export const updateUnit = (clientId, unitId, data) =>
  api.patch(`/clients/${clientId}/units/${unitId}`, data);
export const deleteUnit = (clientId, unitId) =>
  api.delete(`/clients/${clientId}/units/${unitId}`);

export const addSalaryRateBreakup = (clientId, unitId, data) =>
  api.post(`/clients/${clientId}/units/${unitId}/salary-rates`, data);
export const updateSalaryRateBreakup = (clientId, unitId, rateId, data) =>
  api.patch(`/clients/${clientId}/units/${unitId}/salary-rates/${rateId}`, data);
export const deleteSalaryRateBreakup = (clientId, unitId, rateId) =>
  api.delete(`/clients/${clientId}/units/${unitId}/salary-rates/${rateId}`);

export const addBillRateBreakup = (clientId, unitId, data) =>
  api.post(`/clients/${clientId}/units/${unitId}/bill-rates`, data);
export const updateBillRateBreakup = (clientId, unitId, rateId, data) =>
  api.patch(`/clients/${clientId}/units/${unitId}/bill-rates/${rateId}`, data);
export const deleteBillRateBreakup = (clientId, unitId, rateId) =>
  api.delete(`/clients/${clientId}/units/${unitId}/bill-rates/${rateId}`);
