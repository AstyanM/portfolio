---
title: "Parcoursup Simulator"
description: "A tool to estimate admission chances on Parcoursup, based on open data and explainable modeling."
tags: ["Web", "Simulation"]
cover: "/images/projects/simulateur-parcoursup/database_relationships.png"
lang: en
draft: false
teamSize: 1
year: 2025
repoPrivate: true
liveUrl: "https://simulateur-parcoursup.prepa-prevision.fr/"
conclusion: |
  The solution combines open data, controlled enrichments, and explainable modeling. The modular architecture (FastAPI/React) facilitates maintenance, extension, and local recalibration. Limitations relate to the granularity of aggregated data and distributional assumptions; they are compensated by explicit bounds, a main factor, and documented thresholds.
appendix:
  documents:
    - title: "Scientific Article"
      description: "LaTeX article describing the modeling approach"
      url: "/images/projects/simulateur-parcoursup/article_scientifique.pdf"
      type: pdf
  structure:
    description: "Approximately 40k lines of code maintained and organized"
    tree: |
      backend
      ├───core
      ├───data
      │   ├───processed_data
      │   ├───processing_data
      │   └───raw_data
      ├───db
      ├───models
      ├───routers
      ├───services
      └───templates
      frontend/src
      │   App.jsx
      │   main.js
      ├───api
      ├───assets
      ├───components
      │   ├───compare
      │   ├───details
      │   ├───motivation
      │   ├───registration
      │   └───search
      ├───constants
      ├───context
      ├───pages
      ├───styles
      └───utils
  sources:
    - authors: "Ministry of Higher Education and Research"
      year: 2024
      title: "Parcoursup 2024 — Study Continuation and Reorientation Wishes & Institution Responses"
      publisher: "data.enseignementsup-recherche.gouv.fr"
      url: "https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-parcoursup/"
    - authors: "Parcoursup"
      year: 2024
      title: "What Training Programs are Accessible on Parcoursup?"
      publisher: "Parcoursup"
      url: "https://www.parcoursup.gouv.fr/trouver-une-formation/quelles-formations-sont-accessibles-sur-parcoursup-1318"
    - authors: "L'Étudiant"
      year: 2024
      title: "Information Site on Guidance, Studies and Careers"
      publisher: "L'Étudiant"
      url: "https://www.letudiant.fr/"
---

## 1. Data Collection

### a) Sources and Input Files

- **Parcoursup Open Data – Statistics**: `fr-esr-parcoursup.csv`
Numbers, honors mentions, rank of last accepted, distribution by baccalaureate, scholarship holders, etc.
- **Training Cartography**: `fr-esr-cartographie_formations_parcoursup.csv`
Metadata (institution type, apprenticeship, boarding, geolocation, links).
- **Specialties (General Baccalaureate Holders)**: `fr-esr-parcoursup-enseignements-de-specialite-bacheliers-generaux.csv`
Specialty pairs and admitted numbers.
- **Geographical Supplements**: `departements-france.csv`
Department code normalization.

> Geolocation fields are kept for display/diagnostic purposes, with no direct effect on the model (except for academic aggregations).
>

### b) Enrichments through Scraping

