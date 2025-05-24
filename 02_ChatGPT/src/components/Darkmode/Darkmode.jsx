import { useEffect, useState } from 'react'
import './Darkmode.css'

import { MdOutlineWbSunny } from "react-icons/md";

function Darkmode() {

  const [mode, setMode] = useState("darkmode")

  function toggle (){
    setMode(mode === "darkmode" ? "lightmode" : "darkmode")
  }

  useEffect(() => {
    document.body.className = mode
  }, [mode])

  return (
    <button className='darkmodebtn' onClick={() => {toggle()}}><MdOutlineWbSunny/></button>
  )
}

export default Darkmode