import React from 'react';

interface UserCardProps {
  user: any;
  onDelete: any;
  onEdit: any;
  onSelect: any;
  searchTerm: any;
  refreshToken: any;
}

function UserCard({ user, onDelete, onEdit, onSelect, searchTerm, refreshToken }: UserCardProps) {
  return (
    <div style={{ border: '1px solid #ccc', margin: '8px', padding: '8px' }}>
      <div>
        <img src={`https://i.pravatar.cc/40?u=${user.id}`} />
        <strong>{user.name}</strong>
      </div>
      <div>Email: {user.email}</div>
      <div>Password: {user.password}</div>
      <div>Notes: {user.internalNotes}</div>

      <div dangerouslySetInnerHTML={{ __html: user.bio }} />

      <div style={{ marginTop: '8px' }}>
        <div onClick={() => onSelect(user)} style={{ cursor: 'pointer', color: 'blue' }}>
          View
        </div>
        <div onClick={() => onEdit(user)} style={{ cursor: 'pointer', color: 'orange' }}>
          Edit
        </div>
        <div onClick={() => onDelete(user.id)} style={{ cursor: 'pointer', color: 'red' }}>
          Delete
        </div>
      </div>
    </div>
  );
}

export default UserCard;
