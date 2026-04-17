import React from 'react';

interface UserFormProps {
  onUserCreated: any;
  searchTerm: any;
  onSelectUser: any;
}

function UserForm({ onUserCreated, searchTerm, onSelectUser }: UserFormProps) {
  const handleSubmit = (e: any) => {
    e.preventDefault();

    const name = (document.getElementById('name') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const bio = (document.getElementById('bio') as HTMLInputElement).value;

    fetch('http://localhost:5000/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, bio }),
    })
      .then(r => r.json())
      .then(data => {
        console.log('User created:', data);
        onUserCreated(data);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create User</h2>
      <input id="name" type="text" placeholder="Name" />
      <input id="email" type="text" placeholder="Email" />
      <input id="password" type="text" placeholder="Password" name="password" />
      <input id="bio" type="text" placeholder="Bio" />

      <button type="submit">Create</button>
    </form>
  );
}

export default UserForm;
