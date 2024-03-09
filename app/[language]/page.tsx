"use client";
import { redirect } from "next/navigation";
import ScrollingText from "../../components/scrollingText";
import { Checkbox, FormControlLabel, Paper, Switch } from "@mui/material";
import { useState } from "react";
import { translations } from "./translations";

type TextPageParams = {
  params: {
    language: "en" | "es" | "it";
  };
};

export default function TextPage({ params }: TextPageParams) {
  const lang = params.language.toLocaleLowerCase();

  if (!["en", "es", "it"].includes(lang)) {
    const fallbackLang = lang.startsWith("en")
      ? "en"
      : lang.startsWith("it")
        ? "it"
        : "es";
    redirect(`/${fallbackLang}`);
  }

  const [autoScroll, setAutoScroll] = useState(false);

  return (
    <>
      <main className="p-4 sm:p-10 md:p-20">
        <div className="p-4 sm:p-10 flex flex-col gap-10 bg-white bg-opacity-25">
          <FormControlLabel
            control={
              <Switch
                defaultChecked={autoScroll}
                onChange={(ev) => setAutoScroll(ev.target.checked)}
              />
            }
            label={translations[params.language].autoscroll}
          />
          <ScrollingText language={params.language} autoScroll />
        </div>
      </main>
    </>
  );
}
