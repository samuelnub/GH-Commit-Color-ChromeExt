document.addEventListener("DOMContentLoaded", function() {

    // Array of the div boxes to visually show the colour
    const legendDivs = document.getElementsByClassName("legend");

    let originalLegend = { 0: undefined, 1: undefined, 2: undefined, 3: undefined, 4: undefined };
    (function () {
        chrome.storage.sync.get("originalLegend", function (items) {
            originalLegend = items["originalLegend"];

            if (!originalLegend[0] || !originalLegend[1] || !originalLegend[2] || !originalLegend[3] || !originalLegend[4]) {
                debugLog("Visit any GitHub profile page first!");
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
            // this isn't that relavent
            let newLegend = items["ourLegend"];

            if (!newLegend[0] || !newLegend[1] || !newLegend[2] || !newLegend[3] || !newLegend[4]) {
                console.log("Our legend is undefined! But that's okay");
                // do stuff
            }

            // The slider elements (0, 1, 2 correspond to rgb of first, etc. there's 15 (index 14 last) total')
            const colRanges = document.getElementsByClassName("colRange");

            // initially setup so the ranges/background reflect newLegend
            const setFromNewLegend = function() {
                for(let i = 0; i < Object.keys(originalLegend).length; i++) {
                    legendDivs[i].style.backgroundColor = (newLegend[i] ? newLegend[i] : originalLegend[i]);
                    for(let j = 0; j < 3; j++) {
                        colRanges[i * 3 + j].value = rgbStringToRgb((newLegend[i] ? newLegend[i] : originalLegend[i]))[j] * (100 / 255);
                    }
                }
            };
            setFromNewLegend();

            // Setup event listeners for range sliders and apply/reset buttons
            (function () {
                for (let i = 0; i < Object.keys(originalLegend).length; i++) {
                    for (let j = 0; j < 3; j++) {
                        colRanges[i * 3 + j].addEventListener("input", function () {
                            newLegend[i] = rgbString(Math.round(colRanges[i * 3 + 0].value * 2.55), Math.round(colRanges[i * 3 + 1].value * 2.55), Math.round(colRanges[i * 3 + 2].value * 2.55));
                            legendDivs[i].style.backgroundColor = newLegend[i];
                        }, false);
                    }
                }
            })();

            // Setup the apply (sync) and reset (sync undefined object by setting the slider value since it listens for input)
            (function() {
                document.getElementById("apply").addEventListener("click", function() {
                    // this should save on performance if our legend is equal to the original one on the site, as our content.js will simply skip chaning colour if its undefined
                    let equalCount = 0;
                    for(let i = 0; i < Object.keys(originalLegend).length; i++) {
                        if(newLegend[i] == originalLegend[i] || !newLegend[i]) {
                            equalCount++;
                            console.log("equal! " + equalCount);
                        }
                    }
                    chrome.storage.sync.set((equalCount != Object.keys(originalLegend).length ? {"ourLegend" : newLegend} : { "ourLegend" : {0: undefined, 1: undefined, 2: undefined, 3: undefined, 4: undefined}}), function() {
                        debugLog("Applied!");
                    });
                }, false);

                document.getElementById("reset").addEventListener("click", function() {
                    Object.assign(newLegend, originalLegend);
                    setFromNewLegend();
                    debugLog("Reset!");
                }, false);
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

    function debugLog(message) {
        document.getElementById("debug").innerHTML = message;
        setTimeout(function() {
            document.getElementById("debug").innerHTML = "";
        }, 5000);
    }

}, false);