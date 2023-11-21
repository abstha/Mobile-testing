const { remote } = require("webdriverio");
const fs = require("fs");

//different capabilities for different apps
const capabilities = {
  platformName: "Android",
  "appium:automationName": "UiAutomator2",
  "appium:deviceName": "Xiaomi Redmi Note 9 Pro Max",
  "appium:appPackage": "com.google.android.apps.messaging",
  "appium:appActivity":
    "com.google.android.apps.messaging.ui.ConversationListActivity",
};

//different web driver options for the same as above.
const wdOpts = {
  hostname: process.env.APPIUM_HOST || "localhost",
  port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
  logLevel: "info",
  capabilities,
};

const phoneDialerCapabilities = {
  platformName: "Android",
  "appium:automationName": "UiAutomator2",
  "appium:deviceName": "Xiaomi Redmi Note 9 Pro Max",
  "appium:appPackage": "com.android.contacts",
  "appium:appActivity": "com.android.contacts.activities.TwelveKeyDialer",
};

const wdOptsForDialer = {
  hostname: process.env.APPIUM_HOST || "localhost",
  port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
  logLevel: "info",
  capabilities: phoneDialerCapabilities,
};

const ytCapabilities = {
  platformName: "Android",
  "appium:appPackage": "com.android.chrome",
  "appium:appActivity": "com.google.android.apps.chrome.Main",
  "appium:deviceName": "Xiaomi Redmi Note 9 Pro Max",
  "appium:automationName": "UiAutomator2",
};

const wdOptsforYt = {
  hostname: process.env.APPIUM_HOST || "localhost",
  port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
  logLevel: "info",
  capabilities: ytCapabilities,
};

//buys the data pack via USSD
async function buyDataPack() {
  const driver = await remote(wdOptsForDialer);

  try {
    const number = "*17118#";

    const digitMapping = {
      1: "one",
      "*": "star",
      "#": "pound",
      2: "two",
      3: "three",
      4: "four",
      5: "five",
      6: "six",
      7: "seven",
      8: "eight",
      9: "nine",
      0: "zero",
    };

    for (let i = 0; i < number.length; i++) {
      const digit = number[i];
      const elementId = digitMapping[digit];

      const element = await driver.$(
        `android=new UiSelector().resourceId("com.android.contacts:id/${elementId}")`
      );
      await element.click();
    }
    const call = await driver.$(
      'android=new UiSelector().resourceId("com.android.contacts:id/call_sim1")'
    );
    await call.click();

    const num = await driver.$(
      'android=new UiSelector().resourceId("com.android.phone:id/input_field")'
    );
    await num.setValue("1");

    const cl = await driver.$(
      'android=new UiSelector().resourceId("android:id/button1")'
    );
    await cl.click();

    const num2 = await driver.$(
      'android=new UiSelector().resourceId("com.android.phone:id/input_field")'
    );
    await num2.setValue("1");

    const cl2 = await driver.$(
      'android=new UiSelector().resourceId("android:id/button1")'
    );
    // await cl2.click();
  } catch (error) {
    console.error(`Error in buyDataPack: ${error.message}`);
  } finally {
    await driver.deleteSession();
  }
}

async function getOTP(key) {
  const driver = await remote(wdOpts);

  try {
    console.log("Step 1: Clicking 'Continue as Abhinav'");
    const cont = await driver.$(
      '//*[contains(@text,"Use Messages without an account")]'
    );
    await cont.click();
    try {
      console.log("Step 2: Clicking 'Agree'");
      const agree = await driver.$('//*[contains(@text,"Agree")]');
      await agree.click();
    } catch (err) {
      console.log(err);
    }

    console.log("Step 3: Waiting for 5 seconds");
    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log("Step 4: Clicking 'Ncell'");
    const element = await driver.$('android=new UiSelector().text("Ncell")');
    await element.click();

    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log("Step 5: Fetching OTP message");
    const messages = await driver.$$(
      'android=new UiSelector().resourceId("com.google.android.apps.messaging:id/message_text")'
    );
    const lastMessage = messages[messages.length - 1];
    const messageText = await lastMessage.getText();

    const otpRegex = /\b\d{6}\b/;
    const otpMatch = messageText.match(otpRegex);
    if (otpMatch) {
      const otp = otpMatch[0];
      console.log(`Found OTP: ${otp}`);

      setTimeout(() => {
        // Read existing JSON data
        const existingData = fs.readFileSync(
          "C:/Users/abhinav/Desktop/automation tests/cypress test/resourceDetails/OTP.json",
          "utf8"
        );

        // Parse the existing JSON data
        let otpObject = JSON.parse(existingData);

        // Update OTP value based on the key
        otpObject[key] = otp;

        // Write back to the file
        fs.writeFileSync(
          "C:/Users/abhinav/Desktop/automation tests/cypress test/resourceDetails/OTP.json",
          JSON.stringify(otpObject),
          "utf8"
        );

        fs.access(
          "C:/Users/abhinav/Desktop/automation tests/cypress test/resourceDetails/OTP.json",
          fs.constants.F_OK,
          (err) => {
            if (err) {
              console.error("Error checking file existence:", err);
            } else {
              console.log("OTP value has been updated successfully.");
            }
          }
        );
      }, 4000);
    } else {
      console.log("No OTP found in the message.");
    }
  } catch (error) {
    console.error(`Error in getOTP: ${error.message}`);
  } finally {
    await driver.deleteSession();
  }
}

