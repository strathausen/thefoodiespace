import { WaitlistForm } from "./_components/waitlist-form";

export default function Home() {
  return (
    <main>
      <div className="container flex flex-col items-center justify-center gap-12 px-4">
        <div className="container mx-auto px-4 py-8 lowercase">
          <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-center text-2xl font-bold text-accent">
              🍳 Join the Culinary Revolution with TomatoVillage! 🌟
            </h2>
            <p className="mb-4 text-justify">
              Are you passionate about cooking and eager to explore a world of
              flavors? TomatoVillage is about to transform your kitchen
              experience! Our app isn&apos;t just a recipe-sharing platform;
              it&apos;s a vibrant community where culinary creativity thrives.
              Here&apos;s a sneak peek at what&apos;s cooking:
            </p>

            <ul className="mb-4 list-inside list-disc space-y-2">
              <li>
                <strong>Diverse Culinary Creations</strong>: Whether you&apos;re
                a vegan, a meat-lover, or have a sweet tooth, our vast
                collection of user-generated recipes means there&apos;s always
                something new and exciting to try.
              </li>
              <li>
                <strong>Show and Tell</strong>: Don&apos;t just follow recipes;
                showcase your culinary masterpieces! Share photos and videos of
                your dishes, and get inspired by the mouth-watering creations
                from fellow food enthusiasts.
              </li>
              <li>
                <strong>Remix Recipes</strong>: Found a recipe that you love but
                want to add your twist? Remix it! Add your flair to existing
                recipes and share your version with the world, while giving
                credit to the original creator.
              </li>
              <li>
                <strong>Connect with Food Lovers</strong>: Follow your favorite
                home chefs, exchange tips, and build your foodie network. Our
                community is all about supporting and inspiring each other.
              </li>
              <li>
                <strong>Safe and Inclusive Space</strong>: We believe cooking is
                for everyone. Customize your profile with your bio, pronouns,
                and dietary preferences. Our platform is built on respect and
                inclusivity.
              </li>
              <li>
                <strong>More Than Just Recipes</strong>: Get cooking tips,
                nutritional advice, and join in on community challenges. Whether
                you&apos;re a seasoned chef or just starting, there&apos;s
                always something new to learn.
              </li>
            </ul>

            <p className="mb-4 text-center">
              ⏳ <strong>Coming Soon</strong>: We&apos;re stirring up something
              special and can&apos;t wait to welcome you to TomatoVillage. Sign
              up for our waitlist today and be the first to know when we launch.
              Delicious surprises await!
            </p>

            <div className="text-center">
              <WaitlistForm />
            </div>

            <p className="mt-4 text-center text-sm">
              Be part of a culinary journey like no other. TomatoVillage - where
              every flavor tells a story.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
