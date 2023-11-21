const { remote } = require("webdriverio");
const fs = require("fs");

const capabilities = {
  platformName: "Android",
  "appium:automationName": "UiAutomator2",
  "appium:deviceName": "samsung SM-G611F",
  "appium:appPackage": "com.google.android.apps.messaging",
  "appium:appActivity":
    "com.google.android.apps.messaging.ui.ConversationListActivity",
};

const wdOpts = {
  hostname: process.env.APPIUM_HOST || "localhost",
  port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
  logLevel: "info",
  capabilities,
};

const phoneDialerCapabilities = {
  platformName: "Android",
  "appium:automationName": "UiAutomator2",
  "appium:deviceName": "samsung SM-G611F",
  "appium:appPackage": "com.samsung.android.dialer",
  "appium:appActivity": "com.samsung.android.dialer.DialtactsActivity",
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
  "appium:deviceName": "samsung SM-G611F",
  "appium:automationName": "UiAutomator2",
};

const wdOptsforYt = {
  hostname: process.env.APPIUM_HOST || "localhost",
  port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
  logLevel: "info",
  capabilities: ytCapabilities,
};

const ncellCaps = {
  platformName: "Android",
  "appium:appPackage": "com.mventus.ncell.activity",
  "appium:appActivity": "com.mventus.ncell.activity.MainActivity",
  "appium:deviceName": "samsung SM-G611F",
  "appium:automationName": "UiAutomator2",
};

const wdOptsforNcell = {
  hostname: process.nextTick.APPIUM_HOST || "localhost",
  port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
  loglevel: "info",
  capabilities: ncellCaps,
};

//buys the data pack via USSD
async function buyDataPack() {
  const driver = await remote(wdOptsForDialer);

  try {
    const number = "*17123#";

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
        `android=new UiSelector().resourceId("com.samsung.android.dialer:id/${elementId}")`
      );
      await element.click();
    }
    const call = await driver.$(
      'android=new UiSelector().resourceId("com.samsung.android.dialer:id/dialButtonImage")'
    );
    await call.click();

    const num = await driver.$(
      'android=new UiSelector().resourceId("com.android.phone:id/input_field")'
    );
    await num.setValue("2");

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
    await cl2.click();
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
    const number = "*144#";

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
        `android=new UiSelector().resourceId("com.samsung.android.dialer:id/${elementId}")`
      );
      await element.click();
    }

    const call = await driver.$(
      'android=new UiSelector().resourceId("com.samsung.android.dialer:id/dialButton")'
    );
    await call.click();

    const readBalance = await driver.$(
      'android=new UiSelector().resourceId("com.android.phone:id/message")'
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
    await type.setValue("https://youtu.be/dQw4w9WgXcQ?si=EXpstIswmVT1Y8F0");
    await driver.pressKeyCode(66);

    // Wait for the video to play for 60 seconds
    await driver.pause(60000);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await driver.deleteSession();
  }
}

async function NcellApp() {
  const driver = await remote(wdOptsforNcell);
  try {
    await driver.pause(5000);

    const skip = await driver.$('//*[contains(@text,"Skip")]');
    await skip.click();

    const Acc = await driver.$('//*[contains(@text, "I Accept & Continue")]');
    await Acc.click();

    const eng = await driver.$('//*[contains(@text, "English")]');
    await eng.click();

    const text = await driver.$('//*[contains(@text, "Mobile No.")]');
    await text.setValue("9800015053");

    const login = await driver.$('//*[contains(@text, "Login")]');
    await login.click();

    await driver.pause(6000);

    const deny = await driver.$('//*[contains(@text, "Deny")]');
    await deny.click();

    const myPack = await driver.$('//*[contains(@text, "My Packs")]');
    await myPack.click();

    const data = await driver.$('//*[contains(@text, "Data")]');
    await data.click();
  } catch (err) {
    console.log("error", err);
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
} else if (process.argv[2] === "Ncell") {
  NcellApp();
} else {
  console.error('Invalid argument. Use "otp" or "balance" or "buyDataPack".');
}