- **Parcoursup Sheets (Training Programs)**
Retrieval: presentation, *expectations* (in % when available), baccalaureate distribution, milestones (candidates/admitted/admitted), tips, `competition` detection.
- **"Competition" Consolidation**
`competition_label` labeling and, if available, `dossier_coeff/competition_coeff` coefficients.
- **High School Sheets (L'Étudiant)**
Five "key figures" metrics (success rate, honors mentions, number of students, final year enrollment, grade/20) with anti-blocking strategies (retries, throttling, UA rotation).

## 2. Data Processing

> Goal: produce "model-ready" tables through schema alignments, typing, imputations, and derived indicators.
>

### a) Cleaning and Merging — *Training Programs*

1. **Derived Indicators**
    - Average by honors mentions (weights 11/13/15/17/19).
    - Distance to scale [8, 20] and **proxy dispersion** (from honors distribution).
    - Gender bias $B_f$ and scholarship bias $B_b$, bounded/normalized.
    - **Selectivity** $S = 1 - R_d/N$ in $[0,1]$ (with filling if needed).
2. **2025 Cartography & Geography**

    Normalizations (apprenticeship → boolean, categorized boarding, types), renaming, department and city completion, join with department table.

3. **Training Family Harmonization**

    Exhaustive `formation_type → formation` mapping (e.g., "Selective License" → "License – STS"), coverage checks.

4. **Adding "Competition"**

    Adding `competition` and `dossier_coeff`, `competition_coeff` from training programs present in certain competitions (*Sésame, Accès, Geipi-Polytech, Avenir, Advance, Puissance Alpha, IEP-Sciences Po*).


### b) Specialties

1. **Open Data**

    Filtering by year, pairs (doublets) → stable IDs (1..13), calculation of `admitted_specialty_share` per training program, intra-training *ranking*.

2. **Scraping**

    `combination` columns → `doublet_i` in `id1,id2` format (via `specialite2id`).


### c) High Schools

1. **Robust Scraping**

    Incremental enrichment, typing, anti-blocking.

2. **Feature Engineering & Multiplier**

    Decimals (success, honors), metric $x \in [0,1]$, `infos` indicator.

    Bounded transformation into $M_{highschool} \in [0.85, 1.15]$ via z-score → CDF → exponential; if `infos=0` then $M_{highschool} = 1.0$.

    ![Figure 1: Data Processing Pipeline](/images/projects/simulateur-parcoursup/database_relationships.png)

    Figure 1: Data Processing Pipeline


## 3. Establishing Metrics

> Idea: convert each factor into a multiplier $M_i$ centered at 1, bounded to avoid extremes, then aggregate.
>
- **Demographics (bounded, symmetric)**

    $$
    M_{\text{gender}} = \exp\!\big(k_{\max}\,(2B_f - 1)\cdot s\big)
    $$

    $$
    M_{\text{scholarship}} = \exp\!\big(k_{\max}\,(2B_b - 1)\cdot t\big)
    $$

    with $B_f, B_b \in [0,1]$, $s,t \in \{-1,+1\}$, $k_{\max}=\ln(1.025)$ (~±2.5%).

- **General Grades (calibrated to cohort)**

    Let $g$ be the candidate's average, $\mu,\sigma$ those of the training program (from honors).

    $z=\dfrac{g-\mu}{\sigma}, p=\Phi(z)$.

    $$
    M_{\text{grades}}=\begin{cases}
    \exp\!\big(1.25\,\ln(m_{\max})(2p-1)\big) & \text{if } g<\mu \\
    \exp\!\big(\ln(m_{\max})(2p-1)\big) & \text{otherwise}
    \end{cases}
    $$

    with $m_{\max}=1.5$

- **Specialty Grades (consistency)**

    $n=\dfrac{(s_1+s_2)/2 - \mu}{5}$ truncated to $[-1,1]$.

    $$
    M_{\text{specialty-grades}}=\begin{cases}
    \exp\!\big(2.5\,\ln(1.5)\,n\big) & \text{if } n<0 \\
    \exp\!\big(\ln(1.5)\,n\big) & \text{otherwise}
    \end{cases}
    $$

- **Baccalaureate Type (representativeness)**

    For non-general baccalaureates: floor $m_{\min}=0.6$ according to observed share $p_b$.

    $$
    M_{\text{bac}}=\begin{cases}
    0 & \text{if } p_b \le 0 \\
    \min\big(\max(3p_b, m_{\min}), 1\big) & \text{otherwise}
    \end{cases}
    $$

- **Specialty Pair (adequacy/rarity)**

    With $p_{\text{spe}}$ the share of admitted students with the pair and $\bar p_{\text{top}}$ the average of the $N$ most frequent pairs (often $N=3$), set $r=\min\!\big(p_{\text{spe}}/\bar p_{\text{top}},\,1\big)$.

    $$
    M_{\text{doublet}}=\begin{cases}
    \exp\!\big(2\,\ln(1.15)(2r-1)\big) & \text{if } r<0.5 \\
    \exp\!\big(\ln(1.15)(2r-1)\big) & \text{otherwise}
    \end{cases}
    $$

- **High School of Origin (academic context)**

    Aggregated score $x \in [0,1]$ → $z=\dfrac{x-\mu_x}{\sigma_x}$, $p=\Phi(z)$.

    $$
    M_{\text{highschool}}=\operatorname{clamp}\!\big(\exp(k(2p-1)),\, m_{\min},\, m_{\max}\big)
    $$

    with $\mu_x=0.548$, $\sigma_x=0.182$, $m_{\min}=0.85$, $k=\ln(m_{\max})$.

    If `infos=0` then $M_{\text{highschool}}=1$.


## 4. Chosen Model

### a) Aggregated Score

The global score for a training program $f$ is:

$$
M = M_{\text{gender}} \cdot M_{\text{scholarship}} \cdot M_{\text{bac}} \cdot M_{\text{grades}} \cdot M_{\text{specialty-grades}} \cdot M_{\text{doublet}} \cdot M_{\text{highschool}}
$$

> All $M_i$ are capped (bounds) to remain stable and interpretable.
>

### b) Conversion to Calibrated Percentile

We assume $M$ is centered around 1 and choose $\sigma_M$ such that the 97.5th percentile corresponds to:

$\sigma_M=\dfrac{M_{\max}-1}{\Phi^{-1}(0.975)}$, $z_M=\dfrac{M-1}{\sigma_M}$, $P=\Phi(z_M)\in[0,1]$.

The displayed value is $100\times P$.

### c) Three-Level Decision

- **Rejected** if $100P<20$
- **Waiting List** if $20\le 100P<50$
- **Accepted** if $100P\ge 50$

> Simple thresholds adjustable by training/year for local calibration refinement.
>

### d) Explainability

In addition to $P$, the service returns the **main factor** (dominant $M_i$ component) to explain the result (grades, doublet, baccalaureate type, high school, etc.). Demographic effects are **bounded and symmetric**.

### e) "Competition" Case (optional)

If `competition = 1`, a **post-dossier** weighting is applied from a user competition grade and `dossier_coeff/competition_coeff` coefficients (when available).

> Example: $M \simeq 1.440 \Rightarrow 100P \simeq 71.8$ → Accepted.
>

## 5. Backend Architecture

- **Framework**: FastAPI (`main.py`)
Config via `core/config.py`, middlewares (CORS, `UserIdMiddleware`), dependencies `core/deps.py`.
- **Search Infrastructure**: Integration of **Typesense**, a typo-tolerant and fast search engine, for instant indexing and querying of training programs and institutions.
- **Routers**:
    - `routers/simulate.py`: Simulation API (model `Profile`, call `compute_admission`).
    - `routers/formations.py`: Training search & stats (BM25, geo filters, distributions).
    - `routers/profiles.py`: Profile CRUD (`Profile`, `Wish`).
    - `routers/motive.py`: Letter generation and sending (OpenAI API + Brevo).
    - `routers/lycees.py`: High school search (department/type weights).
    - `routers/share.py`: Sending results by email (HTML rendering, Brevo).
- **Database & ORM**: `db/database.py` (SQLAlchemy / SQLite), `models/profile.py`.

![Figure 2: API Endpoints Documentation](/images/projects/simulateur-parcoursup/screencapture-localhost-8000-docs-2025-12-29-15_24_35.png)

Figure 2: API Endpoints Documentation

## 6. Backend Attention Points

- **Mailing**: `/share/simulation` → HTML rendering via `_render_motive_body_html`, sending via Brevo (keys in `.env.local`: `BREVO_API_KEY`, `BREVO_EMAIL_SENDER`).
- **Motivation Letter**: `/motive/generate` (generation), `/motive/email` (sending).
- **Search Engine**: Migration to **Typesense** enabling synonym management, typo tolerance, and relevant result sorting.
- **Academic Filtering**: `frontend/constants/acad_map.json` (department → academy/territory).

## 7. Frontend Architecture

- **Stack**: React (Vite). Entry `main.jsx`, app `App.jsx`.
- **Advanced Features**:
    - **Dynamic Theming**: Intelligent system detecting origin URL to automatically adapt **branding** (logo, color palette, links) and enable multi-site white-label deployment.
    - **Sharing and Public Profiles**: Creation of public profile pages accessible via unique URL, allowing vendors to easily access students' simulations and wish lists.
    - **Training Comparator**: Interactive tool allowing side-by-side comparison of multiple training programs on key criteria (selectivity, career prospects, expectations).

![Figure 3: Accessible Profile Sheet](/images/projects/simulateur-parcoursup/screencapture-simulateur-med-hermione-co-info-profil-1de629dabe09aeb6aef9a135c7706444-2025-12-29-15_30_17.png)

Figure 3: Accessible Profile Sheet

![Figure 4: Training Program Comparator](/images/projects/simulateur-parcoursup/screencapture-localhost-5173-comparateur-2025-12-29-15_31_50.png)

Figure 4: Training Program Comparator

- **Key Folders**:
    - `api/api.js`: endpoint calls (simulation, training programs, profiles, motivation, etc.).
    - `components/`: `details/`, `motivation/`, `registration/`, `search/`.
    - `constants/`: `complete_form.json`, `concours.json`, `confidence_levels.json`, `factorExplains.js`, `thresholds.js`.
    - `context/`: global state, theme (`styles/theme.css`, `utils/ThemeLogo.jsx`).
    - `pages/`: home, training programs, simulator, profile, letter.
    - `utils/`: pagination, conversions, helpers.

![Figure 5: Search Page Graphical Interface](/images/projects/simulateur-parcoursup/image.png)

Figure 5: Search Page Graphical Interface

## 8. Deployment

### a) Railway Hosting

Complete backend and frontend hosting with a connected **PostgreSQL** database and **Typesense** instance (Docker).

![Figure 6: Railway Infrastructure](/images/projects/simulateur-parcoursup/image-1.png)

Figure 6: Railway Infrastructure

### b) n8n Automation

- **Trigger**: Scheduled (Schedule Trigger) for periodic execution.
- **Process**: Daily synchronization of data (Profiles and Wishes) from the database to Google Sheets segmented by client.
- **Purpose**: Automatic feeding of tracking data and triggering sub-workflows for dashboard updates.

![Figure 7: n8n Automation Workflow](/images/projects/simulateur-parcoursup/image-2.png)

Figure 7: n8n Automation Workflow
