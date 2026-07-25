import * as cheerio from "cheerio";

const TIMEOUT_MS = 12_000;
const MAX_BODY_CHARS = 7_000;
const USER_AGENT =
  "Mozilla/5.0 (compatible; StudioFX-Researcher/1.0; +https://studiofx.co)";

/**
 * Fetch a website and extract enough content for Claude to spot a pain point.
 * Returns { content: string | null, error?: string } — never throws.
 */
export async function scrapeWebsite(url) {
  if (!url) return { content: null, error: "No URL" };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-GB,en;q=0.9",
      },
      signal: controller.signal,
      redirect: "follow",
    });

    if (!response.ok) {
      return { content: null, error: `HTTP ${response.status}` };
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("html")) {
      return { content: null, error: `Non-HTML response (${contentType})` };
    }

    const html = await response.text();
    return parseHtml(html);
  } catch (error) {
    return { content: null, error: error.message };
  } finally {
    clearTimeout(timeout);
  }
}

function parseHtml(html) {
  const $ = cheerio.load(html);

  // Strip non-content noise
  $("script, style, noscript, iframe, svg, link, meta[http-equiv]").remove();

  const title = clean($("title").first().text()) || clean($("h1").first().text());
  const description =
    $('meta[name="description"]').attr("content") ??
    $('meta[property="og:description"]').attr("content") ??
    "";

  const headings = [];
  $("h1, h2, h3").each((_, el) => {
    const text = clean($(el).text());
    if (text && text.length < 200) headings.push(text);
  });

  const navLinks = [];
  $("nav a, header a").each((_, el) => {
    const text = clean($(el).text());
    if (text && text.length < 40) navLinks.push(text);
  });

  // Strip header / footer / nav before reading main body
  $("header, footer, nav, aside").remove();
  const mainBody = clean(
    $("main").text() || $("article").text() || $("body").text(),
  );

  const bodySnippet = mainBody.slice(0, MAX_BODY_CHARS);

  const content = [
    `Title: ${title || "(none)"}`,
    `Meta description: ${clean(description) || "(none)"}`,
    `Top headings: ${headings.slice(0, 14).join(" | ") || "(none)"}`,
    `Nav labels: ${dedupe(navLinks).slice(0, 12).join(" · ") || "(none)"}`,
    "",
    "Body excerpt:",
    bodySnippet,
  ].join("\n");

  return {
    title,
    description: clean(description),
    headings: headings.slice(0, 14),
    navLinks: dedupe(navLinks).slice(0, 12),
    content,
  };
}

function clean(s) {
  return (s ?? "").replace(/\s+/g, " ").trim();
}

function dedupe(arr) {
  return Array.from(new Set(arr));
}
