function Game(data,outputId,controlId) {

    var output = document.getElementById(outputId);
    var controls = document.getElementById(controlId);
    var p = new Printer(output);
    var state = init();
    var resolver = function(expression) {
        var fixed = {
            "true" : true,
            "false" : false,
            "null" : null
        };
        return function(state) {
            var value = eval("`" + expression + "`");
            var numVal = parseFloat(value);
            if (!isNaN(numVal)) {
                return numVal
            } else if (value in fixed) {
                return fixed[value];
            } else {
                return value;
            }
        }
    }
    var applyToState = function (template) {
        return function(state) {

        }
    }
    var init = function() {

    }
    this.choose = function(optionIndex) {

    }
}