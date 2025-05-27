/**
 * ---------- DASHBOARD PER STUDIE ----------
 * Dit dashboard geeft de gebruiker inzichten voor alle centra. Daarnaast kan er een keuze worden gemaakt voor één
 * studie.
 * @author Joost Goddijn
 * @version 1.10, 26-05-2025
 * @since 14-05-2025
 * */

const centra = ["AUMC", "EMCR", "ISALA", "LUMC", "MMC", "MUMC", "RUMC", "UMCG", "WKZ"];

let geselecteerdeStudie = null;

/**
 * Functie om kleuren te generen. Kleuren worden gelijkwaardig verdeeld over de kleuren schaal. Wordt gebruikt voor
 * het geven aan kleur van grafieken die een variabele lengte kunnen hebben. Bijvoorbeeld aantal studies
 * @param aantal - Het aantal kleuren dat moet worden gegenereerd
 * @returns - De lijst met kleurcodes
 * */
function kleurenGenereren(aantal) {
    const kleuren = [];
    for (let i = 0; i < aantal; i++) {
        const kleur = Math.round((360 / aantal) * i);
        kleuren.push(`hsl(${kleur}, 70%, 50%`)
    }
    return kleuren;
}

/**
 * Functie die het verschil tussen twee datums berekend in dagen
 * @param datum1 - De eerste datum
 * @param datum2 - De tweede datum
 * @returns - Het verschil tussen de twee datums in dagen
 * */
function verschilDatum(datum1, datum2) {
    if (!datum1 || !datum2) {
        return 0;
    } else {
        const startDatum = new Date(datum1);
        const eindDatum = new Date(datum2);
        const verschil = (eindDatum - startDatum) / (1000 * 60 * 60 * 24);
        return verschil;
    }
}

/**
 * Functie die JSON output ophaald aan de hand van een URL
 * @param url - De URL waar de JSON output te vinden is
 * @returns - De JSON output
 * */
async function laadJson(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Fout bij ophalen...");
        return await response.json();
    } catch (error) {
        console.error(error.message);
    }
}

/**
 * Functie die het meest recente aantal inclusies van een bepaald centrum voor een bepaalde studie in het dashboard zet
 * @param naamStudie - De studie waarvan de inclusies worden opgezocht
 * @param naamCentrum - Het centrum waarvan de inclusies worden opgezocht
 * @param ID - Het HTML id van de card waarin het aantal inclusies wordt getoond
 * */
async function laadDataInclusie(naamStudie, naamCentrum, ID) {
    try {
        const data = await laadJson(`http://localhost:8080/api/aantal_geincludeerd/${naamStudie}/${naamCentrum}`);
        document.getElementById(ID).textContent = (data && data.length > 0) ? data : "0";
    } catch (error) {
        console.log(`Fout bij ophalen data`, error.message);
        document.getElementById(ID).textContent = "0";
    }
}

/**
 * Functie die voor alle centra, alle soorten doorlooptijden ophaalt van een geselecteerde studie
 * @returns - De doorlooptijden van elk centrum van de geselecteerde studie per soort
 * */
async function verzamelDoorlooptijden() {
    let juridisch = [];
    let apotheek = [];
    let metc = [];
    let lab = [];

    for (const centrum of centra) {
        try {
            const data = await laadJson(`http://localhost:8080/api/studie/${geselecteerdeStudie}/${centrum}`);
            const studie = (data && data.length > 0) ? data[0] : {};

            juridisch.push(verschilDatum(studie.juridisch_start, studie.juridisch_eind));
            apotheek.push(verschilDatum(studie.apotheek_start, studie.apotheek_eind));
            metc.push(verschilDatum(studie.metc_start, studie.metc_eind));
            lab.push(verschilDatum(studie.lab_start, studie.lab_eind));
        } catch (error) {
            console.warn(`Geen data voor dit centrum '${centrum}' beschikbaar`)
            juridisch.push(0);
            apotheek.push(0);
            metc.push(0);
            lab.push(0);
        }
    }
    return {
        juridisch: juridisch,
        apotheek: apotheek,
        metc: metc,
        lab: lab
    };
}

