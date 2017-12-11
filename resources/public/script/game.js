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
    };
    var applyToState = function (template) {
        var obj = {};
        Object.keys(template).forEach(function (key) {
            obj[key] = resolver(template[key]);
        });
        return function(state) {
            Object.keys(obj).forEach(function (key) {
                state[key] = obj[key](state);
            });
        }
    };
    var conditional = function (template) {
        var expr = resolver(template.shift());
        var seq = template.map(resolver);
        return function (state) {
            if(expr(state)) {
                seq.forEach(function (fn) {
                    p.print(fn(state));
                });
            }
        }
    };
    var runScript = function (template) {
        var convertAny = function (step) {
            if ((typeof step) == "object") {
                if (isArray(step)) {
                    return runScript(step);
                } else {
                    return applyToState(step);
                }
            } else {
                var s = resolver(step);
                return function(state) {
                    p.print(s(state));
                }
            }
        };
        var first = template.shift();
        var expr = convertAny(first);
        var seq = template.map(convertAny);
        if ((typeof first) == "string") {
            return function (state) {
                if (expr(state)) {
                    seq.forEach(function (step) {
                        step(state);
                    });
                }
            };
        } else {
            seq.unshift(expr);
            return function (state) {
                seq.forEach(function (step) {
                    step(state);
                });
            };
        }
    };
    var init = function() {

    };
    this.choose = function(optionIndex) {

    }
}