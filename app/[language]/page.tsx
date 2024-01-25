import { redirect } from "next/navigation";
import ScrollingText from "../../components/scrollingText";

type TextPageParams = {
  params: {
    language: "en" | "es" | "it";
  };
};

export default function TextPage({ params }: TextPageParams) {
  const lang = params.language.toLocaleLowerCase();
  if (["en", "es", "it"].includes(lang)) {
    return (
      <main className="py-10 md:py-20 px-5 sm:px-10 md:px-20 transition-all">
        <ScrollingText language={params.language} />
      </main>
    );
  } else {
    const fallbackLang = lang.startsWith("en")
      ? "en"
      : lang.startsWith("it")
      ? "it"
      : "es";
    redirect(`/${fallbackLang}`);
  }
}
