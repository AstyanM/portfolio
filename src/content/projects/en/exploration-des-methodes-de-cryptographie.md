---
title: "Exploration of Cryptography Methods"
description: "Implementation and analysis of various cryptography methods, from the Caesar cipher to asymmetric systems like RSA. Each method is evaluated in terms of security and accompanied by decryption tools when possible."
cardDescription: "Implementing and analyzing classical and modern ciphers in Python."
tags: ["Sécurité"]
cover: "/images/projects/exploration-des-methodes-de-cryptographie/crypto.png"
lang: en
draft: true
teamSize: 1
year: 2023
repoUrl: "https://github.com/AstyanM/cryptography-methods"
impact:
  - value: "7"
    label: "encryption methods implemented"
  - value: "4"
    label: "types of attacks developed (brute force, dictionary, frequency, factorization)"
conclusion: |
  This project allowed me to explore the foundations of cryptography through different algorithms, from their implementation in Python to their breaking when possible. From simple methods like Caesar cipher to asymmetric systems like RSA, each technique presents fascinating challenges in terms of security and feasibility. This experience constitutes a solid foundation for understanding data security issues and the evolution of modern cryptographic techniques.
---

## 1. Caesar Cipher: An Illusory Security

The Caesar cipher is one of the simplest encryption methods. It consists of shifting each letter of a text by a fixed number of positions in the alphabet.

### a) Encryption

The algorithm replaces each letter with the one found at a defined distance (the key) in the alphabet.

```python
new_letter_place = useful.alpha.index(alpha_letter) + key % 26
if new_letter_place >= 26:
		new_letter_place -= 26
		encrypted_sentence += useful.alpha[new_letter_place]
```

### b) Decryption and Dictionary Attack

Decryption consists of reversing the shift. However, this method is extremely vulnerable. A simple dictionary attack allows testing the 25 possible shifts and comparing results with a list of common words:

```python
list_options = []
for language_chosen in languages_choosed:
		[list_options.append(possibility) for possibility in useful.see_if_language(
				encrypted_sentences=[(self.encrypt_ceasar(key=shift, sentence=encrypted_text), shift) for shift in range(1, 26)], language=useful.language_choices[language_chosen])]
```

## 2. Vigenère Cipher: A More Powerful Key

The Vigenère cipher improves the security of the Caesar cipher by using a key in the form of a word, where each letter corresponds to a different shift.

### a) Encryption

The text is shifted according to the letters of the key, but if the key is short, it can be analyzed by frequency attacks.

```python
for clear_char in text:
		encrypted_text += useful.alpha[(useful.alpha.index(clear_char) + useful.alpha.index(key[iterator % len(key)])) % 26]
		iterator += 1
```

## 3. Hashing Algorithms

Hashing algorithms transform a text into a unique and irreversible fingerprint. But are these fingerprints really inviolable?

### a) Hashing and Unique Fingerprint

The algorithm takes a text as input and produces a unique fingerprint (SHA-256, SHA-512, MD5, Blake, etc.) using dedicated libraries:

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

### b) Brute Force and Dictionary Attack

Although hashing is irreversible, a dictionary attack can allow recovering common passwords:

```python
for encrypted_type in encrypted_types:
    if self.encrypt_hash(to_crypt=[encrypted_type, password]) == encrypted:
        print("\nPassword found :", password)
```

A more exhaustive approach uses brute force to test all possible combinations:

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

## 4. One-Time Pad: Theoretical Inviolability

One-Time Pad encryption relies on a random key as long as the message, guaranteeing perfect security if used only once.

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

However, the difficulty lies in the secure management and distribution of the key.

## 5. Substitution Cipher

Substitution consists of replacing each letter with another according to a fixed correspondence table.

### a) Encryption

For this, we can easily code it in our Python functions:

```python
new_words = substitute.encrypt_substitution(text=word, dico=dico)
```

### b) Decryption

The **decryption** part works as follows:

1.  **Text preparation**
    -   Replace non-alphabetic characters with spaces
    -   Split text into words and remove unnecessary spaces
    -   Identify unique words and their positions in the text
2.  **Construction of a word dictionary**
    -   Load a dictionary of words sorted by length
    -   Organize words in a dictionary indexed by their length to speed up search
3.  **Pattern matching decryption**
    -   For each encrypted word, search for a word in the dictionary with the same structure (ex: "abc" → "rat")
    -   Progressively construct sentences by testing all possible combinations
    -   Verify that substitutions respect a consistent schema throughout the sentence
4.  **Error management**
    -   If no word matches, it is set aside as "not found"
    -   Display possible sentences with their substitution dictionary
    -   Signal unfound words, often due to an incomplete dictionary

## 6. Transposition Cipher

### a) Encryption

Transposition encryption does not modify letters but rearranges them according to a permutation determined by a key.

```python
for f_iter in range(0, key):
    for s_iter in range(0, len_text):
        if s_iter % key == f_iter:
            encrypted_text += text[s_iter]
print("Encrypted text :", encrypted_text)
```

### b) Decryption

This method can be attacked by rearranging letters until finding a readable text. The **decryption** part looks like this:

1.  **Generation of possible permutations**
    -   Test all possible transposition keys (from 1 to text length)
    -   Rearrange text into columns and fill a grid simulating transposition encryption
    -   Reconstitute text by reading column by column to obtain all possible combinations
2.  **Result filtering**
    -   Verify obtained texts with a dictionary of the chosen language
    -   Keep only those resembling a valid language
3.  **Result display**
    -   If correct sentences are found, display them with their transposition key
    -   Otherwise, display all possibilities in **brute-force** mode, even if they don't form coherent sentences

## 7. RSA

RSA encryption is **asymmetric**: it uses a pair of keys (integers) composed of a **public key** to encrypt and a **private key** to decrypt confidential data. both keys are created by a person, often conventionally named *Alice*, who wishes to be sent confidential data. Alice makes the public key accessible. This key is used by her correspondents to encrypt data sent to her. The private key is reserved for Alice, and allows her to decrypt this data. The private key can also be used by Alice to sign data she sends, the public key allowing any of her correspondents to **verify the signature**.

### a) Pseudo-prime number generation

I use here probabilistic tests like **Miller-Rabin** allowing to generate pseudo-prime numbers quickly:

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

### b) Encryption

Once prime numbers are generated, we can create keys and encrypt messages.

```python
encrypted_mess = [pow(mess_part, e_int, n_int) for mess_part in mess]
```

However, RSA can be vulnerable to factorization attacks if numbers are not large enough. That is why one must refer to current standards to have secure encryption.

## 8. Concatenation and final program

We can then synthesize all these encryption methods in a global program which allows, from a choice menu for the user, to choose the method we want to use and thus be able to encrypt and decrypt as we wish:

![Figure 1 - Final Program Use Case](/images/projects/exploration-des-methodes-de-cryptographie/crypto.png)

Figure 1 - Final Program Use Case

