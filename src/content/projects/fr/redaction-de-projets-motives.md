---
title: "Rédaction de projets motivés"
description: "Outil d'aide à la rédaction de projets motivés Parcoursup, s'appuyant sur un modèle CamemBERT fine-tuné pour identifier et structurer les différentes parties d'une lettre de motivation. Le système intègre également un serveur de correction orthographique basé sur LanguageTool."
cardDescription: "Assistant d'écriture Parcoursup basé sur CamemBERT pour structurer les lettres."
tags: ["Deep Learning", "NLP", "Web"]
cover: "/images/projects/redaction-de-projets-motives/image-1.png"
lang: fr
draft: false
teamSize: 1
year: 2025
month: 11
repoPrivate: true
liveUrl: "http://lettre-motivation.prepa-prevision.fr"
impact:
  - value: "93%"
    label: "de précision du modèle CamemBERT fine-tuné"
  - value: "320"
    label: "lettres annotées pour l'entraînement"
  - value: "En production"
    label: "déployé et accessible en ligne"
summary: "Chaque année, des centaines de milliers de lycéens rédigent leurs projets motivés sur Parcoursup sans trop savoir à quoi ressemble une bonne lettre. J'ai construit un outil web qui lit une lettre, identifie sa structure grâce à un modèle CamemBERT fine-tuné, vérifie la grammaire via LanguageTool, et renvoie une note détaillée avec des suggestions concrètes. Pas de chatbot, juste des métriques transparentes."
conclusion: |
  Ce projet démontre qu'il est possible de combiner traitement automatique du langage et analyse linguistique pour offrir aux étudiants un accompagnement objectif et transparent dans la rédaction de leurs projets motivés Parcoursup. Grâce à l'intégration de CamemBERT pour la structuration des textes et de LanguageTool pour la correction, l'outil propose une évaluation fine, des indicateurs clairs et des suggestions pertinentes sans recours à un chatbot. Ce travail illustre une approche autonome, explicable et pratique du soutien à l'expression écrite dans un contexte académique.
appendix:
  structure:
    tree: |
      backend/
      │   Dockerfile
      │   main.py
      │   railway.toml
      │   requirements.txt
      │   start.sh
      ├───core
      ├───models
      │   │   .gitignore
      │   │   best_camembert_motivation.pt
      │   └───camembert-base
      ├───routers
      ├───schemas
      └───services
      frontend/src/
      │   index.css
      │   main.tsx
      ├───assets
      ├───components
      ├───const
      ├───pages
      └───utils
  sources:
    - authors: "LanguageTool"
      year: 2024
      title: "LanguageTool Developer Documentation"
      publisher: "LanguageTool"
      url: "https://languagetool.org/dev"
    - authors: "Martin, L., Muller, B., Ortiz Suárez, P. J., et al."
      year: 2020
      title: "CamemBERT: A Tasty French Language Model"
      publisher: "Hugging Face"
      url: "https://huggingface.co/camembert-base"
    - authors: "Tiangolo, S."
      year: 2024
      title: "FastAPI Documentation"
      publisher: "FastAPI"
      url: "https://fastapi.tiangolo.com/"
    - authors: "Wikipédia"
      year: "2024, 10 septembre"
      title: "Tests de lisibilité Flesch-Kincaid"
      publisher: "Wikipédia"
      url: "https://fr.wikipedia.org/wiki/Tests_de_lisibilit%C3%A9_Flesch-Kincaid"
---

## 1. Collecte des données

La qualité de la classification repose sur la pertinence des données, plusieurs sources ont donc été mobilisées :

- **Lettres publiques** : des exemples de projets motivés publiés sur des blogs, forums et sites associatifs ont été collectés après accord.
- **Corpus existants** : des jeux de données open‑source ont été vérifiés pour s’assurer qu’ils correspondaient au format Parcoursup.

Au total, **320 lettres** ont été conservées. Chaque document a été enregistré sous forme de texte brut puis stocké dans un tableau avec un identifiant unique.

