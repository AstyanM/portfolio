# Contrôle de freinage par réseau de neurones

*Projet mené en autonomie - 2025*

Voici un lien github vers l’ensemble du code rédigé au cours de ce projet :

[GitHub - AstyanM/abs_narmal2](https://github.com/AstyanM/abs_narmal2.git)

> Ce projet visait à concevoir un système de freinage anti-blocage (ABS) intelligent en utilisant des réseaux de neurones. L’objectif était de maintenir un ratio de glissement optimal lors du freinage afin d’assurer une adhérence maximale, tout en remplaçant les méthodes classiques (type PID) par une stratégie de linéarisation par retour utilisant le contrôleur NARMA-L2.
> 

Voici aussi l’article scientifique que j’ai rédigé :

[Article_Scientifique_ABS_NN_System.pdf](Contr%C3%B4le%20de%20freinage%20par%20r%C3%A9seau%20de%20neurones/Article_Scientifique_ABS_NN_System.pdf)

### Sommaire

### 1. Modélisation du système

Le système ABS a été modélisé à l’aide du modèle de quart de voiture décrivant les dynamiques du véhicule, de la roue et du système de freinage. Le ratio de glissement $\lambda$, grandeurs mécaniques et aérodynamiques sont liées par :

$$
\lambda = \frac{v - r\omega}{v}
$$

![Figure 1 - Modèle simplifié du quart de voiture](Contr%C3%B4le%20de%20freinage%20par%20r%C3%A9seau%20de%20neurones/quarter_car_model.png)

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

### 2. Contrôleur NARMA-L2

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

### 3. Génération des données et entraînement

Pour entraîner les réseaux, un ensemble de 50 scénarios de freinage simulés a été généré à l’aide d’un contrôleur PID. Les paramètres comme la vitesse initiale, le couple de freinage ou l’état du véhicule ont été aléatoirement choisis pour varier les conditions.

| Paramètre | Intervalle |
| --- | --- |
| Vitesse initiale | 20–40 m/s |
| Glissement initial | 0.1–0.4 |
| Couple de freinage initial | 0–20 Nm |

![Figure 2 - Analyse des données générées](Contr%C3%B4le%20de%20freinage%20par%20r%C3%A9seau%20de%20neurones/data_quality_analysis.png)

Figure 2 - Analyse des données générées

Les réseaux ont été entraînés sur environ 20 000 points de données avec une méthode standard (Adam, 5 à 10 époques). L’objectif était de prédire avec précision la réponse du système et d’en extraire une loi de commande stable.

![Figure 3 - Perte d’apprentissage des deux réseaux de neurones](Contr%C3%B4le%20de%20freinage%20par%20r%C3%A9seau%20de%20neurones/training_curves.png)

Figure 3 - Perte d’apprentissage des deux réseaux de neurones

### 4. Résultats expérimentaux

Le contrôleur NARMA-L2 a été comparé au contrôleur PID classique :

- **Suivi du ratio de glissement :** le PID reste plus précis et plus stable. Le NARMA-L2 montre des écarts importants autour de la consigne.
- **Effort de freinage :** le NARMA-L2 applique des pressions de freinage plus faibles, parfois instables, mais suffisantes pour un ralentissement comparable.
- **Réduction du stress mécanique :** des efforts de freinage plus doux peuvent prolonger la durée de vie des composants.

![Figure 4 - Comparaison des performances : glissement et couple de freinage](Contr%C3%B4le%20de%20freinage%20par%20r%C3%A9seau%20de%20neurones/comparison_results.png)

Figure 4 - Comparaison des performances : glissement et couple de freinage

### 5. Discussion et perspectives

Même si le contrôleur NARMA-L2 n’a pas surpassé le PID en termes de précision, il présente un intérêt pour :

- la réduction de l’usure des freins,
- l’économie d’énergie dans les systèmes électromécaniques,
- les applications dans les véhicules électriques et autonomes.

Le projet a aussi mis en évidence l'importance de la qualité des données d'entraînement : l’utilisation exclusive d’un PID comme générateur de données peut biaiser l’apprentissage.

---

### Conclusion

Ce projet a permis de concevoir, simuler et comparer un contrôleur de freinage intelligent basé sur des réseaux de neurones. En plus des travaux techniques, l’objectif était aussi de produire un article scientifique en anglais, qui a synthétisé les fondements théoriques, les choix de conception, les résultats et les limites de l’approche.

Cette expérience pose les bases de futurs travaux sur des contrôleurs hybrides mêlant précision classique et intelligence adaptative.