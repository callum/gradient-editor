const { elements } = chrome.devtools.panels;

elements.createSidebarPane('Gradient editor', sidebar => {
  sidebar.setPage('sidebar-pane.html');
  sidebar.setHeight('100ex');
});
