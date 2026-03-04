const { By } = require("selenium-webdriver");
const BasePage = require("./BasePage");
const CheckoutCompletePage = require("./CheckoutCompletePage");

class CheckoutOverviewPage extends BasePage {

    async getPageOverviewTitle() {
    const title = await this.driver.findElement(By.className("title"));
    return await title.getText();
    }

    async getFirstProductName() {
        const name = await this.driver.findElement(By.css(".inventory_item_name"));
        return await name.getText();
    }

    async clickFinish() {
        await this.driver.findElement(By.id("finish")).click();
        return new CheckoutCompletePage(this.driver);
    }

}

module.exports = CheckoutOverviewPage;