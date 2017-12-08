function d(sideCount) {
    return function() {
        return Math.floor(Math.random() * sideCount);
    }
}

window.d10 = d(10);
window.d100 = d(100);

window.throwException = function (e) {
    throw e;
}

function Printer(output) {
    this.print = function(message) {
        output.innerHTML = output.innerHTML + "<p>" + message + "</p>";
    }
}