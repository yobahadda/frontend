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
    filiere_nom: string;
    coef: number;
  }
  
  export interface Module {
    id: number;
    nom: string;
    filiere_id: number;
    semestre: number;
    elements: []
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
    email: string
    filiere_nom: string
    imageUrl: string;
  }
  
  export interface Grade {
    id: number;
    etudiant_id: number;
    element_id: number;
    note: number;
    absent: boolean;
    valide: boolean;
    private EtudiantDTO etudiant;
  }
  
  export interface EvaluationMethod {
    id: number;
    nom: string;
    coefficient: number;
    element: string;
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
  
  