const { buildDriver } = require("../config/driver");
const LoginPage = require("../pages/LoginPage");
const InventoryPage = require("../pages/InventoryPage");
const CartPage = require("../pages/CartPage");
const CheckoutInformationPage = require("../pages/CheckoutInformationPage");
const CheckoutOverviewPage = require("../pages/CheckoutOverviewPage");
const CheckoutCompletePage = require("../pages/CheckoutCompletePage");

const logger = require("../utils/logger");
const { takeScreenshot } = require("../utils/screenshot");
const { generateBugReport } = require("../utils/bugReports");

async function runTest(testId, type, testLogic) {
    const driver = await buildDriver();
    let status = "PASS";
    let errorMessage = null;
    let screenshotPath = null;

    try {
        await testLogic(driver);
        logger.info(`${testId} PASSED`);
    } catch (err) {
        status = "FAIL";
        errorMessage = err.message;
        screenshotPath = await takeScreenshot(driver, testId);
        logger.error(`${testId} FAILED: ${err.message}`);
    }

    generateBugReport({
        testCaseId: testId,
        type,
        status,
        errorMessage,
        screenshot: screenshotPath,
        timestamp: new Date()
    });

    await driver.quit();
}

// IMPLEMENTATION OF TEST CASES

(async () => {

await runTest("TC_LOGIN_01","Positive", async (driver)=>{
    const login = new LoginPage(driver);

    //login
    await login.open("https://www.saucedemo.com");
    await login.login("standard_user","secret_sauce");

    //verifikasi login berhasil dengan cek URL
    const url = await driver.getCurrentUrl();
    if(!url.includes("inventory")) throw new Error("Login failed");
});

await runTest("TC_LOGIN_02","Negative", async (driver)=>{
    const login = new LoginPage(driver);

    //login
    await login.open("https://www.saucedemo.com");
    await login.login("wronguser_user","secret_sauce");

    //get error message
    const error = await login.getErrorMessage();
    if(!error) throw new Error("Error message not shown");
});

await runTest("TC_LOGIN_03","Negative", async (driver)=>{
    const login = new LoginPage(driver);

    //login
    await login.open("https://www.saucedemo.com");
    await login.login("standard_user","testwrong_sauce");

    //get error message
    const error = await login.getErrorMessage();
    if(!error) throw new Error("Error message not shown");
});

await runTest("TC_PRODUCT_01","Positive", async (driver)=>{
    const login = new LoginPage(driver);
    const inventory = new InventoryPage(driver);

    //login
    await login.open("https://www.saucedemo.com");
    await login.login("standard_user","secret_sauce");

    //verifikasi produk muncul
    const products = await inventory.getProducts();
    if(products.length === 0) throw new Error("Products not displayed");
});

await runTest("TC_SORTING_01", "Positive", async (driver) => {
    const login = new LoginPage(driver);
    const inventory = new InventoryPage(driver);

    //login
    await login.open("https://www.saucedemo.com");
    await login.login("standard_user", "secret_sauce");

    //Ambil produk sebelum sorting
    const originalProducts = await inventory.getProductNames();

    //Sorting Z → A
    await inventory.sortZtoA();

    //Ambil produk setelah sorting
    const sortedProductsUI = await inventory.getProductNames();

    //Sorting (descending)
    const sortedProductsManual = [...originalProducts].sort().reverse();

    //Compare
    if (JSON.stringify(sortedProductsUI) !== JSON.stringify(sortedProductsManual)) {
        throw new Error("Sorting Z to A is incorrect");
    }

});


await runTest("TC_CART_ADD_01", "Positive", async (driver) => {
    const login = new LoginPage(driver);
    const inventory = new InventoryPage(driver);

    //Login
    await login.open("https://www.saucedemo.com");
    await login.login("standard_user", "secret_sauce");

    //Add first product
    await inventory.addProductByIndex(0);

    //wait kecil untuk memastikan UI update
    await driver.sleep(500);

    //Verify cart badge
    const badgeCount = await inventory.getCartBadgeCount();

    if (badgeCount !== "1") {
        throw new Error(`Cart badge incorrect. Expected: 1, Actual: ${badgeCount}`);
    }

});

await runTest("TC_CART_ADD_02", "Positive", async (driver) => {
    const login = new LoginPage(driver);
    const inventory = new InventoryPage(driver);

    //Login
    await login.open("https://www.saucedemo.com");
    await login.login("standard_user", "secret_sauce");

    //Step 2: Add first product
    await inventory.addProductByIndex(0);

    //Step 3: Add second product
    await inventory.addProductByIndex(1);

    //wait for UI Stability
    await driver.sleep(500);

    //Step 4: Verify badge count
    const badgeCount = await inventory.getCartBadgeCount();

    if (badgeCount !== "2") {
        throw new Error(`Expected 2 items in cart, but found ${badgeCount}`);
    }

});

await runTest("TC_CHECKOUT_01", "Positive", async (driver) => {
    const login = new LoginPage(driver);
    const inventory = new InventoryPage(driver);
    const cart = new CartPage(driver);
    const checkout = new CheckoutInformationPage(driver);
    

    //Login
    await login.open("https://www.saucedemo.com");
    await login.login("standard_user", "secret_sauce");

    //Add Procuct 1 time
    await inventory.addProductByIndex(0);

    //Go to Cart
    await inventory.clickCartIcon();

    //Click Checkout
    await cart.clickCheckout();

    //Fill information
    await checkout.fillInformation("John", "Doe", "12345");

    //Click Continue. disini continue sudah menggunakan page overview karena di method clickContinue sudah return new CheckoutOverviewPage
    const overviewPage = await checkout.clickContinue();

    //Verify Overview page
    const title = await overviewPage.getPageOverviewTitle();

    if (title !== "Checkout: Overview") {
        throw new Error(`Failed to navigate to Overview page. Current page: ${title}`);
    }

});

await runTest("TC_CHECKOUT_02", "Boundary", async (driver) => {

    const login = new LoginPage(driver);
    const inventory = new InventoryPage(driver);
    const cart = new CartPage(driver);
    const checkout = new CheckoutInformationPage(driver);

    //Login
    await login.open("https://www.saucedemo.com");
    await login.login("standard_user", "secret_sauce");

    //Add 1 product
    await inventory.addProductByIndex(0);

    //Go to Cart
    await inventory.clickCartIcon();

    //Click Checkout
    await cart.clickCheckout();

    //Fill LONG information (boundary test)
    await checkout.fillInformation(
        "ipkydbvqgekchmzxhewyrzmfurgtqzrmjanucikcqfpcbyexvu",
        "rigzwdbqpznpcjeqjdteapphpdgherrgerraudcmdunjnmapqp",
        "12345"
    );

    //Click Continue
    const overviewPage = await checkout.clickContinue();

    //Verify navigate to Overview page
    const title = await overviewPage.getPageOverviewTitle();

    if (title !== "Checkout: Overview") {
        throw new Error(`Failed to navigate to Overview page. Current page: ${title}`);
    }

});

//Failed karena saucedemo tidak ada validasi long input
await runTest("TC_CHECKOUT_03", "Negative", async (driver) => {

    const login = new LoginPage(driver);
    const inventory = new InventoryPage(driver);
    const cart = new CartPage(driver);
    const checkout = new CheckoutInformationPage(driver);

    //Login
    await login.open("https://www.saucedemo.com");
    await login.login("standard_user", "secret_sauce");

    //Add product
    await inventory.addProductByIndex(0);

    //Go to cart
    await inventory.clickCartIcon();

    //Checkout
    await cart.clickCheckout();

    //Fill "invalid long" data
    await checkout.fillInformation(
        "firstnametoolonghewyrzmfurgtqzrmjanucikcqfpcbyexvua",
        "lastnametoolongqjdteapphpdgherrgerraudcmdunjnmapqpa",
        "12345"
    );

    //Click continue
    await checkout.clickContinue();

    //Verify NOT navigate to Overview
    const currentUrl = await driver.getCurrentUrl();

    if (currentUrl.includes("checkout-step-two")) {
        throw new Error("User should NOT navigate to Overview page as in Business Rules");
    }

});

//Failed karena saucedemo tidak ada validasi long input
await runTest("TC_CHECKOUT_04", "Negative", async (driver) => {

    const login = new LoginPage(driver);
    const inventory = new InventoryPage(driver);
    const cart = new CartPage(driver);
    const checkout = new CheckoutInformationPage(driver);

    //Login
    await login.open("https://www.saucedemo.com");
    await login.login("standard_user", "secret_sauce");

    //Add product
    await inventory.addProductByIndex(0);

    //Go to cart
    await inventory.clickCartIcon();

    //Checkout
    await cart.clickCheckout();

    //Fill "invalid long" data
    await checkout.fillInformation(
        "John",
        "Doe",
        "1234567890"
    );

    //Click continue
    await checkout.clickContinue();

    //Verify NOT navigate to Overview
    const currentUrl = await driver.getCurrentUrl();

    if (currentUrl.includes("checkout-step-two")) {
        throw new Error("User should NOT navigate to Overview page as in Business Rules");
    }

});

//Failed karena saucedemo tidak ada validasi alphabetic postal code
await runTest("TC_CHECKOUT_05", "Negative", async (driver) => {

    const login = new LoginPage(driver);
    const inventory = new InventoryPage(driver);
    const cart = new CartPage(driver);
    const checkout = new CheckoutInformationPage(driver);

    //Login
    await login.open("https://www.saucedemo.com");
    await login.login("standard_user", "secret_sauce");

    //Add product
    await inventory.addProductByIndex(0);

    //Go to cart
    await inventory.clickCartIcon();

    //Checkout
    await cart.clickCheckout();

    //Fill "invalid alphabetic" data
    await checkout.fillInformation(
        "John",
        "Doe",
        "p0st4lc0d3"
    );

    //Click continue
    await checkout.clickContinue();

    //Verify NOT navigate to Overview
    const currentUrl = await driver.getCurrentUrl();

    if (currentUrl.includes("checkout-step-two")) {
        throw new Error("User should NOT navigate to Overview page as in Business Rules");
    }

});

await runTest("TC_CHECKOUT_06", "Positive", async (driver) => {

    const login = new LoginPage(driver);
    const inventory = new InventoryPage(driver);
    const cart = new CartPage(driver);
    const checkoutInfo = new CheckoutInformationPage(driver);
    const overviewPage = new CheckoutOverviewPage(driver);
    const completePage = new CheckoutCompletePage(driver);

    //Login
    await login.open("https://www.saucedemo.com");
    await login.login("standard_user", "secret_sauce");

    //Add specific product (index 0)
    const selectedProductName = await inventory.getProductNameByIndex(0);
    await inventory.addProductByIndex(0);

    //Go to cart
    await inventory.clickCartIcon();

    //Checkout
    await cart.clickCheckout();

    //Fill Information
    await checkoutInfo.fillInformation("John", "Doe", "12345");
    await checkoutInfo.clickContinue();

    //Verify product appears in Overview
    const overviewProductName = await overviewPage.getFirstProductName();

    if (overviewProductName !== selectedProductName) {
        throw new Error("Product in Overview does not match selected product");
    }

    //Click Finish
    await overviewPage.clickFinish();

    //Verify navigate to Checkout Complete
    const completeTitle = await completePage.getConfirmationText();

    if (completeTitle !== "Thank you for your order!") {
        throw new Error("Failed to navigate to Checkout Complete page");
    }

});

await runTest("TC_LOGOUT_01", "Positive", async (driver) => {

    const login = new LoginPage(driver);
    const inventory = new InventoryPage(driver);

    //Login
    await login.open("https://www.saucedemo.com");
    await login.login("standard_user", "secret_sauce");

    //Logout
    await inventory.logout();

    //Verify redirected to login page
    const currentUrl = await driver.getCurrentUrl();

    if (!currentUrl.includes("saucedemo.com")) {
        throw new Error("User not redirected to login page");
    }

    //Try accessing inventory page directly
    await driver.get("https://www.saucedemo.com/inventory.html");

    const urlAfterAccess = await driver.getCurrentUrl();

    if (urlAfterAccess.includes("inventory")) {
        throw new Error("User still able to access inventory without login");
    }

});

})();