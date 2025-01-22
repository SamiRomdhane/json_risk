TEST_NAME = "Vector Pricing";

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

    Test vector pricing

     */
    if (typeof require === 'function')
        var params = require('../params_example.js');
    JsonRisk.store_params(params);
    var results;
    var check = function (arr) {
        for (var j = 0; j < arr.length; j++) {
            if (typeof(arr[j]) !== 'number')
                return false;
            if (isNaN(arr[j]))
                return false;
        }
        return true;
    };
    results = JsonRisk.vector_pricer({
        type: 'bond',
        maturity: TestFramework.get_utc_date(2032, 1, 1),
        notional: 100.0,
        fixed_rate: 0.0125,
        tenor: 12,
        bdc: "following",
        dcc: "act/act",
        calendar: "TARGET",
        settlement_days: 2,
        disc_curve: "EURO-GOV",
        spread_curve: "EURO-GOV",
        currency: "USD"
    });
    TestFramework.assert(check(results), "Vector pricing with bond returns valid vector of numbers");

    results = JsonRisk.vector_pricer({
        type: 'floater',
        maturity: TestFramework.get_utc_date(2032, 1, 1),
        notional: 100.0,
        float_spread: 0.0125,
        float_current_rate: 0.0125,
        tenor: 12,
        bdc: "following",
        dcc: "act/act",
        calendar: "TARGET",
        settlement_days: 2,
        disc_curve: "EURO-GOV",
        fwd_curve: "EURO-GOV",
        currency: "USD"
    });
    TestFramework.assert(check(results), "Vector pricing with floater returns valid vector of numbers");

    results = JsonRisk.vector_pricer({
        type: 'fxterm',
        maturity: TestFramework.get_utc_date(2032, 1, 1),
        notional: 100.0,
        maturity_2: TestFramework.get_utc_date(2038, 1, 1),
        notional_2: 105,
        currency: "EUR",
        disc_curve: "EURO-GOV"
    });
    TestFramework.assert(check(results), "Vector pricing with fxterm returns valid vector of numbers (0)");

    results = JsonRisk.vector_pricer({
        type: 'fxterm',
        maturity: TestFramework.get_utc_date(2032, 1, 1),
        notional: 107.0,
        maturity_2: TestFramework.get_utc_date(2038, 1, 1),
        notional_2: 112,
        currency: "USD",
        disc_curve: "EURO-GOV"
    });
    TestFramework.assert(check(results), "Vector pricing with fxterm returns valid vector of numbers (1)");

    results = JsonRisk.vector_pricer({
        type: 'swap',
        is_payer: true,
        maturity: TestFramework.get_utc_date(2032, 1, 1),
        notional: 100.0,
        fixed_rate: 0.0125,
        tenor: 12,
        float_spread: 0.00758,
        float_current_rate: 0,
        float_tenor: 3,
        bdc: "following",
        float_bdc: "modified",
        dcc: "act/act",
        calendar: "TARGET",
        disc_curve: "EURO-GOV",
        fwd_curve: "EURO-GOV",
        currency: "USD"
    });
    TestFramework.assert(check(results), "Vector pricing with swap returns valid vector of numbers");

    results = JsonRisk.vector_pricer({
        type: 'bond',
        effective_date: JsonRisk.valuation_date,
        maturity: TestFramework.get_utc_date(2032, 1, 1),
        notional: 100.0,
        fixed_rate: 0.0125,
        tenor: 12,
        repay_tenor: 6,
        repay_amount: 1.20,
        bdc: "following",
        dcc: "act/act",
        calendar: "TARGET",
        settlement_days: 2,
        disc_curve: "EURO-GOV",
        spread_curve: "EURO-GOV",
        currency: "USD"
    });
    TestFramework.assert(check(results), "Vector pricing with amortizing bond returns valid vector of numbers");

    results = JsonRisk.vector_pricer({
        type: 'swaption',
        is_payer: true,
        maturity: TestFramework.get_utc_date(2032, 1, 1),
        first_exercise_date: TestFramework.get_utc_date(2022, 1, 1),
        notional: 100.0,
        fixed_rate: 0.0125,
        tenor: 12,
        float_spread: 0.00758,
        float_current_rate: 0,
        float_tenor: 3,
        bdc: "following",
        float_bdc: "modified",
        dcc: "act/act",
        calendar: "TARGET",
        disc_curve: "EURO-GOV",
        fwd_curve: "EURO-GOV",
        surface: "EUR-SWPTN",
        currency: "USD"
    });
    TestFramework.assert(check(results), "Vector pricing with swaption returns valid vector of numbers");

    results = JsonRisk.vector_pricer({
        type: 'callable_bond',
        maturity: TestFramework.get_utc_date(2032, 1, 1),
        first_exercise_date: TestFramework.get_utc_date(2025, 1, 1),
        call_tenor: 3,
        notional: 100.0,
        fixed_rate: 0.0125,
        tenor: 12,
        bdc: "following",
        dcc: "act/act",
        calendar: "TARGET",
        settlement_days: 2,
        disc_curve: "EURO-GOV",
        surface: "EUR-SWPTN",
        fwd_curve: "EURO-GOV",
        spread_curve: "EURO-GOV",
        currency: "EUR"
    });
    TestFramework.assert(check(results), "Vector pricing with callable bond returns valid vector of numbers");

}
