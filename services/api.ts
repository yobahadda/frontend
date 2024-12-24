import axios from 'axios';

const BASE_URL = 'http://localhost:8080/';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchModules = async (professorId: number) => {
  const response = await api.get(`/modules/professor/${professorId}`);
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

export const fetchAssignedStudents = async (professorId: number, elementId: number) => {
  const response = await api.get(`/professeurs/${professorId}/elements/${elementId}/etudiants`);
  return response.data;
};

export const validateElementGrades = async (elementId: number) => {
  const response = await api.post(`/elementsDeModule/${elementId}/validate`);
  return response.data;
};

export const exportElementGrades = async (elementId: number, format: 'excel' | 'pdf' | 'csv') => {
  const response = await api.get(`/elementsDeModule/${elementId}/export?format=${format}`, {
    responseType: 'blob',
  });
  return response.data;
};

export const fetchElementStatus = async (elementId: number) => {
  const response = await api.get(`/elementsDeModule/${elementId}/status`);
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

// What the administator can do
// for professors
export const fetchAllProfessors = async () => {
  const response = await api.get('/professeurs');
  return response.data;
};

export const addProfessor = async (professor: any) => {
  const response = await api.post('/professeurs', professor);
  return response.data;
};

export const deleteProfessor = async (professorId: number) => {
  const response = await api.delete(`/professeurs/${professorId}`);
  return response.data;
};

//under construction
// export const updateProfessor = async (professorId: number, professor: any) => {
//   const response = await api.put(`/professeurs/${professorId}`, professor);
//   return response.data;
// };

//for filieres
export const fetchAllDepartments = async () => {
  const response = await api.get('/filieres');
  return response.data;
};

export const addDepartment = async (department: any) => {
  const response = await api.post('/filieres', department);
  return response.data;
};

export const deleteDepartment = async (departmentId: number) => {
  const response = await api.delete(`/filieres/${departmentId}`);
  return response.data;
};

//under construction
// export const updateDepartment = async (departmentId: number, department: any) => {
//   const response = await api.put(`/filieres/${departmentId}`, department);
//   return response.data;
// };

// for modules
export const fetchAllModules = async () => {
  const response = await api.get('/modules');
  return response.data;
};

export const addModule = async (module: any) => {
  const response = await api.post('/modules', module);
  return response.data;
};

export const deleteModule = async (moduleId: number) => {
  const response = await api.delete(`/modules/${moduleId}`);
  return response.data;
};

//under construction
// export const updateModule = async (moduleId: number, module: any) => {\
//   const response = await api.put(`/modules/${moduleId}`, module);
//   return response.data;
// };

// for students
export const fetchAllStudents = async () => {
  const response = await api.get('/etudiants');
  return response.data;
};

export const addStudent = async (student: any) => {
  const response = await api.post('/etudiants', student);
  return response.data;
}

export const deleteStudent = async (studentId: number) => {
  const response = await api.delete(`/etudiants/${studentId}`);
  return response.data;
}

//under construction
// export const updateStudent = async (studentId: number, student: any) => {
//   const response = await api.put(`/etudiants/${studentId}`, student);
//   return response.data;
// };

// for affectations

// fetch all professors with the function given above

// fetch all modules with the function given above

export const fetchAllAssignments = async () => {
  const response = await api.get('/affectation');
  return response.data;
}

export const fetchAllElements = async () => {
  const response = await api.get('/elementsDeModule');
  return response.data;
}

export const fetchModuleElements = async (moduleId: number) => {
  const response = await api.get(`/elementsDeModule/${moduleId}`);
  return response.data;
};

export const affectProfToEle = async (affectation: any) => {
  const response =  await api.post(`/affectation`,affectation)
  return response.data
}

export const deleteAffectation = async (id:number) => {
  const response = await api.delete(`/affectation/${id}`)
  return response.data
}


// for evaluation methods
// fetch all elements with the function given above
// fetch all modules with the function given above

export const fetchAllEvaluations = async () => {
  const response = await api.get('/evaluations');
  return response.data;
}

export const addEvaluation = async (evaluation: any) => {
  const response = await api.post('/evaluations', evaluation);
  return response.data;
}