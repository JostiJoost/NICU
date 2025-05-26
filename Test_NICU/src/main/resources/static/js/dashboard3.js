/**
 * ---------- DASHBOARD PROTOCOL ----------
 * Dit dashboard geeft de gebruiker inzichten voor de protocollen zoals aantal en doorlooptijd per centrum. Daarnaast
 * de mogelijkheid om per centrum de specifieke doorlooptijd van een protocol te zien
 * @author Joost Goddijn
 * @version 1.0
 * @since 26-05-2025
 * */

let geselecteerdCentrum = null;

/**
 * Functie die het dropdown keuze menu vult om een keuze voor een centrum te maken
 * @param centra - De centra die in het dropdown menu moeten komen
 * */
function populateCentrumDropdown(centra) {
    const select = document.getElementById("centrumSelect");

    select.innerHTML = '<option value="" disabled selected>-- Selecteer een centrum --</option>';
    centra.forEach(naam => {
        const option = document.createElement("option");
        option.value = naam;
        option.textContent = naam;
        select.appendChild(option);
    })

    select.addEventListener("change", (e) => {
        geselecteerdCentrum = e.target.value;
        console.log("Geselecteerde centrum: ", geselecteerdCentrum);
        herlaadDashboard();
    });
}

/**
 * Stuk script wat als controller dient voor de keuze van het dropdown menu
 * */
document.addEventListener("DOMContentLoaded", () => {
    fetch(`http://localhost:8080/api/studie/centra`)
        .then(response => response.json())
        .then(data => {
            populateCentrumDropdown(data);
        })
        .catch(error => {
            console.error("Fout bij ophalen centra: ", error);
        });
});

/**
 * Functie die JSON output ophaald aan de hand van een URL
 * @param url - De URL waar de JSON output te vinden is
 * @returns - De JSON output
 * */
async function laadJson(url) {
    try {
        const response = await fetch(url)
        if (!response.ok) throw new Error("Fout bij ophalen...")
        return await response.json();
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

/**
 * Functie die een een zogenaamd donut-diagram genereert
 * @param centra - De centra waarvoor er data is aangeleverd
 * @param data - De data met daarin het aantal protocollen per centrum
 * @param id - Het HTML id van de chart
 * */
function renderProtocolPercentages(centra, data, id) {
    options = {
        chart: {
            type: 'donut',
            height: 350
        },
        series: data,
        labels: centra,
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: true,
                        name: {
                            show: true
                        },
                        value: {
                            show: true
                        },
                        total: {
                            show: true
                        }
                    }
                }
            }
        }
    }
    chartInstance = new ApexCharts(document.querySelector(`#${id}`), options);
    chartInstance.render();
}

/**
 * Functie die data omzet naar bruikbare data voor de donut-chart
 * @param url - De URL waar de JSON output vandaan wordt gehaald
 * @param id - Het HTML id van de chart
 * */
async function laadProtocolCount(url, id) {
    const data = await laadJson(`http://localhost:8080/api/${url}`);
    const centra = [];
    const aantal = [];
    data.forEach(item => {
        centra.push(item[0]).toString();
        aantal.push(item[1]);
    });

    renderProtocolPercentages(centra, aantal, id);
}

/**
 * Functie die het verschil tussen twee datums berekent
 * @param datum1 - De eerste datum
 * @param datum2 - De tweede datum
 * @returns - Het verschil tussen de twee datums in dagen
 * */
function verschilDatums(datum1, datum2) {
    if(!datum1 || !datum2) {
        return 0;
    } else {
        const startDatum = new Date(datum1);
        const eindDatum = new Date(datum2);
        return (eindDatum - startDatum) / (1000 * 60 * 60 * 24);
    }
}

/**
 * Functie die de doorlooptijden van een bepaalde soort (Protocol of Centrum) en een bepaald type verzamelt
 * @param data - De data waar de doorlooptijden uit worden gehaald
 * @param type - Het type doorlooptijd
 * @param soort - De soort waarvoor de doorlooptijd wordt verzamelt. Protocol of Centrum
 * @returns - Data die de gemiddelde doorlooptijd per soort terug geeft. Gesorteerd op Protocol of Centrum
 * */
