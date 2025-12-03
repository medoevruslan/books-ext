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

async function addBisacCodes(codes) {
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  const bisacFilterSelector = "#filter-bisacs";
  // 1. Find the subject list root (left-side BISAC list)
  const root = document.querySelector(bisacFilterSelector);
  if (!root) {
    console.warn("Cannot find BISAC subject root");
    return;
  }

  let found = 0;
  let maxBisacCount = 5;

  for (const code of codes) {
    if (found === maxBisacCount) break;

    console.log("Trying BISAC:", code);

    // 2. Set filter to the specific code
    setValue(bisacFilterSelector, code);

    // 3. Wait for the list to filter (simple delay)
    await delay(500);

    const visited = new Set();
    let attempts = 0;
    const maxAttempts = 50;


    // Loop to find the item, expanding categories if necessary
    while (found <= maxBisacCount && attempts < maxAttempts) {
      attempts++;

      // 4. Try to find the element that matches the code directly
      const item = document.querySelector(`div[data-code^="${code}"]`);

      if (item) {
        console.log("Clicking BISAC:", code);
        item.click();
        found++;
        await delay(300);
        break; // Move to next code
      }

      // 5. If not found, look for expandable categories
      // Categories have data-literal but NO data-code (or undefined/empty)
      const candidates = Array.from(document.querySelectorAll("div[data-literal]"))
        .filter(el => !el.dataset.code && !visited.has(el));

      if (candidates.length === 0) {
        console.warn("BISAC code not found and no more categories to expand:", code);
        break;
      }

      // 6. Expand the first unvisited category
      // We assume that since we filtered by the code, any visible category *might* contain our item
      const categoryToExpand = candidates[0];
      console.log("Expanding category:", categoryToExpand.dataset.literal);

      visited.add(categoryToExpand);
      categoryToExpand.click();

      // Wait for expansion
      await delay(500);
    }

    if (!found) {
      console.warn("Failed to find BISAC code after expansion:", code);
    }
  }
}

export function run(data) {
  console.log("data is ::", data);

  // Title
  if (data.title) setValue('input[aria-label="book title"]', data.title);

  // Volume
  if (data.volume) setValue('input[aria-label="volume number"]', data.volume);

  // Search Terms
  if (data.searchTerms)
    setValue('input[aria-label="search terms"]', data.searchTerms, true);

  // ================== addBisacCodes
  if (data.categories) {
    const bisacList = data.categories; // array of codes
    addBisacCodes(bisacList);
  }
}
