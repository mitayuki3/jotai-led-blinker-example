import { Chip, Line } from "node-libgpiod";

export class GpioLed {
	constructor(pin) {
		this.pin = pin;
		this.chip = new Chip("gpiochip0");
		this.line = new Line(this.chip, this.pin);
		this.line.requestOutputMode(0, "led-blinker");
	}

	on() {
		this.line.setValue(1);
	}

	off() {
		this.line.setValue(0);
	}

	release() {
		this.line.release();
	}
}