/**
 * Verzamelt gemiddelde doorlooptijden voor elk centrum van een bepaalde doorlooptijd soort
 * @param data - De data waarover de gemiddeldes worden berekent
 * @param soort - De soort doorlooptijd waarover het gemiddelde wordt berekent
 * @returns - Alle gemiddelde doorlooptijden van de gegeven soort per centrum. Op alfabetische volgorde van centrum
 * */
function verzamelDoorlooptijdSoort(data, soort) {
    const start = `start${soort}`;
    const eind = `eind${soort}`;
    const groepen = {};

    data.forEach(item => {
        const centrum = item.centrum;
        const verschil = verschilDatum(item[start], item[eind]);

        if (verschil !== 0) {
            if (!groepen[centrum]) {
                groepen[centrum] = [];
            }
            groepen[centrum].push(verschil);
        }
    });
    return Object.entries(groepen)
        .sort(([A], [B]) => A.localeCompare(B))
        .map(([centrum, waardes]) => ({
        centrum, gemiddelde: waardes.reduce((a, b) => a + b, 0) / waardes.length
    }));
}

/**
 * Rendert een bar chart van de gemiddelde doorlooptijd per soort
 * @param id - Het HTML id van de chart
 * @param data - De data die de chart weergeeft
 * @param kleur - De kleuren van de chart
 * */
function chartRenderen(id, data, kleur) {
    const series = data.map(item => Math.round(item.gemiddelde * 10) / 10);
    const xas = data.map(item => item.centrum);

    const options = {
        series: [{
            data: series
        }],
        chart: {
            type: 'bar',
            height: 350
        },
        plotOptions: {
            bar: {
                horizontal: false
            }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            offsetX: 40
        },
        xaxis: {
            categories: xas
        },
        colors: [`${kleur}`]
    }
    chartInstance = new ApexCharts(document.querySelector(`#gem-chart-${id}`), options);
    chartInstance.render();
}

/**
 * Controller functie die het maken van de gemiddelde doorlooptijd grafiek aanstuurt
 * */
async function gemiddeldeGrafieken() {
    const data = await laadJson(`http://localhost:8080/api/studie/doorlooptijden`);

    const soorten = ['Juridisch', 'Apotheek', 'METC', 'Lab'];
    const kleuren = ["#008FFB", "#00E396", "#FEB019", "#FF4560"];
    let i = 0;
    soorten.forEach(soort => {
        const gemiddelden = verzamelDoorlooptijdSoort(data, soort);
        chartRenderen(soort, gemiddelden, kleuren[i]);
        i++;
    });
}

/**
 * Functie die de doorlooptijd per soort barchart genereert
 * @param soort - De soort doorlooptijd die wordt gerendert
 * @param gemiddelde - De data van de gemiddelde doorlooptijd
 * @param studie - De data van de studie specifieke doorlooptijd
 * @param kleur - De kleuren van de barchart
 * */
function doorloopRenderen(soort, gemiddelde, studie, kleur) {
    const series = gemiddelde.map(item => Math.round(item.gemiddelde * 10) / 10);
    const xas = gemiddelde.map(item => item.centrum);

    const ID = `#chart-${soort}`;
    document.querySelector(ID).innerHTML = "";
    const options = {
        series: [{
            data: series,
            name: `gemiddelde doorlooptijd ${soort}`
        }, {
            data: studie,
            name: `doorlooptijd ${soort} ${geselecteerdeStudie}`
        }],
        chart: {
            type: 'bar',
            height: 350
        },
        plotOptions: {
            bar: {
                horizontal: false
            }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            offsetX: 40
        },
        xaxis: {
            categories: xas
        },
        colors: ["#69d2e7", `${kleur}`]
    }
    chartInstance = new ApexCharts(document.querySelector(ID), options);
    chartInstance.render();
}

/**
 * Controller functie die het maken van de barcharts per soort per studie aanstuurt
 * */
async function grafieken() {
    const data = await laadJson(`http://localhost:8080/api/studie/doorlooptijden`);
    const studieData = await verzamelDoorlooptijden();
    const soorten = ['Juridisch', 'Apotheek', 'METC', 'Lab'];
    const kleuren = ["#008FFB", "#00E396", "#FEB019", "#FF4560"];
    let i = 0;
    soorten.forEach(soort => {
        const gemiddelden = verzamelDoorlooptijdSoort(data, soort);
        doorloopRenderen(soort, gemiddelden, studieData[soort.toLowerCase()], kleuren[i]);
        i++;
    })

}

