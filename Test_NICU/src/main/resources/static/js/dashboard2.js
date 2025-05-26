let geselecteerdCentrum = null;

function kleurenGenereren(aantal) {
    const kleuren = [];
    for (let i = 0; i < aantal; i++) {
        const kleur = Math.round((360 / aantal) * i);
        kleuren.push(`hsl(${kleur}, 70%, 50%`)
    }
    return kleuren;
}

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

function populateCentrumDropdown(centra) {
    const select = document.getElementById("centrumSelect")

    select.innerHTML = '<option value="" disabled selected>-- Selecteer een centrum --</option>';

    centra.forEach(naam => {
        const option = document.createElement("option");
        option.value = naam;
        option.textContent = naam;
        select.appendChild(option);
    });

    select.addEventListener("change", (e) => {
        geselecteerdCentrum = e.target.value;
        console.log("Geselecteerde centrum: ", geselecteerdCentrum);
        herlaadDashboard();
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const data = await laadJson(`http://localhost:8080/api/studie/centra`);
        populateCentrumDropdown(data);
    } catch (error) {
        console.error("Fout bij ophalen centra: ", error);
    }
});

async function laadGroupedBar() {
    const centra = await laadJson(`http://localhost:8080/api/studie/centra`);
    const studies = await laadJson(`http://localhost:8080/api/studie/studies`);
    const data = await laadJson(`http://localhost:8080/api/studie/doorlooptijden`);

    const series = centra.map(centrum => {
        return {
            name: centrum,
            data: studies.map(studie => {
                const item = data.find(d => d.studie === studie && d.centrum === centrum);
                if (!item) return 0;
                return verschilDatum(item.startdatum, item.initiatiedatum);
            })
        }
    })
    console.log("Series: ", series);

    const groupedBarChart = {
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
            categories: studies
        },
        colors: kleurenGenereren(centra.length),
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            offsetX: 40
        }
    };
    groupedBarChartInstance = new ApexCharts(document.querySelector("#grouped-bar-chart"), groupedBarChart);
    groupedBarChartInstance.render();
}

laadGroupedBar();

function verzamelDoorlooptijdSoort(data, soort) {
    const start = `start${soort}`;
    const eind = `eind${soort}`;
    const groepen = {};

    data.forEach(item => {
        const studie = item.studie;
        const verschil = verschilDatum(item[start], item[eind]);

        if (verschil !== 0) {
            if (!groepen[studie]) {
                groepen[studie] = [];
            }
            groepen[studie].push(verschil);
        }
    });
    return Object.entries(groepen)
        .sort(([A], [B]) => A.localeCompare(B))
        .map(([studie, waardes]) => ({
            studie, gemiddelde: waardes.reduce((a, b) => a + b, 0) / waardes.length
        }));
}

function chartRenderen(id, data, studieData = null, kleur, soort) {
    const series =[{
        data: data.map(d => Math.round(d.gemiddelde * 10) / 10),
        name: `Gemmiddelde doorlooptijd ${soort}`
    }];

    if (studieData) {
        series.push({
            data: studieData,
            name: `Doorlooptijd ${soort} ${geselecteerdCentrum}`
        });
        document.querySelector(`#${id}`).innerHTML = "";
    }

    const xas = data.map(d => d.studie);

    const options = {
        series: series,
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
        colors: studieData ? ["#69e2e7", kleur] : [kleur]
    }
    chartInstance = new ApexCharts(document.querySelector(`#${id}`), options);
    chartInstance.render();
}

