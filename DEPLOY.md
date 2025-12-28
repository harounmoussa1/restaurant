# Déploiement Gratuit sur Render

Voici la procédure pour héberger votre projet (Frontend + Backend) gratuitement sur **Render**.

## 1. Préparation (Déjà fait)
✅ Le code a été optimisé pour le Cloud :
- Le Backend sert maintenant aussi le Frontend (le dossier `public` contient le site).
- Le port est dynamique (`process.env.PORT`).

## 2. Hébergement sur Render (Gratuit)

1.  Créez un compte sur [render.com](https://render.com).
2.  Cliquez sur **"New"** -> **"Web Service"**.
3.  Connectez votre dépôt GitHub (vous devez d'abord pousser le code sur GitHub) ou choisissez **"Build and deploy from a Git repository"**.
4.  Configurez le service :
    -   **Name**: `restaurant-print-demo` (ou ce que vous voulez)
    -   **Build Command**: `npm install`
    -   **Start Command**: `node server.js`
    -   **Free Tier**: Sélectionnez l'option "Free".
5.  Cliquez sur **"Create Web Service"**.

Render va vous donner une URL publique (ex: `https://restaurant-print-demo.onrender.com`).
C'est votre nouveau site web !

## 3. Mise à jour de l'App Locale

Une fois le site en ligne, votre PC (App Locale) doit savoir où se connecter.
Il ne doit plus écouter `localhost`, mais le nouveau site.

1.  Ouvrez `local-app/client.js` sur votre PC.
2.  Modifiez la ligne :
    ```javascript
    const BACKEND_URL = 'https://votre-projet.onrender.com';
    ```
3.  Redémarrez l'application locale :
    ```bash
    npm start
    ```

## ⚠️ Limitations de la version gratuite
-   Le serveur se met en "veille" après 15 minutes d'inactivité (le premier chargement prendra ~30 secondes).
-   La base de données (SQLite) sera **réinitialisée** à chaque redémarrage (car le système de fichier est éphémère). Pour une vraie persistance, il faudrait utiliser une base de données externe (comme Render PostgreSQL, mais c'est une autre étape).
