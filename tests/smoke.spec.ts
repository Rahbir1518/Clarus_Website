import { expect, test } from "@playwright/test";

const pages = [
  "/",
  "/how-it-works",
  "/safety",
  "/pricing",
  "/about",
  "/pilot",
  "/privacy",
  "/terms",
];

test.describe("pages", () => {
  for (const path of pages) {
    test(`${path} loads with one h1, no errors, no sideways scroll`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
      expect(errors).toEqual([]);
    });
  }

  test("unknown paths render the 404 page", async ({ page }) => {
    const res = await page.goto("/definitely-not-a-page");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("isn't on the calendar");
  });
});

test.describe("i18n", () => {
  test("Arabic is right-to-left", async ({ page }) => {
    await page.goto("/ar");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.locator("h1")).toContainText("كل متابعة");
  });

  test("Bangla renders its hero", async ({ page }) => {
    await page.goto("/bn");
    await expect(page.locator("html")).toHaveAttribute("lang", "bn");
    await expect(page.locator("h1")).toContainText("প্রতিটি ফলো-আপ");
  });
});

test.describe("demo", () => {
  test("Hear a call plays through to a booking", async ({ page }) => {
    await page.goto("/");
    const player = page.locator("#hear-a-call");
    await player.scrollIntoViewIfNeeded();
    // Retry until the player has hydrated and responds.
    await expect(async () => {
      await player.getByRole("button", { name: "Play the demo" }).click({ timeout: 2000 });
      await expect(player.getByRole("button", { name: "Pause the demo" })).toBeVisible({
        timeout: 1000,
      });
    }).toPass({ timeout: 15_000 });

    // Speed it up, then wait for the agent's first line and the booking.
    await player.getByRole("radio", { name: "1.5×" }).click();
    await expect(
      player.getByText("this is an automated call from Green Road Family Clinic").first(),
    ).toBeAttached();
    await expect(player.getByRole("status").filter({ hasText: "Thu 10:30 booked" })).toBeVisible({
      timeout: 30_000,
    });
  });

  test("the hero demo can be paused", async ({ page }) => {
    await page.goto("/");
    const pause = page.getByRole("button", { name: "Pause the demo" }).first();
    await pause.click();
    await expect(page.getByRole("button", { name: "Play the demo" }).first()).toBeVisible();
  });

  test("reduced motion shows every scene's final state", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    // The hero lands on the booked state instead of animating there.
    await expect(
      page.getByRole("status").filter({ hasText: "Thu 10:30 booked" }).first(),
    ).toBeVisible();
    await context.close();
  });
});

test.describe("pilot form", () => {
  test("validates required fields", async ({ page }) => {
    await page.goto("/pilot");
    const form = page.locator("form");
    await form.getByRole("button", { name: "Join the founding pilot" }).click();
    await expect(form.getByText("Please enter your name.")).toBeVisible();
    await expect(form.getByText("Enter a valid email address.")).toBeVisible();
    await expect(form.getByText("Pick at least one.")).toBeVisible();
  });

  test("rejects a malformed phone number", async ({ page }) => {
    await page.goto("/pilot");
    const form = page.locator("form");
    await form.getByLabel("WhatsApp or phone").fill("call me");
    await form.getByLabel("Email").click();
    await expect(
      form.getByText("Enter a WhatsApp or phone number, with country code."),
    ).toBeVisible();
  });

  test("the nav button opens the pilot dialog", async ({ page, isMobile }) => {
    test.skip(isMobile, "On phones the button lives in the menu sheet.");
    await page.goto("/");
    await page
      .getByRole("navigation", { name: "Main" })
      .getByRole("link", { name: "Join the pilot" })
      .click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("dialog").getByLabel("Clinic name")).toBeVisible();
  });
});

test.describe("pricing", () => {
  test("market switcher changes currency", async ({ page }) => {
    await page.goto("/pricing");
    await page.getByRole("radio", { name: "Bangladesh" }).click();
    await expect(page.getByText("৳25K").first()).toBeVisible();
    await page.getByRole("radio", { name: "Canada" }).click();
    await expect(page.getByText("$600 one-time setup")).toBeVisible();
  });

  test("footer market links preselect the market", async ({ page }) => {
    await page.goto("/pricing?market=bd");
    await expect(page.getByRole("radio", { name: "Bangladesh" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });
});
