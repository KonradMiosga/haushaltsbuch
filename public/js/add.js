import config from './config.js';
const addButton = document.getElementById('addEntry');
const deleteButton = document.getElementById('deleteEntry');

$(document).ready(function () {
    var token = localStorage.getItem('myToken');
    const span1 = document.getElementById("deleteEntryStatus");
    const span2 = document.getElementById("addEntryStatus");
    if (!token) {
        span1.classList.remove("d-none");
        span2.classList.remove("d-none");
    }
    else {
        span1.classList.add("d-none");
        span2.classList.add("d-none");
    }
});

// Event-Listener wird ausgeführt, wenn das DOM vollständig geladen ist
document.addEventListener('DOMContentLoaded', function () {
    // DOM-Elemente initialisieren
    const typeSelect = document.getElementById('type');
    const categorySelect = document.getElementById('category');
    const expenseCategories = document.getElementById('expenseCategories');
    const incomeCategories = document.getElementById('incomeCategories');

    // Kategorien initial ausblenden
    expenseCategories.style.display = 'none';
    incomeCategories.style.display = 'none';

    // Event-Handler für Typ-Auswahl
    typeSelect.addEventListener('change', function () {
        categorySelect.disabled = false;        // Kategorie-Auswahl aktivieren
        categorySelect.value = '';             // Kategorie-Auswahl zurücksetzen

        // Kategorien basierend auf gewähltem Typ ein-/ausblenden
        if (this.value === 'Ausgabe') {
            expenseCategories.style.display = '';
            incomeCategories.style.display = 'none';
        } else if (this.value === 'Einnahme') {
            expenseCategories.style.display = 'none';
            incomeCategories.style.display = '';
        }
    });

    // Buttons initial deaktivieren
    addButton.disabled = true;
    deleteButton.disabled = true;

    // Event-Handler für Löschen-Auswahl
    const delSelection = document.getElementById('delselection');
    delSelection.addEventListener('change', function () {
        deleteButton.disabled = !delSelection.value && localStorage.getItem('myToken') !== null;
    });

    // Formularvalidierung für Hinzufügen-Button
    const nameInput = document.getElementById('name');
    const amountInput = document.getElementById('amount');
    const descriptionInput = document.getElementById('description');

    [nameInput, amountInput, typeSelect, categorySelect].forEach(element => {
        element.addEventListener('change', validateAddForm);
        element.addEventListener('input', validateAddForm);
    });

    // Prüfen ob alle Pflichtfelder ausgefüllt sind
    function validateAddForm() {
        const isValid = 
            localStorage.getItem('myToken') !== null &&
            nameInput.value.trim() !== '' &&
            amountInput.value.trim() !== '' &&
            typeSelect.value !== '' &&
            categorySelect.value !== '';
        addButton.disabled = !isValid;
    }

    // Initial Einträge laden
    refresh();
});

// Lädt die Einträge für die Lösch-Auswahl
function refresh() {
    var token = localStorage.getItem('myToken');
    if (!token) {
        $("#delselection").empty().html('<option value="" disabled selected>Eintrag auswählen</option>');
        return;
    }
    $.ajax({
        url: config.apiUrl + '/entries?token=' + token,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            $("#delselection").empty().html('<option value="" disabled selected>Eintrag auswählen</option>');
            data.forEach(function (entry) {
                $('#delselection').append('<option value="' + entry.name + '">' + entry.name + '</option>');
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            if (xhr.status === 401) {
                localStorage.removeItem('myToken');
                window.location.href = 'login.html';
                return;
            }
            console.log('Error: ' + xhr.status + ' ' + thrownError);
            console.log('Response:', xhr.responseText);
            alert('Fehler beim Datenabruf.\nError: ' + xhr.status + ' ' + thrownError);
        }
    });
}

// Event-Handler für Löschen-Button
$("#deleteEntry").click(function () {
    var my_token = localStorage.getItem('myToken');
    if (!my_token) return;
    var tokenName = {
        token: my_token,
        name: $("#delselection").val()
    };
    console.log(tokenName);
    $.ajax({
        url: config.apiUrl + '/entries',
        type: 'delete',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(tokenName),
        processData: false,
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            console.log(data);
            deleteButton.disabled = true;
            refresh();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert('Fehler beim Löschen.\nError: ' + xhr.status + '   ' + thrownError);
        }
    });
});

// Event-Handler für Hinzufügen-Button
$("#addEntry").click(function () {
    var my_token = localStorage.getItem('myToken');
    if (!my_token) return;
    var tokenEntry = {
        token: my_token,
        entry: {
            name: $("#name").val(),
            amount: parseFloat($("#amount").val()),
            type: $("#type").val(),
            category: $("#category").val(),
            description: $("#description").val()
        }
    };
    console.log(tokenEntry);
    $.ajax({
        url: config.apiUrl + '/entries',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(tokenEntry),
        processData: false,
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            console.log(data);
            $("#name").val('');
            $("#amount").val('');
            $("#type").val('');
            $("#category").val('');
            addButton.disabled = true;
            refresh();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert('Fehler beim Hinzufügen.\nError: ' + xhr.status + ' ' + thrownError);
        }
    });
});