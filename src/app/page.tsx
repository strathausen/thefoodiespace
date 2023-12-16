import { WaitlistForm } from "./_components/waitlist-form";

export default function Home() {
  return (
    <main>
      <div className="container flex flex-col items-center justify-center gap-12 px-4">
        <div className="container mx-auto px-4 py-8 lowercase">
          <div className="mx-auto max-w-2xl rounded-lg bg-white/30 p-6 shadow-md backdrop-blur-3xl">
            <h2 className="mb-4 text-center text-2xl font-bold text-accent">
              🍳 Join the Culinary Revolution with TomatoVillage! 🌟
            </h2>
            <p className="mb-4 text-justify">
              Here&apos;s a sneak peek at what&apos;s cooking:
            </p>

            <ul className="mb-4 list-inside list-disc space-y-2">
              <li>
                <strong>Diverse Culinary Creations</strong>: Whether you&apos;re
                a vegan, a meat-lover, or have a sweet tooth, there&apos;s
                always something new to try.
              </li>
              <li>
                <strong>Show and Tell</strong>: Don&apos;t just follow recipes;
                showcase your own!
              </li>
              <li>
                <strong>Remix Recipes</strong>: Found a recipe that you love but
                want to add your twist? Remix it!
              </li>
              <li>
                <strong>Connect with Food Lovers</strong>: Follow your favorite
                home chefs, exchange tips, and build your foodie network.
              </li>
              <li>
                <strong>Safe and Inclusive Space</strong>: cooking is for
                everyone.
              </li>
            </ul>

            <p className="mb-4 text-center">
              ⏳ <strong>Coming Soon</strong>: We&apos;re stirring up something
              special and can&apos;t wait to welcome you to TomatoVillage.
            </p>

            <div className="text-center">
              <WaitlistForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
