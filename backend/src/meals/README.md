# API des Repas

Ce module gère les opérations CRUD pour les repas dans l'application de commande de nourriture.

## Modèle de données

### Meal
- `id` (UUID): Identifiant unique du repas
- `name` (string, requis): Nom du repas (2-100 caractères)
- `description` (string, optionnel): Description du repas (max 500 caractères)
- `price` (number, requis): Prix du repas (doit être positif)
- `imageUrl` (string, optionnel): URL de l'image du repas (doit être une URL valide)
- `isAvailable` (boolean, optionnel, par défaut: true): Indique si le repas est disponible à la commande
- `restaurantId` (UUID, requis): ID du restaurant auquel le repas appartient
- `createdAt` (Date): Date de création
- `updatedAt` (Date): Date de dernière mise à jour

## Endpoints

### Créer un repas
- **URL**: `POST /meals`
- **Accès**: Propriétaire (OWNER)
- **Corps de la requête**:
  ```json
  {
    "name": "Pizza Margherita",
    "description": "Pizza classique avec sauce tomate et mozzarella",
    "price": 12.99,
    "imageUrl": "https://example.com/images/pizza.jpg",
    "isAvailable": true,
    "restaurantId": "123e4567-e89b-12d3-a456-426614174000"
  }
  ```
- **Réponse réussie**: 201 Created
  ```json
  {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "name": "Pizza Margherita",
    "description": "Pizza classique avec sauce tomate et mozzarella",
    "price": 12.99,
    "imageUrl": "https://example.com/images/pizza.jpg",
    "isAvailable": true,
    "restaurantId": "123e4567-e89b-12d3-a456-426614174000",
    "createdAt": "2025-09-04T14:30:00.000Z",
    "updatedAt": "2025-09-04T14:30:00.000Z"
  }
  ```

### Récupérer tous les repas
- **URL**: `GET /meals`
- **Paramètres de requête optionnels**:
  - `restaurantId` (string): Filtrer par ID de restaurant
  - `available` (boolean): Filtrer par disponibilité
- **Accès**: Tous les utilisateurs authentifiés
- **Réponse réussie**: 200 OK
  ```json
  [
    {
      "id": "123e4567-e89b-12d3-a456-426614174001",
      "name": "Pizza Margherita",
      "description": "Pizza classique avec sauce tomate et mozzarella",
      "price": 12.99,
      "imageUrl": "https://example.com/images/pizza.jpg",
      "isAvailable": true,
      "restaurantId": "123e4567-e89b-12d3-a456-426614174000",
      "createdAt": "2025-09-04T14:30:00.000Z",
      "updatedAt": "2025-09-04T14:30:00.000Z"
    }
  ]
  ```

### Récupérer un repas par ID
- **URL**: `GET /meals/:id`
- **Paramètres d'URL**:
  - `id` (UUID): ID du repas à récupérer
- **Accès**: Tous les utilisateurs authentifiés
- **Réponse réussie**: 200 OK
  ```json
  {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "name": "Pizza Margherita",
    "description": "Pizza classique avec sauce tomate et mozzarella",
    "price": 12.99,
    "imageUrl": "https://example.com/images/pizza.jpg",
    "isAvailable": true,
    "restaurantId": "123e4567-e89b-12d3-a456-426614174000",
    "createdAt": "2025-09-04T14:30:00.000Z",
    "updatedAt": "2025-09-04T14:30:00.000Z"
  }
  ```

### Mettre à jour un repas
- **URL**: `PUT /meals/:id`
- **Paramètres d'URL**:
  - `id` (UUID): ID du repas à mettre à jour
- **Accès**: Propriétaire du restaurant (OWNER)
- **Corps de la requête** (champs optionnels) :
  ```json
  {
    "name": "Pizza Margherita Deluxe",
    "description": "Pizza classique avec sauce tomate, mozzarella et basilic frais",
    "price": 14.99,
    "imageUrl": "https://example.com/images/pizza-deluxe.jpg",
    "isAvailable": true
  }
  ```
- **Réponse réussie**: 200 OK
  ```json
  {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "name": "Pizza Margherita Deluxe",
    "description": "Pizza classique avec sauce tomate, mozzarella et basilic frais",
    "price": 14.99,
    "imageUrl": "https://example.com/images/pizza-deluxe.jpg",
    "isAvailable": true,
    "restaurantId": "123e4567-e89b-12d3-a456-426614174000",
    "createdAt": "2025-09-04T14:30:00.000Z",
    "updatedAt": "2025-09-04T15:30:00.000Z"
  }
  ```

### Supprimer un repas
- **URL**: `DELETE /meals/:id`
- **Paramètres d'URL**:
  - `id` (UUID): ID du repas à supprimer
- **Accès**: Propriétaire du restaurant (OWNER) ou administrateur (ADMIN)
- **Réponse réussie**: 200 OK

## Codes d'erreur

- **400 Bad Request**: Données de requête invalides
- **401 Unauthorized**: Authentification requise
- **403 Forbidden**: Accès refusé (droits insuffisants)
- **404 Not Found**: Repas ou restaurant non trouvé

## Sécurité

- Tous les endpoints nécessit une authentification JWT valide
- Les opérations de modification et de suppression sont restreintes aux propriétaires des restaurants ou aux administrateurs
- Les données sensibles sont validées côté serveur

## Exemple d'utilisation avec cURL

```bash
# Créer un repas
curl -X POST http://localhost:3000/api/meals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_JWT_TOKEN" \
  -d '{
    "name": "Pizza Margherita",
    "description": "Pizza classique avec sauce tomate et mozzarella",
    "price": 12.99,
    "restaurantId": "123e4567-e89b-12d3-a456-426614174000"
  }'
```
