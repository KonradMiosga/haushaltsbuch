import config from './config.js';

document.addEventListener('DOMContentLoaded', function () {
    chuck();
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
