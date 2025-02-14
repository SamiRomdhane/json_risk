const assert = function (expr, msg) {
    var m;
    if (!expr) {
        m = "Failure: " + msg;
        console.log(m);
        m = '<strong style="color:red">Failure: </strong>' + msg + "</br>";
        if (typeof document != "undefined")
            document.body.innerHTML += m;
        if (typeof process != "undefined" && typeof process.exit === "function")
            process.exit(1);
    } else {
        m = "Success: " + msg;
        console.log(m);
        m = '<strong style="color:green">Success: </strong>' + msg + "</br>";
        if (typeof document != "undefined")
            document.body.innerHTML += m;
    }
};

const TestFramework = {
    assert: assert,
    /*

    Compares all elements in vector val with the corresponding element in expected, and checks if they are of the same type and value

     */
    assert_same_vector: function (val, expected, msg) {
        var i;
        if (val.length !== expected.length) {
            assert(false, msg);
            return;
        }
        for (i = 1; i < val.length; i++) {
            if (val[i] !== expected[i]) {
                console.log("WERTE: " + val[i] + ", " + expected[i]);
                assert(false, msg);
                return;
            }
        }
        assert(true, msg);
    },
    /*

    Compares all elements in vector val with the corresponding element in expected, and checks if they are of Date type and carry the same value

     */
    assert_same_dates: function (actual, expected, msg) {
        if (actual.length !== expected.length) {
            console.error(msg + ": length mismatch");
            assert(false, msg);
            return;
        }

        for (let i = 0; i < actual.length; i++) {
            if (actual[i].getTime() !== expected[i].getTime()) {
                console.error(
                    msg +
`: mismatch at index ${i} - expected ${expected[i]}, got ${actual[i]}`, );
                assert(false, msg);
                return;
            }
        }
        assert(true, msg);
    },

    get_utc_date: function (y, m, d) {
        timestamp = Date.UTC(y, m, d);
        return new Date(timestamp);
    },
};

if (typeof require === "function") {
    var JsonRisk = require("../dist/json_risk.js");

    test_files = [
		"interpolation_curve.js"
		"python_interpolation.js",
		"date_conversion.js",
        "number_bool_vector.js",
        "year_fraction.js",
        "month_rolling.js",
        "holidays_calender.js",
        "period_string_conversion.js",
        "date_string_conversion.js",
        "curves.js",
        "surfaces.js",
        "schedule.js",
        "schedule_generation_consistency.js",
        "bond_valuation.js",
        "distribution_functions.js",
        "swaptions.js",
        "swaption_zero_notional",
        "cashflow_equivalent_swaption.js",
        "fx_term.js",
        "irregular_bonds.js",
        "lgm_option_pricing.js",
        "callable_bond_valuation.js",
        "amortizing_callable_bonds.js",
        "vector_pricing.js",
        "vector_pricing_curve_scenarios.js",*/
    ];

    for (testfile of test_files) {
        test = require(`./tests/${testfile}`);
        console.log(test.name);
        test.execute(TestFramework, JsonRisk);
    }
} else {
    console.log("TESTS LOADED: " + jr_tests.length);
}
