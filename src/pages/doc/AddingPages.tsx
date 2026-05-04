import CodeBlock from "@/components/ui/CodeBlock";

export default function AddingPages() {
  return (
    <div className="space-y-4">
      <p>To add a new authenticated page:</p>
      <h3>1. Create the Page Component</h3>
      <CodeBlock>{`// src/pages/app/MyPage.tsx
export default function MyPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-foreground">
          My Page
        </h2>
        <p className="text-sm text-dark-300 mt-1">
          Description here
        </p>
      </div>
      {/* Your content */}
    </div>
  );
}`}</CodeBlock>
      <h3>2. Add the Route</h3>
      <CodeBlock>{`// src/main.tsx — add inside the "app" children array
{
  path: "my-page",
  element: <MyPage />,
}`}</CodeBlock>
      <h3>3. Add to Sidebar Navigation</h3>
      <CodeBlock>{`// src/layouts/AppLayout.tsx — add to navItems
{
  label: "My Page",
  path: "/app/my-page",
  icon: RiPageLine,
}`}</CodeBlock>
    </div>
  );
}
