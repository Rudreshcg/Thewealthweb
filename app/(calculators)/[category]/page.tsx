"use client"; // Ensures this is a Client Component

import React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import TypographyH1 from "@/components/TypographyH1";
import TypographyH2 from "@/components/TypographyH2";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { calculatorsCategory } from "@/constants/calculatorsCategory";

export default function CategoryPage() {
  const pathname = usePathname();
  const category = pathname.split("/").pop(); // Get the last part of the path
  const calculators = calculatorsCategory.filter(
    (calc) => calc.category === category
  );

  if (!calculators.length) return <p>Category not found</p>;

  return (
    <div>
      <TypographyH1 className="mb-6">
        {calculators[0].category.replace("-", " ")}
      </TypographyH1>
      <div className="grid w-full gap-4 grid-cols-1 sm:grid-cols-2">
        {calculators.map((calc, i) => (
          <Link
            key={`calculator-${i}`}
            href={`/${category}/${calc.url}`}
            className="p-4 hover:bg-muted focus-visible:bg-muted transition-all border-2 relative rounded-lg bg-card group"
          >
            <Card className="border-none group-hover:bg-muted group-focus-visible:bg-lime-300 transition-all">
              <TypographyH2 className="mb-2">
                {i + 1}. {calc.name}
              </TypographyH2>
              <Separator className="h-[2px]" />
              <p className="mt-4 text-neutral-700 dark:text-neutral-300">
                {calc.description}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
