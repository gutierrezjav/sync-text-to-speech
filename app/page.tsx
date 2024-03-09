import { Button, Paper } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="p-4 sm:p-10 md:p-20">
      <Paper>
        <div className="px-10 py-20 flex flex-col  place-content-evenly gap-5">
          <Button variant="outlined" className="p-5" href="/en">
            🇬🇧 English
          </Button>
          <Button variant="outlined" className="p-5" href="/es">
            🇪🇸 Español
          </Button>
          <Button variant="outlined" className="p-5" href="/it">
            🇮🇹 Italiano
          </Button>
        </div>
        <Image
          src="/18956.jpg"
          alt="Flowers"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "100%", height: "auto" }} // optional
        />
      </Paper>
    </main>
  );
}
