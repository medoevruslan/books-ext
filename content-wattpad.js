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

const target = document.querySelector('.required-form-wrapper');
if (!target) {
  console.warn("Required form wrapper not found");
} else {
  const title = target.querySelector('.form-group.title-form div[contenteditable=true]');

  if (title && data.title) {
    setValue(title, data.title)
  }

  const description = target.querySelector('.form-group.description-form textarea');
  if (description && data.description) {
    setValue(description, data.description);
  }

  const TAGS_LIMIT = 26;
  let addedTags = 0;

  async function fillTags(tags) {
    for (const tag of tags) {
      if (addedTags > TAGS_LIMIT) break
      await setValue(tagInput, tag, true);
      addedTags++;
      await delay(300);
    }
  }

  const tagInput = target.querySelector('.form-group.tags-form #tag-input')
  const tags = data.searchTerms ? data.searchTerms.split(',') : [];

  if (!tags.length) {
    console.warn("Tags not found - please provide tags list");
  } else if (tagInput) {
    const validatedTags = tags.map(t => t.trim()).flatMap(t => t.split(/\s+/)).filter(t => t.length > 2)
    debugger
    fillTags(validatedTags)
  }

  const targetAudience = document.querySelector('.form-group.target-audience-form #target-audience')
  if (targetAudience) {
    targetAudience.value = "25+";
    targetAudience.dispatchEvent(new Event('change', { bubbles: true }));
  }

  const ratingGroup = document.querySelector('.form-group.rating-form #mature-switch')
  if (ratingGroup) {
    ratingGroup.click()
    ratingGroup.dispatchEvent(new Event('change', { bubbles: true }));
  }
}