---
title: "Making Medical Data Speak"
description: "This project is in collaboration with the Public Interest Group SIB. The objective is to design an application that exploits unstructured data from Computerized Patient Records (CPR), particularly from medical reports, prescriptions, or orders."

tags: ["Python", "Gestion de Projet", "IA"]
cover: "/images/projects/faire-parler-les-donnees-medicales/4544eafe-6418-44fb-8eaa-1bc83c83c536.png"
lang: en
draft: false
---

*Project carried out within a group of 12 people - 2024*

> This project is in collaboration with the Public Interest Group SIB. The objective is to design an application that exploits unstructured data from Computerized Patient Records (CPR), particularly from medical reports, prescriptions, or orders. This project aims to facilitate the integration of this data into hospital systems to improve healthcare decision-making.
>
>
> We rely on advanced technologies such as OCR and Natural Language Processing (NLP), combining free and paid tools, to create an optimized solution accessible to end users in the medical sector. The project also includes a state-of-the-art review to identify existing solutions and a technical demonstrator.
>
> I am surrounded by experts in the fields of AI, Big Data, and health data exploitation, and we collaborate with the Cristal laboratory and SIB. This innovative project is a major opportunity to transform medical data into clinical decision support tools.
>

### Table of Contents

## 1. System Architecture

The project relies on a modular architecture integrating several technical areas:

- **Patient record indexing**: extraction and structuring of medical information via an LLM model
- **Patient triage**: classification based on criticality, using an XGBoost model and decision trees
- **Length of stay prediction**: estimation of hospitalization time based on medical history and admission data
- **Interface and API**: creation of an API enabling interaction with modules through an ergonomic user interface

## 2. Project Management

The project followed a rigorous methodology with detailed planning and structured documents. The documents that served as the basis for this planning are the specifications we drafted in agreement with the client and the following functional requirements diagram:

![Figure 1 - Functional Requirements Diagram](/images/projects/faire-parler-les-donnees-medicales/exigences.png)

Figure 1 - Functional Requirements Diagram

### a) Team Organization

The team was divided into specialized units with clear responsibilities:

| **Unit** | **Responsibilities** |
| --- | --- |
| **Indexing** | Extraction and structuring of medical data |
| **Triage** | Development of the classification model |
| **Length of Stay Prediction** | Implementation of the prediction model |
| **Interface & API** | Development and integration of the API |

### b) Gantt Chart

The project was structured in several phases:

| **Phase** | **Objectives** | **Duration** |
| --- | --- | --- |
| **S5** | Training and objective definition | 4 weeks |
| **S6** | Development of functional modules | 8 weeks |
| **S7** | Validation and improvement of features | 6 weeks |

This allowed us to create a Gantt chart for the entire project duration, which was modified as progress was made and to which we adhered:

![Figure 2 - Gantt Chart](/images/projects/faire-parler-les-donnees-medicales/fef6d892-17e1-480b-a48b-3fa27d176df7.png)

Figure 2 - Gantt Chart

### c) Risk Management

A SWOT analysis was conducted to identify project risks and opportunities:

![Figure 3 - SWOT Matrix](/images/projects/faire-parler-les-donnees-medicales/swot_v2.png)

Figure 3 - SWOT Matrix

Additionally, we also added a risk management plan that was also modified during our work:

![Figure 4 - Risk Management Plan](/images/projects/faire-parler-les-donnees-medicales/gestiondesrisques.png)

Figure 4 - Risk Management Plan

### d) Work Breakdown Structure

This task breakdown was divided into 2 major parts, just like our project: the first includes familiarization with the project and deliverable creation, while the second focuses on their improvement and API usage.

![Figure 5 - Work Breakdown Structure](/images/projects/faire-parler-les-donnees-medicales/4544eafe-6418-44fb-8eaa-1bc83c83c536.png)

Figure 5 - Work Breakdown Structure

### e) RACI Matrix

After all this preparation work and to be able to start the technical part of this project, we drafted a RACI matrix that defines the role of each stakeholder in this project:

![Figure 6 - RACI Matrix Excerpt](/images/projects/faire-parler-les-donnees-medicales/raci.png)

Figure 6 - RACI Matrix Excerpt

