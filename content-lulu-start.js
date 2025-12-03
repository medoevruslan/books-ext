const delay = (ms) => new Promise((r) => setTimeout(r, ms));

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

export async function run() {
  const data = window.bookAutoFillData;

  const bookType = document.querySelector('[data-testid="wizard-start-radio-productType-EBOOK"] button')
  bookType?.click()

  const projectTitle = await waitForSelector('#projectTitle')

  await delay(500)

  projectTitle.scrollIntoView({ behavior: 'smooth' })

  if (data.title) {
    projectTitle.value = data.title
    projectTitle.dispatchEvent(new Event('input', { bubbles: true }))
  }
}




