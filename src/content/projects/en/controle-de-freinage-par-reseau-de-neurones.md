---
title: "Neural Network Braking Control"
description: "Design of an intelligent anti-lock braking system (ABS) using neural networks to maintain an optimal slip ratio. The NARMA-L2 controller, based on a feedback linearization strategy, replaces classical PID-type methods."
cardDescription: "Intelligent ABS system using a NARMA-L2 controller."
tags: ["Deep Learning", "Simulation", "Recherche"]
cover: "/images/projects/controle-de-freinage-par-reseau-de-neurones/comparison_results.png"
lang: en
draft: false
teamSize: 1
year: 2025
month: 6
repoUrl: "https://github.com/AstyanM/abs-narmal-2"
impact:
  - value: "20k"
    label: "data points for training"
  - value: "50"
    label: "braking scenarios simulated"
  - value: "1"
    label: "scientific article written"
summary: "When you brake hard on a wet road, your car's ABS keeps the wheels from locking. The controller behind it usually follows fixed rules. Here, I replaced it with a neural network trained on 50 simulated braking scenarios that learns to maintain the ideal grip between tire and road surface, adapting in real time instead of following a predetermined recipe."
conclusion: |
  This project enabled the design, simulation, and comparison of an intelligent braking controller based on neural networks. Beyond the technical work, the objective was also to produce a scientific article in English, which synthesized the theoretical foundations, design choices, results, and limitations of the approach.

  This experience lays the groundwork for future work on hybrid controllers combining classical precision and adaptive intelligence.
appendix:
  documents:
    - title: "Scientific Article"
      description: "PDF article describing the modeling and experimental results"
      url: "/images/projects/controle-de-freinage-par-reseau-de-neurones/article_scientifique_abs_nn_system.pdf"
      type: pdf
---

## 1. System Modeling

The ABS system was modeled using the quarter-car model describing vehicle, wheel, and braking system dynamics. The slip ratio $\lambda$, mechanical and aerodynamic quantities are related by:

$$
\lambda = \frac{v - r\omega}{v}
$$

![Figure 1 - Simplified Quarter-Car Model](/images/projects/controle-de-freinage-par-reseau-de-neurones/quarter_car_model.png)

Figure 1 - Simplified Quarter-Car Model

The following differential equations describe the system:

- **Vehicle dynamics:**

  $$
  M\dot{v} = -\mu(\lambda)F_z - C_x v^2
  $$

- **Wheel dynamics:**

  $$
  I\dot{\omega} = \mu(\lambda)F_z r - B\omega - \tau_b


  $$

- **Braking system:**

  $$
  \dot{\tau}_b = \frac{-\tau_b + K_b u}{\tau}
  $$

The nonlinear relationship between slip ratio and friction coefficient $\mu(\lambda)$ is modeled by a law of type:

$$
\mu(\lambda) = \frac{2\mu_0 \lambda_0 |\lambda|}{\lambda_0^2 + \lambda^2}
$$

with maximum grip peak around $\lambda_0 = 0.25$.

## 2. NARMA-L2 Controller

The NARMA-L2 controller linearizes a nonlinear system using two neural networks (called f-network and g-network), trained from past outputs and control inputs:

$$
y(k+d) = f(\cdot) + g(\cdot) \cdot u(k+1)
$$

The control law is derived as:

$$
u(k+1) = \frac{y_{\text{ref}} - f_k}{g_k}
$$

Where $y_{ref} = 0.25$ represents the optimal slip ratio.

The networks used have a simple single hidden layer architecture, with $tanh$ function, and take as input:

$$
x(k)=[y(k),y(k−1),y(k−2),u(k),u(k−1),u(k−2)]
$$

## 3. Data Generation and Training

To train the networks, a set of 50 simulated braking scenarios was generated using a PID controller. Parameters such as initial speed, braking torque, or vehicle state were randomly chosen to vary conditions.

| Parameter              | Range     |
| ---------------------- | --------- |
| Initial speed          | 20–40 m/s |
| Initial slip           | 0.1–0.4   |
| Initial braking torque | 0–20 Nm   |

![Figure 2 - Generated Data Analysis](/images/projects/controle-de-freinage-par-reseau-de-neurones/data_quality_analysis.png)

Figure 2 - Generated Data Analysis

The networks were trained on approximately 20,000 data points with a standard method (Adam, 5 to 10 epochs). The objective was to accurately predict the system response and extract a stable control law.

![Figure 3 - Learning Loss for Both Neural Networks](/images/projects/controle-de-freinage-par-reseau-de-neurones/training_curves.png)

Figure 3 - Learning Loss for Both Neural Networks

## 4. Experimental Results

The NARMA-L2 controller was compared to the classical PID controller:

- **Slip ratio tracking:** PID remains more accurate and stable. NARMA-L2 shows significant deviations around the setpoint.
- **Braking effort:** NARMA-L2 applies lower, sometimes unstable braking pressures, but sufficient for comparable deceleration.
- **Mechanical stress reduction:** Gentler braking efforts can extend component lifespan.

![Figure 4 - Performance Comparison: Slip and Braking Torque](/images/projects/controle-de-freinage-par-reseau-de-neurones/comparison_results.png)

Figure 4 - Performance Comparison: Slip and Braking Torque

## 5. Discussion and Perspectives

Even though the NARMA-L2 controller did not outperform PID in terms of accuracy, it presents interest for:

- brake wear reduction,
- energy savings in electromechanical systems,
- applications in electric and autonomous vehicles.

The project also highlighted the importance of training data quality: exclusive use of a PID as data generator can bias learning.
