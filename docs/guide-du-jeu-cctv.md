# Guide de Jeu CCTV - Walkthrough Complet

## Démarrage du Jeu

- Pour démarrer le jeu en français, ajoutez `?lng=fr` à l'URL
- Par défaut, le jeu démarre en anglais (`?lng=en`)

## Écran Verrouillé

L'écran verrouillé dispose de deux modes d'authentification:

### Mode PIN

- Le code PIN actuel est: **3630**
- Principalement utilisé à des fins de développement
- Attention: Après 3 tentatives incorrectes, l'écran sera verrouillé pendant 10 secondes

### Mode RFID

- Le système vérifie environ toutes les secondes si une carte-clé a été scannée
- Méthode d'authentification standard pour jouer normalement

## Mode Debug (Boutons Bleus)

Les boutons bleus sont uniquement disponibles en mode debug:

- Permettent de contourner certaines énigmes
- Options "Good RFID" et "Bad RFID" communiquent avec le backend
- L'application web n'intègre pas cette fonctionnalité, utilisez "Skip RFID" pour continuer
- Alternative: ajoutez `/unlockedScreen` à l'URL

## Navigation sur l'Écran Déverrouillé

Utilisez les touches **F1**, **F2**, **F3** et **F4** pour naviguer entre les sections.

- La touche **\*** affiche la disposition du clavier
- Attention: la disposition est inversée par rapport aux pavés numériques standard, particulièrement pour les paramètres F4

## F1 - Lecteur Multimédia

- Nécessite l'insertion d'une clé USB avec un nom de partition spécifique
- 3 états possibles:
  - Par défaut: "Missing" (Manquant)
  - "Invalid" (Non valide)
  - "Valid" (Valide)

Une fois la clé valide insérée:

- Plusieurs vidéos seront disponibles
- Utilisez **Page Up** / **Page Down** pour naviguer
- **Espace** pour démarrer/arrêter une vidéo
- **Retour arrière** pour revenir 5 secondes en arrière
- **Annuler** pour arrêter et réinitialiser la vidéo

## F2 - Base de Données du Personnel

- Affiche un faux chargement suivi d'une erreur demandant de résoudre un captcha illisible
- Astuce: à chaque actualisation, le captcha devient plus lisible (jusqu'à 7 actualisations)
- Solution du captcha: **11037**
- La position, la taille et la couleur du texte sont aléatoires
- Une fois résolu, vous aurez accès à un tableau contenant tous les agents de sécurité et officiers du casino

## F3 - Centre de Contrôle

Composé de 3 pages:

1. **Statistiques d'Alimentation** (informations "inutiles")
2. **État du Système** (informations "inutiles")
3. **Contrôle des Conduits de Ventilation**:
   - Contrôle de la porte de ventilation
   - État de l'éclairage
   - Ventilateur
   - Accédez aux boutons en sélectionnant le numéro correspondant

En appuyant sur **4**, le système demande un identifiant et un mot de passe:

- Identifiant: **2342**
- Le mot de passe fonctionne comme un clavier multi-tap:
  - Mot de passe réel: "marc"
  - Entrée correcte: **6,2,777,222**
- Une boîte de dialogue confirmera la déconnexion une fois les codes corrects entrés

## F4 - Paramètres

Contient de nombreuses options, mais la plupart sont désactivées (leurres).

**Première page** - Options interactives:

- **2-3**: Volume
- **4-5**: Luminosité
- **9**: Sélection de fonds d'écran
- **#**: Langue de l'application

**Deuxième page** - Configuration système:

- **1**: Économiseur d'énergie (sans effet)
- **3**: Mises à jour automatiques (sans effet)
- **6**: Vérifier les mises à jour (sans effet)
- **7**: Arrêt du système CCTV:
  - Nécessite une carte-clé de niveau 4
  - Affiche une barre de progression indiquant que le système CCTV est déconnecté
