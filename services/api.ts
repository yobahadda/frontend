import axios from 'axios';
import { Student, Module, ProfessorElements, Professor, Grade, Filiere, ModuleElement } from '@/types';

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

export const fetchEvaluationMethods = async (elementId: number): Promise<EvaluationMethod[]> => {
  console.log(`Fetching evaluation methods for element ${elementId}`);
  const response = await api.get(`elements/modalites-evaluation/element/${elementId}`);
  console.log('Evaluation methods API response:', response.data);
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

// export const fetchGrades = async (elementId: number) => {
//   const response = await api.get(`/notes/element/${elementId}`);
//   return response.data;
// };

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

export const fetchFilieres = async (): Promise<Filiere[]> => {
  console.log('Fetching all filieres');
  const response = await api.get('/filieres');
  console.log('Filieres API response:', response.data);
  return response.data;
};

export const addFiliere = async (filiere: { nom: string; description: string }): Promise<Filiere> => {
  console.log('Adding new filiere:', filiere);
  const response = await api.post('/filieres', filiere);
  console.log('Add filiere API response:', response.data);
  return response.data;
};

// export const fetchEvaluationMethods = async (elementId: number) => {
//   const response = await api.get(`/modalites-evaluation/element/${elementId}`);
//   return response.data;
// };

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

export const fetchGrades = async (elementId: number): Promise<Grade[]> => {
  console.log(`Fetching grades for element ${elementId}`);
  try {
    const response = await api.get(`/notes/elements/${elementId}`);
    console.log('Grades API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching grades:', error);
    throw error;
  }
};

export const fetchElementsByProfessor = async (professorId: number): Promise<ProfessorElements> => {
  console.log(`Fetching elements for professor ${professorId}`);
  const response = await api.get(`/elements/professor/${professorId}`);
  console.log('Elements API response:', response.data);
  return response.data;
};

export const fetchProfessors = async (): Promise<Professor[]> => {
  console.log('Fetching all professors');
  const response = await api.get('/professeurs');
  console.log('Professors API response:', response.data);
  return response.data;
}

export const fetchStudentsByElement = async (elementId: number): Promise<Student[]> => {
  console.log(`Fetching students for element ${elementId}`);
  const response = await api.get(`/etudiants/by-element/${elementId}`);
  console.log('Students by element API response:', response.data);
  return response.data;
};

export const fetchAllElements = async (): Promise<ModuleElement[]> => {
  console.log('Fetching all elements');
  const response = await api.get('/elements');
  console.log('Elements API response:', response.data);
  return response.data;
};

export const createProfessorAssignment = async (professorId: number, elementId: number): Promise<any> => {
  console.log(`Creating assignment for professor ${professorId} to element ${elementId}`);
  const response = await api.post('/professor-assignments', { professorId, elementId });
  console.log('Create assignment API response:', response.data);
  return response.data;
};

export const deleteProfessorAssignment = async (assignmentId: number): Promise<void> => {
  console.log(`Deleting assignment ${assignmentId}`);
  await api.delete(`/professor-assignments/${assignmentId}`);
  console.log('Delete assignment API response: success');
};

export const fetchProfessorAssignments = async (): Promise<any[]> => {
  console.log('Fetching all professor assignments');
  const response = await api.get('/professor-assignments');
  console.log('Professor assignments API response:', response.data);
  return response.data;
};

export const fetchAssignments = async (): Promise<any[]> => {
  console.log('Fetching all assignments');
  const response = await api.get('/affectations');
  console.log('Assignments API response:', response.data);
  return response.data;
};

export const createAssignment = async (elementId: number, professorId: number): Promise<any> => {
  console.log(`Creating assignment for element ${elementId} and professor ${professorId}`);
  const response = await api.post(`/affectations/assign/${elementId}/${professorId}`);
  console.log('Create assignment API response:', response.data);
  return response.data;
};

export const deleteAssignment = async (assignmentId: number): Promise<void> => {
  console.log(`Deleting assignment ${assignmentId}`);
  await api.delete(`/affectations/${assignmentId}`);
  console.log('Delete assignment API response: success');
};