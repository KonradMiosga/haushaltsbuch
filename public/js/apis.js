import config from './config.js';

document.addEventListener('DOMContentLoaded', function () {
    chuck();
    // IP holen, dann Wetterdaten holen, dann Graph zeichnen
    getIP();
    getNasa();
});

// nutzung von graphql server, dieser holt sich einen Chuck Norris Witz und lässt ihn 
// in verschiedenen Sprachen übersetzen, dafür werden 2 externe apis verwendet
// die erste api ist die chuck norris api, die zweite api ist die google translate api
function chuck() {
    $.ajax({
        url: config.graphqlUrl,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            query: '{ chuckNorrisJoke(query: "work") { english, german, polish, japanese } }'
        }),
        success: function(response) {
            console.log(response);
            // Beispiel: Zeigen Sie den englischen Witz an
            $('#chuckEn').html(response.data.chuckNorrisJoke.english);
            $('#chuckDe').html(response.data.chuckNorrisJoke.german);
            $('#chuckPo').html(response.data.chuckNorrisJoke.polish);
            $('#chuckJp').html(response.data.chuckNorrisJoke.japanese);
        },
        error: function(error) {
            console.error('Error fetching joke:', error);
        }
    });
}

/* chuck norris api + translation api ohne graphql
function chuck() {
    $.ajax({
        url: 'https://api.chucknorris.io/jokes/search?query=money',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log(data);
            var joke = data.result[Math.floor(Math.random() * data.result.length)];
            console.log(joke);
            $('#chuckapi').html(joke.value);
            translate(joke.value);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log('Error: ' + xhr.status + ' ' + thrownError);
        }
    });
}
function translate(text) {
    $.ajax({
        url: 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=de&dt=t&q=' + text,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log(data);
            $('#translationapi').empty();
            for (var i = 0; i < data[0].length; i++) {
                $('#translationapi').append(data[0][i][0]);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log('Error: ' + xhr.status + ' ' + thrownError);
        }
    });
}
*/

// Variablen für Wetterdaten und Standortdaten
var xValuesTemp = [];
var yValuesTemp = [];
var xValuesRain = [];
var yValuesRain = [];
var ipaddress = null;
var city = null;
var latitude = null;
var longitude = null;

//IP-Adresse holen
function getIP() {
    $.ajax({
        url: 'http://ip-api.com/json/',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            ipaddress = data.query;
            city = data.city;
            latitude = data.lat;
            longitude = data.lon;
            console.log(data);
            $('#idForIp').html('IP-Adresse:  ' + ipaddress);
            $('#idForCity').html('Stadt:  ' + city);
            wether();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log('Error beim Laden der Standortdaten:', thrownError);
            $('#idForIp').html('keine IP-Adresse gefunden');
        }
    });
}

//Wetterdaten holen
function wether() {
    $.ajax({
        //url: 'https://api.open-meteo.com/v1/forecast?latitude=51.3&longitude=10.3&hourly=temperature_2m,precipitation_probability,rain',
        url: 'https://api.open-meteo.com/v1/forecast?latitude=' + latitude
            + '&longitude=' + longitude + '&hourly=temperature_2m,precipitation_probability,rain',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            // Nur die ersten 12 Stunden verwenden
            for (let i = 0; i < 13; i++) {
                xValuesTemp[i] = i*2 + ":00";
                yValuesTemp[i] = data.hourly.temperature_2m[i*2];
                xValuesRain[i] = i*2 + ":00";
                yValuesRain[i] = data.hourly.rain[i*2];
            }
            // Graph erst zeichnen, nachdem Daten verfügbar sind
            graph();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log('Error beim Laden der Wetterdaten:', thrownError);
            $('#idForWeather').html('keine Wetterdaten gefunden');
        }
    });
}

//Graph zeichnen
function graph() {
    new Chart("myChartTemp", {
        type: "line",
        data: {
            labels: xValuesTemp,
            datasets: [{
                fill: false,
                backgroundColor: "red",
                borderColor: "red",
                data: yValuesTemp,
                label: 'Temperatur °C'
            }]
        },
        options: {
            legend: { display: true },
            scales: {
                yAxes: [{ ticks: { min: Math.ceil(Math.min(...yValuesTemp) - 10), max: Math.ceil(Math.max(...yValuesTemp) + 10) } }],
            }
        }
    });
    new Chart("myChartRain", {
        type: "line",
        data: {
            labels: xValuesRain,
            datasets: [{
                fill: true,
                backgroundColor: "blue",
                borderColor: "blue",
                data: yValuesRain,
                label: 'Regen mm/h'
            }]
        },
        options: {
            legend: { display: true },
            scales: {
                yAxes: [{ ticks: { 
                    min: 0, 
                    max: Math.ceil(Math.max(...yValuesRain) + 10) 
                }}],
            }
        }
    });
}

//NASA-Daten holen
function getNasa() {
    $.ajax({
        url: 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log(data);
            $('#nasaTitle').html('Title: ' + data.title);
            $('#nasaDate').html('Date: ' + data.date);
            $('#nasaExplanation').html(data.explanation);
            $('#nasaImage').attr('src', data.url);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log('Error: ' + xhr.status + ' ' + thrownError);
            $('#nasaTitle').html('keine NASA-Daten gefunden');
        }
    });
}