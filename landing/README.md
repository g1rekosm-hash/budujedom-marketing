# Landing Budoexpert — lista przedstartowa

Jedna statyczna strona (`index.html`, bez buildu) z filmem **video promo budoexpert v1** na środku, CTA „Zapisz się” pod filmem i nawigacją: O nas · Jak to działa · Zapisz się · Kontakt.

## Podgląd lokalnie
Można po prostu otworzyć `index.html` dwuklikiem albo uruchomić serwer:
```bash
cd landing && python3 -m http.server 8000   # → http://localhost:8000
```

## Ścieżka zapisu (modal)
1. **Kim jesteś?** — 6 ról (Inwestor prywatny, Wykonawca i usługodawca, Architekt / Projektant, Dostawca materiałów, Deweloper, Szukam pracy / Kariera).
2. **Opis roli** — co ta rola zyskuje + „Co dalej po zapisie?”.
3. **E-mail + województwo + zgoda**.
4. **Sukces** + „Poleć znajomemu” (Web Share / kopiowanie linku).

Kliknięcie roli w sekcji „Dla kogo” lub w chipsach pod filmem otwiera modal od razu na kroku 2.

## Podpięcie formularzy (TODO przed publikacją)
Na górze skryptu w `index.html`:
```js
const SIGNUP_ENDPOINT = '';   // np. Formspree / webhook Make/Zapier / własne API
const CONTACT_ENDPOINT = '';
```
Formularz wysyła JSON `{ email, rola, wojewodztwo, zgoda, zrodlo, timestamp }`. Dopóki adres jest pusty, zgłoszenia trafiają tylko do `localStorage` przeglądarki (tryb demo).

Do uzupełnienia: prawdziwy adres kontaktowy (teraz `kontakt@budoexpert.pl`), link do polityki prywatności przy zgodzie.

## Treści
Copy oparte na starym landingu, **bez** obietnic liczbowych i gwarancji (1250 osób, % oszczędności, 0% ryzyka, 500 osób / 90 dni, CTO / IKO / BLIK, „100% pewności zarobku” itp.) — decyzja właściciela.

## Assety
- `assets/video-promo-budoexpert-v1.mp4` — wersja webowa (H.264 CRF 24, AAC 128k, faststart, ~10,5 MB) z `motion/budoexpert-promo/`.
- `assets/video-promo-budoexpert-v1.webm` — zapasowa wersja VP9/Opus (~10,4 MB) dla przeglądarek bez H.264.
- `assets/poster.jpg` — klatka z 24 s („Wszyscy. W jednym miejscu.”).
- `assets/fonts/` — Poppins 400–800 (woff2).
