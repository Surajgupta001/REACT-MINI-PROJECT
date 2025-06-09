import { Route, Routes } from 'react-router-dom'
import Home from './Component/Pages/Home'
import Room from './Component/Pages/Room'

import './App.css'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/room/:roomId' element={<Room />} />
      </Routes>
    </>
  )
}

export default App
