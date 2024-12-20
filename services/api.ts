import axios from 'axios';

const BASE_URL = 'http://localhost:8080/';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchModules = async (professorId: number): Promise<Module[]> => {
  const response = await api.get(`/modules/professor/${professorId}`);
  return response.data;
};

export const fetchModuleElements = async (moduleId: number) => {
  const response = await api.get(`/elements/module/${moduleId}`);
  return response.data;
};

export const fetchModuleElementsByProfessor = async (professorId: number): Promise<Module[]> => {
  const response = await api.get(`/elements/professor/${professorId}`);
  return response.data;
};

export const fetchStudents = async (filiereId: number) => {
  const response = await api.get(`/etudiants/filiere/${filiereId}`);
  return response.data;
};

export const fetchGrades = async (elementId: number) => {
  const response = await api.get(`/notes/element/${elementId}`);
  return response.data;
};

export const submitGrades = async (grades: any[]) => {
  const response = await api.post('/notes/bulk', grades);
  return response.data;
};

export const updateGrade = async (gradeId: number, data: any) => {
  const response = await api.put(`/notes/${gradeId}`, data);
  return response.data;
};

export const fetchStatistics = async (professorId: number) => {
  const response = await api.get(`/statistics/professor/${professorId}`);
  return response.data;
};

export const fetchDepartments = async () => {
  const response = await api.get('/filieres');
  return response.data;
};

export const fetchEvaluationMethods = async (elementId: number) => {
  const response = await api.get(`/modalites-evaluation/element/${elementId}`);
  return response.data;
};

export const fetchAllStudents = async () => {
  const response = await api.get('/etudiants');
  return response.data;
};

export const fetchAssignedStudents = async (professorId: number, elementId: number) => {
  const response = await api.get(`/professeurs/${professorId}/elements/${elementId}/etudiants`);
  return response.data;
};

export const validateElementGrades = async (elementId: number) => {
  const response = await api.post(`/elements/${elementId}/validate`);
  return response.data;
};

export const exportElementGrades = async (elementId: number, format: 'excel' | 'pdf') => {
  const response = await api.get(`/elements/${elementId}/export?format=${format}`, {
    responseType: 'blob',
  });
  return response.data;
};

export const fetchElementStatus = async (elementId: number) => {
  const response = await api.get(`/elements/${elementId}/status`);
  return response.data;
};

export const fetchDashboardStats = async (professorId: number) => {
  const response = await api.get(`/statistics/dashboard/${professorId}`);
  return response.data;
};

export const fetchDetailedStatistics = async (professorId: number) => {
  const response = await api.get(`/statistics/detailed/${professorId}`);
  return response.data;
};

