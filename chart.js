const ctx = document.getElementById('myChart');

// Retrives precipitation mm/monthly data from NASA Power API from 2020 to 2022 near South Australia, Australia
fetch('https://power.larc.nasa.gov/api/temporal/monthly/point?start=2020&end=2022&latitude=-40&longitude=130&community=ag&parameters=PRECTOTCORR&header=true')
.then(function(response){
    if(response.ok){
        return response.json();
    }
    else{
        alert("Error fetching Nasa power API\n");
    }
})
.then(function(data){
    const precipitation = data.properties.parameter.PRECTOTCORR;
    console.log("Precipitation\n");
    console.log(precipitation);

    // Retrives a local CSV - json for agriculture coverage over Australia using NASA GLAM Project data
    fetch('agriculture_data.json')
    .then(function(response){
        if(response.ok){
            return response.json();
        }
        else{
            alert("Error fetching local agriculture data\n");
        }
    })
    .then(function(data){
        const agriculture = data.values;
        console.log("Agriculture\n");
        console.log(agriculture);

        // Retrives data for seasonal evapo-transpiration in Barrosa Valley, South Australia, Australia
        fetch('evapotranspiration_seasonal.json')
        .then(function(response){
            if(response.ok){
                return response.json();
            }
            else{
                alert("Error fetching local evapotranspiration data\n");
            }
        })
        .then(function(data){
            const evapotranspiration = data.values;
            console.log("Evapotranspiration\n");
            console.log(evapotranspiration);

            // Calls the chart.js function to plot graph with three datasets over 2020 to 2022
            createChart(evapotranspiration, agriculture, precipitation, 'line');
        })
    })
})

function createChart(evapo_transpiration_data, agriculture_data, precipitation_data, type) {
    const label = Object.keys(precipitation_data);  // month-year horizontal axis

    const agriculture_dataset = Object.values(agriculture_data);
    const precipitation_dataset = Object.values(precipitation_data);
    const evapo_transpiration_dataset = Object.values(evapo_transpiration_data);

    new Chart(ctx, {
        type: type,
        data: {
            labels: label, 
            datasets: [
                {
                    label: 'Agricultural Monitoring',
                    data: agriculture_dataset,
                    borderWidth: 1,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    yAxisID: 'y1',  // Assign to the first y-axis
                },
                {
                    label: 'Precipitation (mm/month)',
                    data: precipitation_dataset,
                    borderWidth: 1,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    yAxisID: 'y2',  // Assign to the second y-axis
                },
                {
                    label: 'Evapotranspiration (hundreds)',
                    type: 'bar',
                    data: evapo_transpiration_dataset,
                    borderWidth: 1,
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    yAxisID: 'y3',  // Assign to the third y-axis
                }
            ]
        },
        options: {
            scales: {
                y1: {  // First y-axis (Agriculture)
                    type: 'linear',
                    position: 'left',
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Agriculture Data (NDVI units)'
                    }
                },
                y2: {  // Second y-axis (Precipitation)
                    type: 'linear',
                    position: 'right',
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Average Precipitation (mm/month)'
                    }
                },
                y3: {  // Third y-axis (Evapotranspiration)
                    type: 'linear',
                    position: 'right',
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Total Evapotranspiration by Season (mm)'
                    }
                }
            }
        }
    });
}

