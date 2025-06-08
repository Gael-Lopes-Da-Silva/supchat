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
git clone https://github.com/Gael-Lopes-Da-Silva/supchat
cd supchat
```

2. **Configurer le fichier `.env` à partir de .env.example**

Ce fichier contient les variables sensibles (clés API, secrets, etc.). Il n'est **pas fourni dans le repo**. Veuillez **demander le `.env` aux administrateurs du projet**.

3. **Lancer les services avec Docker Compose** :

```bash
docker compose up --build
```

Cela va lancer :
- Une base de données MariaDB sur le port `8000`
- Le serveur (Express + Socket.IO) sur le port `3000`
- Le frontend (React) sur le port `5000`
- PhpMyAdmin sur le port `8080`

---

## Accès au projet

- Frontend : [http://localhost:5000](http://localhost:5000)
- Backend API : [http://localhost:3000](http://localhost:3000)
- PhpMyAdmin : [http://localhost:8080](http://localhost:8080)

---

## Conseils de développement

- Une fois buildé, le projet peut se lancer via

```bash
  docker compose up
 ```
- Il s'arrête via

```bash
  docker compose down
 ```
- Utilisea [http://localhost:8080](http://localhost:8080) pour accéder à la base de données via phpMyAdmin
- Sinon en ligne de commande :

```bash
docker exec -it supchat_db mariadb -u root -p
```
 Entrez le mot de passe root ou la valeur définie dans MYSQL_ROOT_PASSWORD de votre .env


--- 

## Crédit & contact

Projet développé par Arthur, Gael et Zakaria. Pour toute demande : contactez un administrateur du projet.


Application web disponible ici : https://web.supchat.fun

