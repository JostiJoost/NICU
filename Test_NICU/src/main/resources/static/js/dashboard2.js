let geselecteerdCentrum = null;

function kleurenGenereren(aantal) {
    const kleuren = [];
    for (let i = 0; i < aantal; i++) {
        const kleur = Math.round((360 / aantal) * i);
        kleuren.push(`hsl(${kleur}, 70%, 50%`)
    }
    return kleuren;
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

async function laadStudies(naamCentrum) {
    try {
        const respons = await fetch(`http://localhost:8080/api/studie/${naamCentrum}/studies`)
        if (!respons.ok) throw new Error("Fout bij ophalen...")

        return await respons.json();
    } catch (error) {
        alert("Fout bij ophalen: " + error.message);
        console.log(error.message);
    }
}

function kaartenMaken(studies) {
    const container = document.getElementById("study-cards");
    if (!container) return;

    container.innerHTML = "";

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

    container.appendChild(card);
    })
}

async function laadDataInclusie(naamStudie, naamCentrum) {
    try {
        const url = `http://localhost:8080/api/aantal_geincludeerd/${naamStudie}/${naamCentrum}`;
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 404) {
                console.warn(`Geen data voor ${naamCentrum} - ${naamStudie}`);
                document.getElementById(`aantal-${naamStudie}`).textContent = "0";
            }
            throw new Error(`Fout bij ophalen (status: ${response.status}`);
        }

        const data = await response.json();
        if (!data || data.length === 0) {
            document.getElementById(`aantal-${naamStudie}`).textContent = "0";
        } else {
            document.getElementById(`aantal-${naamStudie}`).textContent = data;
        }
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
            const data = await laadDataStudie(studie, geselecteerdCentrum);
            const studieData = (data && data.length > 0) ? data[0] : {};
            console.log("Geselecteerde velden: ", studieData, geselecteerdCentrum);
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

async function laadDataStudie(naamStudie, naamCentrum) {
    try {
        const url = `http://localhost:8080/api/studie/${naamStudie}/${naamCentrum}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Fout bij ophalen...")

        const data = await response.json();
        return data;
    } catch (error) {
        alert("Fout bij ophalen: " + error.message);
        console.log(error.message);
    }
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

async function laadInclusionChart(naamCentrum) {
    try {
        const url = `http://localhost:8080/api/aantal_geincludeerd/chart/inclusies/centrum/${naamCentrum}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Fout bij ophalen...")

        return await response.json();
    } catch (error) {
        alert("Fout bij ophalen: " + error.message);
        console.log(error.message);
    }
}

async function herlaadDashboard() {
    if (!geselecteerdCentrum) return;
    let studies = await laadStudies(geselecteerdCentrum);
    console.log("Gekozen studies: ", studies);
    kaartenMaken(studies);

    studies.forEach(studie => {
        laadDataInclusie(studie, geselecteerdCentrum);
    })

    verzamelDoorlooptijden(studies).then((doorlooptijden) => {
        stackedBarChart(doorlooptijden, studies);
    });

    laadInclusionChart(geselecteerdCentrum).then((data) => {
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
    });


}