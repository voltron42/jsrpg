function loadGame(path,onRespond) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("get", path, false);
    xhttp.send();
    console.log(xhttp.response);
    return JSON.parse(xhttp.response);
}