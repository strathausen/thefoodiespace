import { Feed } from "./_components/feed";
import { WaitlistForm } from "./_components/waitlist-form";

export default function Home() {
  return (
    <main>
      <div className="container flex flex-col items-center justify-center gap-12 px-4">
        <div className="mx-5">
          <Feed />
        </div>
        <WaitlistForm />
      </div>
    </main>
  );
}
