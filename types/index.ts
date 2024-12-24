export interface Professor {
  id: number;
  nom: string;
  prenom: string;
  specialite: string;
  codeIdentification: string;
  login: string;
  motDePasse?: string;
  imageUrl: string;
}

export interface ModuleElement {
  id: number;
  nom: string;
  coefficient: number;
  responsable: Professor;
}

export interface Module {
  id: number;
  nom: string;
  semestre: number;
  anneeUniversitaire: string;
  elements: ModuleElement[];
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
  email: string;
  filiere: Filiere;
  anneeEtude: number;
  imageUrl: string;
  notes: any[];
}

export interface Grade {
  note: number;
  rattrapage_possible: boolean;
  valide: boolean;
  element_id: number;
  etudiant_id: number;
  absent: boolean;
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

export interface Filiere {
  id: number;
  nom: string;
  description: string;
  modules: Module[];
}

export type ProfessorElements = ModuleElement[];