gemiddeldeGrafieken();

/**
 * Functie die een grouped-barchart genereert waarin voor elk centrum voor elke studie de doorlooptijd staat
 * */
async function laadGroupedBar() {
    const studies = await laadJson(`http://localhost:8080/api/studie/studies`);
    const data = await laadJson(`http://localhost:8080/api/studie/doorlooptijden`);

    const series = studies.map(studie => {
        return {
            name: studie,
            data: centra.map(centrum => {
                const item = data.find(i => i.centrum === centrum && i.studie === studie);
                if (!item) return 0;
                return verschilDatum(item.startdatum, item.initiatiedatum);
            })
        }
    })

    var groupedBarChart = new ApexCharts(document.querySelector("#grouped-bar-chart"), {
        series: series,
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
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: centra
        },
        colors: kleurenGenereren(studies.length),
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            offsetX: 40
        }
    });
    groupedBarChart.render()
}

/**
 * Functie die het dropdown keuze menu vult om een keuze voor een studie te maken
 * @param studies - De studies die in het dropdown menu moeten komen
 * */
function populateStudieDropdown(studies) {
    const select = document.getElementById("studieSelect")

    select.innerHTML = '<option value="" disabled selected>-- Selecteer een studie --</option>';

    studies.forEach(naam => {
        const option = document.createElement("option");
        option.value = naam;
        option.textContent = naam;
        select.appendChild(option);
    });

    select.addEventListener("change", (e) => {
        geselecteerdeStudie = e.target.value;
        console.log("Geselecteerde studie: ", geselecteerdeStudie);
        herlaadDashboard();
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const data = await laadJson(`http://localhost:8080/api/studie/studies`);
        populateStudieDropdown(data);
    } catch (error) {
        console.error("Fout bij ophalen studies: ", error);
    }
});

/**
 * Functie die data aanlevert voor de grafiek die het totale aantal inclusies door de tijd laat zien
 * @param data - De data waarover de cumulatieve inclusie door de tijd wordt verzameld
 * @returns - Een lijst met datums en totale aantal inclusies op die datum. Gesorteerd op datum
 * */
function inclusiesCumulatief(data) {
    const datums = [...new Set(data.map(item => item.datum))]
        .sort((a, b) => new Date(a) - new Date(b));
    const centraData = [...new Set(data.map(item => item.naamCentrum))];

    const dataPerCentrum = {};
    for (const centrum of centraData) {
        dataPerCentrum[centrum] = data
            .filter(item => item.naamCentrum === centrum)
            .sort((a, b) => new Date(a.datum) - new Date(b.datum));
    }

    const laatsteWaarde = {};
    const serie = [];

    for (const datum of datums) {
        for (const centrum of centraData) {
            const centrumData = dataPerCentrum[centrum];
            const entryOpDatum = centrumData.find(item => item.datum === datum);
            if (entryOpDatum) {
                laatsteWaarde[centrum] = entryOpDatum.geincludeerd;
            }
        }

        const totaal = Object.values(laatsteWaarde).reduce((a, b) => a + b, 0);
        serie.push({ x: datum, y: totaal});
    }
    return serie;
}

/**
 * Functie die data aanlevert voor de grafiek die laat zien hoeveel centra actief deelnemen aan een studie
 * op een bepaald moment in de tijd
 * @param studie - De studie waarvoor de data wordt aangeleverd
 * @returns - een lijst met datums en het aantal deelnemende centra op die datum
 * */
async function laadInitiatiedatum(studie) {
    try {
        let deelnemendeCentra = 0;
        const serie = [];
        const data = await laadJson(`http://localhost:8080/api/studie/initiatiedatum/${studie}`);
        for (const datum of data) {
            deelnemendeCentra++;
            serie.push({ x: datum, y: deelnemendeCentra});
        }

        return serie;
    } catch (error) {
        alert("Fout bij ophalen: " + error.message);
        console.log(error.message);
    }
}

laadGroupedBar();

/**
 * Functie om elementen uit het dashboard opnieuw te laden. Daarnaast worden er in deze functie ook enkele
 * grafieken gegenereerd
 * */
