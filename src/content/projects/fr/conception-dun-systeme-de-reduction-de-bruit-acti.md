---
title: "Conception d'un système de Réduction de Bruit Active"
description: "Conception d'un système de réduction de bruit active par opposition de phase, combinant approches théoriques, expérimentales et électroniques. Le système est développé en trois étapes : expérimentation sur haut-parleurs, modélisation électrique et implémentation numérique sur Raspberry Pi."
cardDescription: "Atténuer un bruit par opposition de phase, de l'expérimentation au Raspberry Pi."
tags: ["Traitement du Signal", "Hardware", "Embarqué"]
cover: "/images/projects/conception-dun-systeme-de-reduction-de-bruit-acti/chaine.png"
lang: fr
draft: false
teamSize: 2
year: 2023
month: 9
impact:
  - value: "95%"
    label: "de réduction de bruit mesurée (circuit électrique)"
  - value: "93%"
    label: "d'efficacité à 440 Hz (opposition de phase)"
  - value: "3"
    label: "prototypes conçus et testés"
summary: "Les casques à réduction de bruit fonctionnent en générant un son exactement opposé au bruit ambiant. Nous avons construit ce principe de zéro : d'abord avec deux haut-parleurs en opposition de phase (93 % de réduction à 440 Hz), puis avec un circuit analogique (95 %), et enfin avec un Raspberry Pi traitant le signal numériquement. Trois prototypes, trois approches, un seul objectif : le silence."
conclusion: |
  Ce projet nous a permis d'explorer en profondeur la réduction de bruit active, depuis les premières expériences sur les interférences destructives jusqu'à la modélisation et l'implémentation d'un système numérique avancé. Chaque étape a mis en évidence les défis liés à la mise en œuvre d'un tel système, notamment la précision du traitement du signal et les contraintes matérielles.

  Malgré des difficultés techniques avec le Raspberry Pi, les résultats obtenus sur les premiers prototypes sont prometteurs et suggèrent que l'utilisation d'un matériel plus performant pourrait aboutir à une solution pleinement fonctionnelle. Ce travail constitue une base solide pour approfondir l'optimisation du traitement du signal et l'intégration de systèmes embarqués dédiés à la réduction du bruit.
appendix:
  documents:
    - title: "Rapport TIPE"
      description: "Rapport complet du TIPE sur la réduction de bruit active par opposition de phase"
      url: "/images/projects/conception-dun-systeme-de-reduction-de-bruit-acti/TIPE_Réduction_de_bruit_Astyan.pdf"
      type: pdf
  sources:
    - authors: "Kuo, S. M., Morgan, D. R."
      year: 1996
      title: "Active Noise Control Systems: Algorithms and DSP Implementations"
      publisher: "Wiley"
      url: "https://www.wiley.com/en-us/Active+Noise+Control+Systems%3A+Algorithms+and+DSP+Implementations-p-9780471134831"
    - authors: "Nelson, P. A., Elliott, S. J."
      year: 1992
      title: "Active Control of Sound"
      publisher: "Academic Press"
      url: "https://www.sciencedirect.com/book/9780125154208/active-control-of-sound"
---

## Introduction

Le bruit est une vibration mécanique d’un fluide qui peut être mesurée en décibels (dB). Une exposition prolongée à un bruit excessif peut entraîner du stress, une perte de concentration et, à terme, des troubles auditifs. Il existe deux méthodes principales pour réduire le bruit :

- **La réduction passive**, qui repose sur l’absorption ou l’isolation acoustique via des matériaux spécifiques
- **La réduction active**, qui repose sur la génération d’un signal sonore en opposition de phase afin d’annuler une onde sonore indésirable

La réduction active est particulièrement utile pour atténuer certaines fréquences précises et compléter les limites de la réduction passive. Cependant, elle nécessite un système électronique performant capable d’analyser et de traiter les signaux sonores en temps réel.

![Figure 1 - Simulation d’opposition de phase](/images/projects/conception-dun-systeme-de-reduction-de-bruit-acti/simulation_opposition_bis_page-0001.jpg)

Figure 1 - Simulation d’opposition de phase

## 1. Premières expériences

### a) Interférences destructives avec des Haut-Parleurs

La première expérimentation a consisté à générer une opposition de phase entre deux haut-parleurs pour créer une interférence destructive et réduire le bruit perçu.

- Deux haut-parleurs ont été disposés en face l’un de l’autre et alimentés par un **générateur de signal** avec un déphasage de 180°
- La réduction du bruit a été mesurée à différentes distances, et l’efficacité a atteint **jusqu’à 93 %** pour une fréquence de **440 Hz**

