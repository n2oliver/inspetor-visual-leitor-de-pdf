chrome.runtime.onInstalled.addListener(async () => {
  await chrome.storage.local.set({leitor_pdf_ocultar: false});
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
  
  if(message.action == "reexibir") {
    chrome.tabs.sendMessage(tab.id, { action: "exibir", targetElementId: message.dados.targetElementId },
      (response) => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            return;
        }
      }
    );
  }
  
  if(message.action == "ocultarPeloLeitor") {
    chrome.tabs.sendMessage(tab.id, { action: "ocultar", targetElementId: message.dados.targetElementId },
      (response) => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            return;
        }
      }
    );
  }
  sendResponse({
      tabId
  });

  return true;
});