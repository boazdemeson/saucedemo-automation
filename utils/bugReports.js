const fs = require("fs");
const path = require("path");

function generateBugReport(data) {
    const filePath = path.join(__dirname, `../reports/${data.testCaseId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
}

module.exports = { generateBugReport };