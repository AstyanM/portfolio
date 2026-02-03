---
title: "Creation of a Tic-Tac-Toe Bot"
description: "Development of a bot capable of playing Ultimate Tic-Tac-Toe using game tree search algorithms. The system uses the Negamax algorithm with alpha-beta pruning to compute the best move in real time."
cardDescription: "Ultimate tic-tac-toe bot with Minimax, Negamax and alpha-beta pruning."
tags: ["Simulation"]
cover: "/images/projects/creation-dun-bot-morpion/g.png"
lang: en
draft: false
teamSize: 4
year: 2024
repoUrl: "https://github.com/AstyanM/tictactoe"
conclusion: |
  This project allowed us to explore the different stages of designing a bot playing Ultimate Tic-Tac-Toe, from implementing game rules to optimizing the Minimax algorithm with alpha-beta pruning. Each aspect was adjusted to ensure efficient strategic decisions while respecting time constraints. This experience constitutes a solid foundation for deepening artificial intelligence techniques applied to games and search algorithm optimization.
---

> The first program, **`tttree`**, explores the implementation of **minimax** to generate the graphical representation of a Tic-Tac-Toe decision tree.
>
> The second program, **`sm-refresh`**, introduces algebraic notation (FEN) for moves and requires a minimax interaction with the computer. It also involves realizing the graphical display of positions, both **pseudo-graphical** on standard output and **graphical** in a file.
>
> Finally, the third program, **`sm-bot`**, requires the implementation of the **negamax** algorithm and **alpha-beta** pruning to calculate the best move in Ultimate Tic-Tac-Toe (Super Morpion).
>

### Organization

For the final organization of the program, we chose to do it as follows (excluding header files):

- **`morpion.c`**: implementation of the Tic-Tac-Toe game and functions to determine the game state and generate graphical representations
- **`utils.c`**: implementation of a search algorithm in a game tree
- **`main.c`**: use of the command line and creation of necessary game structures
- **`g.dot`**: dot file for creating a png figure representing the game state
- **`g.png`**: png figure representing the game state
- **`refresh.html`**: html page to represent the game state from the previous figure, automatically refreshing the page
- **`makefile`**: file allowing simple command line manipulations
- **`makefile_sources`**: list of c files to compile when using the **make** command

## 1. First program: **`tttree`**

The **`tttree`** program must generate a graphical representation of a decision tree for the Tic-Tac-Toe game using the Minimax algorithm.

### a) Instructions

- The initial game state will be provided as an argument via the command line, in **FEN** format
- The program will produce a **DOT** file describing the decision tree, which will be written to **standard output**
- Any **debug or error** messages will be directed to **standard error**
- Each node of the tree will display the value evaluated by the **Minimax** algorithm
- A test script must be used to **verify** the proper functioning of the program

### b) Principle

To start, we define the basic structures (**`morpion`** and **`supermorpion`**), variables, and functions that will serve us later:

```c
#pragma once
#define SIZE 9
#define black 'x'
#define white 'o'
#define infini '.'

typedef struct{
    char tableau[SIZE];
    char win;
    char trait;
}morpion;

typedef struct{
    morpion morp[SIZE];
    char win;
}supermopion;

char swin(supermopion);
char win(morpion*);
char* chaine(supermopion sm);
void print_sm(const supermopion);
void print_mp(const morpion);
void initialize(supermopion*);
void init_mp(morpion*);
void make_dot(const char* const);
```

Next, we define nine functions to manage a Tic-Tac-Toe game, notably by manipulating the supermorpion and its sub-morpions. The `fine` function checks if an integer is in the valid range, while `win` and `swin` respectively determine the winner of an individual morpion and the supermorpion by analyzing winning combinations. For representation, `chaine` generates a string describing the game state, `print_mp` and `print_sm` display a morpion and the supermorpion as a grid in the terminal respectively. Game initialization is ensured by `initialize`, which sets up each sub-morpion via `init_mp`, which fills their arrays with an initial value. Finally, `make_dot` produces a DOT file allowing a graphical visualization of the supermorpion.

Finally, we created functions allowing the graphical representation of the tree of possible moves in a morpion while evaluating the quality of each state based on victory or defeat. They ensure the conversion of a character string into a morpion object, generate a DOT file illustrating the different stages of the game, and assign labels to the tree nodes based on the scores obtained. The node display is designed to visually differentiate players, and each game state is uniquely identified. Finally, an evaluation system allows calculating the score of a given state based on the winner and checking if the game is over.

We can then synthesize and test everything in the main file:

