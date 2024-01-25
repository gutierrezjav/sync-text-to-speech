"use client";

import useSWR from "swr";
import { useEffect, useState } from "react";
import { kv } from "@vercel/kv";

type ScrollingTextProps = {
  language: "es" | "it" | "en";
};
const textFetcher = (url: string) => fetch(url).then((r) => r.text());

export default function ScrollingText({ language }: ScrollingTextProps) {
  const [lineNumber, setLineNumber] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const textResult = useSWR(`/text/beer_${language}.txt`, textFetcher);

  useEffect(() => {
    const getLineNumber = () => {
      fetch("/api/line-number")
        .then((r) => r.json())
        .then((res) => res.lineNumber as number)
        .then((lineNumber) => {
          console.log("Returned", lineNumber);
          setLineNumber(lineNumber);
        });
    };
    const interval = setInterval(() => getLineNumber(), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const lineDiv = document.getElementById(`line-${lineNumber}`);
    console.log(lineDiv);
    if (autoScroll && lineDiv) {
      lineDiv.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [lineNumber, autoScroll]);

  if (textResult.isLoading) {
    return <div>Loading text...</div>;
  }
  if (textResult.error) {
    return <div>{textResult.error}</div>;
  }

  const renderLine = (line: string, num: number) => {
    if (line.trim() == "") {
      return <div key={num}>&nbsp;</div>;
    }
    return (
      <div
        id={`line-${num}`}
        key={num}
        className={`flex flex-row gap-2 place-content-start ${
          lineNumber >= num ? "text-black" : "text-white"
        }`}
      >
        <span>{lineNumber === num ? ">" : ""}</span>
        <span>{num}</span>
        <span>{line}</span>
      </div>
    );
  };
  return (
    <>
      <div className="py-4">
        <input
          type="checkbox"
          checked={autoScroll}
          onChange={(ev) => setAutoScroll(ev.target.checked)}
        ></input>
        <span className="px-4">Auto-scroll</span>
      </div>
      <div className="font-sans font-semibold text-lg">
        {textResult.data?.split("\n").map(renderLine)}
      </div>
    </>
  );
}
