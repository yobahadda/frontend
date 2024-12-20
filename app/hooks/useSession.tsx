import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Professor {
  id: number;
  nom: string;
  prenom: string;
  specialite: string;
  codeIdentification: string;
  login: string;
  imageUrl: string;
}

export function useSession() {
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedProfessor = localStorage.getItem('professor');
    if (storedProfessor) {
      setProfessor(JSON.parse(storedProfessor));
    }
    setLoading(false);
  }, []);

  const login = async (login: string, password: string) => {
    try {
      const response = await axios.get(`http://localhost:8080/professeurs/by-login/${login}`);
      const professorData = response.data;
      
      if (professorData && professorData.motDePasse === password) {
        const { motDePasse, ...professorWithoutPassword } = professorData;
        setProfessor(professorWithoutPassword);
        localStorage.setItem('professor', JSON.stringify(professorWithoutPassword));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setProfessor(null);
    localStorage.removeItem('professor');
    router.push('/login');
  };

  return { professor, loading, login, logout };
}

