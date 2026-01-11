import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Socket from './Socket.jsx';
import home from './home.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      
      <h1>WeB socket Testing</h1>
    <home />
      
    </>
  )
}

export default App
