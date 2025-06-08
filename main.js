import { atom, createStore } from "jotai/vanilla";

import { DummyLed } from "./dummyLed.js";

let led;
let blinkInterval = null;

const lampAtom = atom(false);
const toggleAtom = atom(null, (get, set) => {
	const prev = get(lampAtom);
	set(lampAtom, !prev);
});
const store = createStore();

// lampAtom の値を監視して LED 出力に反映する
store.sub(lampAtom, () => {
	const value = store.get(lampAtom);
	if (value) {
		led.on();
		console.log("LED: turn ON");
	} else {
		led.off();
		console.log("LED: turn OFF");
	}
});

async function blinkLED() {
	blinkInterval = setInterval(() => {
		store.set(toggleAtom);
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
		if (process.env.TARGET === "raspberrypi") {
			const { GpioLed } = await import("./gpioLed.js");
			led = new GpioLed(4);
			console.log("Using GpioLed for Raspberry Pi.");
		} else {
			led = new DummyLed(4);
			console.log("Using DummyLed (not on Raspberry Pi).");
		}
		console.log("LED setup complete.");
	} catch (error) {
		console.error("Failed to setup LED:", error);
		process.exit(1);
	}

	console.log("Starting LED blinking...");
	blinkLED();
}

main();
