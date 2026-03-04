# saucedemo-automation
E2E automation framework for SauceDemo built with Selenium WebDriver and Node.js, implementing Page Object Model, structured logging, and failure screenshot capture.

# SauceDemo Automation Testing Project

End-to-End automation testing framework for SauceDemo built using:

- Selenium WebDriver
- Node.js
- Page Object Model (POM)
- Custom test runner
- Structured logging
- Automatic screenshot capture on failure

---

## 📌 Project Overview

This project automates the core business flow of SauceDemo:

Login → Add to Cart → View Cart → Checkout → Confirm Order → Logout

The automation framework is designed with maintainability and scalability in mind using the Page Object Model (POM) pattern.

---

## 🏗️ Framework Architecture

project-root
│
├── config/
│ ├── driver.js
├── pages/
│ ├── BasePage.js
│ ├── CartPage.js
│ ├── CheckoutCompletePage.js
│ ├── CheckoutInformationPage.js
│ ├── CheckoutOverviewPage.js
│ ├── InventoryPage.js
│ ├── LoginPage.js
│
├── tests/
│ ├── testSuite.js
│
├── utils/
│ ├── bugReports.js
│ ├── logger.js
│ ├── screenshot.js
│
├── logs/
├── screenshots/
│
└── package.json

---

## 🧩 Design Pattern

This framework implements:

### Page Object Model (POM)
- Each page has its own class.
- All locators and page actions are encapsulated.
- Tests remain clean and readable.

---

This provides:

- Structured logging
- Automatic failure capture
- Screenshot on error
- Clear PASS/FAIL status

---

## 🧪 Test Coverage
Authentication
- Valid Login
- Invalid Login
-Logout & Session Validation

Cart Management
- Add Product
- Remove Product
- Verify Cart Contents

Checkout
- Valid Checkout Flow
- Boundary Input Case
- Invalid Long Input Case
- Overview Validation
- Order Completion

---

## 📸 Failure Handling

If a test fails:
- Error is logged in /logs
- Screenshot is saved in /screenshots
- Execution continues to next test
- This improves debugging efficiency and traceability.


