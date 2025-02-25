import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          +1
        </button>
        <button onClick={() => setCount((count) => count - 1)}>
          -1
        </button>
        <p>
          count is {count}
        </p>
        {count < 0 && <p className="error-text">Error: Count cannot be negative!</p>}
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
