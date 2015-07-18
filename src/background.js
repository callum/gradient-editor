const contentConnections = {};
const sidebarConnections = {};

function initContentConnection(port) {
  const tabId = port.sender.tab.id;

  contentConnections[tabId] = port;

  port.onDisconnect.addListener(() => {
    delete contentConnections[tabId];
  });

  port.onMessage.addListener(payload => {
    sidebarConnections[tabId].postMessage(payload);
  });
}

function initSidebarConnection(port) {
  port.onMessage.addListener(payload => {
    const tabId = payload.tabId;

    if (payload.type === 'INITIALIZE') {
      sidebarConnections[tabId] = port;

      port.onDisconnect.addListener(() => {
        contentConnections[tabId].postMessage({ type: 'TERMINATE' });
        delete sidebarConnections[tabId];
      });
    }

    contentConnections[tabId].postMessage(payload);
  });
}

chrome.runtime.onConnect.addListener(port => {
  switch (port.name) {
    case 'content':
      initContentConnection(port);
      break;

    case 'sidebar':
      initSidebarConnection(port);
      break;
  }
});