async function checkBalance() {
  const driver = await remote(wdOptsForDialer);

  try {
    console.log("Step 1: Entering the USSD Code:");
    const dial1 = await driver.$(
      'android=new UiSelector().resourceId("com.android.contacts:id/star")'
    );
    await dial1.click();

    const dial2 = await driver.$(
      'android=new UiSelector().resourceId("com.android.contacts:id/one")'
    );
    await dial2.click();

    const dial3 = await driver.$(
      'android=new UiSelector().resourceId("com.android.contacts:id/four")'
    );
    await dial3.click();

    const dial4 = await driver.$(
      'android=new UiSelector().resourceId("com.android.contacts:id/four")'
    );
    await dial4.click();

    const dial5 = await driver.$(
      'android=new UiSelector().resourceId("com.android.contacts:id/pound")'
    );
    await dial5.click();

    const call = await driver.$(
      'android=new UiSelector().resourceId("com.android.contacts:id/call_sim1")'
    );
    await call.click();

    const readBalance = await driver.$(
      'android=new UiSelector().resourceId("com.android.phone:id/ussd_message")'
    );
    const readtext = await readBalance.getText();

    const balanceRegex = /Balance : Rs\. (\d+\.\d+)/;
    const match = readtext.match(balanceRegex);

    // Read the existing JSON file
    const filePath =
      "C:/Users/abhinav/Desktop/automation tests/cypress test/resourceDetails/OTP.json";
    const existingData = fs.readFileSync(filePath, "utf8");
    const existingObject = JSON.parse(existingData);

    if (match) {
      const balance = match[1];
      console.log(`Balance: Rs. ${balance}`);

      existingObject.balance = balance;

      setTimeout(() => {
        fs.writeFileSync(filePath, JSON.stringify(existingObject), "utf8");

        fs.access(filePath, fs.constants.F_OK, (err) => {
          if (err) {
            console.error("Error checking file existence:", err);
          } else {
            console.log("File has been updated successfully.");
          }
        });
      }, 4000);

      const cancel = await driver.$('//*[contains(@text,"Cancel")]');
      await cancel.click();
    } else {
      console.log("Balance not found");
    }
  } catch (error) {
    console.log(`error in checkBalance: ${error}`);
  } finally {
    await driver.deleteSession();
  }
}

async function usageTest() {
  const driver = await remote(wdOptsforYt);

  try {
    const acc = await driver.$('//*[contains(@text,"Use without an account")]');
    await acc.click();

    const got = await driver.$('//*[contains(@text,"Got it")]');
    await got.click();

    const type = await driver.$(
      'android=new UiSelector().resourceId("com.android.chrome:id/search_box_text")'
    );
    await type.setValue(
      "https://www.youtube.com/watch?v=8PnnCRYteIg&pp=ygUPdW5yZXF1aXRlZCBsb3Zl"
    );
    await driver.pressKeyCode(66);

    // Wait for the video to play for 60 seconds
    await driver.pause(60000);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await driver.deleteSession();
  }
}

if (process.argv[2] === "otp") {
  getOTP(process.argv[3]).catch((error) =>
    console.error(`Error in getOTP function: ${error.message}`)
  );
} else if (process.argv[2] === "balance") {
  checkBalance().catch((error) =>
    console.error(`Error in checkBalance function: ${error.message}`)
  );
} else if (process.argv[2] === "buyDataPack") {
  buyDataPack();
} else if (process.argv[2] === "usageTest") {
  usageTest();
} else {
  console.error('Invalid argument. Use "otp" or "balance" or "buyDataPack".');
}
