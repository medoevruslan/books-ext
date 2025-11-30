const data = window.bookAutoFillData;

console.log("data is ::", data);

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const setValue = async (element, value, isEnterClick = false) => {
  if (!element) return console.warn("Not found:", element);

  if (element.isContentEditable) {
    element.focus();
    element.textContent = value
    element.dispatchEvent(new Event('input', { bubbles: true }))
    element.dispatchEvent(new Event('change', { bubbles: true }))
    element.blur()
  } else {

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
  }
};

function waitForSelector(sel) {
  return new Promise(resolve => {
    const observer = new MutationObserver(() => {
      const el = document.querySelector(sel);
      if (el) {
        observer.disconnect();
        resolve(el)
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })

    const initial = document.querySelector(sel);
    if (initial) {
      observer.disconnect()
      resolve(initial)
    }
  })


}

(async function fillStart() {
  const bookType = document.querySelector('[data-testid="wizard-start-radio-productType-EBOOK"] button')
  bookType?.click()

  const projectTitle = await waitForSelector('#projectTitle')

  await delay(500)

  projectTitle.scrollIntoView({ behavior: 'smooth' })

  if (data.title) {
    projectTitle.value = data.title
    projectTitle.dispatchEvent(new Event('input', { bubbles: true }))
  }

})()



