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
  } catch (error) {
    statusEl.textContent = "Unable to detect host.";
    hostEl.textContent = error.message;
  }
}

document.getElementById("fillBtn").onclick = async () => {
  // const fileInput = document.getElementById("fileInput").files[0];
  // if (!fileInput) return alert("Choose a file");

  // const text = await fileInput.text();
  // const bookData = JSON.parse(text);

  console.log("click()");
  const bookData = {
    title: "some title",
    searchTerms:
      "антикультовая сеть, антикультовое движение, риторика ненависти, жертвы антикульта, изъятие детей, секты, культы, Александр Дворкин, РАЦИРС, FECRIS, идеологи ненависти, манипуляция сознанием, гонения на верующих, гонения за веру, борьба с сектами, репрессии, сектоведение, дегуманизация, информационные войны, псевдонаучные экспертизы, промывание мозгов, манипуляция общественным сознанием, антикультовая риторика, свобода совести, свобода вероисповедания, стигматизация, Свидетели Иеговы, религиозная дискриминация, нацизм",
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

detectHost();
