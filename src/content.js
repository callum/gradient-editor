const port = chrome.runtime.connect({ name: 'content' });

window.addEventListener('message', payload => {
  port.postMessage(payload);
}, false);

port.onMessage.addListener(payload => {
  window.postMessage(payload, '*');
});
