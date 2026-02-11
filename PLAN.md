# Plan : Corrections Frontend Critique/Haute/Moyenne + 404 + tsconfig

## Contexte
Suite a un audit complet du frontend du portfolio, 16 problemes ont ete identifies aux niveaux critique, haute et moyenne priorite. Ce plan couvre leur correction, plus l'amelioration de la page 404 et le nettoyage du tsconfig.

---

## 1. CRITIQUE — HTML invalide dans BaseHead
**Fichier** : `src/components/astro/BaseHead.astro:51`
**Action** : Supprimer la ligne `<html lang={lang} />` — c'est un element HTML orphelin dans le `<head>`. Le `lang` est deja sur le vrai `<html>` dans BaseLayout.astro:22.

## 2. CRITIQUE — Flash de theme pour les utilisateurs dark mode
**Fichier** : `src/components/astro/BaseHead.astro:77-82`
**Action** : Modifier le script inline pour respecter `prefers-color-scheme: dark` comme fallback quand il n'y a pas de valeur en localStorage, alignant le comportement avec ThemeToggle.tsx:12-13.
```js
// Avant
return 'light';
// Apres
return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
```

## 3. CRITIQUE — Lightbox accessibilite
**Fichier** : `src/components/react/Lightbox.tsx`
**Actions** :
- Ajouter `role="dialog"` et `aria-modal="true"` sur le conteneur
- Ajouter `aria-label="Close"` sur le bouton de fermeture
- Implementer un focus trap basique (capturer Tab/Shift+Tab pour rester dans la modale)
- Restaurer le focus a l'element source quand la modale se ferme (sauvegarder `document.activeElement` a l'ouverture)

## 4. HAUTE — `aria-expanded` manquants
**Fichiers** :
- `src/components/react/Header.tsx:163` → ajouter `aria-expanded={isMobileMenuOpen}` au bouton mobile menu
- `src/components/react/TableOfContents.tsx:118` → ajouter `aria-expanded={isOpen}`
- `src/components/react/TagFilterEnhanced.tsx:157` → ajouter `aria-expanded={isExpanded}`

## 5. HAUTE — Scroll listener sans optimisation
**Fichier** : `src/components/react/Header.tsx:86`
**Action** : Ajouter `{ passive: true }` au scroll et hashchange listeners.

## 6. HAUTE — Extraire `translateTag` en utilitaire partage
**Ajout dans** : `src/i18n/utils.ts`
```ts
export function translateTag(tag: string, lang: Lang): string {
  const key = `tag.${tag}` as keyof (typeof ui)[typeof lang];
  return ui[lang][key] || tag;
}
```
**Fichiers a modifier** (remplacer les implementations locales par l'import) :
- `src/components/react/ProjectCard.tsx:32-35`
- `src/layouts/ProjectLayout.astro:63-66`
- `src/components/astro/ProjectSpotlight.astro:12-15`
- `src/components/react/TagFilterEnhanced.tsx:51-54`

## 7. HAUTE — Deduplication TagFilterEnhanced
**Fichier** : `src/components/react/TagFilterEnhanced.tsx`
**Action** : Extraire un sous-composant `TagButton` local pour eliminer la repetition du code de rendu des boutons (repete ~8 fois). Le composant prend `tag`, `isSelected`, `onClick`, `count`, et `label` en props.

## 8. MOYENNE — ReadingProgress ARIA
**Fichier** : `src/components/react/ReadingProgress.tsx`
**Action** : Ajouter `role="progressbar"`, `aria-label="Reading progress"`, `aria-valuemin={0}`, `aria-valuemax={100}`.

## 9. MOYENNE — Couleurs hardcodees → tokens design system
- `src/layouts/ProjectLayout.astro:246,249` : Remplacer `#22c55e` par la classe Tailwind `text-green-500` (semantiquement correct pour "success/copie")
- Timeline teal et Contact emerald : garder (intentionnel pour differencier les categories visuelles)

## 10. MOYENNE — Cleanup `!important` sur figure-caption
**Fichier** : `src/layouts/ProjectLayout.astro:189-199`
**Action** : Supprimer le bloc de styles `is:global` avec `!important` qui duplique `global.css:163-166`. Si necessaire, augmenter la specificite dans global.css plutot qu'utiliser `!important`.

## 11. MOYENNE — Elements `<time>` semantiques
**Fichier** : `src/components/astro/Timeline.astro`
**Action** : Remplacer les `<span>` de dates par des `<time datetime="...">`.

## 12. MOYENNE — React Error Boundary
**Fichier a creer** : `src/components/react/ErrorBoundary.tsx`
**Action** : Error boundary basique avec fallback. L'appliquer dans SimilarProjects et les pages projets (autour de ProjectGrid).

## 13. MOYENNE — Centraliser les traductions inline
**Migrer vers `src/i18n/ui.ts`** :
- `ProjectCtaCard.tsx` → nouvelles cles `cta.title`, `cta.description`, `cta.button`
- `ProjectsTimeline.tsx` → utiliser cles existantes `filters.allYears`, `filters.project`, `filters.projects`
- `TableOfContents.tsx` → nouvelle cle `toc.title`

## 14. MOYENNE — Elements interactifs imbriques dans ProjectCard
**Fichier** : `src/components/react/ProjectCard.tsx`
**Action** : Restructurer pour eviter `<button>` dans `<a>` :
- Carte racine → `<motion.div>` au lieu de `<motion.a>`
- Lien principal → `<a>` stretched (couvre toute la carte)
- Bouton GitHub → `<a>` positionne au-dessus avec z-index

## 15. TSCONFIG — Nettoyage aliases redondants
**Fichier** : `tsconfig.json`
**Action** : Supprimer `@components/*`, `@layouts/*`, `@assets/*` (confirme : aucun fichier ne les utilise, `@/*` couvre tout).

## 16. PAGE 404 — Plus d'identite
**Fichier** : `src/pages/404.astro` + `src/i18n/ui.ts`
**Actions** :
- Ajouter `HeroBackground` en arriere-plan + gradient overlay
- "404" en gradient-text avec animation subtile
- Ton pro/sobre, texte direct
- Plusieurs chemins de navigation : Accueil, Projets, Contact (avec stagger)
- Nouvelles cles i18n : `404.viewProjects`, `404.contact`

---

## Ordre d'execution
1. `translateTag` utilitaire + mise a jour des 4 fichiers
2. BaseHead : supprimer `<html>` orphelin + fix theme flash
3. Lightbox : accessibilite complete
4. Header : `aria-expanded` + passive listeners
5. TableOfContents : `aria-expanded`
6. TagFilterEnhanced : `aria-expanded` + extraction TagButton
7. ReadingProgress : ARIA
8. ProjectLayout : cleanup `!important` + couleur hardcodee
9. Timeline : elements `<time>`
10. ErrorBoundary : creation + integration
11. Centraliser traductions (ui.ts + composants)
12. ProjectCard : restructuration elements interactifs
13. tsconfig.json : nettoyage
14. 404.astro : refonte visuelle + nouvelles cles i18n

## Verification
- `npm run build` sans erreur
- Test manuel : 404, theme toggle, lightbox, navigation clavier, console propre