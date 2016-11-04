function god() {
    const calenderSvg = document.getElementsByClassName("js-calendar-graph-svg").item(0);
    if (!calenderSvg) {
        console.log("Can't get svg element! :(");
        return;
    }

    // Array of objects with the members: element and rgb value (string)
    let calenderSquares = [];
    const calenderColumns = calenderSvg.getElementsByTagName("g")[0].getElementsByTagName("g");
    for (let column of calenderColumns) {
        let weekSquares = column.getElementsByTagName("rect");
        for (let square of weekSquares) {
            calenderSquares.push({ element: square, val: rgbString(hexToRgb(square.getAttribute("fill")).r, hexToRgb(square.getAttribute("fill")).g, hexToRgb(square.getAttribute("fill")).b) });
        }
    }

    let originalLegend = [];
    const legendElements = document.getElementsByClassName("legend")[0].getElementsByTagName("li");
    for (let element of legendElements) {
        originalLegend.push(element.style.backgroundColor);
        console.log("Original legend: " + element.style.backgroundColor + " with typeof: " + typeof element.style.backgroundColor);
    }

    let changeColor = (function () {
        console.log("ayy lmao!");
        // Our sync object should be an array
        let newLegend = {};

        chrome.storage.sync.get("ourLegend", function (obj) {
            console.log("Attained our sync'd legend" + obj);
            newLegend = obj;
            if (!newLegend[0] || !newLegend[1] || !newLegend[2] || !newLegend[3] || !newLegend[4]) {
                console.log("Our legend isn't defined!");
                return;
            }

            // square variable is the element, calenderSquares[square] will be the value
            for (let square in calenderSquares) {
                console.log("Changing colour for: " + calenderSquares[square].val);

                switch (calenderSquares[square].val) {
                    case originalLegend[0]:
                        calenderSquares[square].element.setAttribute("fill", newLegend[0]);
                        break;
                    case originalLegend[1]:
                        calenderSquares[square].element.setAttribute("fill", newLegend[1]);
                        break;
                    case originalLegend[2]:
                        calenderSquares[square].element.setAttribute("fill", newLegend[2]);
                        break;
                    case originalLegend[3]:
                        calenderSquares[square].element.setAttribute("fill", newLegend[3]);
                        break;
                    case originalLegend[4]:
                        calenderSquares[square].element.setAttribute("fill", newLegend[4]);
                        break;
                    default:
                        console.log("Couldn't find a colour match for square and legend :( " + calenderSquares[square].val);
                        break;
                }
            }

            for (let i = 0; i < legendElements.length; i++) {
                legendElements[i].setAttribute("style", "background-color: " + newLegend[i]);
            }
        });
    })();

    chrome.storage.onChanged.addListener(changeColor);

    const johnLegend = [
        "I",
        "V",
        "vi",
        "IV"
    ];

    function hexToRgb(hex) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function rgbString(r, g, b) {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }

};

god();