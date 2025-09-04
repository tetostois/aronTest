# Food Ordering App - Frontend

Application web de commande de repas en ligne développée avec Next.js 13+ et TypeScript.

## 🚀 Prérequis

- Node.js 18+
- npm ou yarn
- Backend de l'application (dans le dossier `../backend`)

## 🛠 Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/votre-utilisateur/food-ordering-app.git
   cd food-ordering-app/frontend
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   # ou
   yarn
   ```

3. **Configurer les variables d'environnement**
   Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. **Démarrer l'environnement de développement**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```
   L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## 🏗 Structure du projet

```
src/
├── app/                 # Dossier principal de l'application (Next.js 13+ App Router)
├── components/          # Composants réutilisables
│   ├── common/          # Composants communs (boutons, cartes, etc.)
│   ├── layout/          # Composants de mise en page
│   └── ui/              # Composants d'interface utilisateur
├── features/            # Fonctionnalités de l'application
│   ├── auth/            # Authentification
│   ├── restaurants/     # Gestion des restaurants
│   ├── orders/          # Gestion des commandes
│   └── profile/         # Profil utilisateur
├── hooks/               # Hooks personnalisés
├── lib/                 # Utilitaires et configurations
├── services/            # Appels API et services
├── styles/              # Fichiers de styles globaux
├── types/               # Définitions de types TypeScript
└── utils/               # Fonctions utilitaires
```

## 🔧 Configuration

- **TypeScript** : Configuration dans `tsconfig.json`
- **Alias d'import** : Configurés dans `next.config.js` et `tsconfig.json`
- **Styles** : Utilisation de Tailwind CSS

## 🧪 Tests

Pour lancer les tests :

```bash
npm test
# ou
yarn test
```

## 🚀 Déploiement

Le projet peut être déployé sur Vercel, Netlify ou tout autre fournisseur prenant en charge les applications Next.js.

## 📝 Licence

Ce projet est sous licence MIT.
