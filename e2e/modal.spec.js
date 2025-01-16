import { test, expect } from "@playwright/test";

test.describe("first", () => {
    test("should open modal", { tag: "@smoke" }, async ({ page }) => {
        await page.goto("/");
        const firstPkmn = await page.getByTestId("pokemon").first();
        const firstPkmnDataRaw = await firstPkmn.getAttribute(
            "data-pokemon-data"
        );
        const firstPkmnData = JSON.parse(firstPkmnDataRaw);
        firstPkmn.click();

        await expect(page.getByTestId("pokemon-modal")).toHaveAttribute(
            "open",
            ""
        );
        await expect(page).toHaveTitle(""
            // new RegExp(String.raw`${firstPkmnData.name.fr}`, "g")
        );
    });
});

// test("should fail", { tag: "@smoke" }, () => {
//     expect(true).toBeFalsy();
// });
