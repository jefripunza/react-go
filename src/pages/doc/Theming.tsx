import CodeBlock from "@/components/ui/CodeBlock";

export default function Theming() {
  return (
    <div className="space-y-4">
      <p>
        Themes are defined in <code>src/index.css</code> using CSS custom
        properties. The project supports both dark and light modes.
      </p>
      <h3>Color Variables</h3>
      <CodeBlock>{`/* Dark mode (default) */
 :root {
   --t-dark-900: #0a0a0f;
   --t-dark-800: #12121a;
   --t-foreground: #ffffff;
 }
 
 /* Light mode */
 :root[data-theme="light"] {
   --t-dark-900: #ffffff;
   --t-dark-800: #f1f3f8;
   --t-foreground: #111827;
 }`}</CodeBlock>
      <p>
        The theme toggle is managed by <code>src/stores/themeStore.ts</code> and
        persisted via Zustand's <code>persist</code> middleware.
      </p>
    </div>
  );
}
