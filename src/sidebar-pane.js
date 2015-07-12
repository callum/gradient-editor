const port = chrome.runtime.connect({ name: 'sidebar' });

function inject(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', chrome.extension.getURL('dist/injected.js'), true);

  xhr.onload = () => {
    chrome.devtools.inspectedWindow.eval(xhr.responseText, () => {
      callback();
    });
  };

  xhr.send();
}

function postMessage(payload) {
  port.postMessage({ ...payload, tabId: chrome.devtools.inspectedWindow.tabId });
}

inject(() => {
  postMessage({ type: 'INITIALIZE' });

  chrome.devtools.panels.elements.onSelectionChanged.addListener(() => {
    postMessage({ type: 'INITIALIZE' });
  });

  port.onMessage.addListener(payload => {
    console.log(payload);
  });
});
