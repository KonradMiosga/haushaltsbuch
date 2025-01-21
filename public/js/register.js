import config from './config.js';
$("#registersubmit").click(function (event) {
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
            alert('Error: ' + xhr.status + '   ' + thrownError);
        }
    });
});