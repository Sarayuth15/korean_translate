import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Translator from './Translator'

function App() {
  const [count, setCount] = useState(0)

  return (

    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <Translator />
    </div>

  )
}

export default App
