import CodeBlock from "@/components/ui/CodeBlock";

export default function QuickStart() {
  return (
    <div className="space-y-4">
      <p>Get the project up and running in a few steps:</p>
      <h3>Prerequisites</h3>
      <ul>
        <li>
          <strong>Node.js</strong> ≥ 18 (or Bun)
        </li>
        <li>
          <strong>Go</strong> ≥ 1.21
        </li>
      </ul>
      <h3>Installation</h3>
      <CodeBlock>{`# Clone the repository
git clone https://github.com/jefripunza/react-go.git
cd react-go

# Install frontend dependencies
bun install   # or: npm install

# Run in development mode
bun run dev   # or: npm run dev

# Build for production
bun run build # or: npm run build`}</CodeBlock>
      <h3>Running the Go Backend</h3>
      <CodeBlock>{`# Download Go dependencies
go mod download

# Run the server
go run main.go

# Build binary
go build -o react-go main.go
./react-go`}</CodeBlock>
    </div>
  );
}