```c
#include <stdio.h>
#include "utils.h"
#include "morpion.h"

int main(int argc, char* argv[]) {
    if (argc != 2) {
        printf("Usage : %s <input_string>\n"
, argv[0]);
        return 1;
    }

    const char* input = argv[1];
    morpion mp; // Initializes the Morpion structure
    init_mp(&mp);

    str_to_morpion(input, &mp);
    print_tree(mp, "g1.dot", 9);

    // Displays the resulting Morpion structure
    printf("board : %s\n", mp.tableau);
    printf("turn : %c\n", mp.trait);

    return 0;
}
```

### c) Verification and Deepening

After displaying only the first node of each requested figure with the command:

```bash
#! /bin/bash

echo "Testing ttree for morpion 1o11o1oxx x"
./tttree "1o11o1oxx x" > g1.dot
dot g1.dot -T png -o g1.png

echo "Testing ttree for morpion  x21o11xo o"
./tttree "x21o11xo o" > g2.dot
dot g2.dot -T png -o g2.png
```

We obtain the following 2 figures, which correspond well to what we are looking for given the command:

![Figure 1 - First morpion](/images/projects/creation-dun-bot-morpion/g1.png)

Figure 1 - First morpion

![Figure 2 - Second morpion](/images/projects/creation-dun-bot-morpion/g2.png)

Figure 2 - Second morpion

Furthermore, we implemented the **`minimax`** function:

1.  **`minimax`:**
    -   **Goal:** Implements the **Minimax** algorithm to evaluate possible moves in Tic-Tac-Toe.
    -   **Method:** The `minimax` function performs a recursive search using the Minimax algorithm, which explores the tree of possible moves and evaluates each state of the morpion. It generates nodes in the DOT file representing each state and the connections between them.

After execution, we then obtain these figures:

![Figure 3 - Minimax possibilities tree](/images/projects/creation-dun-bot-morpion/g1-1.png)

Figure 3 - Minimax possibilities tree

![Figure 4 - Global minimax possibilities tree](/images/projects/creation-dun-bot-morpion/g2-1.png)

Figure 4 - Global minimax possibilities tree

To go further, we can improve this program by integrating a **`negamax`** with Alpha-Beta pruning, which will give for example these results for the same inputs:

![Figure 5 - Negamax possibilities tree](/images/projects/creation-dun-bot-morpion/unnamed1.png)

Figure 5 - Negamax possibilities tree

![Figure 6 - Global negamax possibilities tree](/images/projects/creation-dun-bot-morpion/unnamed2.png)

Figure 6 - Global negamax possibilities tree

We clearly see the improvement that a **`negamax`** with Alpha-Beta pruning can bring.

## 2. Second program: **`sm-refresh`**

This program allows us to play Ultimate Tic-Tac-Toe (Super Morpion) against a computer by entering moves via standard input.

### a) Instructions

-   **Move entry** via standard input in algebraic notation
-   **Minimax Algorithm** whose search depth is adjustable via a command line parameter
-   **Game display** in pseudo-graphical form in the terminal
-   **Graphical representation** of positions generated as an image
-   **Real-time tracking** of game evolution via the **`refresh.html`** HTML page

### b) Principle

We will add two functions that will interact to execute moves in the morpion and update the victory state accordingly. The first function allows making a move by placing the player's symbol at the indicated position while the second function applies this same principle to a sub-morpion of the supermorpion, ensuring that the selected morpion has not already been won.

After creating the new functions to manage user move entry via standard input, we can finalize the implementation to play Ultimate Tic-Tac-Toe against the computer:

```c
#include <stdio.h>
#include <string.h>
#include "morpion.h"
#include <stdlib.h>
#include "utils.h"

void play();
int main(){
    play();
    return 0;
}

void play(){
    supermopion sm;
    initialize(&sm);
    int prochain[2];
    int temps = 6;
    int last[2];
    int code=0;

    char str[100] = "999999999 00 x";

    str_to_sm(str, &sm, last);
    make_dot(chaine(sm));
    while(1){
        make_dot(str);
        system("clear");
        printf("The condition in large is as follow:\n");
        print_mp(get_large(sm));
        printf("The detail is as follow:\n");
        print_sm(sm);

switch(code){
case -1:
    printf("The game has been won by %c !\n",
		sm.win);
    return;
case -2:
    printf("Morpion %d is not in the range of 1 - 9 !\n",
		prochain[0]);
    break;
case -3:
    printf("The morpion %d has been won by %c !\n",
		prochain[0], sm.morp[pos(prochain[0])].win);
    break;
case -4:
    printf("Position %d is not in the range of 1 - 9 !\n",
		prochain[1]);
    break;
case -5:
    printf("Position %d has been occupied by %c !\n",
		prochain[1], sm.morp[pos(prochain[0])].tableau[pos(prochain[1])]);
    break;
case -6:
    printf("The position of last %d is not in the range of 1 - 9 !\n",
		last[1]);
    break;
}
    /*==============================================*/
    if(sm.trait == 'x'){
				code = meilleur_coup(sm, last, temps, prochain);
		}
    else code = get_coup(sm, last, temps, prochain);
    if(code < 0){
        continue;
    }
    scoup(&sm, prochain[0], prochain[1]);
    last[0] = prochain[0];
    last[1] = prochain[1];
    strcpy(str, chaine(sm));
    }
}
```

