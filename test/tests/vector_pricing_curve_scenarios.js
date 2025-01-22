TEST_NAME = "Vector Pricing Curve Scenarios";

test = {
    name: TEST_NAME
};

if (typeof module === 'object' && typeof exports !== 'undefined') {
    // Node
    module.exports = test;
} else {
    // Browser
    root.jr_tests.push_back(test);
}

test.execute = function (TestFramework, JsonRisk) {

    /*

    Test vector pricing with curve scenarios

     */
    if (typeof require === 'function')
        var params_vector = require('../params_vector.js');
    if (typeof require === 'function')
        var params_scen_rf = require('../params_scen_rf.js');
    if (typeof require === 'function')
        var params_scen_tag = require('../params_scen_tag.js');
    if (typeof require === 'function')
        var params_vola_sensis = require('../params_vola_sensis.js');

    var compare = function (arr1, arr2) {
        var x,
        y;
        if (arr1.length !== arr2.length)
            return false;
        console.log("Arrays are the same length");
        for (var j = 0; j < arr1.length; j++) {
            if (typeof(arr1[j]) !== 'number')
                return false;
            if (isNaN(arr1[j]))
                return false;
            if (typeof(arr2[j]) !== 'number')
                return false;
            if (isNaN(arr2[j]))
                return false;
            x = arr1[j] - arr1[0];
            y = arr2[j] - arr2[0];
            x *= 10000;
            y *= 10000;
            if (Math.abs(x - y) > 0.0001) {
                console.log(`Prices do not match: Arr1 ${x}, Arr2 ${y}`);
                return false;
            }
            console.log(`Prices match: Arr1 ${x}, Arr2 ${y}`);
        }
        return true;
    };

    bond = {
        type: 'bond',
        maturity: TestFramework.get_utc_date(2045, 1, 1),
        notional: 100.0,
        fixed_rate: 0.0125,
        tenor: 1,
        bdc: "following",
        dcc: "act/act",
        calendar: "TARGET",
        settlement_days: 2,
        disc_curve: "EUR_OIS_DISCOUNT",
        spread_curve: "EUR_GOV_SPREAD",
        currency: "EUR"
    };

    // vector pricing is the reference
    JsonRisk.store_params(params_vector);
    var results_vector = JsonRisk.vector_pricer(bond);

    // scenarios by risk factor
    JsonRisk.store_params(params_scen_rf);
    var results_scen_rf = JsonRisk.vector_pricer(bond);
    TestFramework.assert(compare(results_vector, results_scen_rf), "Vector pricing with scenarios by risk factor (1)");

    // scenarios by tag
    JsonRisk.store_params(params_scen_tag);
    var results_scen_tag = JsonRisk.vector_pricer(bond);
    TestFramework.assert(compare(results_vector, results_scen_tag), "Vector pricing with scenarios by tag (1)");

    bond.disc_curve = "CONST_100BP";
    bond.spread_curve = "EUR_PFA_SPREAD";
    // vector pricing is the reference
    JsonRisk.store_params(params_vector);
    results_vector = JsonRisk.vector_pricer(bond);
    // scenarios by tag
    JsonRisk.store_params(params_scen_tag);
    results_scen_tag = JsonRisk.vector_pricer(bond);
    TestFramework.assert(compare(results_vector, results_scen_tag), "Vector pricing with scenarios by tag (2)");

    bond = {
        type: 'callable_bond',
        maturity: TestFramework.get_utc_date(2042, 1, 1),
        first_exercise_date: TestFramework.get_utc_date(2023, 1, 1),
        call_tenor: 3,
        notional: 100.0,
        fixed_rate: 0.0001,
        tenor: 12,
        bdc: "following",
        dcc: "act/act",
        calendar: "TARGET",
        settlement_days: 2,
        disc_curve: "CONST",
        surface: "CONST_0BP",
        fwd_curve: "CONST",
        currency: "EUR"
    };

    // vector pricing is the reference
    JsonRisk.store_params(params_vector);
    results_vector = JsonRisk.vector_pricer(bond);
    // scenarios by risk factor
    JsonRisk.store_params(params_scen_rf);
    results_scen_rf = JsonRisk.vector_pricer(bond);
    TestFramework.assert(compare(results_vector, results_scen_rf), "Vector pricing with scenarios by risk factor, with volatilities (1)");

    swaption = {
        type: "swaption",
        notional: 100000,
        tenor: 12,
        fixed_rate: 0.0,
        float_tenor: 6,
        float_current_rate: 0,
        surface: "CONST_0BP",
        disc_curve: "CONST",
        fwd_curve: "CONST",
        currency: "EUR"
    };

    for (i = 2; i < 50; i++) {
        swaption.maturity = TestFramework.get_utc_date(2025, 2 * i, 22);
        swaption.first_exercise_date = TestFramework.get_utc_date(2024, i, 22);
        // vector pricing is the reference
        JsonRisk.store_params(params_vector);
        results_vector = JsonRisk.vector_pricer(swaption);
        console.log(results_vector[1]);
        // scenarios by risk factor
        JsonRisk.store_params(params_scen_rf);
        results_scen_rf = JsonRisk.vector_pricer(swaption);
        console.log(results_scen_rf[1]);
        TestFramework.assert(compare(results_vector, results_scen_rf), "Vector pricing with scenarios by risk factor, with volatilities (" + i + ")");
    }

}
