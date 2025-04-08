# Hoagie App Backend (NestJS + MongoDB)

A fully-featured REST API for creating, customizing, and collaborating on Hoagie (sandwich) recipes. Built with **NestJS**, **MongoDB**, and includes JWT authentication, input validation, aggregation, and rate limiting.

---

## 🚀 Getting Started

### Install dependencies:
```bash
npm install
```

Start MongoDB:
Make sure MongoDB is running locally or update the connection string (app.module.ts).

### Run Application:
```bash
npm run start:dev
```

## 📚 API Endpoints

##  Auth:
POST /auth/signup: Create new user account.
POST /auth/login: User login, returns JWT token.
##  Users:
GET /users/:id: Get user details.
##  Hoagies:
POST /hoagies: Create new hoagie.
GET /hoagies?page=1&limit=10: Paginated list of hoagies.
GET /hoagies/:id: Get detailed hoagie information.
POST /hoagies/:id/collaborators: Add collaborator to hoagie.
##  Comments:
POST /comments: Create comment on hoagie.
GET /comments/hoagie/:hoagieId: Get comments by hoagie.
##  Database Schema

### Entities:

User (name, email, password)
Hoagie (name, ingredients, picture, creator, collaborators)
Comment (text, user, hoagie)

## 🛡️ Security & Validation

JWT: Authentication
Class-validator: Input validation
NestJS Throttler: Rate limiting (20 req/minute)