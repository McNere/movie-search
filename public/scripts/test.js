function postData(url, body) {
    var http = new XMLHttpRequest;
    http.open("POST", url, true);
    http.setRequestHeader('Content-Type', 'text/xml');
    http.withCredentials = 'true';
    http.onreadystatechange = function() {
        if(http.readyState == 4) {
            console.log("response 4: " + http.responseText);
        } else {
            console.log("state " + http.readyState);
        }
    }
    http.send(body);
}