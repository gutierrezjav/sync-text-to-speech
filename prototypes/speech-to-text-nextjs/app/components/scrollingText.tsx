"use client";

import useSWR from "swr";

type ScrollingTextProps = {
  language: "es" | "it" | "en";
};

export default function ScrollingText({ language }: ScrollingTextProps) {
  const textResult = useSWR(`/text/beer_${language}.txt`, (url: string) =>
    fetch(url).then((r) => r.text())
  );

  if (textResult.isLoading) {
    return <div>Loading text...</div>;
  }
  if (textResult.error) {
    return <div>{textResult.error}</div>;
  }

  const renderLine = (line: string, num: number) => {
    if (line.trim() == "") {
      return <div>&nbsp;</div>;
    }
    return (
      <div className="flex flex-row gap-2 place-content-start text-white">
        <span>{num}</span>
        <span>{line}</span>
      </div>
    );
  };
  return (
    <div className="font-sans font-semibold text-lg">
      {textResult.data?.split("\n").map(renderLine)}
    </div>
  );
}
