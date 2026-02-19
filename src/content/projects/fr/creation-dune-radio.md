---
title: "Création d'une radio"
description: "Conception et réalisation d'un récepteur FM fonctionnel assurant une réception claire et stable des signaux radio. Le projet couvre la filtration du signal, l'amplification audio, la synthèse de fréquence et la démodulation FM."
cardDescription: "Conception et réalisation d'un récepteur FM avec filtrage et démodulation."
tags: ["Hardware", "Traitement du Signal", "Embarqué"]
cover: "/images/projects/creation-dune-radio/1-1.png"
lang: fr
draft: false
teamSize: 2
year: 2024
month: 12
summary: "Transformer une onde électromagnétique invisible en voix d'animateur radio demande une chaîne d'électronique étonnamment précise. Nous avons conçu et construit un récepteur FM de A à Z : filtres pour isoler la bonne bande de fréquence, synthétiseur pour s'accrocher à une station, PLL pour extraire l'audio, et amplificateur pour piloter un haut-parleur. Le tout validé en simulation LTSpice avant de souder."
conclusion: |
  Ce projet nous a permis d'explorer les différentes étapes de la conception d'un récepteur FM, depuis la théorie des circuits jusqu'aux tests pratiques et simulations. Chaque module a été optimisé pour garantir une réception stable et une qualité sonore optimale. Cette expérience constitue une base solide pour approfondir les techniques de traitement du signal et de communication radiofréquence.
---

