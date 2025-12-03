const data = window.bookAutoFillData;

console.log("data is ::", data);

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const setValue = async (element, value, isEnterClick = false) => {
  if (!element) return console.warn("Not found:", element);

  const proto = Object.getPrototypeOf(element);
  const setter = Object.getOwnPropertyDescriptor(proto, "value").set;

  setter.call(element, value);

  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.focus();

  await delay(1000)

  if (isEnterClick) {
    const events = ["keydown", "keypress", "keyup"];

    // Simulate ArrowDown to select the first option
    events.forEach((type) => {
      element.dispatchEvent(
        new KeyboardEvent(type, {
          key: "ArrowDown",
          code: "ArrowDown",
          keyCode: 40,
          which: 40,
          bubbles: true,
        })
      );
    });

    // Small delay between ArrowDown and Enter
    await delay(100);

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


const inputsWrapper = document.querySelector('subjects-input');
const addBisacBtn = inputsWrapper.querySelector(':scope > button');

let inputAddAttempt = 0

async function fillBisacs(codes) {
  for (let i = 0; i < codes.length; i++) {
    let input = inputsWrapper.querySelectorAll('input')[i];

    if (!input) {
      addBisacBtn.click();
      await delay(200); // Wait for input to appear

      // Re-query input after adding
      input = inputsWrapper.querySelectorAll('input')[i];

      if (!input) {
        throw new Error(`Bisacs input ${i} not found even after clicking add`);
      }
    }

    await delay(500);
    await setValue(input, codes[i], true);
    await delay(1000);
  }
}

if (data.categories) {
  fillBisacs(data.categories)
}

