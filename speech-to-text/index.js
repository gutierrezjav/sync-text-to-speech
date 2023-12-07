require("dotenv").config();
const sdk = require("@deepgram/sdk");
const mic = require("mic");

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;
const deepgram = sdk.createClient(DEEPGRAM_API_KEY);

const micInstance = mic({
  rate: "16000",
  channels: "1",
  debug: true,
  exitOnSilence: 6,
});

const micInputStream = micInstance.getAudioStream();
micInputStream.on("startComplete", function () {
  console.log("Start recording");
  setTimeout(function () {
    micInstance.pause();
    console.log(`Record Completed`);
    process.exit(0);
  }, 5000);
});
micInputStream.on("data", function (data) {
  live.send(data);
});
const live = deepgram.listen.live({ model: "nova-2" });

live.on(sdk.LiveTranscriptionEvents.Open, () => {
  live.on(sdk.LiveTranscriptionEvents.Transcript, (data) => {
    console.log("Transcribed", data);
  });
  live.on(sdk.LiveTranscriptionEvents.Close, () => {
    console.log("Connection closed.");
  });
});

console.log("Listening and transcribing audio.. (this costs money)");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("To stop listening press enter.", (answer) => {
  live.finish();
  rl.close();
});

micInstance.start();