![Figure 1 - Principe général d'un récepteur FM](/images/projects/creation-dune-radio/1.png)

Figure 1 - Principe général d'un récepteur FM

## 1. Filtrage Audio

Afin d'obtenir un signal audio de bonne qualité, nous avons conçu des filtres passe-bas et passe-haut qui se doivent de respecter plusieurs conditions :

On retrouve alors après normalisation : $F_0 = 1, F_1 = 2$

![Figure 2 - Cahier des charges des filtres](/images/projects/creation-dune-radio/1-1.png)

Figure 2 - Cahier des charges des filtres

Le filtre passe-bas repose sur une conception de type Chebyshev d'ordre 4, permettant d'atténuer les fréquences indésirables tout en conservant un bon temps de réponse.

![Figure 3 - Filtres de Chebyshev 3 dB](/images/projects/creation-dune-radio/1-2.png)

Figure 3 - Filtres de Chebyshev 3 dB

$$
\omega_0 = \frac{1}{C\sqrt{R_2(R_4+R)}}\\ Q = \frac{R_3}{\sqrt{R_2(R_4+R)}}\frac{R_y}{R_x}\\ K'=\frac{R_1}{R_2}\frac{R_x}{R_y}
$$

Ce qui nous donne finalement :
$R_1 = \frac{R_2}{K'}\frac{R_x}{R_y};
R_2 = \frac{2\times10^9}{f_{0i}}; R_3 = QR_2\frac{R_x}{R_y};
R_4 = R_2 - 5k\Omega;$

Après avoir trouvé les valeurs exactes reportées ici pour les deux cellules, on peut vérifier expérimentalement la correspondance avec la théorie :

| Résistance | Théorique | Normalisée |
| --- | --- | --- |
| R1 | 28kΩ | 27kΩ |
| R2 | 140kΩ | 130kΩ |
| R3 | 156kΩ | 160kΩ |
| R4 | 135kΩ | 130kΩ |

| Résistance | Théorique | Normalisée |
| --- | --- | --- |
| R1 | 60kΩ | 62kΩ |
| R2 | 301kΩ | 300kΩ |
| R3 | 65kΩ | 70kΩ |
| R4 | 296kΩ | 300k |

![Figure 4 - Représentation théorique](/images/projects/creation-dune-radio/1-3.png)

Figure 4 - Représentation théorique

![Figure 5 - Représentation expérimentale](/images/projects/creation-dune-radio/1-4.png)

Figure 5 - Représentation expérimentale

Quant au filtre passe-haut, il est basé sur une architecture de Rauch répétée 4 fois, garantissant une suppression efficace des basses fréquences parasites. Nous avons soigneusement calculé et normalisé les valeurs des composants pour assurer une réponse en fréquence optimale.

![Figure 6 - Filtre de Rauch](/images/projects/creation-dune-radio/733a9ee1-ac01-4acd-8827-7fe3a4aecd34.png)

Figure 6 - Filtre de Rauch

$$
C_1 = C_2 = C_3 = C\\
Q = \frac{1}{3}\sqrt{\frac{R_2}{R_1}}\\
\omega_c = \frac{1}{C\sqrt{R_1}{R_2}}
$$

![Figure 7 - Réalisation des filtres en cascade](/images/projects/creation-dune-radio/1-5.png)

Figure 7 - Réalisation des filtres en cascade

De même, on peut alors calculer les valeurs exactes pour chaque composant :

| Impédance | Théorique | Normalisé |
| --- | --- | --- |
| R1 | 1kΩ | 1kΩ |
| R2 | 7,3kΩ | 7,2kΩ |
| C | 0,59μF | 0,56μF |

## 2. Amplification Audio

Une fois filtré, le signal audio doit être amplifié pour une restitution sonore de qualité. Nous avons réglé l'amplificateur audio pour obtenir un gain maximal de 20 dB. Un Noise Gate a été intégré avec un seuil fixé à 10 mVrms afin d'atténuer les bruits de fond indésirables. Le fonctionnement de l'amplificateur a été paramétré via des registres afin d'optimiser les performances du système :

![Figure 8 - Paramètres recommandés en fonction de la source audio](/images/projects/creation-dune-radio/1-6.png)

Figure 8 - Paramètres recommandés en fonction de la source audio

Cela nous donne les informations suivantes à rentrer sous forme d'octets dans notre module :

| **Registre** | **Octet** |
| --- | --- |
| Registre 1 | 11000011 |
| Registre 2 | 00000001 |
| Registre 3 | 00000110 |
| Registre 4 | 00001010 |
| Registre 5 | 00000110 |
| Registre 6 | 01011100 |
| Registre 7 | 00100010 |

```c
#include <Wire.h>

#define SI5351_ADDRESS 0x60

void setup() {
    Wire.begin();
    Serial.begin(9600);

    // Initialisation du synthétiseur de fréquence
    configureSynth();
}

void loop() {
    // Le programme tourne en boucle sans action spécifique après configuration
}

void configureSynth() {
    Wire.beginTransmission(SI5351_ADDRESS);

    // Exemple de configuration des registres du synthétiseur
    Wire.write(0x00); // Registre de contrôle
    Wire.write(0x10); // Valeur arbitraire pour init
    Wire.endTransmission();

    delay(100);

    Wire.beginTransmission(SI5351_ADDRESS);
    Wire.write(0x01); // Registre de contrôle supplémentaire
    Wire.write(0x00); // Valeur pour configurer la sortie
    Wire.endTransmission();

    Serial.println("Synthétiseur configuré avec succès !");
}

```

## 3. Synthèse et démodulation de Fréquence

Pour syntoniser la bonne station radio, nous avons conçu un synthétiseur de fréquence. En partant d'un quartz oscillant à 10,7 MHz, nous avons calculé les diviseurs et multiplicateurs nécessaires pour capter la fréquence cible de Radio Campus (94,35 MHz). Ces paramètres ont été implémentés dans un programme Arduino permettant d'ajuster la fréquence de réception de manière précise.

Les formules utilisées sont les suivantes :

$$
p = \frac{f_x}{M}\\
f_s = \frac{N}{M}f_x\\
N = \frac{f_s}{p}
$$

On trouve finalement $M = 1000, N = 10505$, ce qui nous donne les 3 séquences à transmettre :

|  | Décimal | Binaire |
| --- | --- | --- |
| M | 4000 | 111110100000 |
| K | 306905 | 1001010111011011001 |
| Latch | 884930 | 11011000000011000010 |

Pour cela, on utilise à nouveau un programme informatique :

```c
/// LATCH 1 : Calcul et décomposition
Latch1 = Mdiv * 4;
L11 = lowByte(Latch1);
L12 = highByte(Latch1);
L13 = 0;

Serial.print("Latch1: ");
Serial.println(Latch1);

/// LATCH 2 : Calcul et décomposition
K = ((Ndiv / 8) % 8192) * 256 + (Ndiv % 8) * 4 + 1;

L21 = lowByte(K);
L22 = highByte(K);
L23 = (K >> 16) & 0xFF;

Serial.print("Latch2: ");
Serial.println(K);

/// LATCH 3 : Valeurs fixes
L31 = 0x82;
L32 = 0x80;
L33 = 0x0D;
```

Nous avons ensuite utilisé une boucle à verrouillage de phase (PLL) pour démoduler le signal FM. Cette approche permet d'extraire l'information audio contenue dans la modulation de fréquence. Un filtre passe-bas a été conçu pour lisser le signal de sortie et assurer une reproduction audio fidèle. Après plusieurs tests et l'utilisation de l'abaque du modèle, nous avons ajusté les valeurs des composants pour améliorer les performances globales du démodulateur.

![Figure 9 - Abaque](/images/projects/creation-dune-radio/1-7.png)

Figure 9 - Abaque

Toujours d'après le cahier des charges, on a $F_0 = 10,7MHz, f_{max} - f_{min} = 200kHz$. Cela nous donne, après avoir testé expérimentalement, les valeurs finales suivantes :

- $R_1 = +\infty$
- $R_2 =$  Potentiomètre $10 k\Omega$
- $R_3 = 1,3 k\Omega$
- $C_1 = 100pF$
- $C_2 = 1 nF$

## 4. Simulation LTSpice

Avant la mise en place physique du circuit, nous avons effectué une validation par simulation sous LTSpice. Cette simulation nous a permis de vérifier la stabilité et la réponse fréquentielle de chaque étage du récepteur. Les résultats ont confirmé un bon centrage du signal autour de 400 kHz, validant ainsi les choix de conception effectués.

![Figure 10 - Simulation par LTSpice](/images/projects/creation-dune-radio/1-8.png)

Figure 10 - Simulation par LTSpice

[Vidéo 1 - Radio en action](/images/projects/creation-dune-radio/vido_radio.mp4)

Vidéo 1 - Radio en action

