# budujedom-marketing — kontekst dla Claude

Repozytorium działu marketingu **Budoexpert** (nazwa firmy: Budoexpert; strona: budoexpert.pl).
Platforma łączy osoby budujące dom, wykonawców, architektów, dostawców materiałów (hurtownie),
deweloperów i osoby szukające pracy w branży. Obecnie etap przedstartowy: lista zapisów.

## Marka
- Kolory z logo: fiolet `#6C0C79` (ciemniejszy `#520A5C`), turkus `#20CFA3` (ciemniejszy `#17A884`), biały.
- Font: **Poppins**. Logo: turkusowy trójkąt z zaokrąglonymi rogami + napis „budoexpert” (biały na fiolecie / fioletowy na białym).
- Styl wizualny filmów: szkic architektoniczny na papierze milimetrowym, fioletowe tła z siatką.

## Filmy (gotowe) — `motion/budoexpert-promo/`
| Nazwa | Plik | Opis |
|---|---|---|
| **video promo budoexpert v1** | `video-promo-budoexpert-v1.mp4` | 30,5 s, 1920×1080, z dźwiękiem. Intro z kulą → „platforma, która zmienia rynek budowlany” → pytania („Planujesz budowę domu?”…) → REWOLUCJA → karuzela 18 kart z cechami (paralaksa, mgła) → hub ról + platforma 3D „Wszyscy. W jednym miejscu.” → CTA „Nie czekaj! Zapisz się już dziś.” + budoexpert.pl |
| **video promo budoexpert doodle** | `video-promo-budoexpert-doodle.mp4` | 30,5 s, ta sama historia i muzyka co v1, ale w stylu odręcznego szkicu (białe/fioletowe tła, serduszka, strzałki, dopiski fontem Caveat). Źródło: `doodle.html` |
| **video promo budoexpert problem** | `video-promo-budoexpert-problem.mp4` | Ta sama struktura, ale zamiast pytań „Stary świat” (problem każdej grupy), karty z etykietami ról, hub z 6 rolami z formularza, na końcu „Dołącz poniżej ↓” |

**video budoexpert dwa światy** — `motion/budoexpert-dwa-swiaty/video-budoexpert-dwa-swiaty.mp4`: explainer 2.5D 1:58 **bez lektora** (właściciel kazał go usunąć), wg storyboardu v3 „Dwa światy budowania”. Styl „pro”: warstwy z paralaksą i głębią ostrości, wolumetryczne światło, deszcz w planach, UI telefonów w 3D, kinetyczne napisy. Silnik `engine.js` + `scenes-old.js` / `scenes-new.js`, montaż `film.html`, dźwięk `soundtrack.py` — szczegóły w README tego folderu. Płaska wersja 1:1 ze storyboardem odrzucona jako „turbo płytka”.

Źródło animacji: `promo.html` (canvas), render: `render.mjs`, muzyka: `soundtrack.py` — szczegóły w `motion/budoexpert-promo/README.md`.
Pliki MP4 mają ~33 MB; na stronę lepiej użyć wersji skompresowanej (`ffmpeg -crf 23`, `-movflags +faststart`).

## Storyboard „Dwa światy budowania” — `motion/dwa-swiaty-storyboard/`
Explainer 2D (~1:59) dla montażysty: najpierw cały stary świat (inwestor ×2, wykonawca ×2, hurtownia), potem zwrot z trójkątem
i lustrzany nowy świat; CTA „Nie czekaj. Zapisz się już dziś.” PDF: `budoexpert-dwa-swiaty-storyboard.pdf`, treść w `content.mjs`,
build: `node build.mjs`. W tekście lektora nie używać słowa „chaos”.

## Landing page — usunięty na prośbę właściciela (był w PR #3, można go odzyskać z historii gita)
- Ma pokazać **video promo budoexpert v1**, a pod filmem baner/formularz **„Zapisz się”** (lista przedstartowa).
- Copy i formularze można brać ze starego landingu (Buduje-dom.com, specyfikacja treści od użytkownika): role w formularzu —
  Inwestor prywatny, Wykonawca i usługodawca, Architekt / Projektant, Dostawca materiałów, Deweloper, Szukam pracy / Kariera; pole województwo.
- **NIE używać** obietnic i liczb ze starego landingu: „1250 osób”, „do 15/20% oszczędności”, „0% ryzyka”, „pierwsze 500 osób / 90 dni bez prowizji”, CTO / IKO / BLIK, gwarancje. Decyzja właściciela.
- Nazwa wszędzie: **Budoexpert** (nie „Buduje-dom.com”).

## Współpraca
- Rozmowa po polsku, luźno (użytkownik mówi do Claude „Jasiek”).
- Nie generować na razie nowych skryptów do After Effects (`after-effects/` odpowiada starej, 26-sekundowej wersji filmu).
