document.addEventListener('DOMContentLoaded', function() {
    let ourLegendTest = {
        0: "hello!",
        1: "yo",
        2: "yeah boy",
        3: "oh",
        4: "maybe???"
    };

    chrome.storage.sync.set({"ourLegend" : ourLegendTest}, function() {
        console.log(ourLegendTest);
    });

    chrome.storage.sync.get(null, function (items) {
        let ourItems = items;
        for (let item in ourItems) {
            console.log("Item: " + item);
            for (let subItem in ourItems[item]) {
                console.log("Sub item: " + subItem + ": " + ourItems[item][subItem]);
            }
        }
    });

    console.log(chrome.storage);
}, false);