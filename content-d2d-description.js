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

function waitForCKEditor(timeout = 5000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    const timer = setInterval(() => {
      if (window.__CKEDITOR_INSTANCE__) {
        clearInterval(timer);
        resolve(window.__CKEDITOR_INSTANCE__);
      }

      if (Date.now() - start > timeout) {
        clearInterval(timer);
        reject('CKEditor not found');
      }
    }, 100);
  });
}

export async function run(data) {

  // Short Description
  if (data.shortDescription) setValue('#short-description-editor', data.shortDescription);

  // Description
  if (data.description) {
    try {
      const editor = await waitForCKEditor();

      editor.setData(
        typeof data.description === 'string'
          ? data.description
          : `<p>${data.description}</p>`
      );

      editor.model.document.fire('change:data');

    } catch (e) {
      console.warn(e);
    }
  }

  const ebookISBN = document.querySelectorAll('.radio-choice')
  if (ebookISBN.length) {
    ebookISBN[0].click();
    ebookISBN[0].dispatchEvent(new Event('change', { bubbles: true }))
  }
}
