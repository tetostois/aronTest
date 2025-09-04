-- Créer la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS food_ordering 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Utiliser la base de données
USE food_ordering;

-- Créer la table users
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    role ENUM('USER', 'RESTAURANT_OWNER', 'ADMIN') DEFAULT 'USER',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Créer la table restaurants
CREATE TABLE IF NOT EXISTS restaurants (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    openingHours JSON,
    imageUrl VARCHAR(255),
    averageRating DECIMAL(3,2) DEFAULT 0.00,
    isActive BOOLEAN DEFAULT TRUE,
    ownerId VARCHAR(36) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ownerId) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Créer la table des migrations pour TypeORM
CREATE TABLE IF NOT EXISTS migrations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    timestamp BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

-- Insérer l'entrée pour la migration manuelle
INSERT INTO migrations (timestamp, name) 
VALUES (1757007408927, 'CreateInitialSchema1757007408927')
ON DUPLICATE KEY UPDATE name = VALUES(name);
