import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("Type what app you want above, then click Generate!");

  function handleGenerate() {
    if (input.trim().length === 0) return;
    setOutput(`✨ Here’s your simple app: ${input}`);
  }

  return (
    <div style={{ fontFamily: 'Arial', padding: '2rem' }}>
      <h1>AI App Generator (Free)</h1>
      <input
        type="text"
        placeholder="Describe your app..."
        style={{ padding: '0.5rem', width: '300px', marginRight: '0.5rem' }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleGenerate} style={{ padding: '0.5rem 1rem' }}>
        Generate
      </button>
      <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
        <p>{output}</p>
      </div>
    </div>
  );
}
