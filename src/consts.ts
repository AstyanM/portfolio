// Tags disponibles - définis centralement pour cohérence
export const availableTags = [
  // Techniques
  'Deep Learning',
  'NLP',
  'Traitement du Signal',
  'Vision par Ordinateur',
  'Simulation',
  // Domaines
  'Santé',
  'Web',
  'Sécurité',
  // Type de réalisation
  'Hardware',
  'Recherche',
  'Embarqué',
  'Desktop',
  'Data Science',
] as const;

export type Tag = (typeof availableTags)[number];
