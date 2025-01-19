$(document).ready(function () {
    refresh();
});

function refresh(){
    var token = localStorage.getItem('myToken');
    if (!token) {
        $("#delselection").empty().html('<option value="" disabled selected>Eintrag auswählen</option>');
        return;
    }
    $.ajax({
        url: 'http://localhost:8080/api/entries?token=' + token,
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
            alert('Error: ' + xhr.status + ' ' + thrownError);
        }
    });
}

$("#deleteEntry").click(function () {
    var my_token = localStorage.getItem('myToken');
    if (!my_token)  return;
    var tokenName = {
        token: my_token,
        name: $("#delselection").val()
    };
    console.log(tokenName);
    $.ajax({
        url: 'http://localhost:8080/api/entries',
        type: 'delete',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(tokenName),
        processData: false,
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            console.log(data);
            refresh();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert('Error: ' + xhr.status + '   ' + thrownError);
        }
    });
});



$("#addEntry").click(function () {
    var my_token = localStorage.getItem('myToken');
    if (!my_token)  return;
    var tokenEntry = {
        token: my_token,
        entry : {
            name: $("#name").val(),
            amount: parseFloat($("#amount").val()),
            type: $("#type").val(),
            category: $("#category").val(),
            description: $("#description").val()
        }
    };
    console.log(tokenEntry);
    $.ajax({
        url: 'http://localhost:8080/api/entries',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(tokenEntry),
        processData: false,
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            console.log(data);
            refresh();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert('Error: ' + xhr.status + ' ' + thrownError);
        }
    });
});