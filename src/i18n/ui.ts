export const languages = {
  fr: 'Français',
  en: 'English',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'fr';

export const ui = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.projects': 'Projets',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',

    // Hero
    'hero.greeting': 'Bienvenue !',
    'hero.title': 'Je suis Astyan Martin',
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

    // Project detail
    'project.backToProjects': 'Retour aux projets',
    'project.liveDemo': 'Voir le projet',
    'project.sourceCode': 'Code source',

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
    'hero.title': "I'm Astyan Martin",
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

    // Project detail
    'project.backToProjects': 'Back to projects',
    'project.liveDemo': 'Live demo',
    'project.sourceCode': 'Source code',

    // Footer
    'footer.rights': 'All rights reserved.',

    // 404
    '404.title': 'Page not found',
    '404.description': "The page you're looking for doesn't exist.",
    '404.backHome': 'Back to home',
  },
} as const;