## 2. Traitement des données

Le nettoyage et la préparation du corpus comportent plusieurs étapes :

1. **Normalisation** : suppression des accents ou homogénéisation (par exemple, « Étudiant » → « étudiant »), élimination des caractères spéciaux et espaces multiples.
2. **Annotation manuelle** : chaque phrase est assignée à l’une des sections (Introduction, Projet futur, Activités extra‑scolaires & Conclusion).
3. **Création du dataset** : un fichier CSV est généré avec deux colonnes (`text`, `label`). Le label est un entier de 0 à 3 correspondant à la section.
4. **Division en ensembles** : les données sont divisées en jeux d’entraînement (80 %) et de validation (20 %). Un échantillon est conservé pour tester le modèle final.

![Figure 1 : Distribution du nombre de phrases par classes](/images/projects/redaction-de-projets-motives/image.png)

Figure 1 : Distribution du nombre de phrases par classes

Cette préparation garantit un corpus équilibré et représentatif des structures attendues dans un projet motivé Parcoursup, si l’on part du principe que l’échantillon est représentatif de lettres qualitatives.

## 3. Classification de phrases

Le cœur du système est un modèle **CamemBERT** (version de BERT adaptée au français) entraîné pour classer les phrases en quatre catégories. Les principales étapes de modélisation sont :

1. **Fine‑tuning** : à partir du modèle pré‑entraîné `camembert-base`, l’architecture est ajustée avec une couche de sortie de taille 4. Le jeu d’entraînement est utilisé sur plusieurs epochs avec un optimiseur AdamW.
2. **Évaluation** : la performance est mesurée sur le jeu de validation via l’accuracy, le F1-score et la matrice de confusion. Le modèle final atteint une accuracy d’environ 93 %, montrant donc que la différence entre les sections est bien capturée.

![Figure 2 : Courbes d’entraînement Loss/Accuracy du jeu de données](/images/projects/redaction-de-projets-motives/image-1.png)

Figure 2 : Courbes d’entraînement Loss/Accuracy du jeu de données

1. **Persistance du modèle** : le modèle et le tokenizer sont sauvegardés (fichiers `.pt` et vocabulaire). Le chemin est spécifié via `MODEL_DIR`/`MODEL_PATH`.

En production, le modèle est chargé une seule fois et mis en cache afin de minimiser la latence des requêtes.

## 4. Autres métriques

### a) Lisibilité (Score Flesch)

On calcule le nombre de phrases `n_sentences`, de mots `n_words` et de syllabes `n_syll` (après normalisation et segmentation) puis le score de lisibilité :

$$
Flesch_{fr} = 206.835−1.015 \times \frac{n_{words}}{n_{sentences}}−84.6 \times \frac{n_{syll}}{n_{words}}
$$

### b) Richesse lexicale (TTR lissée)

On calcule le **Type-Token Ratio** avec un lissage pour éviter de sur-évaluer les textes très courts :

- facteur de lissage : $\alpha = \log(\min(1, \frac{len\_text}{1400}) \times (e-1) + 1)$
- **TTR lissée** : $\text{TTR} = \frac{n\_unique}{n\_words} \times \alpha$

### c) Connecteurs logiques

Deux indicateurs sont extraits à partir d’une liste de marqueurs regroupés par type :

- **Couverture des connecteurs** : nombre de types détectés `n_types`, liste des types manquants, et détail des marqueurs présents par type (détection via regex avec bornes de mots, insensible à la casse).
- **Compte total** : somme des occurrences de tous les marqueurs détectés.

### d) Redondance lexicale

On mesure la répétition :

- **Top mots** : fréquences sur les mots en minuscules **hors stopwords** ;
- **Top bigrammes** : bigrammes consécutifs, en excluant ceux dont les deux mots sont des stopwords.

Les deux listes sont renvoyées avec leurs fréquences (paramètre `top` par défaut à 3).

### e) Statistiques de référence (benchmarks)

