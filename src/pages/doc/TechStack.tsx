export default function TechStack() {
  return (
    <div className="space-y-4">
      <table>
        <thead>
          <tr>
            <th>Layer</th>
            <th>Technology</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Frontend</td>
            <td>React 19 + Vite</td>
            <td>UI framework with fast builder</td>
          </tr>
          <tr>
            <td>Styling</td>
            <td>TailwindCSS v4</td>
            <td>Utility-first CSS</td>
          </tr>
          <tr>
            <td>State</td>
            <td>Zustand</td>
            <td>Lightweight state management</td>
          </tr>
          <tr>
            <td>Icons</td>
            <td>react-icons</td>
            <td>Icon library</td>
          </tr>
          <tr>
            <td>HTTP</td>
            <td>Axios</td>
            <td>API client</td>
          </tr>
          <tr>
            <td>Backend</td>
            <td>Go</td>
            <td>API server with embedded frontend</td>
          </tr>
          <tr>
            <td>Routing</td>
            <td>React Router v7</td>
            <td>Client-side routing</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
