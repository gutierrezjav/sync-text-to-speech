"use client";

import useSWR from "swr";
import { useEffect, useState } from "react";
import { kv } from "@vercel/kv";
import { translations } from "@/app/[language]/translations";

type ScrollingTextProps = {
  language: "es" | "it" | "en";
  autoScroll: boolean;
};
const textFetcher = (url: string) => fetch(url).then((r) => r.text());

export default function ScrollingText({
  language,
  autoScroll,
}: ScrollingTextProps) {
  const [lineNumber, setLineNumber] = useState(0);

  const textResult = useSWR(`/text/beer_${language}.txt`, textFetcher);

  useEffect(() => {
    const getLineNumber = () => {
      fetch("/api/line-number")
        .then((r) => r.json())
        .then((res) => res.lineNumber as number)
        .then((lineNumber) => {
          console.log("Returned", lineNumber);
          setLineNumber(lineNumber + 1);
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
    return <div>{translations[language].loading}</div>;
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
        className={`flex flex-row gap-2 place-content-start leading-loose text-black ${
          lineNumber > num ? "text-opacity-90 " : "text-opacity-20 "
        }`}
      >
        <span>{line}</span>
      </div>
    );
  };
  return <div>{textResult.data?.split("\n").map(renderLine)}</div>;
}
