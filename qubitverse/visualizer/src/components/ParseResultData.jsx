const ParseValueLine = (line) => {
    return line.split("=");
}

const ParseQubitData = (lines, startIndex) => {
    let vals = [];
    let i = startIndex;
    while (/^[ a-z]+$/i.test(lines[i]) === false && lines[i] !== "") {
        const tup = ParseValueLine(lines[i]);
        vals.push({
            qubit: tup[0] + ": |" + Number(tup[0]).toString(2) + "〉\t",
            value: tup[1]
        });
        i++;
    }
    return { values: vals, newIndex: i };
}

const ParseProbData = (lines, i) => {
    const tup = ParseValueLine(lines[i]);
    return { name: tup[0], value: Number(tup[1]) };
}

export const ParseResultData = ({ data, setBlochData, setProbData, setEdgesResultGraph, setVerticesResultGraph, setMeasuredValue, setMeasurementHist }) => {
    var vertices = [], edges = [], measured = NaN, prob = [], blochData = [], isMeasureSystem = false;
    const lines = data.split('\n');

    for (let i = 0, j = 0; i < lines.length; i++) {
        if (lines[i] === "+") {
            const { values, newIndex } = ParseQubitData(lines, i + 1); // start after the "+" marker if needed
            vertices.push({
                id: j + 1,
                label: "Initial State",
                originalLabel: "Initial State",
                expanded: false,
                values: values
            });
            i = newIndex - 1; // set i to the last processed index; the for-loop will then increment it
            j++;
        }
        else if (lines[i] === "measureNth") {
            const { values, newIndex } = ParseQubitData(lines, i + 1);
            vertices.push({
                id: j + 1,
                label: "Measuring the Qubit",
                originalLabel: "Measuring the Qubit",
                expanded: false,
                values: values
            });
            i = newIndex - 1; // set i to the last processed index; the for-loop will then increment it
            j++;
        }
        else if (lines[i] === "prob") {
            i++; // skip prob
            while (/^[ a-z]+$/i.test(lines[i]) === false && lines[i] !== "") {
                prob.push(ParseProbData(lines, i));
                i++;
            }
            i--;
        }
        else if (lines[i] === "bloch") {
            i++; // skip bloch
            while (/^[ a-z]+$/i.test(lines[i]) === false && lines[i] !== "") {
                const tup = ParseValueLine(lines[i]);
                blochData.push({
                    qubit: tup[0],
                    x: Number(tup[1].split(",")[0]),
                    y: Number(tup[1].split(",")[1]),
                    z: Number(tup[1].split(",")[2])
                });
                i++;
            }
            i--;
        }
        else if (lines[i] === "measure") {
            i++;
            measured = Number(lines[i++]);
            isMeasureSystem = true;
        }
        else {
            if (lines[i] === "") continue;
            const { values, newIndex } = ParseQubitData(lines, i + 1); // start after the "+" marker if needed
            vertices.push({
                id: j + 1,
                label: "Applying " + lines[i].toUpperCase() + " Gate",
                originalLabel: "Applying " + lines[i].toUpperCase() + " Gate",
                expanded: false,
                values: values
            });
            i = newIndex - 1; // set i to the last processed index; the for-loop will then increment it
            j++;
        }
    }

    if (isMeasureSystem) {
        // collapse the hilbert-space
        for (let i = 0; i < prob.length; i++) {
            prob[i].value = 0;
        }
        prob[measured].value = 1;

        let measuredValueVertex = JSON.parse(JSON.stringify(vertices[0].values)); // deep copy
        for (let i = 0; i < measuredValueVertex.length; i++) {
            measuredValueVertex[i].value = "(0,0)";
        }
        measuredValueVertex[measured].value = "(1,0)";

        vertices.push({
            id: vertices.length + 1,
            label: "Measured State",
            originalLabel: "Measured State",
            expanded: false,
            values: measuredValueVertex
        });

        setMeasurementHist(prev => [...prev, measured]);
    }

    for (let i = 0; i < vertices.length - 1; i++) {
        edges.push({ from: i + 1, to: i + 2 });
    }

    setProbData(prob);
    setEdgesResultGraph(edges);
    setVerticesResultGraph(vertices);
    setMeasuredValue(measured);
    setBlochData(blochData);
};

export default ParseResultData;