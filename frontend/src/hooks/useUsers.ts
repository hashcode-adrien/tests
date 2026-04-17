import { useState, useEffect } from 'react';
import { fetchUsers } from '../api/usersApi';

// Defect: types any partout
export function useUsers(searchTerm: any) {
  const [users, setUsers] = useState<any>([]);

  // Defect: useEffect avec dépendances manquantes — fetchUsers dépend de searchTerm mais pas dans les deps
  useEffect(() => {
    fetchUsers(searchTerm).then((data: any) => {
      setUsers(data);
    });

    // Defect: setInterval sans clearInterval en cleanup — fuite mémoire
    const interval = setInterval(() => {
      console.log('polling users...');
      fetchUsers(searchTerm).then((data: any) => setUsers(data));
    }, 5000);

    // pas de return () => clearInterval(interval);
  }, []);

  return { users, setUsers };
}
