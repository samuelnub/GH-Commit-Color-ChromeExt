(function() {
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

    // Array of rgb(?,?,?) strings
    let originalLegend = [];
    const legendElements = document.getElementsByClassName("legend")[0].getElementsByTagName("li");
    for (let element of legendElements) {
        originalLegend.push(element.style.backgroundColor);
        console.log("Original legend: " + element.style.backgroundColor + " with typeof: " + typeof element.style.backgroundColor);
    }

    let changeColor = (function (changes, namespace) {
        console.log("Attempting to change colours!");

        chrome.storage.sync.get("ourLegend", function (items) {
            console.log("Attained our sync'd legend" + items);
            const newLegend = items;
            if (!newLegend[0] || !newLegend[1] || !newLegend[2] || !newLegend[3] || !newLegend[4]) {
                console.log("Our legend isn't defined!");
                // return;
            }

            console.log("Our legend: " + newLegend[0]);

            // of loop grabs the object as a whole
            for (let square of calenderSquares) {
                console.log("Changing colour for: " + square.val);

                switch (square.val) {
                    case originalLegend[0]:
                        square.element.setAttribute("fill", newLegend[0]);
                        break;
                    case originalLegend[1]:
                        square.element.setAttribute("fill", newLegend[1]);
                        break;
                    case originalLegend[2]:
                        square.element.setAttribute("fill", newLegend[2]);
                        break;
                    case originalLegend[3]:
                        square.element.setAttribute("fill", newLegend[3]);
                        break;
                    case originalLegend[4]:
                        square.element.setAttribute("fill", newLegend[4]);
                        break;
                    default:
                        console.log("Couldn't find a colour match for square and legend :( " + square.val);
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

    function syncOriginal() {
        let legend = { 0: originalLegend[0], 1: originalLegend[1], 2: originalLegend[2], 3: originalLegend[3], 4: originalLegend[4] };
        chrome.storage.sync.set({"originalLegend" : legend }, function() {
            console.log("Since our legend isn't defined, we'll set it to GitHub's original colour scheme");
        });
    }

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
            r: rgb.replace(/[^\d,]/g, '').split(',')[0],
            g: rgb.replace(/[^\d,]/g, '').split(',')[1],
            b: rgb.replace(/[^\d,]/g, '').split(',')[2]
        };
    }

})();