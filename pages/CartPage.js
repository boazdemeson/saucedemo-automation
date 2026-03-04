const { By } = require("selenium-webdriver");
const BasePage = require("./BasePage");

class CartPage extends BasePage {

    async removeFirstItem() {
        await this.driver.findElement(By.css(".cart_item button")).click();
    }

    async getCartItems() {
        return await this.driver.findElements(By.className("cart_item"));
    }

    async clickCheckout() {
        await this.driver.findElement(By.id("checkout")).click();
    }
}

module.exports = CartPage;