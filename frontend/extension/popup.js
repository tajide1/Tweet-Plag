// This callback function is called when the content script has been
// injected and returned its results
function onPageDetailsReceived(pageDetails) {
    var name = pageDetails.title.split(' on Twitter: ')
    name = name[0]
    document.getElementById('title').value = name;
    var id  = pageDetails.url.split('/')
    id = id[id.length-1]
    document.getElementById('url').value = id;
    document.getElementById('summary').innerText = pageDetails.summary;
}

// Global reference to the status display SPAN
var statusDisplay = null;

// POST the data to the server using XMLHttpRequest
function addBookmark() {
    // Cancel the form submit
    event.preventDefault();

    // The URL to POST our data to
    var postUrl = 'http://localhost:5000/result';
    
    // Prepare the data to be POSTed by URLEncoding each field's contents
    var title = document.getElementById('title');
    var url = document.getElementById('url');
    var summary = document.getElementById('summary');
    formData = new FormData();
    formData.append("title", title.value);
    formData.append("url", url.value);
    formData.append("summary", summary.value);
    // Set up an asynchronous AJAX POST request
    var xhr = new XMLHttpRequest();
    xhr.open('POST', postUrl, true);


  



    // Handle request state change events
    xhr.onreadystatechange = function() {
        // If the request completed
        if (xhr.readyState == 4) {
            statusDisplay.innerHTML = '';
            if (xhr.status == 200) {
                // If it was a success, close the popup after a short delay
                statusDisplay.innerHTML = xhr.responseText;
                // window.setTimeout(window.close, 1000);
            } else {
                // Show what went wrong
                statusDisplay.innerHTML = 'Error Analyzing: ' + url.value;
            }
        }
    };

    // Send the request and set status
    xhr.send(formData);
    statusDisplay.innerHTML = 'Analyzing Tweet...';
}

// When the popup HTML has loaded
window.addEventListener('load', function(evt) {
    // Cache a reference to the status display SPAN
    statusDisplay = document.getElementById('status-display');
    // Handle the bookmark form submit event with our addBookmark function
    document.getElementById('addbookmark')
            .addEventListener('submit', addBookmark);
    // Get the event page
    chrome.runtime.getBackgroundPage(function(eventPage) {
        // Call the getPageInfo function in the event page, passing in
        // our onPageDetailsReceived function as the callback. This
        // injects content.js into the current tab's HTML
        eventPage.getPageDetails(onPageDetailsReceived);
    });
});