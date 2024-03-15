"use client";
import { Deepgram } from "@/components/microphone/deepgram";
import Microphone from "../../components/microphone/microphone";
import { useEffect, useState } from "react";
import { useQueue } from "@uidotdev/usehooks";

export default function Listen() {
  const [audioBlob, setAudioBlob] = useState<Blob | undefined>();

  const { add, remove, first, size, queue } = useQueue<any>([]);
  const [isProcessing, setProcessing] = useState(false);

  const [words, setWords] = useState<string[]>([]);
  const [wordList, setWordList] = useState<string[]>([]);

  const [caption, setCaption] = useState<string | null>();
  const captionQueue = useQueue<string>([]);

  useEffect(() => {
    const processQueue = async () => {
      if (size > 0 && !isProcessing) {
        setProcessing(true);

        const blob = first;
        setAudioBlob(blob);
        remove();

        const waiting = setTimeout(() => {
          clearTimeout(waiting);
          setProcessing(false);
        }, 250);
      }
    };

    processQueue();
  }, [queue, remove, first, size, isProcessing]);

  useEffect(() => {
    if (captionQueue.size > 4) captionQueue.remove();
    if (caption && caption?.trim().length > 0) captionQueue.add(caption);
  }, [caption]);

  useEffect(() => {
    let combinedWords = wordList.concat(...words);
    if (combinedWords.length > 6) {
      setWordList([]);
      const sentence = combinedWords.join(" ");
      setCaption(sentence);
      fetch("/api/find-line-number", {
        method: "POST",
        body: JSON.stringify({
          text: sentence,
        }),
      });
    } else {
      console.log("waiting for more text...");
      setWordList(combinedWords);
    }
  }, [words]);

  return (
    <main className="w-full h-screen">
      <div className="m-auto w-fit p-20">
        <div className="mt-20 flex flex-col gap-2">
          {captionQueue.queue.map((q, idx) => {
            const opacity = (1 + idx) * 20;
            return (
              <div
                key={idx}
                className={`text-xl text-center opacity-${opacity}`}
              >
                {q}
              </div>
            );
          })}
        </div>
        <Microphone onAudioRecorded={(blob: Blob) => add(blob)} />

        <Deepgram
          audioToDecode={audioBlob}
          wordsDecoded={(words) => setWords(words)}
        />
      </div>
    </main>
  );
}
