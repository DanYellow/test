import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
});

test("should add new Pokedex", async ({ page }) => {
    await page.waitForResponse((resp) =>
        resp.url().includes("https://tyradex.vercel.app/api/v1/gen/1")
    );
    const pokedexOnPage = await page.getByTestId("pokedex");
    const nbPokedexOnPage = await pokedexOnPage.count();

    await page.getByTestId("load-generation-btn").first().click();
    await expect(pokedexOnPage).toHaveCount(nbPokedexOnPage + 1);
    await expect(page.getByTestId("load-generation-btn")).toHaveAttribute(
        "data-load-generation",
        String(nbPokedexOnPage + 2)
    );
});

test("should disable load generation button when there's no generation anymore", async ({ page }) => {
    await page.waitForResponse((resp) =>
        resp.url().includes("https://tyradex.vercel.app/api/v1/gen/1")
    );
    const loadGenerationBtn = await page
        .getByTestId("load-generation-btn")
        .first();
    const fakeGeneration = "42";
    await loadGenerationBtn.evaluate((node) => {
        const fakeGeneration = "42";
        return node.setAttribute('data-load-generation', fakeGeneration);
    })

    const dexRequest = page.waitForResponse(`https://tyradex.vercel.app/api/v1/gen/${fakeGeneration}`);

    await expect(loadGenerationBtn).toHaveAttribute("data-load-generation", fakeGeneration);
    await loadGenerationBtn.click();
    await dexRequest;

    await expect(loadGenerationBtn).toHaveAttribute("inert", "");
});

