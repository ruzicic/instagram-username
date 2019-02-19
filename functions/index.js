const functions = require("firebase-functions");
const puppeteer = require("puppeteer");
const cors = require("cors")({
  origin: true
});
const opts = { memory: "2GB", timeoutSeconds: 30 };
const selectors = {
  url: "https://www.instagram.com/",
  input: "[name=username]",
  errorIcon: "span.coreSpriteInputError"
};

async function checkAvailability(str) {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"]
  });
  const page = await browser.newPage();
  await page.goto(selectors.url, {
    waitUntil: ["load", "domcontentloaded"]
  });

  await page.waitForSelector(selectors.input);
  await page.type(selectors.input, str);
  await page.click("body");

  try {
    await page.waitForSelector(selectors.errorIcon, {
      visible: true,
      timeout: 250
    });

    return false;
  } catch (e) {
    // page.waitForSelector will throw if element not found
    return true;
  } finally {
    await browser.close();
  }
}

function isBadInput(str) {
  return !str || String(str) === "";
}

async function handleCheckRequest(request, response) {
  if (request.method !== "GET") {
    return response.status(403).json({
      message: "FORBIDDEN"
    });
  }

  return await cors(request, response, async () => {
    const { username = "" } = request.query;

    if (isBadInput(username)) {
      return response.status(400).json({
        available: false,
        message: "Please provide a valid username parameter."
      });
    }

    return response.status(200).json({
      available: await checkAvailability(username)
    });
  });
}

/**
 * PRIVATE
 * Used by instagram-username.com
 */
exports.check_internal = functions
  .runWith(opts)
  .https.onCall(({ text = "" }) => checkAvailability(text));

/**
 * PUBLIC
 * Exposed Rest API
 */
exports.check = functions.runWith(opts).https.onRequest(handleCheckRequest);