Des moyennes et écarts-types empiriques servent à situer un texte relativement à un corpus interne :

- `asl_mean`, `asl_std` (longueur moyenne de phrase) ;
- `ttr_mean`, `ttr_std` (richesse lexicale) ;
- `flesch_mean`, `flesch_std` (lisibilité).

    Ces valeurs alimentent le calcul de **percentiles** en aval du pipeline (pour un positionnement relatif des textes).


**Remarques d’implémentation** : les fonctions s’appuient sur des utilitaires communs (`normalize_text`, `split_sentences`, `tokenize_words`, `count_syllables_fr`, `load_connectors`, `char_counts`) et un dictionnaire de stopwords français.

## 5. Architecture

### a) Backend

L’API FastAPI est conçue autour de trois routers :

1. **`/health`** : route de supervision qui retourne un objet `{"status": "ok"}`. Elle permet aux services d’orchestration de vérifier que

    l’instance est opérationnelle.

2. **`/analyze`** : route principale prenant un JSON `{ "text": "..." }`. Elle appelle successivement :
    - la fonction de correction grammaticale (LanguageTool) ;
    - les calculs de métriques (score de Flesch, ratio type/token, connecteurs logiques, redondance) ;
    - la fonction de notation qui combine ces métriques et pénalités pour produire une note sur 20 ;
    - la classification des sections, si demandée. Le JSON retourné contient le texte corrigé, les positions des erreurs, les scores, les suggestions et la structure estimée.
3. **`/structure`** : prend un texte et retourne les phrases et leur étiquette de section ainsi que la liste des sections manquantes. Cette route est plus légère et peut être utilisée séparément pour guider l’utilisateur dans la construction de sa lettre.

Les services sont importés depuis `backend/services/` ; ils utilisent `transformers` pour charger CamemBERT, `language_tool_python` pour les corrections et des fonctions maison pour les métriques. La configuration (`core/config.py`) centralise les paramètres (chemins, CORS, etc.).

![Figure 3 : Documentation des endpoints de l’API](/images/projects/redaction-de-projets-motives/image-2.png)

Figure 3 : Documentation des endpoints de l’API

### b) Points d’attention

Quelques éléments nécessitent une vigilance particulière :

- **Serveur LanguageTool** : il doit être disponible pour que la route `/analyze` fonctionne. Prévoir un mécanisme de bascule ou un cache si le service est indisponible.
- **Qualité des données** : le biais dans les annotations peut influencer la classification. Continuer à enrichir le corpus et à valider les étiquetages est recommandé.

### c) Frontend

L’interface web est développée avec **React** et orchestrée via **Vite**.

Elle propose :

- Un champ de saisie permettant de coller ou d’écrire sa lettre.
- Un bouton d’envoi qui appelle `/analyze` et affiche les résultats.
- Des composants graphiques pour visualiser les sections (avec codes couleur), les erreurs grammaticales soulignées et les scores de lisibilité sous forme de barres ou de jauges.

L’architecture suit le modèle composant/context de React : des hooks gèrent l’état de la lettre et des résultats, tandis que des composants spécialisés s’occupent de l’affichage. Les appels à l’API sont centralisés dans `frontend/api/` pour faciliter leur modification.

![Figure 4 : Interface graphique de la page d’évaluation](/images/projects/redaction-de-projets-motives/image-3.png)

Figure 4 : Interface graphique de la page d’évaluation

### d) Mise en ligne

Hébergement complet du backend et frontend sur **Railway.**

![ Figure 3 : Infrastructure Railway](/images/projects/redaction-de-projets-motives/image-4.png)

 Figure 3 : Infrastructure Railway

Les étapes importantes sont :

1. Construire et pousser une image Docker du backend contenant le modèle CamemBERT. Exposer le port `8000` et veiller à charger `languagetool-server.jar` ou à pointer vers un service externe.
2. Charger le modèle et le mettre en cache pour la rapidité des futurs appels.
