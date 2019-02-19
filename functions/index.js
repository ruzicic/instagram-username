const functions = require("firebase-functions");

const puppeteer = require("puppeteer");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: true }));

const selectors = {
  url: "https://www.instagram.com/",
  input: "[name=username]",
  errorIcon: "span.coreSpriteInputError"
};

// Handler to check availability of provided username
app.get("/check", async (req, res) => {
  const username = req.query.username;

  if (!username) {
    return res.status(400).json({
      available: false,
      message: "Please provide a username parameter."
    });
  }

  /**
   * Provided string is a valid instagram username
   * Start puppeteer and go to instagram now
   */
  let available = false;
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"]
  });
  const page = await browser.newPage();
  await page.goto(selectors.url, {
    waitUntil: ["load", "domcontentloaded"]
  });

  await page.waitForSelector(selectors.input);
  await page.type(selectors.input, username);
  await page.click("body");

  // waitForSelector will throw if not found
  try {
    await page.waitForSelector(selectors.errorIcon, {
      visible: true,
      timeout: 250
    });

    available = false;
  } catch (e) {
    available = true;
  }

  await browser.close();

  return res.status(200).send({
    available
  });
});

const opts = { memory: "2GB", timeoutSeconds: 60 };
exports.api = functions.runWith(opts).https.onRequest(app);

