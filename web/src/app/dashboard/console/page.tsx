"use client";

import { useSearchParams } from "next/navigation";
import { Tab, Tabs } from "@heroui/react";

const ConsolePage = () => {
  const searchParams = useSearchParams();
  const hwids: string[] = JSON.parse(searchParams.get("hwids") || "[]");

  return (
    <div>
      <h1>Console</h1>
      <Tabs aria-label="HWID Tabs">
        {hwids.map((hwid, index) => (
          <Tab key={index} title={`Client ${index + 1} - HWID: ${hwid}`}>
            <p>{hwid}</p>
          </Tab>
        ))}
      </Tabs>
    </div>
  );
};

export default ConsolePage;
