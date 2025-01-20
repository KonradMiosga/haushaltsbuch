$(document).ready(function () {
    var token = localStorage.getItem('myToken');
    if (token) {
        const div1 = document.getElementById("logindiv");
        div1.classList.add("d-none");
        const div2 = document.getElementById("profilediv");
        div2.classList.remove("d-none");
    } else {
        const div1 = document.getElementById("logindiv");
        div1.classList.remove("d-none");
        const div2 = document.getElementById("profilediv");
        div2.classList.add("d-none");
    }
});


$("#loginsubmit").click(function () {
    var login = {
        email: $("#loginName").val(),
        password: $("#loginPassword").val()
    };
    console.log(login);
    $.ajax({
        url: 'http://localhost:8080/api/auth',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(login),
        processData: false,
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            console.log(data);
            localStorage.setItem('myToken', data.token);
            const div1 = document.getElementById("logindiv");
            div1.classList.add("d-none");
            const div2 = document.getElementById("profilediv");
            div2.classList.remove("d-none");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert('Error: ' + xhr.status + '   ' + thrownError);
        }
    });
});

$("#logoutsubmit").click(function () {
    var token = localStorage.getItem('myToken');
    if (!token) return;
    $.ajax({
        url: 'http://localhost:8080/api/auth?token=' + token,
        type: 'DELETE',
        dataType: 'json',
        success: function (data) {
            localStorage.removeItem('myToken');
            const div1 = document.getElementById("logindiv");
            div1.classList.remove("d-none");
            const div2 = document.getElementById("profilediv");
            div2.classList.add("d-none");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log('Error: ' + xhr.status + ' ' + thrownError);
            console.log('Response:', xhr.responseText);
            alert('Error: ' + xhr.status + ' ' + thrownError);
        }
    });
});