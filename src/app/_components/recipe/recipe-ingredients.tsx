"use client";
import { useEffect, useState } from "react";
import { Heading } from "../typography/Heading2";

function decimalToFrac(decimal: number): string {
  const integer = Math.floor(decimal);
  if (decimal >= 1) {
    decimal -= integer;
  }

  let closestFraction = "";
  let minDifference = Number.MAX_VALUE;

  for (let denominator = 1; denominator <= 6; denominator++) {
    for (let numerator = 1; numerator <= 6; numerator++) {
      const fractionDecimal = numerator / denominator;
      const difference = Math.abs(fractionDecimal - decimal);

      if (difference < minDifference) {
        minDifference = difference;
        closestFraction = `${numerator}/${denominator}`;
      }
    }
  }

  return (integer ? integer.toString() + " " : "") + closestFraction;
}

function isFraction(value: string) {
  return /^[\d]+\/[\d]+$/.test(value.trim());
}

function calculateNumber(value: string) {
  const fraction = value.split("/");
  return Number(fraction[0]) / Number(fraction[1]);
}

function formatQuantity(
  value: string,
  originalYield: number,
  yieldNumber: number,
) {
  if (isFraction(value)) {
    const number = calculateNumber(value);
    const newNumber =
      Math.round((number * yieldNumber * 10) / originalYield) / 10;
    return decimalToFrac(newNumber);
  }
  return value;
}

const IngredientField = ({
  ingredient,
  originalYield,
  yieldNumber,
}: {
  ingredient: PrismaJson.RecipeIngredient;
  originalYield?: number;
  yieldNumber?: number;
}) => {
  let quantity: string | number = ingredient.quantity;
  if (originalYield && originalYield !== yieldNumber && yieldNumber) {
    if (/^[\d]+$/.test(ingredient.quantity)) {
      quantity =
        Math.round(
          (Number(ingredient.quantity) * yieldNumber * 10) / originalYield,
        ) / 10;
    }
    if (isFraction(ingredient.quantity)) {
      quantity = formatQuantity(
        ingredient.quantity,
        originalYield,
        yieldNumber,
      );
      // if new quantity is still the same value as the original quantity, just return the original quantity
      if (
        quantity ===
        formatQuantity(ingredient.quantity, originalYield, originalYield)
      ) {
        quantity = ingredient.quantity;
      }
    }
  }
  return (
    <div className="flex items-center gap-2">
      <span className="w-10 text-right font-semibold">{quantity}</span>
      <span className="min-w-14 text-stone-950/60">
        {ingredient.unit ? ` ${ingredient.unit}` : ""}
      </span>
      <span>{ingredient.name}</span>
      {ingredient.notes && (
        <span className="ml-2 text-sm text-stone-950/50">
          {ingredient.notes}
        </span>
      )}
    </div>
  );
};

export const RecipeIngredients = ({
  ingredients,
  className,
  yield: recipeYield,
}: {
  ingredients: PrismaJson.RecipeIngredient[];
  className?: string;
  yield?: string;
}) => {
  const [originalYield, setOriginalYield] = useState<number>();
  const [yieldNumber, setYieldNumber] = useState<number>();
  const [yieldUnit, setYieldUnit] = useState<string>();

  useEffect(() => {
    const yieldRegex = /(\d+)[ ]*(\w*)/g;
    const matches = recipeYield?.matchAll(yieldRegex);
    const match = matches?.next().value as string[];
    if (match) {
      setOriginalYield(Number(match[1]));
      setYieldNumber(Number(match[1]));
      setYieldUnit(match[2]);
    }
  }, [recipeYield]);

  return (
    <div className={className}>
      <Heading id="ingredients" className="font-vollkorn text-xl font-semibold">
        ingredients
      </Heading>
      <div className="mt-2 text-center">
        {recipeYield && !yieldNumber && <span>yield: {recipeYield}</span>}
        {yieldNumber && (
          <span>
            yield:{" "}
            <input
              value={yieldNumber}
              type="number"
              className="w-16 rounded bg-white/50 text-center shadow outline-none"
              onChange={(e) => setYieldNumber(Number(e.target.value) || 1)}
              min={1}
            />
            {yieldUnit ? ` ${yieldUnit}` : ""}
          </span>
        )}
      </div>
      <ul className="mt-3 list-inside list-disc">
        {ingredients.map((ingredient, i) => (
          <IngredientField
            key={i}
            ingredient={ingredient}
            originalYield={originalYield}
            yieldNumber={yieldNumber}
          />
        ))}
      </ul>
    </div>
  );
};
