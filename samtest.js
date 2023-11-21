//create a homepage in html?
const { remote } = require("webdriverio");
const fs = require("fs");

const capabilities = {
  platformName: "Android",
  "appium:automationName": "UiAutomator2",
  "appium:deviceName": "samsung SM-G611F",
  "appium:appPackage": "com.samsung.android.dialer",
  "appium:appActivity": "com.samsung.android.dialer.DialtactsActivity",
};

const wdOpts = {
  hostname: process.env.APPIUM_HOST || "localhost",
  port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
  logLevel: "info",
  capabilities,
};

async function test() {
  const driver = await remote(wdOpts);

  try {
    console.log("Step 1: Entering the USSD Code:");
    const dial1 = await driver.$(
      'android=new UiSelector().resourceId("com.samsung.android.dialer:id/star")'
    );
    await dial1.click();

    const dial2 = await driver.$(
      'android=new UiSelector().resourceId("com.samsung.android.dialer:id/one")'
    );
    await dial2.click();

    const dial3 = await driver.$(
      'android=new UiSelector().resourceId("com.samsung.android.dialer:id/four")'
    );
    await dial3.click();

    const dial4 = await driver.$(
      'android=new UiSelector().resourceId("com.samsung.android.dialer:id/four")'
    );
    await dial4.click();

    const dial5 = await driver.$(
      'android=new UiSelector().resourceId("com.samsung.android.dialer:id/pound")'
    );
    await dial5.click();

    const call = await driver.$(
      'android=new UiSelector().resourceId("com.samsung.android.dialer:id/dialButton1")'
    );
    await call.click();
  } catch (error) {
    console.log(error);
  } finally {
    await driver.deleteSession();
  }
}

test();
