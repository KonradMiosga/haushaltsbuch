import config from './config.js';
const loginButton = document.getElementById("loginsubmit");

[loginName, loginPassword].forEach(element => {
    element.addEventListener('change', validateLogForm);
    element.addEventListener('input', validateLogForm);
});
function validateLogForm() {
    if (loginName.value === '' || loginPassword.value === '') {
        loginButton.disabled = true;
    } else {
        loginButton.disabled = false;
    }
}


// Seiten-Initialisierung
$(document).ready(function () {
    var token = localStorage.getItem('myToken');
    if (token) showProfile();
    else showLogin();
});

function showProfile() {  
    // Wenn Token vorhanden, Profil anzeigen
    const div1 = document.getElementById("logindiv");
    div1.classList.add("d-none");
    const div2 = document.getElementById("profilediv");
    div2.classList.remove("d-none");
    refresh();
}
function showLogin() {  
    // Wenn kein Token vorhanden, Login anzeigen
    const div1 = document.getElementById("logindiv");
    div1.classList.remove("d-none");
    const div2 = document.getElementById("profilediv");
    div2.classList.add("d-none");
}

// Event-Handler für Login
$("#loginsubmit").click(function () {
    loginButton.disabled = true;
    var login = {
        email: $("#loginName").val(),
        password: $("#loginPassword").val()
    };
    console.log(login);
    $.ajax({
        url: config.apiUrl + '/auth',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(login),
        processData: false,
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            console.log(data);
            localStorage.setItem('myToken', data.token);
            showProfile();
            loginButton.disabled = false;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert('Fehler bei der Anmeldung.\nError: ' + xhr.status + '   ' + thrownError);
            loginButton.disabled = false;
        }
    });
});

// Event-Handler für Logout
$("#logoutsubmit").click(function () {
    var token = localStorage.getItem('myToken');
    if (!token) return;
    $.ajax({
        url: config.apiUrl + '/auth?token=' + token,
        type: 'DELETE',
        dataType: 'json',
        success: function (data) {
            localStorage.removeItem('myToken');
            $("#loginName").val('');
            $("#loginPassword").val('');
            loginButton.disabled = true;
            showLogin();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log('Error: ' + xhr.status + ' ' + thrownError);
            alert('Fehler bei der Abmeldung.\nError: ' + xhr.status + ' ' + thrownError);
        }
    });
});

// Event-Handler für Profil speichern
$("#savesubmit").click(function () {
    var my_token = localStorage.getItem('myToken');
    if (!my_token)  return;
    var tokenUser = {
        token: my_token,
        user : {
            email: $("#userName").val(),          
            password: $("#userPassword").val(),   
            firstName: $("#userFirstname").val(),  
            lastName: $("#userLastname").val()     
        }
    };
    $.ajax({
        url: config.apiUrl + '/users',
        type: 'put',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(tokenUser),
        processData: false,
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            console.log(data);
            alert('Daten erfolgreich gespeichert.');
            refresh();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert('Fehler beim Speichern.\nError: ' + xhr.status + ' ' + thrownError);
        }
    });
});

// Lädt die Benutzerdaten vom Server
function refresh() {
    var token = localStorage.getItem('myToken');
    if (!token) return;
    // Benutzerdaten vom Server abrufen
    $.ajax({
        url: config.apiUrl + '/users?token=' + token,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log("Empfangene Benutzerdaten:", data);
            // Formularfelder mit Benutzerdaten befüllen
            $("#userName").val(data.email);           
            $("#userPassword").val(data.password);   
            $("#userFirstname").val(data.firstName);
            $("#userLastname").val(data.lastName);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            localStorage.removeItem('myToken');
            showLogin();
            console.log('Error: ' + xhr.status + ' ' + thrownError);
            alert('Fehler beim Refresh der Daten.\nError: ' + xhr.status + ' ' + thrownError);
        }
    });
}