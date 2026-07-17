# Le Cambronne — Bistrot chic (refonte)

Refonte complète du site [lecambronne-bistrotchic.fr](https://www.lecambronne-bistrotchic.fr).
Restaurant bistronomique, quartier Graslin, Nantes. Groupe : Le Mas des Oliviers, Le Moïa.

## DA « Velours & Charbon »

Tirée du lieu réel (photos Fokale32) : murs charbon, fauteuils à oreilles velours rouge,
suspensions cuivre, bibliothèque rétroéclairée, carreaux de ciment, lustres cristal.
Face au Théâtre Graslin → structure de la page en **actes** (I à VI).

- **Couleurs** : charbon `#17191d` · ivoire `#f3efe7` · rouge Cambronne `#d8332b` (logo) · cuivre `#c08350`
- **Typo** : Bodoni Moda (didone, titres + italiques) · Manrope (corps, labels letterspaced)
- **Motifs** : filets doubles (cadre Belle Cave), trame losanges SVG (écho carreaux ciment), lettrines rouges, numéros d'acte
- **Animations** : reveals translateY + clip-path (jamais de scale sur images), parallaxe hero en translation, nav qui se masque à la descente
- Alternance sections nuit (charbon) / jour (ivoire) ; terrasse = section blanche

## Structure

- `index.html` — one-page en 6 actes : Quartier, Salle, Cuisine, Cave, Terrasse, Infos + footer rouge
- `carte.html` — carte complète (menu sur ivoire) + carte des vins (sur charbon, colonnes)
- `mentions-legales.html` — à compléter (SIRET, hébergeur)
- `styles.css` / `carte.css` / `main.js` — vanilla, zéro dépendance
- `robots.txt`, `sitemap.xml`, JSON-LD Restaurant (horaires, adresse, résa)

## Données réelles

- 6 rue de l'Héronnière, 44000 Nantes — angle rue Piron
- 02 40 47 36 42 · 7 j/7 (dimanche midi uniquement)
- Résa : Overfull (lien avec token dans les pages)
- Photos : site existant (Fokale32 — Philippe Pierre) — les photos DSC03558/DSC06813 de l'ancien site appartiennent aux autres restos du groupe, écartées

## À demander au client

- Photos plats (aucune photo culinaire dispo — la carte n'a pas de visuel plat)
- Photo façade/angle de rue (acte Quartier)
- Portrait chef / équipe si souhaité
- Infos mentions légales (SIRET, hébergeur, directeur publication)

## Dev

```bash
python3 -m http.server 8741   # puis http://localhost:8741
```