### f) Training and Consultations

Throughout this project, we had the opportunity to work with numerous experts in their fields to help us progress. We therefore recorded all those we called upon and noted the total hours of training and consultation we used. In the end, we had used 14 hours of internal consultation (with people employed by the Centrale Lille group) and 23 hours of external consultation (with SIB representatives and medical staff).

![Figure 7 - All Consultants Met](/images/projects/faire-parler-les-donnees-medicales/consultants.png)

Figure 7 - All Consultants Met

### g) Others

We mainly used 5 tools to organize our work:

- **Discord:** Communication
- **Google Drive:** Document sharing, collaborative work
- **Hugging Face:** Host for LLM and ML models used in different units
- **Mimic IV:** Medical database present on Cristal server
- **GitHub:** Collaborative environment for developing and managing versions

Finally, for our project to have a clear status, we drafted and signed an **internal agreement** with the Cristal laboratory.

## 3. Technical Deliverables

Due to the confidentiality surrounding the technical part of this project, I unfortunately cannot share the code we wrote. I will therefore be concise, but the implemented solution is much more complex than what I describe here.

### a) Indexing Unit

The foundations of this work were built by synthesizing patient data into a text file from numerous joins on the **MIMIC IV** data table. These joins allowed us to keep only the most important parameters.

**LLM Model Used**: OpenHermes 2.5 - Mistral 7B

**Objectives**:

- Retrieval and concatenation of the entire patient medical record
- Synthesis and indexing of this data
- Work on result explainability

![Figure 8 - Schematic of Our Solution's Operation](/images/projects/faire-parler-les-donnees-medicales/explicabilite.png)

Figure 8 - Schematic of Our Solution's Operation

**Result:** We finally manage to index patient data into a structured file

![Figure 9 - Example of Report Before and After Indexing](/images/projects/faire-parler-les-donnees-medicales/capture_dcran_2025-02-18_005443.png)

Figure 9 - Example of Report Before and After Indexing

### b) Patient Triage Unit

To decide the triage result, several data points deemed to have a strong influence on patient priority level are retrieved:

| Temperature | float |
| --- | --- |
| HeartRate | int |
| RespiratoryRate | int |
| OxygenSaturation | float |
| BloodPressure | string |
| TransportMode | string |
| Age | int |
| Gender | string |

**Models Used**: OpenHermes 2.5 - Mistral 7B & XGBoostClassifier

**Method**:

- Structured decision tree to direct patients to appropriate care.
- Vectorization (Machine Learning), cosine similarity calculation
- LLM Prompt
- Python dictionary

### c) Length of Stay Prediction Unit

**Objectives**:

- Predict length of stay at the time of admission to a department
- Useful for relatives and bed/staff management
- Based on reports written since hospital entry

**Modules:**

- Important word extraction with an LLM
- Prediction from examples to identify trends through information
- Training dataset containing examples of data with correct answers

**Techniques Used**:

- **One-Hot Encoding** for categorical variables
- **StandardScaler** for data normalization
- **Principal Component Analysis (PCA)** for dimensionality reduction

![Figure 10 - Summary of Prediction Deliverable Operation](/images/projects/faire-parler-les-donnees-medicales/capture_dcran_2025-02-18_010534.png)

Figure 10 - Summary of Prediction Deliverable Operation

### d) API Unit

**Technologies Used**: Flask, FastAPI, Django

**Objectives**:

- Allow hospital services to access predictions via an intuitive interface
- Manage access and permissions via a secure database

![Figure 11: Different Steps of API Operation](/images/projects/faire-parler-les-donnees-medicales/capture_dcran_2025-02-18_010534-1.png)

Figure 11: Different Steps of API Operation

## 4. Technical Deliverables

- **Documented source code and API**: Available on GitHub but private
- **User and technical documentation**: Detailed explanation of modules and usage guide
- **Video demonstrations**: Presentation of different implemented features
- **Scientific article**: In progress

---

## Conclusion

The project enabled the development of a performant tool for exploiting medical data, facilitating patient triage and hospital management. The integration of an LLM model and Machine Learning allowed for optimal results, paving the way for future improvements such as model optimization or integration of French databases.
