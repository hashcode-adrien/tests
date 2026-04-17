import React, { useState } from 'react';
import UserList from './components/UserList';
import UserForm from './components/UserForm';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  console.log('App render', searchTerm);

  return (
    <div>
      <h1>User Management</h1>
      <input
        placeholder="Search users..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <UserList
        searchTerm={searchTerm}
        onSelectUser={(user: any) => console.log('selected', user)}
        onDeleteUser={(id: any) => console.log('delete', id)}
        onEditUser={(user: any) => console.log('edit', user)}
        refreshToken={Math.random()}
      />
      <div onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Hide form' : 'Add user'}
      </div>
      {showForm && (
        <UserForm
          onUserCreated={(user: any) => console.log('created', user)}
          searchTerm={searchTerm}
          onSelectUser={(user: any) => console.log('selected', user)}
        />
      )}
    </div>
  );
}

export default App;
