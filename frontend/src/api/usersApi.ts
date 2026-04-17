// Defect: secret en front — ne jamais exposer une clé côté client
const API_KEY = "sk-live-1234567890";

// Defect: URL d'API en dur au lieu d'une variable d'environnement
const BASE_URL = "http://localhost:5000/api";

// Defect: types any partout
export async function fetchUsers(search?: any): Promise<any> {
  const url = search
    ? `${BASE_URL}/users/search?name=${search}`
    : `${BASE_URL}/users/users`;

  // Defect: fetch sans try/catch, pas de gestion d'erreur
  const response = await fetch(url, {
    headers: {
      "X-Api-Key": API_KEY,
    },
  });

  const data = await response.json();
  console.log("fetchUsers result:", data);
  return data;
}

export async function createUser(user: any): Promise<any> {
  // Defect: URL en dur
  const response = await fetch("http://localhost:5000/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Api-Key": API_KEY },
    body: JSON.stringify(user),
  });

  return response.json();
}

export async function deleteUser(id: any): Promise<any> {
  // Defect: utilise l'endpoint GET pour supprimer (correspond au bug backend)
  const response = await fetch(`http://localhost:5000/api/users/delete/${id}`);
  return response.json();
}

export async function fetchUserOrders(userId: any): Promise<any> {
  // Defect: fetch N+1 côté front — appelé par utilisateur
  const response = await fetch(`http://localhost:5000/api/users/${userId}/orders`);
  return response.json();
}
