export interface Professeur {
    id: number;
    nom: string;
    prenom: string;
    specialite: string;
    code_identification: string;
    login: string;
    mot_de_passe?: string;
  }
  
  export interface ModuleElement {
    id: number;
    nom: string;
    module_id: number;
    coef: number;
  }
  
  export interface Module {
    id: number;
    nom: string;
    filiere_id: number;
    semestre: number;
  }
  
  export interface Department {
    id: number;
    nom: string;
    description: string;
  }
  
  export interface Student {
    id: number;
    nom: string;
    prenom: string;
    filiere: {
      id: number;
      nom: string;
      description: string;
    };
    notes: any[];
    imageUrl: string;
  }
  
  export interface Grade {
    id: number;
    etudiant_id: number;
    element_id: number;
    note: number;
    absent: boolean;
    valide: boolean;
  }
  
  export interface EvaluationMethod {
    id: number;
    nom: string;
    coefficient: number;
    element_id: number;
  }
  
  export interface ProfessorAssignment {
    id: number;
    professeur_id: number;
    element_id: number;
  }
  
  export interface ApiResponse<T> {
    data?: T;
    error?: string;
    message?: string;
  }
  
  