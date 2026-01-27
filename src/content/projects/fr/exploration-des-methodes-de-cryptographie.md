---
title: "Exploration des méthodes de Cryptographie"
description: "Ce projet consiste à explorer différentes méthodes de cryptographie en les implémentant sous forme de code. L'objectif est d'étudier la sécurité et la faisabilité du chiffrement, tout en proposant des outils permettant de déchiffrer les messages lorsque cela est possible. Nous avons classé les méthodes selon leur complexité, en commençant par les plus simples avant d'aborder des algorithmes plus avancés."
tags: ["Sécurité"]
cover: "/images/projects/exploration-des-methodes-de-cryptographie/crypto.png"
lang: fr
draft: true
teamSize: 1
year: 2023
repoUrl: "https://github.com/AstyanM/cryptographie"
conclusion: |
  Ce projet m'a permis d'explorer les fondements de la cryptographie à travers différents algorithmes, de leur implémentation en Python jusqu'à leur cassage lorsque cela était possible. Des méthodes simples comme le chiffre de César aux systèmes asymétriques comme RSA, chaque technique présente des défis fascinants en termes de sécurité et de faisabilité. Cette expérience constitue une base solide pour comprendre les enjeux de la sécurisation des données et l'évolution des techniques cryptographiques modernes.
---

## 1. Chiffre de César : Une sécurité illusoire

Le chiffre de César est l'une des méthodes de chiffrement les plus simples. Il consiste à décaler chaque lettre d'un texte d'un nombre fixé de positions dans l'alphabet.

### a) Chiffrement

L'algorithme remplace chaque lettre par celle qui se trouve à une distance définie (la clé) dans l'alphabet.

```python
new_letter_place = useful.alpha.index(alpha_letter) + key % 26
if new_letter_place >= 26:
		new_letter_place -= 26
		encrypted_sentence += useful.alpha[new_letter_place]
```

### b) Déchiffrement et Attaque par dictionnaire

Le déchiffrement consiste à inverser le décalage. Toutefois, cette méthode est extrêmement vulnérable. Une simple attaque par dictionnaire permet de tester les 25 décalages possibles et de comparer les résultats avec une liste de mots courants :

```python
list_options = []
for language_chosen in languages_choosed:
		[list_options.append(possibility) for possibility in useful.see_if_language(
				encrypted_sentences=[(self.encrypt_ceasar(key=shift, sentence=encrypted_text), shift) for shift in range(1, 26)], language=useful.language_choices[language_chosen])]
```

## 2. Chiffre de Vigenère : Une clé plus puissante

Le chiffre de Vigenère améliore la sécurité du chiffre de César en utilisant une clé sous forme de mot, où chaque lettre correspond à un décalage différent.

### a) Chiffrement

Le texte est décalé selon les lettres de la clé, mais si la clé est courte, elle peut être analysée par des attaques de fréquence.

```python
for clear_char in text:
		encrypted_text += useful.alpha[(useful.alpha.index(clear_char) + useful.alpha.index(key[iterator % len(key)])) % 26]
		iterator += 1
```

## 3. Algorithmes de Hachage

Les algorithmes de hachage transforment un texte en une empreinte unique et irréversible. Mais ces empreintes sont-elles vraiment inviolables ?

### a) Hachage et Empreinte unique

L'algorithme prend un texte en entrée et produit une empreinte unique (SHA-256, SHA-512, MD5, Blake, etc.) en utilisant des bibliothèques dédiées :

```python
if type_hash == 1:
    hashed_password = sha256(str(password_to_hash).encode('utf-8')).hexdigest()
elif type_hash == 2:
    hashed_password = sha512(str(password_to_hash).encode('utf-8')).hexdigest()
elif type_hash == 3:
    hashed_password = sha3_512(str(password_to_hash).encode('utf-8')).hexdigest()
elif type_hash == 4:
    hashed_password = md5(str(password_to_hash).encode('utf-8')).hexdigest()
else:
    hashed_password = blake2b(useful.to_binary(password_to_hash).encode()).hexdigest()
```

### b) Attaque par Brute force et Dictionnaire

Bien que le hachage soit irréversible, une attaque par dictionnaire peut permettre de retrouver des mots de passe courants :

```python
for encrypted_type in encrypted_types:
    if self.encrypt_hash(to_crypt=[encrypted_type, password]) == encrypted:
        print("\nPassword found :", password)
```

Une approche plus exhaustive utilise le brute force pour tester toutes les combinaisons possibles :

```python
possibilities = product(alphabet_used, repeat=i)
for password in possibilities:
    word = ""
    count = 0
    while count < i:
        word += password[count]
        count += 1
    for encrypted_type in encrypted_types:
        if self.encrypt_hash(to_crypt=[encrypted_type, word]) == encrypted:
		        print("\nPassword found :", word)
```

## 4. One-Time Pad : L'inviolabilité théorique

Le chiffrement One-Time Pad repose sur une clé aléatoire aussi longue que le message, garantissant une sécurité parfaite si elle n'est utilisée qu'une seule fois.