### c) Function **`mscore`**

This is a function that modifies the score assigned to each classic morpion, giving more points for morpions having advantageous situations (several well-placed pawns, important square taken, like the middle, etc...):

→ List of winning triplets:

```c
int t[][3] = {
        {0, 1, 2}, {3, 4, 5}, {6, 7, 8},
        {0, 3, 6}, {1, 4, 7}, {2, 5, 8},
        {0, 4, 8}, {2, 4, 6}
    };
```

**→** System implementing `a[3]`, an array containing the symbols '**`x`**', '**`o`**' or '**`.`**' coded by numbers 2, 3 and 5 (2 for the player, 3 for the opponent, 5 for an empty square) and using their product (unique because they are prime numbers) to define different moves:

```c
int a[3];
    for(int i=0;i<8;i++){
        for(int j = 0; j<3;j++){
            if(mp.tableau[t[i][j]] == trait){
                a[j] = 2;
            }
            else if(mp.tableau[t[i][j]] == N(trait)){
                a[j] = 3;
            }
            else if(mp.tableau[t[i][j] == infini]){
                a[j] = 5;
            }

        }
```

→ Tests if the morpion is won by the player or the enemy and modifies the score accordingly with a +/- **`MAX`**:

```c
if(win(&try) == trait) return maxs;
else if(win(&try) == N(trait)) return -maxs;
```

→ Tests if two allied/enemy symbols are on the same triplet in question and adds/removes score accordingly (+/- 10):

```c
else if(a[0] * a[1] * a[2] == 20) s += 20;
else if(a[0] * a[1] * a[2] == 45) s -= 20;
```

→ Tests if an allied/enemy symbol is on the triplet in question and adds/removes score accordingly (+/- 5):

```c
else if(a[0] * a[1] * a[2] == 50) s += 8;
else if(a[0] * a[1] * a[2] == 75) s -= 8;
```

→ Discriminates sides (squares 2,4,6,8), which are weaker squares in Tic-Tac-Toe because they can only form two winning triplets, and increases the value of the central square, often the best square in Tic-Tac-Toe:

```c
if(a[1] == 2) s += 3;
else if(a[1] == 3) s -= 3;

if (t[i][1] == 5 && a[1] == 2) s += 7;
else if (t[i][1] == 5  && a[1] == 3) s -= 3;
```

All this is completed by the `score` function which gives the score of a supermorpion based on similar parameters.

### d) Verifications

Thus, when executing the **`exe`** file, we find exactly what we wanted:

```bash
The condition in large is as follow:
----------
 3 . . .
 2 . . .
 1 . . .
   a b c
----------
The detail is as follow:
-----------------
 1    2    3
  ...  ...  ...
  ...  ...  ...
  ...  ...  ...
 4    5    6
  ...  ...  ...
  .x.  ox.  ...
  ..x  ...  ...
 7    8    9
  ...  ...  ...
  o..  ...  .o.
  ...  ...  x..

-----------------
The last coup is in 4 5 !
You are o in morpion 5 !
----------
 3 . . .
 2 o x .
 1 . . .
   a b c
----------
Please choose a new position (a-c)(1-3)
```

Indeed, we can see the 9 grids of the supermorpion, the one of the main morpion, and display information about the last move and the current player.

Then, we can also create the **`png`** file, which updates the **`refresh.html`** page:

![Figure 7 - Png file](/images/projects/creation-dun-bot-morpion/g.png)

Figure 7 - Png file

![Figure 8 - refresh.html page](/images/projects/creation-dun-bot-morpion/untitled.png)

Figure 8 - refresh.html page

## 3. Third program: **`sm-bot`**

This program allows calculating the best possible move in a game of Ultimate Tic-Tac-Toe (Super Morpion) using the **Negamax** algorithm with alpha-beta pruning. The initial game state is entered via the command line in **FEN** format, accompanied by a parameter indicating the remaining time to finish the game. The program analyzes the position and returns the optimal move to play in standard coordinate format.

### a) Instructions

-   **Use of Negamax** with alpha-beta pruning for move analysis
-   **Time management strategy** ensuring a quick response
-   **Initial position entry** via command line in **FEN** format, including grid states, last move played, and player on turn
-   **Time parameter** specified in command line to adapt search depth
-   **Best move return** in format `<#grid>(1..9) <#cell>(1..9)`

### b) Principle

