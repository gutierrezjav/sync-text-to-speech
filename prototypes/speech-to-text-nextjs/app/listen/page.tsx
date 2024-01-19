import Microphone from "../components/microphone";

export default function Listen() {
  return (
    <main className="w-full h-screen">
      <div className="m-auto w-fit p-40">
        <Microphone />
      </div>
    </main>
  );
}
