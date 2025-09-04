const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: 'mysql', // Se connecter d'abord à la base système
};

const dbName = process.env.DB_DATABASE || 'food_ordering';

async function setupDatabase() {
  let connection;
  
  try {
    // Se connecter au serveur MySQL
    connection = await mysql.createConnection({
      ...config,
      multipleStatements: true,
    });

    console.log('Connected to MySQL server');

    // Créer la base de données si elle n'existe pas
    await connection.query(`
      CREATE DATABASE IF NOT EXISTS \`${dbName}\`
      CHARACTER SET utf8mb4
      COLLATE utf8mb4_unicode_ci;
    `);
    console.log(`Database '${dbName}' created or already exists`);

    // Utiliser la base de données
    await connection.query(`USE \`${dbName}\`;`);
    console.log(`Using database '${dbName}'`);

    // Créer la table users
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100),
        role ENUM('USER', 'RESTAURANT_OWNER', 'ADMIN') DEFAULT 'USER',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);
    console.log('Table \'users\' created or already exists');

    // Créer la table restaurants
    await connection.query(`
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
    `);
    console.log('Table \'restaurants\' created or already exists');

    // Créer la table des migrations pour TypeORM
    await connection.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        timestamp BIGINT NOT NULL,
        name VARCHAR(255) NOT NULL
      ) ENGINE=InnoDB;
    `);
    console.log('Table \'migrations\' created or already exists');

    // Insérer l'entrée pour la migration manuelle
    await connection.query(`
      INSERT INTO migrations (timestamp, name) 
      VALUES (1757007408927, 'CreateInitialSchema1757007408927')
      ON DUPLICATE KEY UPDATE name = VALUES(name);
    `);
    console.log('Migration record inserted or updated');

    console.log('\n✅ Database setup completed successfully!');
    console.log('You can now start your application with: npm run start:dev');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\nDatabase connection closed');
    }
  }
}

// Exécuter le script
setupDatabase();
