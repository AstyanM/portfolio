---
title: "Creation of a 3D Printer"
description: "Design and manufacturing of a functional Delta 3D printer, covering the full rapid prototyping process. The project includes CAD modeling, parts printing, mechanical assembly, and system calibration."
cardDescription: "Designing and building a functional Delta 3D printer from scratch."
tags: ["Hardware"]
cover: "/images/projects/creation-dune-imprimante-3d/05264723-4451-49d6-9aae-f9f1348ce313.png"
lang: en
draft: true
teamSize: 8
year: 2024
month: 10
impact:
  - value: "105h"
    label: "of cumulative 3D printing"
  - value: "1 kg"
    label: "of filament used"
  - value: "4"
    label: "mechanical subassemblies designed in CAD"
conclusion: |
  This project allowed us to explore in depth the entire rapid prototyping process, from CAD design and modeling to parts printing and final assembly of the Delta 3D printer. Each step required thorough reflection on design choices, mechanical constraints, and specifics of the Delta architecture, notably its control and movement system. The multiple tests and adjustments made allowed us to optimize components to ensure fluid and precise operation. This experience not only familiarized us with additive manufacturing technologies but also with technical challenges related to implementing a complex system, thus constituting a solid foundation for future engineering and prototyping projects.
---

![Figure 1 - Commercial Delta Printer](/images/projects/creation-dune-imprimante-3d/1.jpg)

Figure 1 - Commercial Delta Printer

## 1. Modeling

### a) Upper Frame

The objectives to be met for this part are as follows:

-   Fixing to the top of the bars
-   Connecting the 3x2 bars together using profiles
-   Fixing the sensor
-   Holding the pulley
-   Limiting supports for printing

This led the group to make choices and realize the 3D modeling below:

![Figure 2 - Upper Frame 3D Modeling](/images/projects/creation-dune-imprimante-3d/276b557f-f805-4401-896b-ce306aaa9999.png)

Figure 2 - Upper Frame 3D Modeling

### b) Lower Frame

Similarly, this part must meet several criteria:

-   Holding the bed
-   Integrating the motor
-   Integrating the screen
-   Stability on the ground during printing

Therefore, this modeling was chosen:

![Figure 3 - Lower Frame 3D Modeling](/images/projects/creation-dune-imprimante-3d/84d5894f-0c08-4de7-9443-5d6bdda7aa65.png)

Figure 3 - Lower Frame 3D Modeling

### c) Carriage

This part, on which I worked personally, aims to model the carriage that must slide around the metal rods to move the print head in space thanks to a motor and a microcontroller. This carriage must follow these indications to ensure proper printer operation:

-   Fixing magnets without loss of arm amplitude
-   Slide connection around metal rods
-   Belt passage and locking
-   Informing that the carriage has arrived at the top

We started by making test versions of this part, which we progressively printed and improved to test several structures.

![Figure 4 - Example of a test print](/images/projects/creation-dune-imprimante-3d/05264723-4451-49d6-9aae-f9f1348ce313.png)

Figure 4 - Example of a test print

Finally, we settled after several test sessions on a structure that allows locking the belt thanks to multiple notches located inside the 3D structure:

![Figure 5 - Carriage 3D Modeling](/images/projects/creation-dune-imprimante-3d/05b356e7-c0e4-43de-bf97-6f13191887c5.png)

Figure 5 - Carriage 3D Modeling

![Figure 6 - Printed and functional carriage](/images/projects/creation-dune-imprimante-3d/3988d843-4f02-4613-8154-a03fd5eb8e2d.png)

Figure 6 - Printed and functional carriage

### d) Toolhead

For this last part, the structure prerequisites were as follows:

-   Fixing the radiator, fans, magnets, inductive sensor
-   Dimensioning the head to have a minimum volume in the printing space
-   Preserving the brand spirit

![Figure 7 - Toolhead 3D Modeling](/images/projects/creation-dune-imprimante-3d/be846340-17fa-42ea-9fd1-39eff77900b4.png)

Figure 7 - Toolhead 3D Modeling

## 2. Printing and Assembly

![Figure 8 - 3D Structure Assembly](/images/projects/creation-dune-imprimante-3d/eb712480-cbe0-47a0-943b-67ef344ff8e0.png)

Figure 8 - 3D Structure Assembly

Before being able to print the parts definitively, we had to verify that the assembly was functional, which we could do directly with 3D modeling. For this, we defined all our connections and imported all elements that we did not model.

To print the parts, we used Prusa I3 MK2 3D printers with the following settings for all parts:

| Speed | 0.2 mm |
| --- | --- |
| Infill | 20 % |
| Supports | Everywhere |

For such an operation, counting unsuccessful attempts and all tests performed, we used 1 kg of filament and 105 h of printing in total. This allowed us to reach the assembly stage with the printed components and those we already had available (motor, metal rods, print bed...):

![Figure 9 - Final Assembly](/images/projects/creation-dune-imprimante-3d/05cd9ead-dc18-4f70-b9be-baa9ab28ef29.png)

Figure 9 - Final Assembly

