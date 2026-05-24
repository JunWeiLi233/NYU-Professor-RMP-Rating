const status = document.getElementById("status");

chrome.storage.local.get(null).then((items) => {
  const cached = Object.keys(items).filter((key) => key.startsWith("professor:")).length;
  status.textContent = cached === 1 ? "1 professor cached" : `${cached} professors cached`;
});
