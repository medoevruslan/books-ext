export async function run() {
  const data = window.bookAutoFillData;

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
}



