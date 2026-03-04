const fs = require("fs");
const path = require("path");

async function takeScreenshot(driver, testId) {
    const image = await driver.takeScreenshot();
    const filePath = path.join(__dirname, `../screenshots/${testId}_${Date.now()}.png`);
    fs.writeFileSync(filePath, image, "base64");
    return filePath;
}

module.exports = { takeScreenshot };