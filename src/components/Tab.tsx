import { useState } from "react";

export interface Tab {
  key: string; // for ruleKey
  label: string;
  render: () => React.ReactNode;
}
interface Props {
  tabs: Tab[];
  useRule?: boolean;
}
export default function Tabs({ tabs, useRule }: Props) {
  const [activeTab, setActiveTab] = useState(tabs[0].key);

  return (
    <div className="flex">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`px-4 py-2 ${
            activeTab === tab.key ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
