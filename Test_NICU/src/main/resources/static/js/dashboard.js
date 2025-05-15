
// POGING TOT DYNAMISCHE DATA

function getMostRecentInclusion(studie, centrum) {

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

async function laadData(naamStudie, naamCentrum, ID) {
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

laadData("ABC3", "AUMC", "aantal-aumc");
laadData("ABC3", "EMCR", "aantal-emcr");
laadData("ABC3", "ISALA", "aantal-isala");
laadData("ABC3", "LUMC", "aantal-lumc");
laadData("ABC3", "MMC", "aantal-mmc");
laadData("ABC3", "MUMC", "aantal-mumc");
laadData("ABC3", "RUMC", "aantal-rumc");
laadData("ABC3", "UMCG", "aantal-umcg");
laadData("ABC3", "WKZ", "aantal-wkz");


console.log("Script werkt! ");
var areaChart = new ApexCharts(document.querySelector("#area-chart"), areaChartOptions);
areaChart.render();
