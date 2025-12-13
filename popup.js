const statusEl = document.getElementById("status");
const hostEl = document.getElementById("host");

const routes = {
  'play.google.com': [
    { pattern: /about/, script: 'content-gbooks-about.js' },
    { pattern: /genres/, script: 'content-gbooks-genres.js' }
  ],
  'draft2digital.com': [
    { pattern: /\/book\/e\/\d+$/, script: 'content-d2d-description.js' },
    { pattern: /\/book\/m\/\d+\/ebook$/, script: 'content-d2d-main.js' }
  ],
  'www.wattpad.com': [
    { pattern: /.*/, script: 'content-wattpad.js' }
  ],
  'www.lulu.com': [
    { pattern: /start/, script: 'content-lulu-start.js' },
    { pattern: /copyright/, script: 'content-lulu-copyright.js' },
    { pattern: /details/, script: 'content-lulu-details.js' }
  ]
};

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

    checkSupport(url);

    return url.host
  } catch (error) {
    statusEl.textContent = "Unable to detect host.";
    hostEl.textContent = error.message;
  }
}

function checkSupport(url) {
  const supportEl = document.getElementById("supportStatus");
  const fillBtn = document.getElementById("fillPage");
  let isSupported = false;

  if (routes[url.hostname]) {
    const hostRoutes = routes[url.hostname];
    const match = hostRoutes.find(route => route.pattern.test(url.href));
    if (match) {
      isSupported = true;
    }
  }

  if (isSupported) {
    supportEl.textContent = "Supported Website";
    supportEl.className = "support-status supported";
    fillBtn.disabled = false; // Will be re-evaluated by validateForm, but initially allow it if form is valid
    validateForm(); // Re-run validation to ensure buttons are correct based on form data AND support
  } else {
    supportEl.textContent = "Not Supported";
    supportEl.className = "support-status unsupported";
    fillBtn.disabled = true;
    fillBtn.title = "This website is not supported for auto-fill.";
  }
}

const host = detectHost();

// Load saved data
document.addEventListener('DOMContentLoaded', async () => {
  const data = await chrome.storage.local.get([
    'title', 'publisher', 'searchTerms', 'categories', 'shortDescription', 'description'
  ]);

  if (data.title) document.getElementById('title').value = data.title;
  if (data.publisher) document.getElementById('publisher').value = data.publisher;
  if (data.searchTerms) document.getElementById('searchTerms').value = data.searchTerms;
  if (data.categories) document.getElementById('categories').value = data.categories;
  if (data.shortDescription) document.getElementById('shortDescription').value = data.shortDescription;
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
  const supportEl = document.getElementById("supportStatus");
  const isSupported = supportEl.classList.contains("supported");

  if (!isSupported) {
    btn.disabled = true;
    btn.title = "This website is not supported for auto-fill.";
    return;
  }

  btn.disabled = !isValid;
  btn.title = isValid ? "" : "Please fill Title, Publisher, Search Terms, and Description";
}

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const debouncedSave = debounce(async (id, value) => {
  await chrome.storage.local.set({ [id]: value });
}, 500);

['title', 'publisher', 'searchTerms', 'categories', 'shortDescription', 'description'].forEach(id => {
  const element = document.getElementById(id);
  element.addEventListener('input', (e) => {
    validateForm();
    debouncedSave(id, e.target.value);
  });
});

document.getElementById("resetForm").onclick = async () => {
  await chrome.storage.local.clear();

  ['title', 'publisher', 'searchTerms', 'categories', 'shortDescription', 'description'].forEach(id => {
    document.getElementById(id).value = '';
  });

  validateForm();
};

document.getElementById("fillPage").onclick = async () => {
  const title = document.getElementById('title').value;
  const publisher = document.getElementById('publisher').value;
  const searchTerms = document.getElementById('searchTerms').value;
  const categoriesStr = document.getElementById('categories').value;
  const shortDescription = document.getElementById('shortDescription').value;
  const description = document.getElementById('description').value;

  // Save data
  await chrome.storage.local.set({
    title, publisher, searchTerms, categories: categoriesStr, shortDescription, description
  });

  const categories = categoriesStr.split(',').map(c => c.trim()).filter(Boolean);

  const bookData = {
    title,
    publisher,
    searchTerms,
    categories,
    shortDescription,
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
