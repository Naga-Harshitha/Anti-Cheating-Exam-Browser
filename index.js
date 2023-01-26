// Extension should work only in selected URLs(test page) during a certain time/trigger.
chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {hostEquals: 'www.testpage.com'},
                // Add time/trigger condition here
            })],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

// The browser should open in full screen mode.
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    chrome.tabs.update(tabId, {'url': 'chrome://flags/#fullscreen-api'});
});

// Pop up should be shown when someone switches between 2 tabs or Application.
chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
        // Show pop up here
    });
});

// More than one tab can’t be opened.
chrome.tabs.onCreated.addListener(function(tab) {
    chrome.tabs.query({}, function(tabs) {
        if (tabs.length > 1) {
            chrome.tabs.remove(tab.id);
        }
    });
});

// Users should not be able to close the tab by the normal close button [shortcut keys should not work too]. (User should only be able to close tab by clicking on “End Test” Button)
var endTestClicked = false;
document.getElementById("endTestButton").addEventListener("click", function() {
    endTestClicked = true;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.remove(tabs[0].id);
    });
});
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    // Check if "End Test" button was clicked
    if (!endTestClicked) {
        // Show error message
    }
});

// Should do requirement check initially when extension is activated:
// Audio
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
navigator.getUserMedia({audio: true}, function(stream) {
    // Audio is available
}, function(err) {
    // Audio is not available
});

// Camera
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
navigator.getUserMedia({video: true}, function(stream) {
    // Camera is available
}, function(err) {
    // Camera is not available
});

// Internet Stability
var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://www.testpage.com', true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        // Internet is stable
    } else {
        // Internet is not stable
    }
};
xhr.send();

var endTestClicked = false;
document.getElementById("endTestButton").addEventListener("click", function() {
    endTestClicked = true;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.remove(tabs[0].id);
    });
});

// Capture the user related information in local storage.
var userInfo = {};

// IP
var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.ipify.org?format=json', true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        userInfo.ip = data.ip;
    }
};
xhr.send();

// Requirements check
var requirements = {
    audio: false,
    camera: false,
    internet: false
};
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
navigator.getUserMedia({audio: true}, function(stream) {
    requirements.audio = true;
}, function(err) {
    requirements.audio = false;
});
navigator.getUserMedia({video: true}, function(stream) {
    requirements.camera = true;
}, function(err) {
    requirements.camera = false;
});
var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://www.testpage.com', true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        requirements.internet = true;
    } else {
        requirements.internet = false;
    }
};
xhr.send();
userInfo.requirements = requirements;

// Save userInfo to local storage
localStorage.setItem("userInfo", JSON.stringify(userInfo));