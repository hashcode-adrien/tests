import React, { useState, useEffect } from 'react';
import moment from 'moment';
import UserCard from './UserCard';
import { fetchUsers, deleteUser, fetchUserOrders } from '../api/usersApi';

// Defect: types any partout
interface UserListProps {
  searchTerm: any;
  onSelectUser: any;
  onDeleteUser: any;
  onEditUser: any;
  refreshToken: any;
}

// Defect: composant monolithique > 200 lignes mélangeant appels API, logique métier et rendu
function UserList({ searchTerm, onSelectUser, onDeleteUser, onEditUser, refreshToken }: UserListProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [page, setPage] = useState(1);

  console.log('UserList render', searchTerm, refreshToken);

  // Defect: useEffect avec dépendances manquantes (searchTerm absent)
  useEffect(() => {
    // Defect: fetch sans try/catch, pas d'état loading ni error
    fetch('http://localhost:5000/api/users/users')
      .then(r => r.json())
      .then((data: any) => {
        console.log('users fetched:', data);
        setUsers(data);
      });
  }, []);

  // Defect: setInterval sans clearInterval — fuite mémoire
  useEffect(() => {
    const id = setInterval(() => {
      console.log('auto-refresh...');
      fetch('http://localhost:5000/api/users/users')
        .then(r => r.json())
        .then((data: any) => setUsers(data));
    }, 10000);
    // pas de cleanup
  }, []);

  const handleDelete = (id: any) => {
    // Defect: mutation directe du state
    const idx = users.findIndex((u: any) => u.id === id);
    users.splice(idx, 1);
    setUsers(users);

    deleteUser(id);
    onDeleteUser(id);
    console.log('deleted user', id);
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    onEditUser(user);
  };

  const handleSelect = (user: any) => {
    setSelectedUser(user);
    onSelectUser(user);
  };

  // Defect: calcul coûteux refait à chaque render, pas de useMemo
  const filteredUsers = users
    .filter((u: any) => {
      if (filter === 'all') return true;
      if (filter === 'active') return u.isActive;
      if (filter === 'inactive') return !u.isActive;
      return true;
    })
    .filter((u: any) => {
      if (!searchTerm) return true;
      return (
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a: any, b: any) => {
      if (sortField === 'name') return a.name?.localeCompare(b.name);
      if (sortField === 'email') return a.email?.localeCompare(b.email);
      if (sortField === 'createdAt') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return 0;
    });

  const totalUsers = users.length;
  const activeUsers = users.filter((u: any) => u.isActive).length;

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h2>Users ({totalUsers})</h2>
        <span>Active: {activeUsers} / Inactive: {totalUsers - activeUsers}</span>
      </div>

      <div style={{ marginBottom: '8px' }}>
        <span>Filter: </span>
        {/* Defect: <div onClick> au lieu de <button> */}
        <div
          onClick={() => setFilter('all')}
          style={{ display: 'inline-block', cursor: 'pointer', marginRight: '8px', fontWeight: filter === 'all' ? 'bold' : 'normal' }}
        >
          All
        </div>
        <div
          onClick={() => setFilter('active')}
          style={{ display: 'inline-block', cursor: 'pointer', marginRight: '8px', fontWeight: filter === 'active' ? 'bold' : 'normal' }}
        >
          Active
        </div>
        <div
          onClick={() => setFilter('inactive')}
          style={{ display: 'inline-block', cursor: 'pointer', fontWeight: filter === 'inactive' ? 'bold' : 'normal' }}
        >
          Inactive
        </div>
      </div>

      <div style={{ marginBottom: '8px' }}>
        <span>Sort by: </span>
        <select value={sortField} onChange={e => setSortField(e.target.value)}>
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="createdAt">Created At</option>
        </select>
      </div>

      {/* Defect: liste sans état loading ni error */}
      <div>
        {/* Defect: key={index} dans le map — bug de réconciliation */}
        {filteredUsers.map((user: any, index: number) => (
          <div key={index}>
            {/* Defect: fetch N+1 — OrdersLoader fait un fetch par utilisateur */}
            <OrdersLoader userId={user.id} />
            <UserCard
              user={user}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onSelect={handleSelect}
              searchTerm={searchTerm}
              refreshToken={refreshToken}
            />
            <div style={{ fontSize: '12px', color: '#999' }}>
              {/* Defect: moment utilisé juste pour formater une date (dépendance inutile) */}
              Joined: {moment(user.createdAt).format('DD/MM/YYYY')}
            </div>
          </div>
        ))}
      </div>

      {selectedUser && (
        <div style={{ marginTop: '16px', padding: '8px', backgroundColor: '#f0f0f0' }}>
          <h3>Selected: {selectedUser.name}</h3>
          <div>Email: {selectedUser.email}</div>
          <div>Password: {selectedUser.password}</div>
          <div>Notes: {selectedUser.internalNotes}</div>
          {/* Defect: XSS */}
          <div dangerouslySetInnerHTML={{ __html: selectedUser.bio }} />
        </div>
      )}

      <div style={{ marginTop: '16px' }}>
        {/* Defect: pagination côté client uniquement, backend renvoie tout */}
        <div
          onClick={() => setPage(p => Math.max(1, p - 1))}
          style={{ display: 'inline-block', cursor: 'pointer', marginRight: '8px' }}
        >
          Previous
        </div>
        <span>Page {page}</span>
        <div
          onClick={() => setPage(p => p + 1)}
          style={{ display: 'inline-block', cursor: 'pointer', marginLeft: '8px' }}
        >
          Next
        </div>
      </div>
    </div>
  );
}

// Defect: composant qui fait un fetch par user — N+1 côté front (waterfall)
function OrdersLoader({ userId }: { userId: any }) {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    // Defect: fetch N+1 — un appel par utilisateur pour récupérer ses commandes
    fetchUserOrders(userId).then((data: any) => {
      setOrders(data || []);
    });
  }, [userId]);

  if (orders.length === 0) return null;

  return (
    <div style={{ fontSize: '11px', color: '#666' }}>
      {orders.length} order(s)
    </div>
  );
}

export default UserList;
