import config from './config.js';
const regButton = document.getElementById('registersubmit');

[registerVorname, registerNachname, registerEmail, registerPassword, registerRepeatPassword, registerCheck].forEach(element => {
    element.addEventListener('change', validateRegForm);
    element.addEventListener('input', validateRegForm);
});

function validateRegForm() {
    if (registerPassword.value === '' 
            || registerRepeatPassword.value === '' 
            || registerCheck.checked === false 
            || registerEmail.value === '' 
            || registerVorname.value === '' 
            || registerNachname.value === ''
            || registerPassword.value !== registerRepeatPassword.value) {
        regButton.disabled = true;
    } else {
        regButton.disabled = false;
    }
}

// POST-Request für Registrierung, Auslöser ist der Klick auf den Registrieren-Button
$("#registersubmit").click(function (event) {
    regButton.disabled = true;
    event.preventDefault();
    var password = $("#registerPassword").val();
    var repeatPassword = $("#registerRepeatPassword").val();
    var checkbox = $("#registerCheck").is(":checked");
    if (password !== repeatPassword) {
        alert("Die Passwörter stimmen nicht überein.");
        return;
    }
    if (!checkbox) {
        alert("Bitte stimmen Sie den Bedingungen zu.");
        return;
    }
    var NewUser = {
        email: $("#registerEmail").val(),
        password: password,
        firstName: $("#registerVorname").val(),
        lastName: $("#registerNachname").val()
    };
    console.log(NewUser);
    $.ajax({
        url: config.apiUrl + '/users',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(NewUser),
        processData: false,
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            console.log(data);
            alert('Registrierung erfolgreich, sie können sich jetzt einloggen.');
            window.location.href = 'profile.html';
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert('Fehler bei der Registrierung.\nBitte überprüfen Sie Ihre eingegebenen Daten.\nError: ' + xhr.status + '   ' + thrownError);
            regButton.disabled = false;
        }
    });
});