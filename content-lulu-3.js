const data = window.bookAutoFillData;

console.log("data is ::", data);

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const setValue = async (element, value, isEnterClick = false) => {
  if (!element) return console.warn("Not found:", element);

  const proto = Object.getPrototypeOf(element);
  const setter = Object.getOwnPropertyDescriptor(proto, "value").set;

  setter.call(element, value);

  element.dispatchEvent(new Event("input", { bubbles: true }));

  await delay(300)

  if (isEnterClick) {
    const events = ["keydown", "keypress", "keyup"];
    events.forEach((type) => {
      element.dispatchEvent(
        new KeyboardEvent(type, {
          key: "Enter",
          code: "Enter",
          keyCode: 13,
          which: 13,
          bubbles: true,
        })
      );
    });
  }

};

(async function fillDetails() {
  const description = document.querySelector('#description');

  if (data.description && description) {
    description.value = data.description
    description.dispatchEvent(new Event('input', { bubbles: true }))
  }

  const tableOfContent = document.querySelector('#tableOfContent');

  if (data.searchTerms && tableOfContent) {
    tableOfContent.value = data.searchTerms
    description.dispatchEvent(new Event('input', { bubbles: true }))
  }


  const keywordsInput = document.querySelector('input[aria-label=Keywords]');
  debugger
  if (keywordsInput && data.searchTerms.length > 0) {
    const terms = data.searchTerms.split(',').map(t => t.trim()).filter(Boolean)
    const MAX_KEYWORDS = Math.min(50, terms.length)
    for (let i = 0; i < MAX_KEYWORDS; i++) {
      if (!terms[i]) continue
      await setValue(keywordsInput, terms[i], true)
      await delay(300)
    }
  }

})()



