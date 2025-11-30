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

(async function fillCopyright() {
  const authorFName = document.querySelector('[id="bookContributors[0].firstName"]')
  const authorLName = document.querySelector('[id="bookContributors[0].lastName"]')



  if (data.publisher) {
    const [fName, lName] = data.publisher.split(' ')

    if (authorFName) {
      authorFName.value = fName
      authorFName.dispatchEvent(new Event('input', { bubbles: true }))
    }

    if (authorLName) {
      authorLName.value = lName
      authorLName.dispatchEvent(new Event('input', { bubbles: true }))
    }
  }

})()



