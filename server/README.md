# Supchat

Supchat est une plateforme de messagerie collaborative en temps réel, à la Slack ou Discord, permettant la gestion de workspaces, de canaux, de messages avec fichiers joints, d'émojis et de rôles personnalisés.

---

## Fonctionnalités

- Authentification via Google & Facebook
- Création / Rejointure de workspaces publics ou privés (via lien d'invitation)
- Gestion des rôles et permissions dans un workspace
- Canaux publics et privés avec gestion des membres
- Messagerie en temps réel (Socket.io)
- Mentions (@user) et hashtags (#canal)
- Notifications in-app + sonores + visuelles
- Reactions avec emojis + tooltip utilisateurs
- Upload de fichiers (images, vidéos, documents...)
- Liste des utilisateurs connectés avec statut (en ligne, absent...)
- Interface riche en React (frontend)
- Accès à PhpMyAdmin pour la base MariaDB

---

## Prérequis

- Docker + Docker Compose
- Accès au fichier `.env` (demander aux administrateurs du projet)

---

## Installation & Lancement (avec Docker Compose)

1. **Récupérer le projet** :

```bash
git clone <votre-url-du-repo>
cd <nom-du-repo>
```

2. **Configurer le fichier `.env`**

Ce fichier contient les variables sensibles (clés API, secrets, etc.). Il n'est **pas fourni dans le repo**. Veuillez **demander le `.env` aux administrateurs du projet**.

3. **Lancer les services avec Docker Compose** :

```bash
docker compose up --build
```

Cela va lancer :
- Une base de données MariaDB sur le port `8000`
- Le backend (Express + Socket.IO) sur le port `3000`
- Le frontend (React) sur le port `5000`
- PhpMyAdmin sur le port `8080`

---

## Accès au projet

- Frontend : [http://localhost:5000](http://localhost:5000)
- Backend API : [http://localhost:3000](http://localhost:3000)
- PhpMyAdmin : [http://localhost:8080](http://localhost:8080)

---

## Structure principale du projet

```
.
├── client/web              # Frontend React
├── server
│   ├── database            # Fichiers SQL & config MariaDB
│   ├── controllers         # Logique métier (users, workspaces, channels...)
│   ├── routes              # Routes Express
│   ├── middlewares         
│   ├── services            # Google / Facebook strategy, email, etc.
│   └── socket.js           # Configuration serveur WebSocket
├── docker-compose.yml     # Définition des services
└── .env                   # Variables d'environnement (non versionné)
```

---

## Conseils de développement

- **Hot reload** automatique avec `npm run dev` pour le backend et `npm start` pour le frontend
- Utiliser [http://localhost:8080](http://localhost:8080) pour accéder à la base de données

---

## Crédit & contact

Projet développé par Arthur, Gael et Zakaria. Pour toute demande : contacter un administrateur du projet.
