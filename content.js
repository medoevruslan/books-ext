const data = window.bookAutoFillData;

console.log("data is ::", data);

const setValue = (selector, value, isEnterClick = false) => {
  const el = document.querySelector(selector);
  if (!el) return console.warn("Not found:", selector);

  const proto = Object.getPrototypeOf(el);
  const setter = Object.getOwnPropertyDescriptor(proto, "value").set;

  setter.call(el, value);

  el.dispatchEvent(new Event("input", { bubbles: true }));

  if (isEnterClick) {
    ["keydown", "keypress", "keyup"].forEach((type) => {
      el.dispatchEvent(
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

// Title
if (data.title) setValue('input[aria-label="book title"]', data.title);

// Volume
if (data.volume) setValue('input[aria-label="volume number"]', data.volume);

// Search Terms
if (data.searchTerms)
  setValue('input[aria-label="search terms"]', data.searchTerms, true);

// document.querySelector("select").value = "English";
// document
//   .querySelector("select")
//   .dispatchEvent(new Event("change", { bubbles: true }));
