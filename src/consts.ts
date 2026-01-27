// Tags disponibles - définis centralement pour cohérence
export const availableTags = [
  // Techniques
  'Deep Learning',
  'Traitement du Signal',
  'Vision par Ordinateur',
  'Simulation',
  // Domaines
  'Santé',
  'Web',
  'Sécurité',
  'Architecture',
  // Type de réalisation
  'Hardware',
  'Recherche',
  'Embarqué',
] as const;

export type Tag = (typeof availableTags)[number];