```python
for bit in text:
    new_bit = int(bit) + int(key[iterator])

    # Xor operation
    if int(new_bit) % 2 == 0:
        encrypted_text += "0"
    else:
        encrypted_text += "1"
    iterator += 1
```

Cependant, la difficulté réside dans la gestion et la distribution sécurisée de la clé.

## 5. Chiffrement par Substitution

La substitution consiste à remplacer chaque lettre par une autre selon une table de correspondance fixe.

### a) Chiffrement

Pour cela, nous pouvons le coder facilement dans nos fonctions Python :

```python
new_words = substitute.encrypt_substitution(text=word, dico=dico)
```

### b) Déchiffrement

La partie de **déchiffrement** fonctionne ainsi :

1. **Préparation du texte**
    - Remplace les caractères non alphabétiques par des espaces
    - Divise le texte en mots et supprime les espaces inutiles
    - Identifie les mots uniques et leurs positions dans le texte
2. **Construction d'un dictionnaire de mots**
    - Charge un dictionnaire de mots triés par longueur
    - Organise les mots dans un dictionnaire indexé par leur longueur pour accélérer la recherche
3. **Déchiffrement par correspondance de motifs**
    - Pour chaque mot chiffré, cherche un mot dans le dictionnaire avec la même structure (ex : "abc" → "rat")
    - Construit progressivement des phrases en testant toutes les combinaisons possibles
    - Vérifie que les substitutions respectent un même schéma sur toute la phrase
4. **Gestion des erreurs**
    - Si aucun mot ne correspond, il est mis de côté comme "non trouvé"
    - Affiche les phrases possibles avec leur dictionnaire de substitution
    - Signale les mots introuvables, souvent dus à un dictionnaire incomplet

## 6. Chiffrement par Transposition

### a) Chiffrement

Le chiffrement par transposition ne modifie pas les lettres mais les réorganise selon une permutation déterminée par une clé.

```python
for f_iter in range(0, key):
    for s_iter in range(0, len_text):
        if s_iter % key == f_iter:
            encrypted_text += text[s_iter]
print("Encrypted text :", encrypted_text)
```

### b) Déchiffrement

Cette méthode peut être attaquée en réarrangeant les lettres jusqu'à retrouver un texte lisible. La partie de **déchiffrement** se présente ainsi :

1. **Génération des permutations possibles**
    - Teste toutes les clés possibles de transposition (de 1 à la longueur du texte)
    - Réorganise le texte en colonnes et remplit une grille simulant le chiffrement par transposition
    - Reconstitue le texte en lisant colonne par colonne pour obtenir toutes les combinaisons possibles
2. **Filtrage des résultats**
    - Vérifie les textes obtenus avec un dictionnaire de la langue choisie
    - Retient uniquement ceux qui ressemblent à une langue valide
3. **Affichage des résultats**
    - Si des phrases correctes sont trouvées, les affiche avec leur clé de transposition
    - Sinon, affiche toutes les possibilités en mode **brute-force**, même si elles ne forment pas des phrases cohérentes

## 7. RSA

Le chiffrement RSA est **asymétrique** : il utilise une paire de clés (des nombres entiers) composée d'une **clé publique** pour chiffrer et d'une **clé privée** pour déchiffrer des données confidentielles. Les deux clés sont créées par une personne, souvent nommée par convention *Alice*, qui souhaite que lui soient envoyées des données confidentielles. Alice rend la clé publique accessible. Cette clé est utilisée par ses correspondants pour chiffrer les données qui lui sont envoyées. La clé privée est quant à elle réservée à Alice, et lui permet de déchiffrer ces données. La clé privée peut aussi être utilisée par Alice pour signer une donnée qu'elle envoie, la clé publique permettant à n'importe lequel de ses correspondants de **vérifier la signature**.

### a) Génération de nombres pseudo-premiers

J'utilise ici des tests probabilistes comme celui de **Miller-Rabin** permet de générer des nombres pseudo-premiers rapidement :

```python
k = 28
while True:
    for i in range(0, k):
        aleatory = self.system_random.randint(2, my_number - 2)
        if not self.witness_test(my_number, aleatory):
            return my_number
        if int(str(my_number)[-1]) + 2 == 5:
            my_number += 4
        else:
            my_number += 2
```

### b) Chiffrement

Une fois les nombres premiers générés, on peut créer des clés et chiffrer des messages.

```python
encrypted_mess = [pow(mess_part, e_int, n_int) for mess_part in mess]
```

Cependant, RSA peut être vulnérable aux attaques de factorisation si les nombres ne sont pas assez grands. C'est pourquoi il faut se référer aux normes actuelles pour avoir un chiffrement sécurisé.

## 8. Concaténation et programme final

On peut alors synthétiser toutes ces méthodes de chiffrement dans un programme global qui permet, à partir d'un menu à choix pour l'utilisateur, de choisir la méthode que l'on veut utiliser et ainsi de pouvoir chiffrer et déchiffrer comme on veut :

![Figure 1 - Cas d'utilisation du programme final](/images/projects/exploration-des-methodes-de-cryptographie/crypto.png)

Figure 1 - Cas d'utilisation du programme final

