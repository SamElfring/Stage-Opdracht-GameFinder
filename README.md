# Stage Opdracht (GameFinder)

Voor mijn stage heb ik een opdracht gemaakt waarmee je via de [IGDB](http://igdb.com/api) api elk spel kan vinden met behulp van filters!

Het werkt zo:

## GameFinder

Door middel van filters kun je zoeken naar videogames.<br>
Deze filters zijn:
* Naam
* Minimale Rating (1 t/m 10)
* Release Datum
* Platform (PC, PS4, Switch)
* Max. aantal resultaten

Nadat je de filters hebt ingevuld krijg je meerdere resultaten te zien. Deze resultaten kun je daarna weer sorteren.<br>
De lijst is te sorteren op:
* Rating
* Release Datum
* Naam

Ook kun je op de resultaten klikken als je een beschrijving en screenshots van het spel wilt zien.

## Zelf proberen?
Clone deze repository en open 'index.html' in je browser.
Je hebt wel je eigen zogenoemde 'key' nodig om de api van [IGDB](http://igdb.com/api) te gebruiken. Deze kun je [hier](https://api.igdb.com/pricing) krijgen.
Klik op 'get started' (volledig gratis) en maak een account aan. Nadat je een account hebt aangemaakd krijg je een key.
<br>
### Wat te doen met de key?
Je zult de key moeten invoeren in het 'app.js' bestand. Op **regel 56** vindt je het stuk code;
```javascript
headers: {
    'Accept': 'application/json',
    'user-key': 'vul-hier-je-eigen-key-in'
},
```
Haal vul-hier-je-eigen-key-in weg en kopieër daar je eigen key (laat de quotes(') staan!).
Open/refresh nu 'index.html' en zoek maar raak!
