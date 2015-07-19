import actions from './lib/actions';

chrome.runtime.onConnect.addListener(port => {
  const listener = (payload) => {
    const { tabId, action } = payload;

    switch (action) {
      case actions.INITIALIZE:
        chrome.tabs.executeScript(tabId, { file: 'dist/content.js' });

        port.onDisconnect.addListener(() => {
          chrome.tabs.sendMessage(tabId, { action: actions.TERMINATE });
          port.onMessage.removeListener(listener);
        });

        break;
      default:
        chrome.tabs.sendMessage(tabId, payload);
    }
  };

  port.onMessage.addListener(listener);
});
