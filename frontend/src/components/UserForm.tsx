import React from 'react';

// Defect: types any sur les props
interface UserFormProps {
  onUserCreated: any;
  searchTerm: any;
  onSelectUser: any;
}

function UserForm({ onUserCreated, searchTerm, onSelectUser }: UserFormProps) {
  const handleSubmit = (e: any) => {
    e.preventDefault();

    // Defect: formulaire non contrôlé — accès direct au DOM au lieu de state React
    const name = (document.getElementById('name') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const bio = (document.getElementById('bio') as HTMLInputElement).value;

    // Defect: pas de validation (email, mot de passe, champs requis)
    // Defect: fetch sans try/catch, URL en dur
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
      {/* Defect: inputs sans <label htmlFor> — accessibilité cassée */}
      <input id="name" type="text" placeholder="Name" />
      <input id="email" type="text" placeholder="Email" />
      {/* Defect: mot de passe visible — type="text" au lieu de type="password" */}
      <input id="password" type="text" placeholder="Password" name="password" />
      <input id="bio" type="text" placeholder="Bio" />

      <button type="submit">Create</button>
    </form>
  );
}

export default UserForm;
