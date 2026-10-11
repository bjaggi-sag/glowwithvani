// Run against a locally served production export. Requires Playwright + Chrome.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("node:assert/strict");
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3005";
(async () => {
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    colorScheme: "light",
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  let submitted = false;
  await page.route("https://formspree.io/**", (route) => {
    submitted = true;
    return route.fulfill({ status: 503, body: "Test failure" });
  });
  // Never load a third-party video during automated checks.
  await page.route("https://www.youtube-nocookie.com/**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "Local video placeholder",
    }),
  );
  try {
    await page.goto(`${base}/portfolio/?discipline=screen`, {
      waitUntil: "networkidle",
    });
    assert.equal(
      await page
        .getByRole("button", { name: "Film & video", exact: true })
        .getAttribute("aria-pressed"),
      "true",
    );
    assert.equal(await page.locator(".portfolio-card").count(), 0);
    assert.equal(await page.locator(".project-card").count(), 1);
    await page.locator(".project-card-link").click();
    await page.locator("dialog[open]").waitFor();
    assert.match(page.url(), /project=photo-hustinder/);
    assert.equal(await page.locator("iframe").count(), 0);
    assert.equal(
      await page.locator(".project-credits dd").first().innerText(),
      "Gurvani Kaur",
    );
    await page.getByRole("button", { name: /Play Photo/ }).click();
    assert.match(
      await page.locator("iframe").getAttribute("src"),
      /youtube-nocookie.com\/embed\/nPntwQ_pm9w/,
    );
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("dialog[open]").count(), 0);
    assert.equal(await page.evaluate(() => document.body.style.overflow), "");
    await page
      .getByRole("button", { name: "Editorial & fashion", exact: true })
      .click();
    assert.ok((await page.locator(".portfolio-card").count()) > 0);
    await page
      .getByRole("button", { name: "Published editorials", exact: true })
      .click();
    await page.locator(".work-empty").waitFor();
    await page
      .getByRole("button", { name: "Clear filters", exact: true })
      .click();
    assert.equal(await page.locator(".portfolio-card").count(), 19);
    await page.getByRole("searchbox").fill("definitely-no-such-project");
    await page.locator(".work-empty").waitFor();
    await page
      .getByRole("button", { name: "Clear filters", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Theatre & SFX", exact: true })
      .click();
    const characterCount = await page.locator(".portfolio-card").count();
    assert.ok(characterCount > 0 && characterCount < 19);
    await page.goBack();
    await page.waitForFunction(
      () => document.querySelectorAll(".portfolio-card").length === 19,
    );
    const photo = page.locator(".portfolio-media-button").nth(5);
    await photo.click();
    const lightbox = page.getByRole("dialog", {
      name: "Portfolio image viewer",
    });
    await lightbox.waitFor();
    const box = await lightbox.boundingBox();
    assert.ok(box.y >= 0 && box.y < 5);
    await page.getByRole("button", { name: "Close image viewer" }).focus();
    await page.keyboard.press("Shift+Tab");
    assert.equal(
      await page.evaluate(() =>
        document.activeElement.getAttribute("aria-label"),
      ),
      "Next image",
    );
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Escape");
    assert.equal(await page.locator(".portfolio-lightbox").count(), 0);
    assert.equal(
      await photo.evaluate((el) => el === document.activeElement),
      true,
    );
    await page.goto(`${base}/portfolio/?project=photo-hustinder`, {
      waitUntil: "networkidle",
    });
    await page.locator("dialog[open]").waitFor();
    await page
      .getByRole("button", { name: "Close project", exact: true })
      .click();
    assert.ok(!page.url().includes("project="));
    assert.equal(
      await page.getByText("Punjabi feature film", { exact: true }).count(),
      0,
    );

    for (const width of [360, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of ["/", "/portfolio/", "/contact/?type=production"]) {
        await page.goto(base + route, { waitUntil: "networkidle" });
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          `Horizontal overflow at ${width}: ${route}`,
        );
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base + "/", { waitUntil: "networkidle" });
    assert.equal(await page.locator("#primary-navigation").isVisible(), false);
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    assert.equal(await page.locator("#primary-navigation").isVisible(), true);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#primary-navigation").isVisible(), false);
    await page.getByRole("button", { name: "Toggle color theme" }).click();
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    await page.goto(base + "/portfolio/?discipline=editorial", {
      waitUntil: "networkidle",
    });
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    await page
      .getByRole("navigation", { name: "Primary", exact: true })
      .getByRole("link", { name: "The Work", exact: true })
      .click();
    await page.waitForFunction(
      () => document.querySelectorAll(".portfolio-card").length === 19,
    );
    await page.goto(base + "/contact/?type=production", {
      waitUntil: "networkidle",
    });
    assert.equal(
      await page.locator("[name=inquiryType]").inputValue(),
      "Film / video / production",
    );
    await page.locator("[name=name]").fill("Local test");
    await page.locator("[name=email]").fill("test@example.com");
    await page.locator("[name=organization]").fill("Test Studio");
    await page.locator("[name=message]").fill("Local test only, intercepted.");
    await page.locator("[name=eventDate]").fill("2000-01-01");
    await page
      .getByRole("button", { name: "Send Inquiry", exact: true })
      .click();
    assert.equal(submitted, false);
    await page.locator("[name=eventDate]").fill("");
    await page
      .getByRole("button", { name: "Send Inquiry", exact: true })
      .click();
    await page.getByRole("link", { name: "Email Instead" }).waitFor();
    assert.match(
      decodeURIComponent(
        await page
          .getByRole("link", { name: "Email Instead" })
          .getAttribute("href"),
      ),
      /Test Studio/,
    );
    await page.unroute("https://formspree.io/**");
    await page.route("https://formspree.io/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: '{"ok":true}',
      }),
    );
    await page.getByRole("button", { name: "Try Again", exact: true }).click();
    await page
      .getByText("Thanks, your inquiry was sent.", { exact: true })
      .waitFor();
    assert.deepEqual(errors, []);
    console.log(
      "PASS: filters, search, history, deep links, video consent, lightbox focus, five viewport widths, theme persistence, draft visibility, mobile navigation, and intercepted inquiry error/success paths.",
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