![Figure 2 - Schéma du premier montage](/images/projects/conception-dun-systeme-de-reduction-de-bruit-acti/montage_hp_colles_page-0001.jpg)

Figure 2 - Schéma du premier montage

![Figure 3 -  Résultats associés : 93% d’efficacité](/images/projects/conception-dun-systeme-de-reduction-de-bruit-acti/hp_colles_courbe.png)

Figure 3 - Résultats associés : 93% d’efficacité

![Figure 4 - Schéma du deuxième montage](/images/projects/conception-dun-systeme-de-reduction-de-bruit-acti/montage_hp_2_page-0001.jpg)

Figure 4 - Schéma du deuxième montage

![Figure 5 - Résultats associés : 86% d‘efficacité](/images/projects/conception-dun-systeme-de-reduction-de-bruit-acti/hp_distants_l.png)

Figure 5 - Résultats associés : 86% d‘efficacité

L’expérience a donc révélé que le positionnement des haut-parleurs et les réflexions des ondes sonores influencent fortement l’efficacité de l’annulation.

L’expérimentation a mis en évidence plusieurs limitations :

- L’efficacité diminue fortement en présence de réflexions sonores sur les parois environnantes
- Une opposition de phase parfaite est difficile à maintenir sur l’ensemble du spectre sonore
- L’environnement de mesure doit être contrôlé pour limiter les interférences extérieures

Ces observations ont motivé la mise en place d’un **système électrique plus précis** permettant un meilleur contrôle du signal généré.

### b) Première modélisation électrique

L’objectif était de concevoir un circuit capable de générer un signal déphasé en opposition de phase avec le bruit ambiant.

- Une tension sinusoïdale de **1 kHz** est envoyée en entrée d’un circuit composé de résistances et de condensateurs pour produire un **décalage de phase** via la fonction $2arctan(R_1C\omega)$
- Le signal obtenu a ensuite été additionné avec le bruit ambiant via un **amplificateur sommateur**, simulant ainsi une annulation du bruit par superposition d’ondes opposée

![Figure 6 - Montage électrique du circuit déphaseur sommateur](/images/projects/conception-dun-systeme-de-reduction-de-bruit-acti/montagedephaseursommateur_page-0001.jpg)

Figure 6 - Montage électrique du circuit déphaseur sommateur

Un premier circuit a été monté et testé :

![Figure 7 - Système électrique](/images/projects/conception-dun-systeme-de-reduction-de-bruit-acti/photo_circuit_simple.jpg)

Figure 7 - Système électrique

![Figure 8 - Résultats associés mesurés](/images/projects/conception-dun-systeme-de-reduction-de-bruit-acti/photo_resultat_elec.jpg)

Figure 8 - Résultats associés mesurés

On peut mesurer que la réduction sonore mesurée a atteint **95 %**, ce qui valide la faisabilité du modèle. Cependant, les valeurs des composants électroniques ont montré des **incertitudes** d’environ **±10 %**, ce qui peut limiter la précision du déphasage obtenu et aussi expliquer l’écart de valeurs.

## 2. Système Électrique

Ce circuit a pour but de simuler une utilisation plus classique du principe de réduction de bruit active comme on peut le voir dans le commerce : l’annulation du bruit environnant pour ne garder que le son que l’on a choisi. Pour cela, nous traitons un signal d’entrée que nous sommons ensuite avec une musique.

Le bruit est donc la musique diffusée que nous essayons d’enlever au signal envoyé par le GBF.

![Figure 9 - Principe général du système](/images/projects/conception-dun-systeme-de-reduction-de-bruit-acti/chain_page-0001.jpg)

Figure 9 - Principe général du système

Nous avons alors monté et testé notre système :

![Figure 10 - Système électrique](/images/projects/conception-dun-systeme-de-reduction-de-bruit-acti/photo_intermediaire.jpg)

Figure 10 - Système électrique

![Figure 11 - Résultats associés mesurés](/images/projects/conception-dun-systeme-de-reduction-de-bruit-acti/photo_resultats_intermediaire-1.jpg)

Figure 11 - Résultats associés mesurés

Avec en vert la courbe du signal sans réduction et en jaune celle du signal avec réduction de bruit, nous pouvons voir que l’efficacité est discutable et encore assez peu satisfaisante pour un système réel. Cela nous amène alors à changer la manière dont on traite le signal et donc amener un **traitement électronique** pour notre système final.

