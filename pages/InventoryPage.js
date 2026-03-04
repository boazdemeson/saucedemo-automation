const { By } = require("selenium-webdriver");
const BasePage = require("./BasePage");

class InventoryPage extends BasePage {

    async getProducts() {
        return await this.driver.findElements(By.className("inventory_item"));
    }

    async sortZtoA() {
        await this.driver.findElement(By.className("product_sort_container"))
            .sendKeys("Name (Z to A)");
    }

    async getProductNames() {
        const elements = await this.driver.findElements(By.className("inventory_item_name"));
        return await Promise.all(elements.map(el => el.getText()));
    }

    async addProductByIndex(index) {
        const addButtons = await this.driver.findElements(By.css(".inventory_item button"));
    
        if (index >= addButtons.length) {
            throw new Error(`Product index ${index} not found`);
        }

        await addButtons[index].click();
    }

    async getProductNameByIndex(index) {
        const productNames = await this.driver.findElements(By.css(".inventory_item_name"));

        if (index >= productNames.length) {
            throw new Error(`Product index ${index} out of range`);
        }

        return await productNames[index].getText();
    }

    async getCartBadgeCount() {
       const badges = await this.driver.findElements(By.className("shopping_cart_badge"));
    
        if (badges.length === 0) {
            return "0";
        }

        return await badges[0].getText();
    }

    async clickCartIcon() {
        await this.driver.findElement(By.className("shopping_cart_link")).click();
    }

    async logout() {
        await this.driver.findElement(By.id("react-burger-menu-btn")).click();
        await this.driver.sleep(1000);
        await this.driver.findElement(By.id("logout_sidebar_link")).click();
    }
}

module.exports = InventoryPage;