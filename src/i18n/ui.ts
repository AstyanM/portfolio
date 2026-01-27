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

    // Footer
    'footer.rights': 'Tous droits réservés.',

    // 404
    '404.title': 'Page non trouvée',
    '404.description': "La page que vous cherchez n'existe pas.",
    '404.backHome': "Retour à l'accueil",
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

    // Footer
    'footer.rights': 'All rights reserved.',

    // 404
    '404.title': 'Page not found',
    '404.description': "The page you're looking for doesn't exist.",
    '404.backHome': 'Back to home',
  },
} as const;