async function herlaadDashboard() {
    if(!geselecteerdeStudie) return;
    centra.forEach(centrum => {
        const id = `aantal-${centrum.toLocaleLowerCase()}`;
        laadDataInclusie(geselecteerdeStudie, centrum, id);
    });

    document.querySelector("#stacked-bar-chart").innerHTML = "";
    verzamelDoorlooptijden().then((doorlooptijden) => {
        stackedBarChart(doorlooptijden);
    });

    laadJson(`http://localhost:8080/api/aantal_geincludeerd/chart/inclusies/studie/${geselecteerdeStudie}`).then((data) => {
        const centra = [...new Set(data.map(item => item.naamCentrum))];
        const series = centra.map(centrum => ({
            name: centrum,
            data: data
                .filter(item => item.naamCentrum === centrum)
                .map(item => ({
                    x: item.datum,
                    y: item.geincludeerd
                }))
        }));

        document.querySelector("#line-chart").innerHTML = "";
        var lineChart = new ApexCharts(document.querySelector("#line-chart"), {
            series: series,
            chart: { height: 350, type: 'line', toolbar: { show: false } },
            colors: kleurenGenereren(centra.length),
            dataLabels: { enabled: false },
            stroke: {
                curve: 'smooth',
                width: 2
            },
            xaxis: { type: 'datetime' },
            tooltip: { shared: true, intersect: false }
        });
        lineChart.render();
    });

    laadJson(`http://localhost:8080/api/aantal_geincludeerd/chart/inclusies/studie/${geselecteerdeStudie}`).then((data) => {
        const centra = [...new Set(data.map(item => item.naamCentrum))];
        const series = centra.map(centrum => {
            const centrumData = data.filter(item => item.naamCentrum === centrum);
            const eersteDatum = new Date(Math.min(...centrumData.map(item => new Date(item.datum))));
            return {
                name: centrum,
                data: centrumData.map(item => ({
                    x: verschilDatum(eersteDatum, new Date(item.datum)),
                    y: item.geincludeerd
                }))
            };
        });

        document.querySelector("#line-chart-2").innerHTML = "";
        var lineChartRelatief = new ApexCharts(document.querySelector("#line-chart-2"), {
            series: series,
            chart: {
                height: 350,
                type: 'line',
                zoom: { enabled: true },
                toolbar: { show: false }
            },
            colors: kleurenGenereren(centra.length),
            dataLabels: { enabled: false },
            stroke: {
                curve: 'smooth',
                width: 2
            },
            xaxis: {
                type: 'numeric',
                title: { text: 'aantal dagen' },
                labels: {
                    formatter: function (val) {
                        return Math.round(val);
                    }
                },
                tickAmount: 10,
                forceNiceScale: true
            },
            tooltip: { shared: true, intersect: false }
        });
        lineChartRelatief.render();
    });

    document.querySelector("#totale-doorlooptijd").innerHTML = "";
    laadJson(`http://localhost:8080/api/aantal_geincludeerd/chart/inclusies/studie/${geselecteerdeStudie}`).then(async (data) => {
        const serie = inclusiesCumulatief(data);
        const serieDeelnemend = await laadInitiatiedatum(geselecteerdeStudie);
        console.log("serieDeelnemend: ", serieDeelnemend);
        const totaleDoorlooptijd = new ApexCharts(document.querySelector("#totale-doorlooptijd"), {
            series: [
                {
                    name: 'totale inclusie',
                    type: 'line',
                    data: serie,
                    yAxisIndex: 0
                },
                {
                    name: 'Aantal deelnemende centra',
                    type: 'line',
                    data: serieDeelnemend,
                    yAxisIndex: 1
                },
            ],
            chart: {
                height: 350,
                type: 'line',
                zoom: {enabled: true},
                toolbar: {show: false}
            },
            dataLabels: {enabled: false},
            stroke: {
                curve: 'smooth'
            },
            xaxis: {type: 'datetime'},
            yaxis: [
                {
                    title: {text: 'inclusies'},
                    opposite: false
                },
                {
                    title: {text: 'Aantal centra'},
                    opposite: true
                },
            ],
            tooltip: {shared: true, intersect: false}
        });
        totaleDoorlooptijd.render();

    })
    grafieken();
}

console.log("Script werkt! ");