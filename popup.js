const statusEl = document.getElementById("status");
const hostEl = document.getElementById("host");

async function detectHost() {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab || !tab.url) {
      statusEl.textContent = "No accessible tab.";
      return;
    }

    const url = new URL(tab.url);

    hostEl.textContent = url.host || "(no host)";
    statusEl.textContent = "You're currently on:";
    return url.host
  } catch (error) {
    statusEl.textContent = "Unable to detect host.";
    hostEl.textContent = error.message;
  }
}

const host = detectHost();

// Load saved data
document.addEventListener('DOMContentLoaded', async () => {
  const data = await chrome.storage.local.get([
    'title', 'publisher', 'searchTerms', 'categories', 'description'
  ]);

  if (data.title) document.getElementById('title').value = data.title;
  if (data.publisher) document.getElementById('publisher').value = data.publisher;
  if (data.searchTerms) document.getElementById('searchTerms').value = data.searchTerms;
  if (data.categories) document.getElementById('categories').value = data.categories;
  if (data.description) document.getElementById('description').value = data.description;

  validateForm();
});

function validateForm() {
  const title = document.getElementById('title').value.trim();
  const publisher = document.getElementById('publisher').value.trim();
  const searchTerms = document.getElementById('searchTerms').value.trim();
  const description = document.getElementById('description').value.trim();

  const isValid = title && publisher && searchTerms && description;
  const btn = document.getElementById("fillPage");
  btn.disabled = !isValid;
  btn.title = isValid ? "" : "Please fill Title, Publisher, Search Terms, and Description";
}

['title', 'publisher', 'searchTerms', 'description'].forEach(id => {
  document.getElementById(id).addEventListener('input', validateForm);
});

document.getElementById("fillPage").onclick = async () => {
  const title = document.getElementById('title').value;
  const publisher = document.getElementById('publisher').value;
  const searchTerms = document.getElementById('searchTerms').value;
  const categoriesStr = document.getElementById('categories').value;
  const description = document.getElementById('description').value;

  // Save data
  await chrome.storage.local.set({
    title, publisher, searchTerms, categories: categoriesStr, description
  });

  const categories = categoriesStr.split(',').map(c => c.trim()).filter(Boolean);

  const bookData = {
    title,
    publisher,
    searchTerms,
    categories,
    description
  };

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (data) => {
      window.bookAutoFillData = data; // store globally
    },
    args: [bookData],
  });

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"],
  });
};
