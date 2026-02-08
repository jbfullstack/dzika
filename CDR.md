Objectif général

Créer un site web de présentation musicale premium, destiné à mettre en valeur les musiques d’un artiste avec une forte identité visuelle, une UX/UI top-tier, et une administration complète permettant de gérer l’ensemble du contenu sans toucher au code.

Le site doit être robuste, rapide, optimisé, scalable, et parfaitement utilisable sur PC, tablette et mobile.

Stack technique imposée

Framework frontend : Next.js (App Router)

Déploiement : Vercel

Base de données : PostgreSQL

Stockage fichiers (audio & images) : Vercel Blob (ou équivalent compatible)

Auth admin : sécurisée (JWT / session / middleware Next.js)

Styles : CSS modulable (CSS variables, themes dynamiques, ou Tailwind + config dynamique)

Pages publiques (côté utilisateur)
1. Page d’accueil

Présentation de l’artiste

Mise en avant des musiques récentes / populaires

Accès aux différentes pages de thèmes

Design fort, immersif, différenciant

2. Pages de thèmes (catégories)

Exemples :

Instrumental

Violence

Techno

Experimental

etc.

Chaque thème :

Possède son propre style graphique (couleurs, typographies, animations, ambiance)

Est entièrement configurable depuis l’admin

Liste les musiques associées

Peut être activé / désactivé depuis l’admin

👉 L’architecture doit permettre l’ajout illimité de nouveaux thèmes, chacun avec :

Variables CSS dédiées

Background spécifique

Animations spécifiques

Layout adaptable

3. Pages de musique (détail)

Pour chaque musique :

Lecteur audio beau, moderne et agréable

Lecture en streaming

Téléchargement autorisé si activé

Informations affichées :

Titre

Description / texte

Thème

Durée

Versions disponibles

Commentaires utilisateurs

Notes par étoiles (0 à 5)

Affichage du nombre de lectures et téléchargements

4. Versions multiples par musique

Une musique peut contenir :

V1

V2

VHard

VTechno

etc.

Chaque version :

Fichier audio distinct

Nom personnalisé

Peut être activée / désactivée

Peut être téléchargeable ou non

5. Page de présentation de l’artiste

Bio

Projets

Vision artistique

Images

Contenu entièrement éditable depuis l’admin

6. Footer

Informations légales

Contacts

Réseaux sociaux

Contenu éditable depuis l’admin

Fonctionnalités communautaires
Commentaires & notes

Les utilisateurs peuvent :

Laisser un commentaire par musique

Donner une note (0 à 5 étoiles)

L’admin peut :

Répondre aux commentaires

Modérer / supprimer

Désactiver les commentaires sur une musique

Page Admin (back-office)
Accès

Authentification sécurisée

Accès restreint admin uniquement

Gestion des musiques

Ajouter / modifier / supprimer une musique

Activer / désactiver une musique

Uploader :

Image de couverture

Plusieurs versions audio

Gérer :

Textes

Thèmes

Ordre d’affichage

Gestion des thèmes

Créer / modifier / supprimer un thème

Paramétrer :

Nom

Description

Styles graphiques (couleurs, polices, ambiance)

Activation / désactivation

Gestion des pages

Page artiste

Footer

Contenus globaux

Tous les textes et images doivent être modifiables depuis l’admin

Statistiques

Dashboard avec :

Nombre de lectures par musique

Nombre de téléchargements par musique

Statistiques par date

Évolution dans le temps (charts)

Données stockées en base PostgreSQL

Gestion des commentaires

Voir tous les commentaires

Répondre en tant qu’admin

Modérer / supprimer

Voir les notes moyennes par morceau

UI / UX – exigences fortes

Design premium, moderne, audacieux

Forte personnalité graphique (différenciation claire)

Animations fluides

Lecteur audio custom (pas un player basique HTML)

Transitions soignées

Responsive parfait :

Desktop

Tablette

Mobile

Accessibilité correcte (contrastes, navigation clavier)

Contraintes techniques & qualité

Performance optimisée (lazy loading, streaming audio)

SEO de base (métadonnées)

Architecture claire et maintenable

Code robuste et scalable

Sécurité (uploads, admin, API)

Aucune dépendance inutile

Résumé

Un site musical immersif, administrable à 100 %, avec :

Thèmes visuels dynamiques

Lecteur audio haut de gamme

Versions multiples par morceau

Communauté (commentaires & notes)

Statistiques avancées

UX/UI au niveau des meilleures plateformes modernes