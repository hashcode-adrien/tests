import { useState, useEffect } from 'react';
import { fetchUsers } from '../api/usersApi';

export function useUsers(searchTerm: any) {
  const [users, setUsers] = useState<any>([]);

  useEffect(() => {
    fetchUsers(searchTerm).then((data: any) => {
      setUsers(data);
    });

    const interval = setInterval(() => {
      console.log('polling users...');
      fetchUsers(searchTerm).then((data: any) => setUsers(data));
    }, 5000);

  }, []);

  return { users, setUsers };
}
