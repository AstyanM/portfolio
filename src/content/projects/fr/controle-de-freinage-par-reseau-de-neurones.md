---
title: "Contrôle de freinage par réseau de neurones"
description: "Conception d'un système de freinage anti-blocage (ABS) intelligent utilisant des réseaux de neurones pour maintenir un ratio de glissement optimal. Le contrôleur NARMA-L2, basé sur une stratégie de linéarisation par retour, remplace les méthodes classiques de type PID."
cardDescription: "Système ABS intelligent utilisant un contrôleur NARMA-L2."
tags: ["Deep Learning", "Simulation", "Recherche"]
cover: "../../../assets/images/projects/controle-de-freinage-par-reseau-de-neurones/comparison_results.png"
lang: fr
draft: false
teamSize: 1
year: 2025
month: 6
repoUrl: "https://github.com/AstyanM/abs-narmal-2"
impact:
  - value: "20k"
    label: "points de données pour l'entraînement"
  - value: "50"
    label: "scénarios de freinage simulés"
  - value: "1"
    label: "article scientifique rédigé"
summary: "Quand on freine fort sur une route mouillée, l'ABS empêche les roues de se bloquer. Le contrôleur derrière suit d'habitude des règles fixes. Ici, un réseau de neurones entraîné sur 50 scénarios de freinage simulés le remplace : il apprend à maintenir l'adhérence idéale entre le pneu et la route, en s'adaptant en temps réel au lieu de suivre une recette prédéfinie."
conclusion: |
  Ce projet a permis de concevoir, simuler et comparer un contrôleur de freinage intelligent basé sur des réseaux de neurones. En plus des travaux techniques, l'objectif était aussi de produire un article scientifique en anglais, qui a synthétisé les fondements théoriques, les choix de conception, les résultats et les limites de l'approche.

  Cette expérience pose les bases de futurs travaux sur des contrôleurs hybrides mêlant précision classique et intelligence adaptative.
appendix:
  documents:
    - title: "Article scientifique"
      description: "Article au format PDF décrivant la modélisation et les résultats expérimentaux"
      url: "/images/projects/controle-de-freinage-par-reseau-de-neurones/article_scientifique_abs_nn_system.pdf"
      type: pdf
  sources:
    - authors: "Narendra, K. S., Parthasarathy, K."
      year: 1990
      title: "Identification and Control of Dynamical Systems Using Neural Networks"
      publisher: "IEEE Transactions on Neural Networks"
      url: "https://ieeexplore.ieee.org/document/80202"
    - authors: "Nørgaard, M., Ravn, O., Poulsen, N. K., Hansen, L. K."
      year: 2000
      title: "Neural Networks for Modelling and Control of Dynamic Systems"
      publisher: "Springer"
      url: "https://link.springer.com/book/9781852332273"
    - authors: "Precup, R.-E., Preitl, S."
      year: 2006
      title: "PI and PID Controllers Tuning for Integral-Type Servo Systems to Ensure Robust Stability and Controller Robustness"
      publisher: "Electrical Engineering"
      url: "https://link.springer.com/article/10.1007/s00202-006-0031-4"
---

## 1. Modélisation du système

Le système ABS a été modélisé à l’aide du modèle de quart de voiture décrivant les dynamiques du véhicule, de la roue et du système de freinage. Le ratio de glissement $\lambda$, grandeurs mécaniques et aérodynamiques sont liées par :

$$
\lambda = \frac{v - r\omega}{v}
$$

![Figure 1 - Modèle simplifié du quart de voiture](/images/projects/controle-de-freinage-par-reseau-de-neurones/quarter_car_model.png)

Figure 1 - Modèle simplifié du quart de voiture

Les équations différentielles suivantes décrivent le système :

- **Dynamique du véhicule :**

  $$
  M\dot{v} = -\mu(\lambda)F_z - C_x v^2
  $$

- **Dynamique de la roue :**

  $$
  I\dot{\omega} = \mu(\lambda)F_z r - B\omega - \tau_b


  $$

- **Système de freinage :**

  $$
  \dot{\tau}_b = \frac{-\tau_b + K_b u}{\tau}
  $$

La relation non linéaire entre le ratio de glissement et le coefficient de friction $\mu(\lambda)$ est modélisée par une loi de type :

$$
\mu(\lambda) = \frac{2\mu_0 \lambda_0 |\lambda|}{\lambda_0^2 + \lambda^2}
$$

avec un pic d’adhérence maximal autour de $\lambda_0 = 0.25$.

## 2. Contrôleur NARMA-L2

Le contrôleur NARMA-L2 permet de linéariser un système non linéaire par l'utilisation de deux réseaux de neurones (appelés f-network et g-network), entraînés à partir des sorties passées et des entrées de commande :

$$
y(k+d) = f(\cdot) + g(\cdot) \cdot u(k+1)
$$

On en déduit la loi de commande :

$$
u(k+1) = \frac{y_{\text{ref}} - f_k}{g_k}
$$

Où $y_{ref} = 0.25$ représente le ratio de glissement optimal.

Les réseaux utilisés ont une architecture simple à une couche cachée, avec fonction $tanh$, et prennent en entrée :

$$
x(k)=[y(k),y(k−1),y(k−2),u(k),u(k−1),u(k−2)]
$$

## 3. Génération des données et entraînement

Pour entraîner les réseaux, un ensemble de 50 scénarios de freinage simulés a été généré à l’aide d’un contrôleur PID. Les paramètres comme la vitesse initiale, le couple de freinage ou l’état du véhicule ont été aléatoirement choisis pour varier les conditions.

| Paramètre                  | Intervalle |
| -------------------------- | ---------- |
| Vitesse initiale           | 20–40 m/s  |
| Glissement initial         | 0.1–0.4    |
| Couple de freinage initial | 0–20 Nm    |

![Figure 2 - Analyse des données générées](/images/projects/controle-de-freinage-par-reseau-de-neurones/data_quality_analysis.png)

Figure 2 - Analyse des données générées

Les réseaux ont été entraînés sur environ 20 000 points de données avec une méthode standard (Adam, 5 à 10 époques). L’objectif était de prédire avec précision la réponse du système et d’en extraire une loi de commande stable.

![Figure 3 - Perte d’apprentissage des deux réseaux de neurones](/images/projects/controle-de-freinage-par-reseau-de-neurones/training_curves.png)

Figure 3 - Perte d’apprentissage des deux réseaux de neurones

## 4. Résultats expérimentaux

Le contrôleur NARMA-L2 a été comparé au contrôleur PID classique :

- **Suivi du ratio de glissement :** le PID reste plus précis et plus stable. Le NARMA-L2 montre des écarts importants autour de la consigne.
- **Effort de freinage :** le NARMA-L2 applique des pressions de freinage plus faibles, parfois instables, mais suffisantes pour un ralentissement comparable.
- **Réduction du stress mécanique :** des efforts de freinage plus doux peuvent prolonger la durée de vie des composants.

![Figure 4 - Comparaison des performances : glissement et couple de freinage](/images/projects/controle-de-freinage-par-reseau-de-neurones/comparison_results.png)

Figure 4 - Comparaison des performances : glissement et couple de freinage

## 5. Discussion et perspectives

Même si le contrôleur NARMA-L2 n’a pas surpassé le PID en termes de précision, il présente un intérêt pour :

- la réduction de l’usure des freins,
- l’économie d’énergie dans les systèmes électromécaniques,
- les applications dans les véhicules électriques et autonomes.

Le projet a aussi mis en évidence l'importance de la qualité des données d'entraînement : l’utilisation exclusive d’un PID comme générateur de données peut biaiser l’apprentissage.
