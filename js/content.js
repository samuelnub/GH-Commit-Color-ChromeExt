(function () {
    const calenderSvg = document.getElementsByClassName("js-calendar-graph-svg").item(0);
    if (!calenderSvg) {
        console.log("Can't get svg element! I guess this isn't a user's profile page :(");
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

    // Object of numbered rgb(?,?,?) strings
    let originalLegend = {};
    const legendElements = document.getElementsByClassName("legend")[0].getElementsByTagName("li");
    for (let i = 0; i < legendElements.length; i++) {
        originalLegend[i] = legendElements[i].style.backgroundColor;
    }

    (function () {
        chrome.storage.sync.set({ "originalLegend": originalLegend }, function () {
            console.log("Sync'd original legend from the site itself! Here:");
            console.log(originalLegend);
        });
    })();

    const changeColor = function (changes, namespace) {
        chrome.storage.sync.get("ourLegend", function (items) {
            let newLegend = {};
            Object.assign(newLegend, items["ourLegend"]);

            if (!newLegend.hasOwnProperty("0") && !newLegend.hasOwnProperty("1") && !newLegend.hasOwnProperty("2") && !newLegend.hasOwnProperty("3") && !newLegend.hasOwnProperty("4")) {
                let alreadySameCount = 0;
                for (let i = 0; i < Object.keys(originalLegend).length; i++) {
                    if (legendElements[i].style.backgroundColor == originalLegend[i]) {
                        alreadySameCount++;
                    }
                }
                if (alreadySameCount == Object.keys(originalLegend).length) {
                    // Everything's the same, and we've recieved a completely undefined object (which means it was reset)
                    return;
                }
            }

            (function () {
                for (let i = 0; i < legendElements.length; i++) {
                    legendElements[i].setAttribute("style", "background-color: " + (newLegend[i] ? newLegend[i] : originalLegend[i]));
                }

                // of loop grabs the object as a whole
                for (let square of calenderSquares) {
                    switch (square.val) {
                        case originalLegend[0]:
                            square.element.setAttribute("fill", (newLegend[0] ? newLegend[0] : originalLegend[0]));
                            break;
                        case originalLegend[1]:
                            square.element.setAttribute("fill", (newLegend[1] ? newLegend[1] : originalLegend[1]));
                            break;
                        case originalLegend[2]:
                            square.element.setAttribute("fill", (newLegend[2] ? newLegend[2] : originalLegend[2]));
                            break;
                        case originalLegend[3]:
                            square.element.setAttribute("fill", (newLegend[3] ? newLegend[3] : originalLegend[3]));
                            break;
                        case originalLegend[4]:
                            square.element.setAttribute("fill", (newLegend[4] ? newLegend[4] : originalLegend[4]));
                            break;
                        default:
                            console.log("Couldn't find a colour match for square and legend :( " + square.val);
                            break;
                    }
                }
            })();
        });
    };
    // Can't have iife and pass it to the listener callback, well at least not that i know of :(
    changeColor();
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

    function rgbStringToRgb(rgbString) {
        return {
            r: rgbString.replace(/[^\d,]/g, '').split(',')[0],
            g: rgbString.replace(/[^\d,]/g, '').split(',')[1],
            b: rgbString.replace(/[^\d,]/g, '').split(',')[2]
        };
    }

})();