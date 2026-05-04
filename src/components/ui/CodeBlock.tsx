export default function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-dark-900/80 border border-dark-600/40 rounded-xl p-4 overflow-x-auto text-xs font-mono text-neon-green leading-relaxed whitespace-pre">
      {children}
    </pre>
  );
}
