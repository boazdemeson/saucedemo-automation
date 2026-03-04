const { By } = require("selenium-webdriver");
const BasePage = require("./BasePage");
const CheckoutOverviewPage = require("./CheckoutOverviewPage");

class CheckoutInformationPage extends BasePage {

    async fillInformation(firstName, lastName, postalCode) {
        await this.driver.findElement(By.id("first-name")).sendKeys(firstName);
        await this.driver.findElement(By.id("last-name")).sendKeys(lastName);
        await this.driver.findElement(By.id("postal-code")).sendKeys(postalCode);
    }

    async clickContinue() {
        await this.driver.findElement(By.id("continue")).click();
        return new CheckoutOverviewPage(this.driver);
    }

}

module.exports = CheckoutInformationPage;