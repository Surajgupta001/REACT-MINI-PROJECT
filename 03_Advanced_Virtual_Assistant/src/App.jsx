import { useContext } from 'react';

import virtualAssistant from './assets/ai.png'

import { IoMicOutline } from "react-icons/io5";

import { dataContext } from './Context/UserContext';

import speakking from './assets/speak.gif'
import aivoicegif from './assets/aiVoice.gif'

import './App.css'

function App() {

  let { recognition, speaking, setSpeaking, prompt, setPrompt, response, setResponse } = useContext(dataContext)

  return (
    <div className='main'>
      <img src={virtualAssistant} alt="" id='shifra' />
      <span>I'm Shifra, Your Advanced Virtual Assistant</span>
      {!speaking ? <button onClick={() => {
        setPrompt('listening...')
        setSpeaking(true)
        setResponse(false)
        recognition.start()
      }}>Click here <IoMicOutline /></button>
        :
        <div className='response'>
          {!response ? <img src={speakking} alt="" id='speak' />
            :
            <img src={aivoicegif} alt="" id='aivoicegif' />
          }
          <p>{prompt}</p>
        </div>
      }
    </div>
  )
}

export default App
