import actionTypes from './lib/action-types';

function selectElement() {
  const opts = { useContentScriptContext: true };

  chrome.devtools.inspectedWindow.eval('selectElement($0)', opts, (res, err) => {
    if (err) console.error(err);
  });
}

chrome.devtools.panels.elements.createSidebarPane('Gradients', sidebar => {
  const { tabId } = chrome.devtools.inspectedWindow;

  sidebar.setPage('sidebar-pane.html');
  sidebar.setHeight('100ex');

  const listener = () => {
    selectElement();
  };

  const port = chrome.runtime.connect({ name: 'devtools' });

  port.postMessage({ tabId, action: actionTypes.INITIALIZE });

  sidebar.onShown.addListener(() => {
    selectElement();
    chrome.devtools.panels.elements.onSelectionChanged.addListener(listener);
  });

  sidebar.onHidden.addListener(() => {
    port.postMessage({ tabId, action: actionTypes.TERMINATE });
    chrome.devtools.panels.elements.onSelectionChanged.removeListener(listener);
  });
});

