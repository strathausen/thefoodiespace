"use client";
import { useState } from "react";
import { InputField } from "../_components/input-field";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [socials, setSocials] = useState<string[]>([]);

  return (
    <main>
      <div className="mt-10">
        <h1 className="py-6 text-xl underline decoration-accent">
          profile page
        </h1>
        <InputField
          label="name"
          name="name"
          type="text"
          placeholder="name"
          value={name}
          onChange={setName}
        />
      </div>
    </main>
  );
}
