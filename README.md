# Démo Technique: Impression Web -> Locale

Ce projet est un POC (Proof of Concept) démontrant la communication entre un site web et une application locale pour déclencher une impression.

## Architecture

1. **Frontend (Site Web)**: Interface simple pour envoyer des commandes.
2. **Backend (API)**: Serveur Node.js qui reçoit les requêtes du web et les transmet via WebSocket.
3. **Application Locale**: Client Node.js qui écoute les événements d'impression et simule l'impression.

## Comment tester

1. Les services sont déjà lancés en arrière-plan :
   - Backend sur port 3000
   - App Locale connectée au backend

2. Le site web s'est ouvert automatiquement. Sinon, ouvrez :
   `frontend/index.html`

3. Tapez un message sur le site et cliquez sur "Envoyer".

4. Vérifiez le dossier `local-app/printer_output/` : un fichier texte contenant votre "ticket" aura été créé, simulant l'impression papier.

## Structure des dossiers

- `/backend`: Serveur API + WebSocket
- `/frontend`: Interface Web
- `/local-app`: Script d'impression local

## Arrêt
Fermez les terminaux Node.js ou utilisez `Ctrl+C` si vous les avez lancés manuellement.
