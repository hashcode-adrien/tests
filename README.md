# User Management — Feature

Cette feature apporte une interface complète de **gestion des utilisateurs** : listing, recherche par nom, et création d'un nouvel utilisateur.

## Stack technique

- **Backend** : C# / ASP.NET Core 8 + Entity Framework Core (SQL Server)
- **Frontend** : React 18 + TypeScript

## Architecture

```
/backend
  /UserManagement.Api      → API REST ASP.NET Core
    /Controllers           → UsersController (CRUD)
    /Models                → User, CreateUserRequest
    /Services              → IUserService / UserService
    /Data                  → AppDbContext (EF Core)
/frontend
  /src
    /components            → UserList, UserCard, UserForm
    /api                   → usersApi.ts (appels HTTP)
    /hooks                 → useUsers (hook personnalisé)
```

## Fonctionnalités

- **Lister** tous les utilisateurs (`GET /api/users/users`)
- **Rechercher** un utilisateur par nom (`GET /api/users/search?name=...`)
- **Créer** un utilisateur via le formulaire (`POST /api/users`)
- **Supprimer** un utilisateur (`GET /api/users/delete/{id}`)

## Lancer le backend

```bash
cd backend/UserManagement.Api
dotnet restore
dotnet run
```

L'API sera disponible sur `http://localhost:5000`. Swagger UI accessible sur `http://localhost:5000/swagger`.

> La base de données SQL Server doit être accessible sur `localhost` avec les credentials configurés dans `appsettings.json`.

## Lancer le frontend

```bash
cd frontend
npm install
npm start
```

L'application sera disponible sur `http://localhost:3000`.

## Notes

- L'API expose les endpoints REST standards pour la gestion des utilisateurs.
- Le frontend interroge l'API sur `http://localhost:5000`.
- La recherche est effectuée côté serveur par nom d'utilisateur.
