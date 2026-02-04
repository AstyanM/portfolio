export const languages = {
  en: 'English',
  fr: 'Français',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'en';

export const ui = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.projects': 'Projets',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',

    // Hero
    'hero.greeting': 'Bienvenue !',
    'hero.title': 'Astyan Martin',
    'hero.subtitle':
      "Étudiant en ingénierie, passionné par l'IA, les algorithmes et la conception matérielle.",
    'hero.cta': 'Découvrir mes projets',

    // Projects
    'projects.title': 'Mes Projets',
    'projects.subtitle':
      'Une sélection de projets techniques mêlant exploration et innovation.',
    'projects.viewAll': 'Voir tous les projets',
    'projects.readMore': 'Lire plus',
    'projects.filter.all': 'Tous',

    // Tags
    'tag.Deep Learning': 'Deep Learning',
    'tag.Traitement du Signal': 'Traitement du Signal',
    'tag.Vision par Ordinateur': 'Vision par Ordinateur',
    'tag.Simulation': 'Simulation',
    'tag.Santé': 'Santé',
    'tag.Web': 'Web',
    'tag.Sécurité': 'Sécurité',
    'tag.Architecture': 'Architecture',
    'tag.Hardware': 'Hardware',
    'tag.Recherche': 'Recherche',
    'tag.Embarqué': 'Embarqué',

    // Project detail
    'project.backToProjects': 'Retour aux projets',
    'project.liveDemo': 'Voir le projet',
    'project.sourceCode': 'Code source',
    'project.privateRepo': 'Dépôt privé',

    // Contact
    'contact.title': 'Me Contacter',
    'contact.subtitle': 'Intéressé par mon profil ou envie de discuter d\'un projet ?',
    'contact.cta': 'Envoyer un email',
    'contact.or': 'ou retrouvez-moi sur',
    'contact.downloadCv': 'Télécharger mon CV',

    // Footer
    'footer.rights': 'Tous droits réservés.',

    // 404
    '404.title': 'Page non trouvée',
    '404.description': "La page que vous cherchez n'existe pas.",
    '404.backHome': "Retour à l'accueil",

    // Similar Projects
    'similar.title': 'Ces projets pourraient vous intéresser',
    'similar.titleSingular': 'Ce projet pourrait vous intéresser',

    // Hero (extended)
    'hero.description': "Étudiant en ingénierie, curieux et passionné par de nombreux domaines techniques. Ce portfolio regroupe mes projets les plus significatifs, mêlant exploration de l'IA, algorithmes et conception matérielle.",

    // Projects (extended)
    'projects.otherTitle': 'Autres Projets',
    'projects.noResults': 'Aucun projet avec ce tag.',

    // Tech Stack
    'techstack.title': 'Stack Technique',
    'techstack.subtitle': "Une boîte à outils complète pour transformer des idées complexes en solutions fonctionnelles, du bas niveau à l'intelligence artificielle avancée.",

    // Timeline
    'timeline.title': 'Mon Parcours',
    'timeline.subtitle': "De la classe préparatoire à l'ingénierie, avec des expériences en IA et développement.",
    'timeline.educationTitle': 'Formation',
    'timeline.internshipsTitle': 'Stages',
    'timeline.upcoming': 'À venir',

    // Spotlight
    'spotlight.label': 'Projet à la Une',
    'spotlight.btn': 'Voir le projet en détails',

    // Filters
    'filters.allYears': 'Toutes les années',
    'filters.yearLabel': 'Période',
    'filters.tagsLabel': 'Tags',
    'filters.project': 'projet',
    'filters.projects': 'projets',
    'filters.allTags': 'Tous les tags',
    'filters.showMoreTags': 'Afficher tous les filtres',
    'filters.showLessTags': 'Réduire',
    'filters.techniques': 'Techniques',
    'filters.domains': 'Domaines',
    'filters.types': 'Type de réalisation',

  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.projects': 'Projects',
    'nav.about': 'About',
    'nav.contact': 'Contact',

    // Hero
    'hero.greeting': 'Welcome!',
    'hero.title': 'Astyan Martin',
    'hero.subtitle':
      'Engineering student, passionate about AI, algorithms and hardware design.',
    'hero.cta': 'Discover my projects',

    // Projects
    'projects.title': 'My Projects',
    'projects.subtitle':
      'A selection of technical projects combining exploration and innovation.',
    'projects.viewAll': 'View all projects',
    'projects.readMore': 'Read more',
    'projects.filter.all': 'All',

    // Tags
    'tag.Deep Learning': 'Deep Learning',
    'tag.Traitement du Signal': 'Signal Processing',
    'tag.Vision par Ordinateur': 'Computer Vision',
    'tag.Simulation': 'Simulation',
    'tag.Santé': 'Health',
    'tag.Web': 'Web',
    'tag.Sécurité': 'Security',
    'tag.Architecture': 'Architecture',
    'tag.Hardware': 'Hardware',
    'tag.Recherche': 'Research',
    'tag.Embarqué': 'Embedded',

    // Project detail
    'project.backToProjects': 'Back to projects',
    'project.liveDemo': 'Live demo',
    'project.sourceCode': 'Source code',
    'project.privateRepo': 'Private repository',

    // Contact
    'contact.title': 'Get in Touch',
    'contact.subtitle': 'Interested in my profile or want to discuss a project?',
    'contact.cta': 'Send an email',
    'contact.or': 'or find me on',
    'contact.downloadCv': 'Download my Resume',

    // Footer
    'footer.rights': 'All rights reserved.',

    // 404
    '404.title': 'Page not found',
    '404.description': "The page you're looking for doesn't exist.",
    '404.backHome': 'Back to home',

    // Similar Projects
    'similar.title': 'These projects might interest you',
    'similar.titleSingular': 'This project might interest you',

    // Hero (extended)
    'hero.description': 'Engineering student, curious and passionate about many technical fields. This portfolio showcases my most significant projects, blending AI exploration, algorithms and hardware design.',

    // Projects (extended)
    'projects.otherTitle': 'Other Projects',
    'projects.noResults': 'No projects with this tag.',

    // Tech Stack
    'techstack.title': 'Tech Stack',
    'techstack.subtitle': 'A complete toolkit to transform complex ideas into functional solutions, from low-level to advanced AI.',

    // Timeline
    'timeline.title': 'My Journey',
    'timeline.subtitle': 'From preparatory classes to engineering school, with experience in AI and development.',
    'timeline.educationTitle': 'Education',
    'timeline.internshipsTitle': 'Internships',
    'timeline.upcoming': 'Upcoming',

    // Spotlight
    'spotlight.label': 'Featured Project',
    'spotlight.btn': 'View project details',

    // Filters
    'filters.allYears': 'All years',
    'filters.yearLabel': 'Period',
    'filters.tagsLabel': 'Tags',
    'filters.project': 'project',
    'filters.projects': 'projects',
    'filters.allTags': 'All tags',
    'filters.showMoreTags': 'Show all filters',
    'filters.showLessTags': 'Show less',
    'filters.techniques': 'Techniques',
    'filters.domains': 'Domains',
    'filters.types': 'Type',

  },
} as const;