async function laadDoorlooptijdGrafieken(toonStudieData = false , studies) {
    const data = await laadJson(`http://localhost:8080/api/studie/doorlooptijden`);
    const studieData = toonStudieData ? await verzamelDoorlooptijden(studies) : null;

    const soorten = ['Juridisch', 'Apotheek', 'METC', 'Lab'];
    const kleuren = {
        Juridisch: "#008FFB",
        Apotheek: "#00E396",
        METC: "#FEB019",
        Lab: "#FF4560"
    };
    soorten.forEach(soort => {
        const gemiddelden = verzamelDoorlooptijdSoort(data, soort);
        const kleur = kleuren[soort];
        const id = toonStudieData ? `chart-${soort}` : `gem-chart-${soort}`;
        chartRenderen(id, gemiddelden, studieData ? studieData[soort.toLowerCase()] : null, kleur, soort);
    })
}

laadDoorlooptijdGrafieken(false, "");

function kaartenMaken(studies) {
    const id = document.getElementById("study-cards");
    if (!id) return;

    id.innerHTML = "";

    studies.forEach(studie => {
        const card = document.createElement("card");
        card.className = "card";
        card.innerHTML = `
            <div class="card-inner">
                <p class="text-primary">${studie}</p>
                <span class="material-icons-outlined text-blue">child_care</span>
            </div>
            <span id="aantal-${studie}" class="text-primary font-weight-bold">Laden...</span>
    `;

    id.appendChild(card);
    })
}

async function laadDataInclusie(naamStudie, naamCentrum) {
    try {
        const data = await laadJson(`http://localhost:8080/api/aantal_geincludeerd/${naamStudie}/${naamCentrum}`);
        document.getElementById(`aantal-${naamStudie}`).textContent = (data && data.length > 0) ? data : "0";
    } catch (error) {
        console.log(`Fout bij ophalen data`, error.message);
        document.getElementById(`aantal-${naamStudie}`).textContent = "0";
    }
}

async function verzamelDoorlooptijden(studies) {
    let juridisch = [];
    let apotheek = [];
    let metc = [];
    let lab = [];

    for (const studie of studies) {
        try {
            const data = await laadJson(`http://localhost:8080/api/studie/${studie}/${geselecteerdCentrum}`);
            const studieData = (data && data.length > 0) ? data[0] : {};
            juridisch.push(verschilDatum(studieData.juridisch_start, studieData.juridisch_eind));
            apotheek.push(verschilDatum(studieData.apotheek_start, studieData.apotheek_eind));
            metc.push(verschilDatum(studieData.metc_start, studieData.metc_eind));
            lab.push(verschilDatum(studieData.lab_start, studieData.lab_eind));
        } catch (error) {
            console.warn(`Geen data voor deze studie '${studie}' beschikbaar`)
            console.log("Geselecteerde velden: ", studie, geselecteerdCentrum);
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

function verschilDatum(datum1, datum2) {
    if (!datum1 || !datum2) {
        return 0;
    } else {
        const startDatum = new Date(datum1);
        const eindDatum = new Date(datum2);
        return (eindDatum - startDatum) / (1000 * 60 * 60 * 24);
    }
}

function stackedBarChart(doorlooptijden, studies) {

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
            categories: studies,
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

async function herlaadDashboard() {
    if (!geselecteerdCentrum) return;
    let studies = await laadJson(`http://localhost:8080/api/studie/${geselecteerdCentrum}/studies`);
    console.log("Gekozen studies: ", studies);
    kaartenMaken(studies);

    studies.forEach(studie => {
        laadDataInclusie(studie, geselecteerdCentrum);
    })

    verzamelDoorlooptijden(studies).then((doorlooptijden) => {
        stackedBarChart(doorlooptijden, studies);
    });

    laadJson(`http://localhost:8080/api/aantal_geincludeerd/chart/inclusies/centrum/${geselecteerdCentrum}`).then((data) => {
        const series = studies.map(studie => {
            console.log("Data: ", data);
            const studieData = data.filter(item => item.naamStudie === studie);
            const eersteDatum = new Date(Math.min(...studieData.map(item => new Date(item.datum))));
            return {
                name: studie,
                data: studieData.map(item => ({
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
            colors: kleurenGenereren(studies.length),
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

        laadDoorlooptijdGrafieken(true, studies);
    });
}