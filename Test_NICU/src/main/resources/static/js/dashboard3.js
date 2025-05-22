let geselecteerdCentrum = null;

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

async function laadProtocolCount(url, id) {
    const response = await fetch(`http://localhost:8080/api/${url}`);
    if (!response.ok) throw new Error("Fout bij ophalen...")

    const data = await response.json();
    const centra = [];
    const aantal = [];
    data.forEach(item => {
        centra.push(item[0]).toString();
        aantal.push(item[1]);
    });

    renderProtocolPercentages(centra, aantal, id);
}


function verschilDatums(datum1, datum2) {
    if(!datum1 || !datum2) {
        return 0;
    } else {
        const startDatum = new Date(datum1);
        const eindDatum = new Date(datum2);
        return (eindDatum - startDatum) / (1000 * 60 * 60 * 24);
    }
}

function doorlooptijdBerekenen(data, type, soort) {
    const doorlooptijden = {};

    data.forEach(item => {
        const centrum = item.naamCentrum;
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

function chartRenderen(id, data) {
    document.querySelector(`#${id}`).innerHTML = "";
    const options = {
        series: [{
            name: "Gemiddelde doorlooptijd",
            data: data.map(d => Math.round(d.gemiddelde * 10) / 10)
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
        categories: data.map(d => d.name),
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            offsetX: 40
        },
        xaxis: {
            categories: data.map(d => d.name)
        }
    }

    chartInstance = new ApexCharts(document.querySelector(`#${id}`), options);
    chartInstance.render();
}

async function dataGemiddelde(){
    const response = await fetch(`http://localhost:8080/api/protocollen/datums`);
    if (!response.ok) throw new Error("Fout bij ophalen...");

    const data = await response.json();
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

async function dataDoorlooptijd() {
    const response = await fetch(`http://localhost:8080/api/protocollen/datums`);
    if (!response.ok) throw new Error("Fout bij ophalen...");

    let data = await response.json();
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

async function laadProtocolCards() {
    const response = await fetch(`http://localhost:8080/api/protocollen/datums`);
    if (!response.ok) throw new Error("Fout bij ophalen...");
    const data = await response.json();
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

async function herlaadDashboard() {
    if (!geselecteerdCentrum) {
        return;
    }

    laadProtocolCards();
    dataDoorlooptijd();
}

