# 🍔 Food Ordering API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">API backend pour une application de commande de nourriture en ligne</p>

## 📋 Prérequis

- Node.js (v16 ou supérieur)
- PostgreSQL (v12 ou supérieur)
- npm ou yarn

## 🚀 Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/votre-utilisateur/food-ordering-app.git
   cd food-ordering-app/backend
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer l'environnement**
   ```bash
   cp .env.example .env
   ```
   Puis éditez le fichier `.env` avec vos paramètres.

## ⚙️ Configuration

Copiez le fichier `.env.example` vers `.env` et modifiez les variables selon votre configuration :

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=food_ordering

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRATION=1d

# CORS
FRONTEND_URL=http://localhost:3001
```

## 🏃‍♂️ Démarrage

```bash
# Développement
$ npm run start:dev

# Production
$ npm run build
$ npm run start:prod
```

## 📊 Base de données

### Migration

```bash
# Générer une migration
$ npm run migration:generate src/migrations/InitialMigration

# Exécuter les migrations
$ npm run migration:run

# Annuler la dernière migration
$ npm run migration:revert
```

### Schéma

```bash
# Synchroniser le schéma (déconseillé en production)
$ npm run schema:sync
```

## 🧪 Tests

```bash
# Lancer les tests unitaires
$ npm test

# Lancer les tests e2e
$ npm run test:e2e

# Couverture de test
$ npm run test:cov
```

## 📚 Documentation API

Une fois l'application démarrée, accédez à la documentation Swagger :
- Développement : http://localhost:3000/api
- Production : https://votre-domaine.com/api

## 🛠 Technologies utilisées

- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [JWT](https://jwt.io/)
- [Swagger](https://swagger.io/)


