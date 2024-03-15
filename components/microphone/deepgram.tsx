import {
  LiveClient,
  LiveTranscriptionEvents,
  createClient,
} from "@deepgram/sdk";
import EventEmitter from "events";
import { useEffect, useState } from "react";
import Dg from "./dg.svg";

declare interface DeepgramConnector {
  on(event: "wordsReceived", listener: (words: string[]) => void): this;
  on(event: "connected", listener: () => void): this;
  on(event: string, listener: Function): this;
}

class DeepgramConnector extends EventEmitter {
  private _connection: LiveClient | undefined;
  private _isConnected: boolean = false;
  private _retryLimit = 4;
  private _retries = 0;

  public retry = true;

  public get isConnected(): boolean {
    return this._isConnected;
  }

  constructor() {
    super();
  }

  public connect = async () => {
    const apiKey = await this.getApiKey();

    console.log("connecting to deepgram");
    const deepgram = createClient(apiKey ?? "");

    this._connection = deepgram.listen.live({
      model: "nova-2",
      interim_results: false,
      punctuate: true,
      profanity_filter: false,
      smart_format: true,
      language: "es",
      filler_words: false,
    });

    this._connection.on(LiveTranscriptionEvents.Open, () => {
      console.log("connection established");
      this._isConnected = true;
      this.emit("connected");
      this._retries = 0;
    });

    this._connection.on(LiveTranscriptionEvents.Close, () => {
      console.log("connection closed");
      this._isConnected = false;
      this._connection?.removeAllListeners();
      this.emit("disconnected");
      if (this.retry && this._retries < this._retryLimit) {
        this._retries++;
        this.connect();
      }
    });
    this._connection.on(LiveTranscriptionEvents.Warning, (w) => {
      console.log("connection warning", w);
    });

    this._connection.on(LiveTranscriptionEvents.Transcript, (data) => {
      const words: string[] = data.channel.alternatives[0].words.map(
        (w: any) => w.punctuated_word ?? w.word
      );
      this.emit("wordsReceived", words);
    });

    this._connection.on(LiveTranscriptionEvents.Error, (err) => {
      console.log("connection error", err);
    });
  };

  public sendAudio = (blob: Blob) => {
    console.log("Sending audio", blob.size);
    if (!this._isConnected) {
      this.connect();
    }
    this._connection?.send(blob);
  };

  private getApiKey = async () => {
    console.log("getting a new api key");
    try {
      const res = await fetch("/api", { cache: "no-store" });
      const obj = await res.json();
      if (!("key" in obj)) {
        throw new Error("No api key returned");
      }
      return obj.key;
    } catch (e) {
      console.error(e);
    }
  };
}

export const Deepgram = (params: {
  audioToDecode?: Blob;
  wordsDecoded: (words: string[]) => void;
}) => {
  const [dg, setDg] = useState<DeepgramConnector>();
  const [isConnected, setConnected] = useState(false);

  useEffect(() => {
    const dg = new DeepgramConnector();
    dg.on("connected", () => setConnected(true));
    dg.on("disconnected", () => setConnected(false));
    dg.on("wordsReceived", (words) => params.wordsDecoded(words));
    dg.connect();
    setDg(dg);
  }, []);

  useEffect(() => {
    if (params.audioToDecode) dg!.sendAudio(params.audioToDecode);
  }, [params.audioToDecode]);

  return (
    <div className="flex flex-row gap-10 p-10">
      <span className="text-sm ">
        {isConnected
          ? "Deepgram connection open!"
          : "Deepgram is connecting..."}
      </span>
      <Dg
        width="30"
        height="30"
        className={
          isConnected ? "fill-white drop-shadow-glowBlue" : "fill-gray-600"
        }
      />
    </div>
  );
};
