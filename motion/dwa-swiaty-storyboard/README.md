# Dwa światy budowania — storyboard (explainer 2D, ~1:59)

Gotowy storyboard dla animatora i montażysty: **`budoexpert-dwa-swiaty-storyboard.pdf`** (A4 poziomo, 18 stron).

Film w jednym ciągu: najpierw cały **stary świat** (szaro, deszcz; inwestor ×2, wykonawca ×2, hurtownia),
potem zwrot (deszcz zamiera, turkusowy trójkąt rozlewa kolor), a po nim cały **nowy świat**. Te same postacie
i te same kadry, lustrzany tekst lektora, na każdym ekranie aplikacji Budoexpert. Na końcu CTA „Nie czekaj. Zapisz się już dziś.” i budoexpert.pl.

W PDF:
- okładka, koncepcja, oś czasu, zasady;
- palety obu światów, postacie, muzyka i dźwięk;
- 13 scen / 31 ujęć: szkic kadru, timecode, opis animacji, lektor, dźwięk, przejście;
- skrypt lektora do nagrania;
- lista ekranów aplikacji do zaprojektowania.

## Edycja
- Teksty (lektor, opisy, timecode'y): `content.mjs`
- Szkice kadrów (SVG): `frames.mjs`, prymitywy rysunkowe: `draw.mjs`
- Przebudowanie HTML + PDF: `node build.mjs` (Playwright + Chromium; font Poppins z `../budoexpert-promo/fonts`)
