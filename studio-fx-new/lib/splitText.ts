/**
 * splitChars — wraps each character in overflow:hidden + will-change span.
 * Pattern: .char-wrap (overflow hidden) > .char (animated element)
 * GSAP animates .char from yPercent:110 → 0, chars clip-reveal from below.
 * This is the single most-used technique on Awwwards SOTD sites (2020-present).
 */
export function splitChars(el: HTMLElement): HTMLElement[] {
  const original = el.textContent || '';
  el.innerHTML = original
    .split('')
    .map(c =>
      c === ' '
        ? '<span style="display:inline-block;width:0.28em">&nbsp;</span>'
        : `<span class="char-wrap" style="display:inline-block;overflow:hidden;vertical-align:bottom"><span class="char" style="display:inline-block;will-change:transform">${c}</span></span>`
    )
    .join('');
  return Array.from(el.querySelectorAll<HTMLElement>('.char'));
}

/**
 * splitWords — wraps each word for word-by-word reveals (less granular than chars).
 */
export function splitWords(el: HTMLElement): HTMLElement[] {
  const original = el.textContent || '';
  el.innerHTML = original
    .split(' ')
    .map(w =>
      `<span class="word-wrap" style="display:inline-block;overflow:hidden;vertical-align:bottom;margin-right:0.28em"><span class="word" style="display:inline-block;will-change:transform">${w}</span></span>`
    )
    .join('');
  return Array.from(el.querySelectorAll<HTMLElement>('.word'));
}
