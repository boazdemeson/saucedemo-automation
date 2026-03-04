const { By } = require("selenium-webdriver");
const BasePage = require("./BasePage");

class CheckoutCompletePage extends BasePage {

    async getConfirmationText() {
        const text = await this.driver.findElement(By.className("complete-header"));
        return await text.getText();
    }
}

module.exports = CheckoutCompletePage;