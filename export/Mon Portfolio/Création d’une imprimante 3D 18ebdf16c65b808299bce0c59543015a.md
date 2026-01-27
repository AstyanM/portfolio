# Création d’une imprimante 3D

*Projet mené au sein d’un groupe de 8 personnes*

> Ce projet consiste à concevoir et fabriquer une imprimante 3D Delta fonctionnelle. L’objectif est de maîtriser l’ensemble du processus de prototypage rapide, en passant par plusieurs étapes essentielles : la modélisation CAO, l’impression des pièces, l’assemblage mécanique et la calibration de l’imprimante. Nous avons également étudié les spécificités de son architecture et de son système de commande pour assurer un fonctionnement précis et fiable.
> 

### Sommaire

![Figure 1 - Imprimante Delta du commerce](Cr%C3%A9ation%20d%E2%80%99une%20imprimante%203D/1.jpg)

Figure 1 - Imprimante Delta du commerce

## 1. Modélisation

### a) Upper Frame

Les objectifs à remplir pour cette partie sont les suivants :

- Fixation au sommet des barres
- Relier les 3x2 barres entre elles en utilisant des profilés
- Fixer le capteur
- Maintien de la poulie
- Limitation des supports pour l’impression

Cela a mené le groupe à faire des choix et à réaliser la modélisation 3D ci-dessous :

![Figure 2 - Modélisation 3D de l’Upper Frame](Cr%C3%A9ation%20d%E2%80%99une%20imprimante%203D/276b557f-f805-4401-896b-ce306aaa9999.png)

Figure 2 - Modélisation 3D de l’Upper Frame

### b) Lower Frame

De même, cette partie doit remplir plusieurs critères :

- Tenir le plateau
- Intégrer le moteur
- Intégrer l’écran
- Stabilité au sol pendant l’impression

C’est donc cette modélisation qui a été retenue :

![Figure 3 - Modélisation 3D du Lower Frame](Cr%C3%A9ation%20d%E2%80%99une%20imprimante%203D/84d5894f-0c08-4de7-9443-5d6bdda7aa65.png)

Figure 3 - Modélisation 3D du Lower Frame

### c) Carriage

Cette partie, sur laquelle j’ai travaillé personnellement, vise à modéliser le chariot qui doit coulisser autour des tiges métalliques afin de faire bouger la tête d’impression dans l’espace grâce à un moteur et un microcontrôleur. Ce chariot se doit de suivre ces indications pour assurer le bon fonctionnement de l’imprimante :

- Fixation des aimants sans perte d'amplitude des bras
- Liaison glissière autour des tiges métalliques
- Passage et blocage de la courroie
- Informer que le chariot est arrivé en haut

Nous avons commencé par faire des versions de test de cette partie, que nous avons progressivement imprimées et améliorées pour tester plusieurs structures.

![Figure 4 - Exemple d’une impression test](Cr%C3%A9ation%20d%E2%80%99une%20imprimante%203D/05264723-4451-49d6-9aae-f9f1348ce313.png)

Figure 4 - Exemple d’une impression test

Finalement, nous nous sommes fixés après plusieurs sessions de test sur une structure qui permet de bloquer la courroie grâce à de multiples encoches situées à l’intérieur de la structure 3D :

![Figure 5 - Modélisation 3D du Carriage](Cr%C3%A9ation%20d%E2%80%99une%20imprimante%203D/05b356e7-c0e4-43de-bf97-6f13191887c5.png)

Figure 5 - Modélisation 3D du Carriage

![Figure 6 - Chariot imprimé et fonctionnel](Cr%C3%A9ation%20d%E2%80%99une%20imprimante%203D/3988d843-4f02-4613-8154-a03fd5eb8e2d.png)

Figure 6 - Chariot imprimé et fonctionnel

### d) Toolhead

Pour cette dernière partie, les prérequis de la structure étaient les suivants :

- Fixer le radiateur, les ventilateurs, les aimants, le capteur inductif
- Dimensionner la tête pour avoir un volume minimum dans l’espace d’impression
- Conserver l’esprit de la marque

![Figure 7 - Modélisation 3D de la Toolhead](Cr%C3%A9ation%20d%E2%80%99une%20imprimante%203D/be846340-17fa-42ea-9fd1-39eff77900b4.png)

Figure 7 - Modélisation 3D de la Toolhead

## 2. Impression et assemblage

![Figure 8 - Assemblage de la structure 3D](Cr%C3%A9ation%20d%E2%80%99une%20imprimante%203D/eb712480-cbe0-47a0-943b-67ef344ff8e0.png)

Figure 8 - Assemblage de la structure 3D

Avant de pouvoir imprimer les pièces de manière définitive, nous avons dû vérifier que l’assemblage était fonctionnel, ce que l’on a pu faire avec la modélisation 3D directement. Pour cela, nous avons défini toutes nos liaisons et nous avons importé tous les éléments que nous n’avons pas modélisés.

Pour imprimer les pièces, nous avons utilisé les imprimantes 3D Prusa I3 MK2 avec les paramètres suivants pour toutes les pièces :

| Vitesse | 0.2 mm |
| --- | --- |
| Remplissage | 20 % |
| Supports | Partout |

Pour une telle opération, en comptant les tentatives infructueuses et tous les tests réalisés, nous avons utilisé 1 kg de filament et 105 h d’impression au total. Cela nous a permis d’arriver à l’étape de l’assemblage avec les composants imprimés et ceux que l’on avait déjà à disposition (moteur, tiges métalliques, plateau d’impression…) :

![Figure 9 - Assemblage final](Cr%C3%A9ation%20d%E2%80%99une%20imprimante%203D/05cd9ead-dc18-4f70-b9be-baa9ab28ef29.png)

Figure 9 - Assemblage final

---

## Conclusion

Ce projet nous a permis d’explorer en profondeur l’ensemble du processus de prototypage rapide, depuis la conception et la modélisation en CAO jusqu’à l’impression des pièces et l’assemblage final de l’imprimante 3D Delta. Chaque étape a nécessité une réflexion approfondie sur les choix de conception, les contraintes mécaniques et les spécificités de l’architecture Delta, notamment son système de commande et de déplacement. Les multiples tests et ajustements réalisés nous ont permis d’optimiser les composants pour garantir un fonctionnement fluide et précis. Cette expérience nous a non seulement familiarisés avec les technologies de fabrication additive, mais aussi avec les défis techniques liés à la mise en œuvre d’un système complexe, constituant ainsi une base solide pour de futurs projets en ingénierie et prototypage.