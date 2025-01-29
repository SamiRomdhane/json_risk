TEST_NAME = "Python Referenzdaten-Test";

test = {
    name: TEST_NAME,
};

if (typeof module === "object" && typeof exports !== "undefined") {
    // Node.js
    module.exports = test;
} else {
    // Browser
    root.jr_tests.push_back(test);
}

test.execute = function (TestFramework, JsonRisk) {
    // Referenzdaten laden
    const referenceData = require(__dirname + "/../python_reference_data.json");

    // Testlogik für jedes Szenario
    for (const scenario in referenceData) {
        console.log(`Teste Szenario: ${scenario}`);
        const data = referenceData[scenario];

        // Erstelle eine gültige Kurve für JsonRisk
        const curve = {
            times: data.map(entry => entry.t),  // Extrahiere alle Zeiten
            dfs: data.map(entry => entry.DF)    // Extrahiere die DF-Werte
        };

        data.forEach((entry) => {
            const t = entry.t;
            const expectedDF = entry.DF;

            const actualDF = JsonRisk.get_df(curve, t);
			
			console.log(`Vergleich für t=${t}`);
		
			console.log(`Erwarteter DF-Wert: ${expectedDF}`);
			console.log(`Berechneter DF-Wert: ${actualDF}`);
			console.log(`Abweichung DF: ${Math.abs(expectedDF - actualDF)}`);

            // Vergleiche die Werte
            TestFramework.assert(
                Math.abs(actualDF - expectedDF) < 1e-12,
				`${scenario}: Diskontfaktorenvergleich bei t=${t}`);
        });
    }
};
