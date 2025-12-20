// content_script.js
console.log("WhatsPlatform Extension Loaded");

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "get_page_content") {
    sendResponse({ content: document.body.innerText });
  }
});

// Example: Inject a button or overlay if needed
// const btn = document.createElement("button");
// btn.innerText = "Send to WhatsPlatform";
// document.body.appendChild(btn);
