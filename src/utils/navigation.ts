/**
 * Smoothly scrolls to a section on the page
 * @param {string} selector - CSS selector for the section to scroll to
 */
export const scrollToSection = (selector: string) => {
  try {
    const section = document.querySelector(selector)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  } catch {
    // Ignore invalid selectors so navigation clicks do not throw in runtime.
  }
}
