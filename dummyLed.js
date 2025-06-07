export class DummyLed {
	constructor(pin) {
		this.pin = pin;
		console.log(`DummyLed initialized for pin ${this.pin}`);
	}

	on() {
		console.log(`DummyLed on (pin ${this.pin})`);
	}

	off() {
		console.log(`DummyLed off (pin ${this.pin})`);
	}

	release() {
		console.log(`DummyLed released (pin ${this.pin})`);
	}
}
