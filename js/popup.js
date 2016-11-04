document.addEventListener('DOMContentLoaded', function() {
    
    // Array of the div boxes to visually show the colour
    const legendDivs = document.getElementsByClassName("legend");

    let originalLegend = { 0: undefined, 1: undefined, 2: undefined, 3: undefined, 4: undefined };
    (function () {
        chrome.storage.sync.get("originalLegend", function (items) {
            originalLegend = items["originalLegend"];

            if (!originalLegend[0] || !originalLegend[1] || !originalLegend[2] || !originalLegend[3] || !originalLegend[4]) {
                document.getElementById("debug").innerHTML = "Visit any GitHub profile first!";
                return;
            }

            for(let i = 0; i < legendDivs.length; i++) {
                legendDivs[i].style.borderColor = originalLegend[i];
            }
        });
    })();

    // get ourLegend. if undefined, leave the sliders and backgroundcolor to be the same as original
    (function () {
        chrome.storage.sync.get("ourLegend", function (items) {
            const ourLegend = items["ourLegend"];

            if (!ourLegend[0] || !ourLegend[1] || !ourLegend[2] || !ourLegend[3] || !ourLegend[4]) {
                console.log("Our legend is undefined! But that's okay");
                // do stuff
            }

            // The slider elements (0, 1, 2 correspond to rgb of first, etc. there's 15 (index 14 last) total')
            const colRanges = document.getElementsByClassName("colRange");

            // initially setup so the ranges/background reflect ourLegend
            (function() {
                for(let i = 0; i < Object.keys(originalLegend).length; i++) {
                    legendDivs[i].style.backgroundColor = (ourLegend[i]) ? ourLegend[i] : originalLegend[i];
                    for(let j = 0; j < 3; j++) {
                        colRanges[i * 3 + j].value = rgbStringToRgb((ourLegend[i]) ? ourLegend[i] : originalLegend[i])[j] * (100 / 255);
                    }
                }
            })();

            // small copy just for const's sake. this is the one that will write to our sync storage "ourLegend"
            let newLegend = ourLegend;

            // Setup event listeners for range sliders and apply/reset buttons
            (function () {
                for (let i = 0; i < Object.keys(originalLegend).length; i++) {
                    for (let j = 0; j < 3; j++) {
                        colRanges[i * 3 + j].addEventListener("input", function () {
                            let ourRIndex = i * 3 + 0;
                            let ourGIndex = i * 3 + 1;
                            let ourBIntex = i * 3 + 2;

                            ourLegend[i] = rgbString(colRanges[ourRIndex].value, colRanges[ourGIndex].value, colRanges[ourBIntex].value);
                            legendDivs[i].style.backgroundColor = ourLegend[i];
                        }, false);
                    }
                }
            })();

        });
    })();

    function rgbString(r, g, b) {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }

    // slightly different from the content.js one, to just have the return object consist of numbered members instead of r,g,b
    function rgbStringToRgb(rgbString) {
        return {
            0: rgbString.replace(/[^\d,]/g, '').split(',')[0],
            1: rgbString.replace(/[^\d,]/g, '').split(',')[1],
            2: rgbString.replace(/[^\d,]/g, '').split(',')[2]
        };
    }

}, false);