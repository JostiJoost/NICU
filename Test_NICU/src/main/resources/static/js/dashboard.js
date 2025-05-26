const centra = ["AUMC", "EMCR", "ISALA", "LUMC", "MMC", "MUMC", "RUMC", "UMCG", "WKZ"];
let geselecteerdeStudie = null;
// ---------- KLEUREN GENEREREN -----------

function kleurenGenereren(aantal) {
    const kleuren = [];
    for (let i = 0; i < aantal; i++) {
        const kleur = Math.round((360 / aantal) * i);
        kleuren.push(`hsl(${kleur}, 70%, 50%`)
    }
    return kleuren;
}

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

async function laadJson(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Fout bij ophalen...");
        return await response.json();
    } catch (error) {
        console.error(error.message);
    }
}

async function laadDataInclusie(naamStudie, naamCentrum, ID) {
    try {
        const data = await laadJson(`http://localhost:8080/api/aantal_geincludeerd/${naamStudie}/${naamCentrum}`);
        document.getElementById(ID).textContent = (data && data.length > 0) ? data : "0";
    } catch (error) {
        console.log(`Fout bij ophalen data`, error.message);
        document.getElementById(ID).textContent = "0";
    }
}

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

function chartRenderen(id, titel, data, kleur) {
    const series = data.map(d => Math.round(d.gemiddelde * 10) / 10);
    const xas = data.map(d => d.centrum);

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
    const ID = `#gem-chart-${id}`;
    chartInstance = new ApexCharts(document.querySelector(`#gem-chart-${id}`), options);
    chartInstance.render();
}

async function gemiddeldeGrafieken() {
    const data = await laadJson(`http://localhost:8080/api/studie/doorlooptijden`);

    const soorten = ['Juridisch', 'Apotheek', 'METC', 'Lab'];
    const kleuren = ["#008FFB", "#00E396", "#FEB019", "#FF4560"];
    let i = 0;
    soorten.forEach(soort => {
        const gemiddelden = verzamelDoorlooptijdSoort(data, soort);
        chartRenderen(soort, `Gemiddelde doorlooptijd - ${soort}`, gemiddelden, kleuren[i]);
        i++;
    });
}

function doorloopRenderen(soort, titel, gemiddelde, studie, kleur) {
    const series = gemiddelde.map(d => Math.round(d.gemiddelde * 10) / 10);
    const xas = gemiddelde.map(d => d.centrum);

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

async function grafieken() {
    const data = await laadJson(`http://localhost:8080/api/studie/doorlooptijden`);
    const studieData = await verzamelDoorlooptijden();
    const soorten = ['Juridisch', 'Apotheek', 'METC', 'Lab'];
    const kleuren = ["#008FFB", "#00E396", "#FEB019", "#FF4560"];
    let i = 0;
    soorten.forEach(soort => {
        const gemiddelden = verzamelDoorlooptijdSoort(data, soort);
        doorloopRenderen(soort, `Doorlooptijd ${soort} per centrum`, gemiddelden, studieData[soort.toLowerCase()], kleuren[i]);
        i++;
    })

}

gemiddeldeGrafieken();


async function laadGroupedBar() {
    const studies = await laadJson(`http://localhost:8080/api/studie/studies`);
    const data = await laadJson(`http://localhost:8080/api/studie/doorlooptijden`);

    const series = studies.map(studie => {
        return {
            name: studie,
            data: centra.map(centrum => {
                const item = data.find(d => d.centrum === centrum && d.studie === studie);
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

function totaleDoorlooptijdBerekenen(data) {
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
            const entryOpDatum = centrumData.find(d => d.datum === datum);
            if (entryOpDatum) {
                laatsteWaarde[centrum] = entryOpDatum.geincludeerd;
            }
        }

        const totaal = Object.values(laatsteWaarde).reduce((a, b) => a + b, 0);
        serie.push({ x: datum, y: totaal});
    }
    return serie;
}

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
        const serie = totaleDoorlooptijdBerekenen(data);
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