
// POGING TOT DYNAMISCHE DATA

function getMostRecentInclusion(studie, centrum) {

}

let stackedBarChartInstance = null;

// ---------- KLEUREN GENEREREN -----------

function kleurenGenereren(aantal) {
    const kleuren = [];
    for (let i = 0; i < aantal; i++) {
        const kleur = Math.round((360 / aantal) * i);
        kleuren.push(`hsl(${kleur}, 70%, 50%`)
    }
    return kleuren;
}


// POGING TOT STACKED BAR CHART

function stackedBarChart(doorlooptijden) {
    if (stackedBarChartInstance) {
        stackedBarChartInstance.destroy();
    }
    document.querySelector("#stacked-bar-chart").innerHTML = "";


    var stackedBarChartOptions = {
        series: [{
            name: 'Juridisch',
            data: doorlooptijden.juridisch
        }, {
            name: 'Apotheek',
            data: doorlooptijden.apotheek
        }, {
            name: 'METC',
            data: doorlooptijden.metc
        }, {
            name: 'Laboratorium',
            data: doorlooptijden.lab
        }],
        chart: {
            type: 'bar',
            height: 350,
            stacked: true,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                dataLabels: {
                    total: {
                        enabled: true,
                        offsetX: 0,
                        style: {
                            fontSize: '13px',
                            fontWeight: 900
                        }
                    }
                }
            },
        },
        stroke: {
            width: 1,
            colors: ['#fff']
        },
        xaxis: {
            categories: centra,
            labels: {
                formatter: function (val) {
                    return val
                }
            }
        },
        yaxis: {
            title: {
                text: undefined
            },
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val
                }
            }
        },
        fill: {
            opacity: 1
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            offsetX: 40
        }
    };

    stackedBarChartInstance = new ApexCharts(document.querySelector("#stacked-bar-chart"), stackedBarChartOptions);
    stackedBarChartInstance.render();
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

async function laadDataInclusie(naamStudie, naamCentrum, ID) {
    try {
        const studie = naamStudie;
        const centrum = naamCentrum;
        const url = `http://localhost:8080/api/aantal_geincludeerd/${studie}/${centrum}`;
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 404) {
                console.warn(`Geen data voor ${naamStudie} - ${naamCentrum}`);
                document.getElementById(ID).textContent = "0";
            }
            throw new Error(`Fout bij ophalen (status: ${response.status}`);
        }

        const data = await response.json();
        if (!data || data.length === 0) {
            document.getElementById(ID).textContent = "0";
        } else {
            document.getElementById(ID).textContent = data;
        }
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
            const data = await laadDataStudie(geselecteerdeStudie, centrum);
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

async function laadDataStudie(naamStudie, naamCentrum) {
    try {
        const studie = naamStudie;
        const centrum = naamCentrum;
        const url = `http://localhost:8080/api/studie/${studie}/${centrum}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Fout bij ophalen...")

        const data = await response.json();
        return data;
    } catch (error) {
        alert("Fout bij ophalen: " + error.message);
        console.log(error.message);
    }
}

async function laadGroupedBar() {
    const response = await fetch(`http://localhost:8080/api/studie/studies`);
    if (!response.ok) throw new Error("Fout bij ophalen...")
    const studies = await response.json();

    const response2 = await fetch(`http://localhost:8080/api/studie/doorlooptijden`)
    if (!response2.ok) throw new Error("Fout bij ophalen...")
    const data = await response2.json()

    const series = studies.map(studie => {
        return {
            name: studie,
            data: centra.map(centrum => {
                const item = data.find(d => d.centrum === centrum && d.studie === studie);
            console.log("Studie:", studie, "Centrum:", centrum);
            console.log("Gevonden item:", item);
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
                    position: 'top',
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



const centra = ["AUMC", "EMCR", "ISALA", "LUMC", "MMC", "MUMC", "RUMC", "UMCG", "WKZ"];
let geselecteerdeStudie = null;

// laadDataInclusie(geselecteerdeStudie, "AUMC", "aantal-aumc");
// laadDataInclusie(geselecteerdeStudie, "EMCR", "aantal-emcr");
// laadDataInclusie(geselecteerdeStudie, "ISALA", "aantal-isala");
// laadDataInclusie(geselecteerdeStudie, "LUMC", "aantal-lumc");
// laadDataInclusie(geselecteerdeStudie, "MMC", "aantal-mmc");
// laadDataInclusie(geselecteerdeStudie, "MUMC", "aantal-mumc");
// laadDataInclusie(geselecteerdeStudie, "RUMC", "aantal-rumc");
// laadDataInclusie(geselecteerdeStudie, "UMCG", "aantal-umcg");
// laadDataInclusie(geselecteerdeStudie, "WKZ", "aantal-wkz");

// verzamelDoorlooptijden().then((doorlooptijden) => {
//     stackedBarChart(doorlooptijden);
// });

async function laadInclusionChart(naamStudie) {
    try {
        const url = `http://localhost:8080/api/aantal_geincludeerd/chart/inclusies/studie/${naamStudie}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Fout bij ophalen...")

        return await response.json();
    } catch (error) {
        alert("Fout bij ophalen: " + error.message);
        console.log(error.message);
    }
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

document.addEventListener("DOMContentLoaded", () => {
    fetch(`http://localhost:8080/api/studie/studies`)
        .then(response => response.json())
        .then(data => {
            populateStudieDropdown(data);
        })
        .catch(error => {
            console.error("Fout bij ophalen studies: ", error);
        });
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
        const response = await fetch(`http://localhost:8080/api/studie/initiatiedatum/${studie}`);
        if (!response.ok) throw new Error("Fout bij ophalen data...")
        let deelnemendeCentra = 0;
        const serie = [];
        const data = await response.json();
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

    verzamelDoorlooptijden().then((doorlooptijden) => {
        stackedBarChart(doorlooptijden);
    });

    laadInclusionChart(geselecteerdeStudie).then((data) => {
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

    laadInclusionChart(geselecteerdeStudie).then((data) => {
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

    laadInclusionChart(geselecteerdeStudie).then(async (data) => {
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


}



console.log("Script werkt! ");
