        import { kommunenummer } from './data/kommunenummer.mjs';

        function search() {
            const searchInput = document.getElementById('searchInput');
            const resultContainer = document.getElementById('resultat');
            const resultCountContainer = document.getElementById('resultCount');
            resultContainer.innerHTML = '';
            resultCountContainer.innerHTML = '';

            // Lag et array for å lagre og kunne sortere treffene
            const matches = [];

            // Sjekker om søkeordet er en del av en kommune eller kommunenummer i kommunenummer-objektet
            for (const kommune in kommunenummer) {
                const kommunenummerVerdi = kommunenummer[kommune].toString();

                if (kommune.toLowerCase().includes(searchInput.value.toLowerCase()) || kommunenummerVerdi.includes(searchInput.value)) {
                    matches.push({ kommune, kommunenummerVerdi });
                }

                // Begrens antallet treff til 10
                if (matches.length >= 10) {
                    break;
                }
            }

            // Sorter treffene alfabetisk basert på kommune
            matches.sort((a, b) => a.kommune.localeCompare(b.kommune));

            // Vis antall treff
            resultCountContainer.textContent = `Antall treff: ${matches.length}`;

            // Vis resultatene
            for (const match of matches) {
                const paragraph = document.createElement('p');
                paragraph.textContent = `${match.kommune} ${match.kommunenummerVerdi}`;

                // Legg til en hendelseslytter for hvert <p>-element
                paragraph.addEventListener('click', function() {
                    // Oppdater inputfeltet når et resultat klikkes
                    searchInput.value = `${match.kommune} (kommunenr: ${match.kommunenummerVerdi})`;
                    
                    // Skjul resultatlisten
                    resultContainer.innerHTML = '';
                    resultCountContainer.innerHTML = '';
                });

                resultContainer.appendChild(paragraph);
            }
        }

        // Knytt funksjonen til input-hendelsen for å oppdatere resultater mens du skriver
        document.getElementById('searchInput').addEventListener('input', search);

        // Legg til hendelseslytter for å tømme inputfeltet når det klikkes
        document.getElementById('searchInput').addEventListener('click', function () {
            this.value = '';
        });