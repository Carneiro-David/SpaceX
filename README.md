# 🚀 SpaceX — React Web Application

## Présentation

SpaceX est une application web développée avec React permettant d'explorer l'univers de l'exploration spatiale à travers différentes informations sur SpaceX, ses fusées, ses lancements et les astronautes.

Ce projet personnel a pour objectif de mettre en pratique le développement frontend, l'intégration d'API REST et la manipulation de données dynamiques.

## Fonctionnalités

- **Home** : présentation de SpaceX et statistiques sur les lancements.
- **History** : historique des lancements SpaceX sous forme de timeline interactive.
- **Crew** : exploration des astronautes, recherche par nom ou agence et fiches détaillées.
- **Rockets** : présentation des fusées, de leurs configurations et de leurs caractéristiques techniques.
- **Quiz** : section interactive dédiée aux connaissances sur l'univers spatial.

## Technologies utilisées

- React.js
- JavaScript
- HTML5 / CSS3
- Bootstrap
- Axios
- React Router
- React Toastify
- Launch Library 2 API

## API

L'application utilise l'API REST **Launch Library 2**, développée par The Space Devs.

Documentation : https://thespacedevs.com/llapi

Les données sont récupérées dynamiquement, notamment pour les lancements, les astronautes et les configurations de fusées.

Un système de cache local est utilisé pour limiter les appels API.

**Limites :** l'API publique possède un quota de requêtes. L'environnement de développement fournit des données historiques qui peuvent être incomplètes ou anciennes.

## Installation

### Prérequis

- Node.js
- npm
- Git

### Cloner le dépôt

```bash
git clone https://github.com/Carneiro-David/SpaceX.git
```

### Accéder au projet

```bash
cd SpaceX
```

### Installer les dépendances

```bash
npm install
```

### Démarrer l'application

```bash
npm start
```

L'application sera accessible à l'adresse :

http://localhost:3000

## Structure du projet

```text
src/
├── assets/
│   ├── img/
│   └── style/
├── components/
│   ├── data/
│   ├── layout/
│   ├── pages/
│   └── routes/
├── services/
│   └── api.js
├── App.js
└── index.js
```

## Améliorations envisagées

- Amélioration du responsive design.
- Optimisation des appels API et du cache.
- Enrichissement des fiches techniques des fusées.
- Amélioration des filtres et de la recherche.
- Ajout de nouvelles statistiques sur les missions spatiales.

## Auteur

Projet académiques développé mon groupe d'élève.

GitHub : https://github.com/Carneiro-David
