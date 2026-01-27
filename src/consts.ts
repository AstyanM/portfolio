// Tags disponibles - définis centralement pour cohérence
export const availableTags = [
  'Fullstack',
  'React',
  'Python',
  'Gestion de Projet',
  'IA',
  'Electronique',
  'Physique',
] as const;

export type Tag = (typeof availableTags)[number];