## 3. Système Électronique

### a) Utilisation d’un plaque Sysam

Pour explorer cette nouvelle possibilité, nous avons développé un programme de traitement du signal en python afin d’enregistrer un son, de le traiter avec notre programme grâce à la plaque Sysam puis le renvoyer dans un autre haut-parleur. Expérimentalement, nous avons commencé par un signal sinusoïdal que nous avons déphasé afin de pouvoir évaluer clairement l’efficacité de notre solution.

![Figure 12 - Premier système électronique avec Plaque Sysam](/images/projects/conception-dun-systeme-de-reduction-de-bruit-acti/photo_sysam.jpg)

Figure 12 - Premier système électronique avec Plaque Sysam

Cependant, l’expérience nous a montré que, pour un travail aussi précis que la réduction de bruit active, la plaque Sysam était loin d’être assez rapide pour traiter le signal. Les résultats assez mauvais que nous avons obtenus nous ont donc mené à considérer une option plus aboutie comprenant un **Raspberry Pi** pour le traitement du signal.

### b) Implémentation numérique avec un Raspberry Pi

Pour automatiser l’analyse et la correction du signal sonore, un système numérique a été développé à l’aide d’un **Raspberry Pi** et de **convertisseurs analogique-numérique (CAN) et numérique-analogique (CNA)**. Cela ajoute alors des contraintes supplémentaires sur le signal d’entrée et de sortie, car il doit correspondre aux amplitudes et plages de tension requises par les composants de traitement.

Le protocole mis en place comprend alors plusieurs étapes :

![Figure 13 - Protocole de traitement du signal](/images/projects/conception-dun-systeme-de-reduction-de-bruit-acti/chaine.png)

Figure 13 - Protocole de traitement du signal

Pour le conditionnement du signal d’entrée, il a été décidé d’utiliser un amplificateur sommateur afin de décaler la plage de tension au-dessus de $0V$ avec une amplitude de $2V$.

![Figure 14 - Amplificateur sommateur pour le conditionnement d’entrée](/images/projects/conception-dun-systeme-de-reduction-de-bruit-acti/montage_ali_1_page-0001.jpg)

Figure 14 - Amplificateur sommateur pour le conditionnement d’entrée

Pour le signal de sortie, nous avons pu observer que le faible taux d’échantillonage du Raspberry Pi était à l’origine d’arêtes vives en sortie. Nous avons donc choisi d’utiliser un filtre passe-bas pour y remédier.

![Figure 15 - Passe-bas pour le conditionnement de sortie](/images/projects/conception-dun-systeme-de-reduction-de-bruit-acti/montage_ali_2_page-0001.jpg)

Figure 15 - Passe-bas pour le conditionnement de sortie

Un système d’interface utilisateur a aussi été conçu afin de pouvoir ajuster dynamiquement les paramètres du système :

- **Un encodeur rotatif** permet de modifier l’intensité de la réduction du bruit
- **Des LED** indiquent l’état de fonctionnement du système
- Un **script en Python** gère l’ensemble du traitement des périphériques et l’optimisation du signal sonore

Finalement, nous avons pu modéliser le circuit final et le réaliser :

![Figure 16 - Modélisation du projet final](/images/projects/conception-dun-systeme-de-reduction-de-bruit-acti/circuit_complet.jpg)

Figure 16 - Modélisation du projet final

![Figure 17 - Système en état de marche](/images/projects/conception-dun-systeme-de-reduction-de-bruit-acti/photo_astyan_avance.jpg)

Figure 17 - Système en état de marche

Cependant, l’implémentation sur le **Raspberry Pi** nous a posé plusieurs défis :

- La **vitesse de traitement** était insuffisante, introduisant un décalage temporel rendant l’annulation inefficace
- Un problème de **distorsion sonore** a été observé en sortie sans raison évidente
- Certaines broches de sortie du **Raspberry Pi** ont été endommagées lors des tests, rendant impossible la mise en pratique finale

La mise en pratique n’a donc pas pu être effectuée malgré l’élaboration de toute la partie théorique en amont. Toutefois, je suis convaincu qu’au vu des résultats prometteurs des autres expériences, ce
système aurait sûrement pu aboutir.
Les deux derniers systèmes étant très complexes et chronophages, nous aurions aussi pu explorer d’autres pistes :

- **Miniaturisation portable** du système intermédiaire
- Trouver un équivalent de la plaque **Sysam** moins complexe que le Raspberry Pi
