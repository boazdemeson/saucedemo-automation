const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const options = new chrome.Options();

options.addArguments(
    "--disable-infobars",
    "--disable-notifications"
);

// Disable password manager & breach warning
options.setUserPreferences({
    "credentials_enable_service": false,
    "profile.password_manager_enabled": false,
    "profile.password_manager_leak_detection": false
});


async function buildDriver() {
    return await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();
}

module.exports = { buildDriver };