The main program declares a string representing the initial state of a supermorpion game. It then initializes a **`supermopion`** data structure, extracts information on the last move played, displays the current state of the supermorpion as well as the enlarged main morpion, and informs about the last move and the current player. Finally, it uses a function to calculate the best possible move for the current player based on remaining time, then displays this information. In summary, **`main`** manages the supermorpion state, moves played, and suggests the best next move based on provided information:

```c
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "utils.h"
#include <time.h>

void test(char* chaine, int temps);
void time_calculate();

int main(int argc, char* argv[]){
    const char* coup = argv[1];
    const int temps = atoi(argv[2]);
    test(coup, temps);
    return 0;
}

void test(char* chaine, int temps){
    supermopion sm;
    initialize(&sm);
    int last[2];
    int prochain[2];
    str_to_sm(chaine, &sm, last);
    print_sm(sm);
    print_mp(get_large(sm));
    fprintf(stderr, "Last: %d %d\n", last[0], last[1]);
    fprintf(stderr,"Jouer: %c\n", sm.trait);
    meilleur_coup(sm, last, temps, prochain);
    printf("%d", prochain[0]*10+prochain[1]);
    return prochain[0]*10+prochain[1];
}

void time_calculate() {
    clock_t debut, fin;
    double temps_execution;
    supermopion sm;
    initialize(&sm);
    debut = clock();
    int k;
    for (k = 0; k<1000; k++) {
	    scoup(&sm, 4, 5);
	    score(sm);
	    sm.morp[3].tableau[4]= infini;

    }
    fin = clock();
    temps_execution = ((double) (fin - debut)) / CLOCKS_PER_SEC;
    printf("Execution time is : %f seconds\n", temps_execution);

}
```

### c) Time Management

Time management in our program is done thanks to the **`temps_to_depth`** function as well as an external text file to **`sm_bot.exe`**, called **`depth.txt`**

We based ourselves on a time of 15 minutes per player, to which are added 30 seconds per move. Furthermore, in the absence of contrary indication, the time to make a move is limited only by the total game time.

```c
void temps_to_depth(const double temps){

    char* filename = "./depth.txt";
    FILE *file = fopen(filename, "r");
    int depth;

    if (file == NULL) {
        fprintf(stderr, "Error opening file.\n");
        return;
    }

    fscanf(file, "%d", &depth);
    fclose(file);

    double temps_execution;
    temps_execution = ((double) (fin - debut)) / CLOCKS_PER_SEC;

    if (temps_execution > 30 && temps <= 300) {
				depth -= 1;}
    else if (temps_execution < 3 && temps <= 300) {
				depth += 1;}
    else if (temps_execution > 90 && temps > 300 && temps <= 600) {
				depth -= 1;}
    else if (temps_execution < 5 && temps > 300 && temps <= 600) {
				depth += 1;}
    else if (temps_execution > 120 && temps > 600) {
				depth -= 1;}
    else if (temps_execution < 8 && temps > 600) {
				depth += 1;}
    else {
        depth += 0;
    }

    FILE *file2 = fopen(filename, "w");
    if (file2 == NULL) {
        fprintf(stderr, "Error opening file.\n");
        return;
    }
    fprintf(file2, "%d", depth);
    fclose(file2);

    fprintf(stderr, "ultimate depth : %d\n", depth);
}
```

This mechanism dynamically adjusts the **`depth`** based on **remaining time** and **execution time of the previous turn**. If the previous move took too long, the **`depth`** is decreased by 1, while if the move was fast, it is increased by 1. For example, if remaining time is less than **300 seconds**, an execution time greater than **30 seconds** leads to a reduction of **`depth`**, while if more than **600 seconds** remain, a time less than **8 seconds** increases it. Between these thresholds, **`depth`** remains stable, guaranteeing efficient time management, notably by accelerating the game when available time becomes critical.

### d) To go further

Additional adjustments could improve system accuracy, such as adding more frequent thresholds (every 100 or 150 seconds) or taking into account the number of remaining empty squares. Overall, the time management function automatically adapts to each turn to optimize the balance between calculation time and remaining time.

# 4. Perspectives

Although we managed to carry this project to completion, perspectives for improvement remain to be explored:

-   First, deeper optimization of search algorithms, such as adding transposition tables or advanced heuristics, could significantly improve the performance of **`tttree`** and **`sm-bot`** programs
-   Furthermore, a more user-friendly interface for Program 2, **`sm-refresh`**, with advanced interactive features, would be an avenue for improvement
-   We can improve the **`Temps_to_depth`** function, by taking into account the number of remaining empty squares, or even their positions
-   We can consider giving a score (positive or negative) to specific blocking situations by the opponent of certain triplets, like **`“XXO”`** or **`“XOO”`**.

