import { useState, useEffect } from 'react'
import lens from "./assets/lens.png";
import spinner from "./assets/spinner.gif";
import './App.css'

function App() {
  const [prompt, updatePrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [reset, setreset] = useState(false);

  const sendPrompt = async (event: any) => {
    if (event.key !== "Enter") {
      return;
    }
    console.log('prompt', prompt)
    try {
      setLoading(true);
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      };

      const res = await fetch("/api/ask", requestOptions)
      if (!res.ok){
        throw new Error('Error: Something went wrong went calling the API...')
      }

      const { message } = await res.json()
      setAnswer(message)

    } catch (err) {
      console.error(err, "err")
    } finally {
      setLoading(false)
    }
  }

  const startOver = () => {
    console.log("start over")
    setAnswer("")
    updatePrompt("")
  }

  useEffect(() => {
    if (reset) {
      startOver()
      setreset(false)
    }
  }, [reset])

  return (
    <>
      <div className="app">
      <div className="app-container">
        <div className="spotlight__wrapper">
          <input
            type="text"
            className="spotlight__input"
            placeholder="Ask me anything..."
            disabled={loading}
            style={{
              backgroundImage: loading ? `url(${spinner})`: `url(${lens})`,
            }}
            value={prompt}
            onChange={(e) => updatePrompt(e.target.value)}
            onKeyDown={(e) => sendPrompt(e)}
          />
          <button
            onClick={() => setreset(true)}
          >Start over</button>
          <div className="spotlight__answer">
          <div className="spotlight__answer">{answer && <p>{answer}</p>}</div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default App
