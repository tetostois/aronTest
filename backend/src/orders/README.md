# Gestion des Commandes

Ce module gère les commandes de repas dans l'application de commande de nourriture. Il permet de créer, lire, mettre à jour et suivre l'état des commandes.

## Modèle de données

### Order
- `id` (UUID) - Identifiant unique de la commande
- `status` (OrderStatus) - Statut actuel de la commande
- `totalAmount` (number) - Montant total de la commande
- `deliveryAddress` (string) - Adresse de livraison
- `specialInstructions` (string) - Instructions spéciales pour la commande
- `createdAt` (Date) - Date de création de la commande
- `updatedAt` (Date) - Date de dernière mise à jour
- `deliveredAt` (Date) - Date de livraison
- `cancelledAt` (Date) - Date d'annulation
- `cancellationReason` (string) - Raison de l'annulation
- `estimatedDeliveryTime` (Date) - Temps de livraison estimé

### OrderStatus
- `PENDING` - Commande en attente de confirmation
- `CONFIRMED` - Commande confirmée
- `PREPARING` - En cours de préparation
- `READY_FOR_PICKUP` - Prêt à être récupéré
- `OUT_FOR_DELIVERY` - En cours de livraison
- `DELIVERED` - Livrée
- `CANCELLED` - Annulée

### OrderItem
- `id` (UUID) - Identifiant unique de l'article
- `quantity` (number) - Quantité commandée
- `price` (number) - Prix unitaire au moment de la commande
- `specialInstructions` (string) - Instructions spéciales pour cet article
- `discount` (number) - Réduction appliquée

## Points d'API

### Créer une commande
```
POST /orders
```

**Corps de la requête :**
```json
{
  "restaurantId": "123e4567-e89b-12d3-a456-426614174000",
  "items": [
    {
      "mealId": "123e4567-e89b-12d3-a456-426614174001",
      "quantity": 2,
      "specialInstructions": "Sans oignons"
    }
  ],
  "deliveryAddress": "123 Rue de la Paix, 75001 Paris",
  "specialInstructions": "Sonner deux fois"
}
```

### Récupérer toutes les commandes
```
GET /orders
```

**Paramètres de requête :**
- `restaurantId` (optionnel) - Filtrer par restaurant
- `status` (optionnel) - Filtrer par statut (peut être une liste)

### Récupérer une commande par ID
```
GET /orders/:id
```

### Mettre à jour une commande
```
PUT /orders/:id
```

### Mettre à jour le statut d'une commande
```
PUT /orders/:id/status
```

**Corps de la requête :**
```json
{
  "status": "DELIVERED",
  "deliveryPersonId": "123e4567-e89b-12d3-a456-426614174002"
}
```

### Supprimer une commande
```
DELETE /orders/:id
```

## Règles d'accès

- **Client** : Peut voir et gérer ses propres commandes
- **Propriétaire de restaurant** : Peut voir et gérer les commandes de son restaurant
- **Livreur** : Peut voir et mettre à jour les commandes qui lui sont assignées
- **Administrateur** : Accès complet à toutes les commandes

## Transitions de statut autorisées

| Rôle | Depuis | Vers |
|------|--------|------|
| Client | PENDING | CANCELLED |
| Client | CONFIRMED | CANCELLED |
| Propriétaire | PENDING | CONFIRMED |
| Propriétaire | CONFIRMED | PREPARING |
| Propriétaire | PREPARING | READY_FOR_PICKUP |
| Livreur | READY_FOR_PICKUP | OUT_FOR_DELIVERY |
| Livreur | OUT_FOR_DELIVERY | DELIVERED |
| Admin | * | * |

## Exemple de flux de commande

1. Le client crée une commande (PENDING)
2. Le propriétaire confirme la commande (CONFIRMED)
3. Le restaurant commence la préparation (PREPARING)
4. La commande est prête (READY_FOR_PICKUP)
5. Le livreur prend en charge la livraison (OUT_FOR_DELIVERY)
6. La commande est livrée (DELIVERED)

## Gestion des erreurs

- `400 Bad Request` - Données de requête invalides
- `401 Unauthorized` - Authentification requise
- `403 Forbidden` - Droits insuffisants
- `404 Not Found` - Commande ou ressource non trouvée
- `409 Conflict` - Transition de statut non autorisée
