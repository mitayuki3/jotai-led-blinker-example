import { Chip, Line } from 'node-libgpiod';

let chip;
let LED;
let blinkInterval = null;

async function setupGPIO() {
  try {
    // チップを開く (通常は /dev/gpiochip0)
    chip = new Chip('gpiochip0');
    // GPIO 4番ラインを取得し、出力として設定
    LED = new Line(chip, 4);
    await LED.requestOutputMode(0, 'led-blinker'); // 初期値をオフ(0)に設定
    console.log('GPIO setup complete.');
  } catch (error) {
    console.error('Failed to setup GPIO:', error);
    process.exit(1);
  }
}

// LEDを1秒周期で点滅させる関数
async function blinkLED() {
  let value = 0;
  blinkInterval = setInterval(async () => {
    value = value === 0 ? 1 : 0; // 0と1を切り替える
    await LED.setValue(value);   // LEDの状態を書き込む
    console.log(`LED is ${value === 1 ? 'on' : 'off'}`);
  }, 500);
}

// プログラム終了時にLEDをオフにする処理
process.on('SIGINT', async () => {
  if (blinkInterval) {
    clearInterval(blinkInterval);
  }
  if (LED) {
    // LEDをオフにする
    await LED.setValue(0);
    LED.release();
  }
  if (chip) {
    chip.close();
  }
  console.log('LED blinking stopped and GPIO unexported.');
  process.exit();
});

async function main() {
  await setupGPIO();
  console.log('Starting LED blinking...');
  blinkLED();
}

main();
