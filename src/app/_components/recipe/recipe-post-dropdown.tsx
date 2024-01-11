"use client";
import Link from "next/link";
import { useState } from "react";
import { FaEllipsisVertical } from "react-icons/fa6";

type Props = {
  recipeId: string;
  enableEdit?: boolean;
};

export const RecipePostDropdown = (props: Props) => {
  const options = [
    {
      label: "edit ✏️",
      link: `/editor/${props.recipeId}`,
      enabled: props.enableEdit,
    },
    // {
    //   label: "delete 🗑️",
    //   link: `/editor/${props.recipeId}`,
    //   enabled: props.enableEdit,
    // },
    {
      label: "report 🚩",
      action: () => alert("report"),
      enabled: props.enableEdit === false,
    },
  ];
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-20 flex cursor-pointer flex-col gap-0.5 px-2 py-1">
      <button
        onClick={() => setIsOpen((t) => !t)}
        onAbort={() => setIsOpen(false)}
      >
        <FaEllipsisVertical />
      </button>
      {isOpen && (
        <div className="absolute right-1 top-7 w-32 rounded bg-white/80 px-4 py-2 shadow-xl drop-shadow-md">
          <ul>
            {options
              .filter((o) => o.enabled)
              .map((option) => (
                <li
                  key={option.label}
                  className="text-stone-500 transition hover:text-stone-950"
                  onClick={option.action}
                >
                  {option.link ? (
                    <Link href={option.link}>{option.label}</Link>
                  ) : (
                    option.label
                  )}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};
