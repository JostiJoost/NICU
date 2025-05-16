
// POGING TOT DYNAMISCHE DATA

function getMostRecentInclusion(studie, centrum) {

}

// ---------- KLEUREN GENEREREN -----------

function kleurenGenereren(aantal) {
    const kleuren = [];
    for (let i = 0; i < aantal; i++) {
        const kleur = Math.round((360 / aantal) * i);
        kleuren.push(`hsl(${kleur}, 70%, 50%`)
    }
    return kleuren;
}


// ---------- CHARTS ----------

// BAR CHART

var barChartOptions = {
    series: [{
        data: [10, 8, 6, 4, 2]
    }],
    chart: {
        type: 'bar',
        height: 350,
        toolbar: {
            show: false
        },
    },
    colors: [
        "#246dec",
        "#cc3c43",
        "#367952",
        "#f5b74f",
        "#4f35a1"
    ],
    plotOptions: {
        bar: {
            distributed: true,
            borderRadius: 4,
            borderRadiusApplication: 'end',
            horizontal: false,
            columnWidth: '40%',
        }
    },
    dataLabels: {
        enabled: false
    },
    legend: {
        show: false
    },
    xaxis: {
        categories: ["Laptop", "Phone", "Monitor", "Headphones", "Camera"],
    },
    yaxis: {
        title: {
            text: "Count"
        }
    }
};

var barChart = new ApexCharts(document.querySelector("#bar-chart"), barChartOptions);
barChart.render();

//AREA CHART

var areaChartOptions = {
    series: [{
        name: 'Purchase Orders',
        data: [31, 40, 28, 51, 42, 109, 100]
    }, {
        name: 'SalesOrders',
        data: [11, 32, 45, 32, 34, 52, 41]
    }],
    chart: {
        height: 350,
        type: 'area',
        toolbar: {
            show: false,
        },
    },
    colors: ["#4f35a1", "#246dec"],
    dataLabels: {
        enabled: false,
    },
    stroke: {
        curve: 'smooth'
    },

    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    markers: {
        size: 0
    },
    yaxis: [
        {
            title: {
                text: 'Purchase Orders',
            },
        },
        {
            opposite: true,
            title: {
                text: 'Sales Orders',
            },
        },
    ],
    tooltip: {
        shared: true,
        intersect: false,
    }
};

var areaChart = new ApexCharts(document.querySelector("#area-chart"), areaChartOptions);
areaChart.render();




// POGING TOT STACKED BAR CHART

function stackedBarChart(doorlooptijden) {
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

    var stackedBarChart = new ApexCharts(document.querySelector("#stacked-bar-chart"), stackedBarChartOptions);
    stackedBarChart.render();
}


function verschilDatum(datum1, datum2) {
    if (!datum1 || !datum2) {
        return 0;
    } else {
        const startDatum = new Date(datum1);
        const eindDatum = new Date(datum2);
        console.log("Startdatum: " + startDatum + ", Einddatum: " + eindDatum);
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
        if (!response.ok) throw new Error("Fout bij ophalen...");

        const data = await response.json();
        console.log("opgehaalde data:", data);

        document.getElementById(ID).textContent = data;
    } catch (error) {
        alert("Fout bij ophalen: " + error.message);
        console.log(error.message);
    }
}

async function verzamelDoorlooptijden() {
    let juridisch = [];
    let apotheek = [];
    let metc = [];
    let lab = [];

    for (const centrum of centra) {
        const data = await laadDataStudie("ABC3", centrum);
        const studie = data[0];

        juridisch.push(verschilDatum(studie.juridisch_start, studie.juridisch_eind));
        apotheek.push(verschilDatum(studie.apotheek_start, studie.apotheek_eind));
        metc.push(verschilDatum(studie.metc_start, studie.metc_eind));
        lab.push(verschilDatum(studie.lab_start, studie.lab_eind));
    }
    console.log("Array juridisch: " + juridisch);
    console.log("Array apotheek: " + apotheek);
    console.log("Array metc: " + metc);
    console.log("Array lab: " + lab);
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
        console.log("opgehaalde data: " + data[0]);
        return data;
    } catch (error) {
        alert("Fout bij ophalen: " + error.message);
        console.log(error.message);
    }
}

const centra = ["AUMC", "EMCR", "ISALA", "LUMC", "MMC", "MUMC", "RUMC", "UMCG", "WKZ"];

laadDataInclusie("ABC3", "AUMC", "aantal-aumc");
laadDataInclusie("ABC3", "EMCR", "aantal-emcr");
laadDataInclusie("ABC3", "ISALA", "aantal-isala");
laadDataInclusie("ABC3", "LUMC", "aantal-lumc");
laadDataInclusie("ABC3", "MMC", "aantal-mmc");
laadDataInclusie("ABC3", "MUMC", "aantal-mumc");
laadDataInclusie("ABC3", "RUMC", "aantal-rumc");
laadDataInclusie("ABC3", "UMCG", "aantal-umcg");
laadDataInclusie("ABC3", "WKZ", "aantal-wkz");

verzamelDoorlooptijden().then((doorlooptijden) => {
    console.log("Juridisc: " + doorlooptijden.juridisch)
    stackedBarChart(doorlooptijden);
});

async function laadInclusionChart(naamStudie) {
    try {
        const studie = naamStudie;
        const url = `http://localhost:8080/api/aantal_geincludeerd/chart/inclusies/${studie}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Fout bij ophalen...")

        const data = await response.json();
        console.log("opgehaalde data: ", data);
        return data;
    } catch (error) {
        alert("Fout bij ophalen: " + error.message);
        console.log(error.message);
    }
}


laadInclusionChart("ABC3").then((data) => {
    const centra = [...new Set(data.map(item => item.naamCentrum))];

    const series = centra.map(centrum => {
        return {
            name: centrum,
            data: data
                .filter(item => item.naamCentrum === centrum)
                .map(item => ({
                    x: item.datum,
                    y: item.geincludeerd
                }))
        };
    });

    var lineChartOptions = {
        series: series,
        chart: {
            height: 350,
            type: 'line',
            toolbar: {
                show: false,
            },
        },
        colors: kleurenGenereren(centra.length),
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth'
        },
        xaxis: {
            type: 'datetime'
        },
        tooltip: {
            shared: true,
            intersect: false,
        }
    };

    var lineChart = new ApexCharts(document.querySelector("#line-chart"), lineChartOptions);
    lineChart.render();
});

laadInclusionChart("ABC3").then((data) => {
    const centra = [...new Set(data.map(item => item.naamCentrum))];

    const series = centra.map(centrum => {
        const centrumData = data.filter(item => item.naamCentrum === centrum);

        const eersteDatum = new Date(
            Math.min(...centrumData.map(item => new Date (item.datum)))
        );

        return {
            name: centrum,
            data: centrumData.map(item => ({
                    x: verschilDatum(eersteDatum, new Date(item.datum)),
                    y: item.geincludeerd
                }))
        };
    });

    var lineChartOptions = {
        series: series,
        chart: {
            height: 350,
            type: 'line',
            toolbar: {
                show: false,
            },
        },
        colors: kleurenGenereren(centra.length),
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth'
        },
        tooltip: {
            shared: true,
            intersect: false,
        }
    };

    var lineChart = new ApexCharts(document.querySelector("#line-chart-2"), lineChartOptions);
    lineChart.render();
});


console.log("Script werkt! ");
