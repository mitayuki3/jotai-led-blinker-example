import { GpioLed } from "./gpioLed.js";

let led;
let blinkInterval = null;

// LEDを1秒周期で点滅させる関数
async function blinkLED() {
	let value = 0;
	blinkInterval = setInterval(() => {
		value = value === 0 ? 1 : 0;
		if (value === 1) {
			led.on();
		} else {
			led.off();
		}
		console.log(`LED is ${value === 1 ? "on" : "off"}`);
	}, 500);
}

// プログラム終了時にLEDをオフにする処理
process.on("SIGINT", () => {
	if (blinkInterval) {
		clearInterval(blinkInterval);
	}
	if (led) {
		led.off(); // LEDをオフにする
		led.release(); // GPIOを解放する
	}
	console.log("LED blinking stopped and GPIO unexported.");
	process.exit();
});

async function main() {
	try {
		led = new GpioLed(4); // GPIO 4番ピンを使用
		console.log("GPIO setup complete.");
	} catch (error) {
		console.error("Failed to setup GPIO:", error);
		process.exit(1);
	}

	console.log("Starting LED blinking...");
	blinkLED();
}

main();
