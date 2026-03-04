const { By } = require("selenium-webdriver");
const BasePage = require("./BasePage");

class LoginPage extends BasePage {

    async login(username, password) {
        await this.driver.findElement(By.id("user-name")).clear();
        await this.driver.findElement(By.id("user-name")).sendKeys(username);
        await this.driver.findElement(By.id("password")).clear();
        await this.driver.findElement(By.id("password")).sendKeys(password);
        await this.driver.findElement(By.id("login-button")).click();
    }

    async getErrorMessage() {
        return await this.driver.findElement(By.css("h3[data-test='error']")).getText();
    }
}

module.exports = LoginPage;