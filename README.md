# familie-dokgen-nodejs
Dokumentgenerator laget i Node.js. Denne har som hensikt å kunne generere brev/dokumenter i HTML-og PDF/A-format, slik at saksbehandlere kan få konsistent utformede brev utsendt til brukere. Applikasjonen kan også oppdatere og generere nye maler med andre innflettingsfelt.

## Kom i gang
Prosjektet er bygget i Node.js. Installer dependencies med `yarn install` eller `npm install`, kjør tilsvarende med `yarn start`.

Serveren bruker Express for API'et, med Mocha som testrammeverk. Skal du kjøre tester, gjør du `yarn test`. For å generere brev med innflettingsfelter, benyttes markdown med Handlebars-syntaks. Merk at disse feltene _må_ matche JSON schema som definert i malen. Enhver innflettingsfeil vil returnere en FieldError som spesifiserer alle valideringsfeil i JSON-verdiene.

## Endepunkter
`/template`: støtter GET, POST, PUT, DELETE. Om man bruker POST eller PUT, så vil det _genererte_ brevet bli returnert slik at man kan bruke det til preview. Derfor støtter dette endepunktet også de valgfrie parameterene til `/letter`.
* Parametre
  * Obligatorisk: 
    * `templateName` (string) spesifiserer hvilken mal som brukes.
  * Obligatorisk (POST, PUT): 
    * `markdownContent` (string) innholdet som malen skal oppdateres med.

`/template/all`: returnerer en liste med navn over alle tilgjengelige maler. Ingen parametre.

`/letter`: støtter POST. Dette endepunktet genererer et brev basert på valgt mal, innflettingsfelt og format.

* Parametre
  * Obligatorisk: 
    * `templateName` (string) spesifiserer hvilken mal som brukes.
  * Valgfri: 
    * `interleavingFields` (json - default {}) spesifiserer innflettingsfeltene som brukes. Disse verifiseres, så om noe er feil, vil endepunktet returnere en FieldError. 
    * `format` (string) tar inn enten 'html', 'pdf' eller 'pdfa' og returnerer fil med det gitte formatet.
