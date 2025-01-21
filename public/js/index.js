import config from './config.js';

$(document).ready(function () {
    var token = localStorage.getItem('myToken');
    if (!token) {
            var einzahlungTotal = 0;
            var auszahlungTotal = 0;
            var einzahlungHtml = '';
            var auszahlungHtml = '';
            einzahlungHtml = '<li class="list-group-item d-flex justify-content-between">'+
                '<span>Gehalt</span><span>2000,00€</span></li>';
            auszahlungHtml = '<li class="list-group-item d-flex justify-content-between">'+
                '<span>Miete</span><span>600,00€</span></li>';
            $("#einzahlungListe").empty().html(einzahlungHtml);
            $("#auszahlungListe").empty().html(auszahlungHtml);
            $("#einzahlungErg").text('2000,00 €');
            $("#auszahlungErg").text('600,00 €');
            $("#gesamtErg").text('1400,00 €');
        return;
    }

    $.ajax({
        url: config.apiUrl + '/entries?token=' + token,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            var einzahlungTotal = 0;
            var auszahlungTotal = 0;
            var einzahlungHtml = '';
            var auszahlungHtml = '';
            data.forEach(function (entry) {
                var listItem = '<li class="list-group-item d-flex justify-content-between">' +
                    '<span>' + entry.name + '</span>' +
                    '<span>' + entry.amount.toFixed(2) + '€</span>' +
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
        },
        error: function (xhr, ajaxOptions, thrownError) {
            if (xhr.status === 401) {
                localStorage.removeItem('myToken');
                window.location.href = 'login.html';
                return;
            }
            console.log('Error: ' + xhr.status + ' ' + thrownError);
            console.log('Response:', xhr.responseText);
            alert('Error: ' + xhr.status + ' ' + thrownError);
        }
    });
});
