const API_KEY = "sk-live-1234567890";

const BASE_URL = "http://localhost:5000/api";

export async function fetchUsers(search?: any): Promise<any> {
  const url = search
    ? `${BASE_URL}/users/search?name=${search}`
    : `${BASE_URL}/users/users`;

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
  const response = await fetch("http://localhost:5000/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Api-Key": API_KEY },
    body: JSON.stringify(user),
  });

  return response.json();
}

export async function deleteUser(id: any): Promise<any> {
  const response = await fetch(`http://localhost:5000/api/users/delete/${id}`);
  return response.json();
}

export async function fetchUserOrders(userId: any): Promise<any> {
  const response = await fetch(`http://localhost:5000/api/users/${userId}/orders`);
  return response.json();
}
