const SITE_ORIGIN = "https://www.velomacflowmeter.com";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const INDEXNOW_KEY_PATTERN = /^[A-Za-z0-9-]{8,128}$/;

const key = process.env.INDEXNOW_KEY?.trim();
const requestedUrls = process.argv.slice(2);

if (!key || !INDEXNOW_KEY_PATTERN.test(key)) {
  console.error("INDEXNOW_KEY must contain 8–128 letters, numbers, or hyphens.");
  process.exit(1);
}

if (!requestedUrls.length) {
  console.error("Pass one or more genuinely changed Velomac paths or URLs.");
  console.error("Example: npm run indexnow -- /products/vortex-flowmeter /resources/example");
  process.exit(1);
}

const urlList = [...new Set(requestedUrls.map(normalizeUrl))];

if (urlList.length > 10_000) {
  console.error("IndexNow accepts no more than 10,000 URLs in one request.");
  process.exit(1);
}

const response = await fetch(INDEXNOW_ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: "www.velomacflowmeter.com",
    key,
    keyLocation: `${SITE_ORIGIN}/indexnow-key.txt`,
    urlList
  })
});

if (!response.ok) {
  const responseText = (await response.text()).slice(0, 500);
  console.error(`IndexNow submission failed (${response.status} ${response.statusText}).`);
  if (responseText) console.error(responseText);
  process.exit(1);
}

console.log(`IndexNow accepted ${urlList.length} URL${urlList.length === 1 ? "" : "s"}.`);
urlList.forEach((url) => console.log(`- ${url}`));

function normalizeUrl(value) {
  let url;

  try {
    url = value.startsWith("/") ? new URL(value, SITE_ORIGIN) : new URL(value);
  } catch {
    console.error(`Invalid URL or path: ${value}`);
    process.exit(1);
  }

  if (url.origin !== SITE_ORIGIN || url.username || url.password) {
    console.error(`Only URLs on ${SITE_ORIGIN} can be submitted: ${value}`);
    process.exit(1);
  }

  url.hash = "";
  return url.toString();
}
