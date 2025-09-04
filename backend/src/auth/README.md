# Authentification

Ce module gère l'authentification des utilisateurs avec JWT et propose les fonctionnalités suivantes :

## Fonctionnalités

- Inscription des utilisateurs
- Connexion avec email/mot de passe
- Authentification par JWT
- Rôles utilisateurs (USER, ADMIN, RESTAURANT_OWNER)
- Protection des routes avec guards

## Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# JWT Configuration
JWT_SECRET=votre_secret_jwt
JWT_EXPIRATION=1d
JWT_REFRESH_SECRET=votre_refresh_secret
JWT_REFRESH_EXPIRATION=7d

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/food_ordering

# Application
PORT=3000
NODE_ENV=development
```

## Points d'API

### Inscription

```
POST /auth/register
```

**Corps de la requête :**
```json
{
  "email": "user@example.com",
  "password": "motdepasse123",
  "name": "John Doe",
  "role": "user"
}
```

### Connexion

```
POST /auth/login
```

**Corps de la requête :**
```json
{
  "email": "user@example.com",
  "password": "motdepasse123"
}
```

**Réponse réussie :**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

## Protection des routes

Utilisez le décorateur `@UseGuards(JwtAuthGuard)` pour protéger une route :

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  @Get()
  getProfile(@Request() req) {
    return req.user;
  }
}
```

## Rôles d'utilisateur

Les rôles disponibles sont :
- `user` : Utilisateur standard
- `admin` : Administrateur avec accès complet
- `restaurant_owner` : Propriétaire de restaurant

Pour restreindre l'accès à des rôles spécifiques, utilisez le décorateur `@Roles()` :

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  @Get('dashboard')
  getDashboard() {
    return { message: 'Admin dashboard' };
  }
}
```

## Sécurité

- Les mots de passe sont hachés avec bcrypt avant d'être stockés
- Les tokens JWT sont signés avec une clé secrète
- Les tokens ont une durée de validité limitée
- Les routes protégées nécessitent un token JWT valide
