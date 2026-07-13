chrome.runtime.onInstalled.addListener(async () => {
  await chrome.storage.local.set({insp_visual_ligado: true});
  await chrome.storage.local.set({insp_visual_leitor_de_tela: true});
  await chrome.storage.local.set({insp_visual_ocultar: false});
});
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
  });
  const tabId = tab.id;

  if(message.action == "salvarTabId") {
    chrome.storage.local.set({tabId: tab.id});
  }
  if(message.action == "ocultar") {
    chrome.runtime.sendMessage({ action: "ocultar", targetElementId: message.dados.targetElementId });
  }
  sendResponse({
      tabId
  });

  return true;
});