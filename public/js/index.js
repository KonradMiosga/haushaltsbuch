import config from './config.js';

// Seiten-Initialisierung
$(document).ready(function () {
    var token = localStorage.getItem('myToken');
    if (!token) muster();
    else loadEntries(token);
});

// Einträge laden
function loadEntries(token) {
    $.ajax({
        url: config.apiUrl + '/entries?token=' + token,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            refresh(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            if (xhr.status === 401) {
                localStorage.removeItem('myToken');
                window.location.href = 'profile.html';
                return;
            }
            console.log('Error: ' + xhr.status + ' ' + thrownError);
            console.log('Response:', xhr.responseText);
            alert('Fehler beim laden Ihrer Einträge.\nError: ' + xhr.status + ' ' + thrownError);
        }
    });
}

function muster() {
    var muster = [{
        name: "Bsp.-Gehalt",
        amount: 2000,
        type: "Einnahme"
    }, {
        name: "Bsp.-Nebenjob",
        amount: 400,
        type: "Einnahme"
    }, {
        name: "Bsp.-Taschengeld",
        amount: 50,
        type: "Einnahme"
    }, {
        name: "Bsp.-Miete",
        amount: 600,
        type: "Ausgabe"
    }, {
        name: "Bsp.-Netflix",
        amount: 10,
        type: "Ausgabe"
    }, {
        name: "Bsp.-Versicherung",
        amount: 50,
        type: "Ausgabe"
    }, {
        name: "Bsp.-Auto",
        amount: 250,
        type: "Ausgabe"
    }, {
        name: "Bsp.-Essen",
        amount: 300,
        type: "Ausgabe"
    }];
    refresh(muster);
}

function refresh(data) {
    data.sort(function (a, b) {
        return b.amount - a.amount;
    });
    var einzahlungTotal = 0;
    var auszahlungTotal = 0;
    var einzahlungHtml = '';
    var auszahlungHtml = '';
    data.forEach(function (entry) {
        var listItem = '<li class="list-group-item d-flex justify-content-between">' +
            '<span>' + entry.name + '</span>' +
            '<span>' + entry.amount.toFixed(2) + ' €</span>' +
            '</li>';
        if (entry.type === "Einnahme") {
            einzahlungHtml += listItem;
            einzahlungTotal += entry.amount;
        } else if (entry.type === "Ausgabe") {
            auszahlungHtml += listItem;
            auszahlungTotal += entry.amount;
        }
    });
    $("#einzahlungListe").empty().html(einzahlungHtml);
    $("#auszahlungListe").empty().html(auszahlungHtml);
    $("#einzahlungErg").text(einzahlungTotal.toFixed(2) + ' €');
    $("#auszahlungErg").text(auszahlungTotal.toFixed(2) + ' €');
    $("#gesamtErg").text((einzahlungTotal - auszahlungTotal).toFixed(2) + ' €');
    chart(data);
}

// Zeigt ein Tortendiagramm
function chart(data) {
    console.log(data);
    var einzahlungenValue = [];
    var einzahlungenLabel = [];
    var auszahlungenValue = [];
    var auszahlungenLabel = [];
    var einzahlungenTotal = 0;
    var auszahlungenTotal = 0;
    var barColors = ["#b91d47", "#00aba9", "#2b5797", "#e8c3b9", "#1e7145", "#f0a500", "#f472d0", "#00a300",
        "#b91d47", "#00aba9", "#2b5797", "#e8c3b9", "#1e7145", "#f0a500", "#f472d0", "#00a300"];
    for (var i = 0; i < data.length; i++) {
        if (data[i].type === "Einnahme") {
            einzahlungenValue.push(data[i].amount);
            einzahlungenLabel.push(data[i].name);
            einzahlungenTotal += data[i].amount;
        } else {
            auszahlungenValue.push(data[i].amount);
            auszahlungenLabel.push(data[i].name);
            auszahlungenTotal += data[i].amount;
        }
    }
    var diff = einzahlungenTotal - auszahlungenTotal;
    new Chart("myChartEinnahmen", {
        type: "pie",
        data: {
            labels: einzahlungenLabel,
            datasets: [{
                backgroundColor: barColors,
                data: einzahlungenValue,
                hoverOffset: 10
            }]
        }
    });
    new Chart("myChartAusgaben", {
        type: "pie",
        data: {
            labels: auszahlungenLabel,
            datasets: [{
                backgroundColor: barColors,
                data: auszahlungenValue,
                hoverOffset: 10
            }]
        }

    });
    new Chart("myChartRest", {
        type: "pie",
        data: {
            labels: ["Ausgaben", "Überschuss"],
            datasets: [{
                backgroundColor: ["red", "green"],
                data: [auszahlungenTotal, diff],
                hoverOffset: 10
            }]
        }
    });
}