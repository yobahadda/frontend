import axios from 'axios';
import { Student, Module, ProfessorElements, Professor, Grade } from '@/types';

const BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchModules = async (): Promise<Module[]> => {
  console.log('Fetching all modules');
  const response = await api.get('/modules');
  console.log('Modules API response:', response.data);
  return response.data;
};

export const fetchModuleElements = async (moduleId: number) => {
  const response = await api.get(`/elements/module/${moduleId}`);
  return response.data;
};

export const fetchModuleElementsByProfessor = async (professorId: number): Promise<ProfessorElements> => {
  console.log(`Fetching module elements for professor ${professorId}`);
  const response = await api.get(`/elements/professor/${professorId}`);
  console.log('Module elements API response:', response.data);
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

export const submitGrades = async (grades: Grade[]): Promise<void> => {
  console.log('Submitting grades:', grades);
  const response = await api.post('/notes/bulk', grades);
  console.log('Submit grades API response:', response.data);
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

export const fetchAllStudents = async (): Promise<Student[]> => {
  console.log('Fetching all students');
  const response = await api.get('/etudiants');
  console.log('Students API response:', response.data);
  return response.data;
};

export const fetchStudentsByProfessor = async (professorId: number): Promise<Student[]> => {
  console.log(`Fetching students for professor ${professorId}`);
  try {
    const response = await api.get(`etudiants/professeurs/${professorId}`);
    console.log('Students API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
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

export const filterModulesByProfessor = (modules: Module[], professorId: number): Module[] => {
  return modules.filter(module => 
    module.elements.some(element => element.responsable.id === professorId)
  );
};

export const fetchElementsByProfessor = async (professorId: number): Promise<ProfessorElements> => {
  console.log(`Fetching elements for professor ${professorId}`);
  const response = await api.get(`/elements/professor/${professorId}`);
  console.log('Elements API response:', response.data);
  return response.data;
};

export const fetchStudentsByElement = async (elementId: number): Promise<Student[]> => {
  console.log(`Fetching students for element ${elementId}`);
  const response = await api.get(`/etudiants/by-element/${elementId}`);
  console.log('Students by element API response:', response.data);
  return response.data;
};

