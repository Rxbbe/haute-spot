# Haute Spot website

```
haute-spot/
  index.html            Hoofdpagina
  videos.html           Pagina met foto's en video's
  assets/
    css/styles.css      Gedeelde opmaak
    js/script.js        Animaties en contactformulier (hoofdpagina)
    js/videos-page.js   Toont de foto's en video's
    data/videos.js      Lijst met foto's en video's (hier voeg je ze toe)
    img/logo.png        Logo uit de PDF (momenteel niet in gebruik)
```

Foto's en video's toevoegen: open `assets/data/videos.js` en voeg een regel toe. De uitleg staat bovenaan het bestand.

## Online zetten op Vercel

Het is een statische site, dus er is geen build nodig.

1. Zet de map `haute-spot` in een Git-repository (of gebruik `npx vercel` in deze map).
2. Maak in Vercel een nieuw project aan. Framework Preset: **Other**. Build Command en Output Directory leeg laten, Root Directory: de map met `index.html`.
3. Na het deployen krijg je een adres als `https://jouw-project.vercel.app`.

`vercel.json` zet tijdelijk `noindex` aan, zodat Google het vercel.app-adres niet indexeert.
Verwijder het `X-Robots-Tag`-blok zodra hautespot.be live gaat.

Daarna ook aanpassen op het nieuwe adres:
- EmailJS, tabblad Security: voeg het domein toe aan de toegestane domeinen.
- Google reCAPTCHA-beheer: voeg het domein toe aan de sleutel.
- Logo in de mailtemplates: vervang `https://hautespot.be/assets/img/logo.png` door `https://jouw-project.vercel.app/assets/img/logo.png`.
