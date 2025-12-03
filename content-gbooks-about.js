const data = window.bookAutoFillData;

const LABELS = {
  title: ["Название", "Title"],
  subtitle: ["Подзаголовок", "Subtitle"],
  description: ["Описание", "Description"],
  bookId: ["Идентификатор книги", "Book ID"],
  language: ["Язык", "Language"],
  publisher: ["Издатель", "Publisher"],
  pages: ["Количество страниц", "Page count", "Number of pages"],
  releaseDate: ["Дата выпуска", "Release date"],
  publicationDate: ["Дата публикации", "Publication date"],
  minAge: ["Минимальный возраст", "Minimum age"],
  maxAge: ["Максимальный возраст", "Maximum age"],
  adult: ["Для совершеннолетних?", "For mature audiences?"],
  save: ["Сохранить", "Save"],
  saveContinue: ["Сохранить и продолжить", "Save and continue"]
};

function findInputByLabels(labelArray, isParentLookup = true) {
  for (const text of labelArray) {
    const elems = [...document.querySelectorAll('*')]
    const elem = elems.find(el => el.textContent.trim() === text);
    if (elem) {
      return isParentLookup ? elem.parentElement.querySelector('input, textarea, [contenteditable]') : elem.querySelector('input, textarea, [contenteditable]');
    }
  }
  return null;
}


const titleInput = findInputByLabels(LABELS.title);
if (titleInput) {
  titleInput.focus()
  titleInput.value = data.title;
  titleInput.dispatchEvent(new Event('input', { bubbles: true }));
}

const desc = findInputByLabels(LABELS.description);
if (desc) {
  desc.focus();
  desc.innerHTML = data.description.replace(/\n/g, "<br>"); // keep line breaks
  desc.dispatchEvent(new InputEvent("input", { bubbles: true }));
}

const publisher = findInputByLabels(LABELS.publisher, false);
if (publisher) {
  publisher.focus();
  publisher.value = data.publisher;
  publisher.dispatchEvent(new Event('input', { bubbles: true }));
}

const minAge = findInputByLabels(LABELS.minAge);
if (minAge) {
  minAge.focus();
  minAge.value = 18;
  minAge.dispatchEvent(new Event('input', { bubbles: true }));
}


// value: true (adult), false (not adult)
const yesLabels = ["Да", "Yes"];
const noLabels = ["Нет", "No"];

const adultButtons = document.querySelectorAll('button[role="option"]');
if (adultButtons.length > 0) {
  const targetLabels = yesLabels;
  const buttons = Array.from(adultButtons);

  const target = buttons.find(b => {
    const spans = Array.from(b.querySelectorAll("span"));
    return spans.some(sp => targetLabels.includes(sp.textContent.trim()));
  });
  target?.click();
}