function doorlooptijdBerekenen(data, type, soort) {
    const doorlooptijden = {};

    data.forEach(item => {
        let key = soort;

        if (key === "centrum") {
            key = item.naamCentrum
        } else if (key === "protocol") {
            key = item.naamProtocol
        } else {
            return;
        }

        let verschil = 0;

        if (type === "aanvraag-accordering") {
            verschil = verschilDatums(item.datumAanvraag, item.datumAccordering);
        } else if (type === "aanvraag-eerste") {
            verschil = verschilDatums(item.datumAanvraag, item.datumEerste);
        } else if (type === "eerste-accordering") {
            verschil = verschilDatums(item.datumEerste, item.datumAccordering);
        } else {
            return;
        }

        if (!doorlooptijden[key]) {
            doorlooptijden[key] = [];
        }
        doorlooptijden[key].push(verschil)
    })

    return Object.entries(doorlooptijden)
        .sort(([A], [B]) => A.localeCompare(B))
        .map(([key, data]) => ({
            name: key,
            gemiddelde: data.reduce((a, b) => a + b, 0) / data.length
        }));

}

/**
 * Functie die een barchart genereert. Laat de gemiddelde of precieze doorlooptijd zien
 * @param id - Het HTML id van de barchart
 * @param data - De data voor de barchart
 * */
function chartRenderen(id, data) {
    document.querySelector(`#${id}`).innerHTML = "";
    const options = {
        series: [{
            name: "Gemiddelde doorlooptijd",
            data: data.map(item => Math.round(item.gemiddelde * 10) / 10)
        }],
        chart: {
            type: 'bar',
            height: 350
        },
        plotOptions: {
            bar: {
                horizontal: false,
                dataLabels: {
                    position: 'top'
                }
            }
        },
        categories: data.map(item => item.name),
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            offsetX: 40
        },
        xaxis: {
            categories: data.map(item => item.name)
        }
    }

    chartInstance = new ApexCharts(document.querySelector(`#${id}`), options);
    chartInstance.render();
}

/**
 * Controller functie die het genereren van de gemiddelde doorlooptijd grafieken aanstuurt
 * */
async function dataGemiddelde(){
    const data = await laadJson(`http://localhost:8080/api/protocollen/datums`);
    const types = [
        { type: "aanvraag-accordering", id: "gem-aanvraag-accordering" },
        { type: "aanvraag-eerste", id: "gem-aanvraag-eerste"},
        { type: "eerste-accordering", id: "gem-eerste-accordering"}
    ];

    types.forEach(({ type, id }) => {
        const doorlooptijden = doorlooptijdBerekenen(data, type, "centrum");
        chartRenderen(id, doorlooptijden);
    })
}

/**
 * Controller functie die het genereren van de doorlooptijd per protocol grafieken aanstuurt
 * */
async function dataDoorlooptijd() {
    let data = await laadJson(`http://localhost:8080/api/protocollen/datums`);
    data = data.filter(item => item.naamCentrum === geselecteerdCentrum)
    const types = [
        { type: "aanvraag-accordering", id: "aanvraag-accordering" },
        { type: "aanvraag-eerste", id: "aanvraag-eerste"},
        { type: "eerste-accordering", id: "eerste-accordering"}
    ];

    types.forEach(({ type, id }) => {
        const doorlooptijden = doorlooptijdBerekenen(data, type, "protocol");
        chartRenderen(id, doorlooptijden);
    })
}

/**
 * Functie die kaarten maakt om de doorlooptijd van een protocol in weer te geven
 * @param naamProtocol - De naam van het weer te geven protocol
 * @param doorlooptijd - De doorlooptijd die wordt weergegeven in de kaart
 * */
function makeCard({naamProtocol, doorlooptijd}) {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
        <div class="card-inner"> 
            <p class="text-primary">${naamProtocol}</p>
            <span class="material-icons-outlined text-blue">schedule</span>
        </div>
        <span class="text-primary font-weight-bold">${doorlooptijd} dagen</span>
    `;

    return card;
}

/**
 * Controller functie die het maken en vullen van de doorlooptijd kaarten aanstuurt
 * */
async function laadProtocolCards() {
    const data = await laadJson(`http://localhost:8080/api/protocollen/datums`);
    const dataCentrum = data.filter(item => item.naamCentrum === geselecteerdCentrum);

    const id = document.getElementById('centrum-cards');
    id.innerHTML = "";

    dataCentrum.forEach(item => {
        let eindDatum = item.datumAccordering;
        if (!eindDatum) {
            eindDatum = new Date().toISOString().split("T")[0];
        }
        const doorlooptijd = verschilDatums(item.datumAanvraag, eindDatum);
        const card = makeCard({
            naamProtocol: item.naamProtocol,
            doorlooptijd
        });
        id.appendChild(card);

    })

}

laadProtocolCount("protocollen/count", `percentage-protocollen`);
laadProtocolCount("protocollen/count/finished", `percentage-protocollen-afgerond`);
dataGemiddelde();

/**
 * Functie die een deel van het dashboard herlaadt
 * */
async function herlaadDashboard() {
    if (!geselecteerdCentrum) {
        return;
    }

    laadProtocolCards();
    dataDoorlooptijd();
}

