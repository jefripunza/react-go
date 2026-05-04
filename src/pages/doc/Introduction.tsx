export default function Introduction() {
  return (
    <div className="space-y-4">
      <p>
        Welcome to the <strong>Base Project</strong> documentation. This project
        is a starter template for building full-stack web applications with{" "}
        <strong>React</strong> (frontend) and <strong>Go</strong> (backend).
      </p>
      <h3>Features</h3>
      <ul>
        <li>
          <strong>React + Vite</strong> — Fast dev server with HMR and optimized
          production builds.
        </li>
        <li>
          <strong>Go Backend</strong> — Compiled binary with embedded frontend
          via <code>embed.FS</code>.
        </li>
        <li>
          <strong>TailwindCSS v4</strong> — Utility-first CSS with dark mode
          support.
        </li>
        <li>
          <strong>Authentication</strong> — Built-in login flow with token
          validation.
        </li>
        <li>
          <strong>Dark / Light Mode</strong> — Theme toggle with persistent
          state.
        </li>
        <li>
          <strong>Responsive Layout</strong> — Collapsible sidebar with mobile
          support.
        </li>
      </ul>
    </div>
  );
}
