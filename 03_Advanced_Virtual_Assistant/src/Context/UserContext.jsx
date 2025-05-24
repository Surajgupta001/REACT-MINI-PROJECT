import { useState, createContext } from 'react'
import run from '../Gemini';

export const dataContext = createContext()

function UserContext({ children }) {

    const [speaking, setSpeaking] = useState(false);
    const [prompt, setPrompt] = useState('listening...');
    const [response, setResponse] = useState(false);

    function speak(text) {
        const textSpeak = new SpeechSynthesisUtterance(text)
        textSpeak.volume = 1;
        textSpeak.rate = 1;
        textSpeak.pitch = 1;
        textSpeak.lang = 'hi-GB';
        window.speechSynthesis.speak(textSpeak)
    }

    async function aiResponse(prompt) {
        let text = await run(prompt)
        let newText = text.split('**') && text.split('*') && text.
            replace('google', 'Suraj') && text.replace('Google', 'Suraj')
        setPrompt(newText)
        speak(newText)
        setResponse(true)
        setTimeout(() => {
            setSpeaking(false)
        }, 5000)
    }

    let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    let recognition = new speechRecognition()
    recognition.onresult = (e) => {
        let currentIndex = e.resultIndex
        let transcript = e.results[currentIndex][0].transcript
        setPrompt(transcript)
        takeCommand(transcript.toLowerCase())
    }

    function takeCommand(command) {
        if (command.includes('open') && command.includes('youtube')) {
            window.open('https://www.youtube.com/', '_blank')
            speak('Opening Youtube')
            setPrompt('Opening Youtube')
            setResponse(true)
            setTimeout(() => {
                setSpeaking(false)
            }, 5000)
        }
        else if (command.includes('open') && command.includes('google')) {
            window.open('https://www.google.co.in/', '_blank')
            speak('Opening Google')
            setPrompt('Opening Google')
            setResponse(true)
            setTimeout(() => {
                setSpeaking(false)
            }, 5000)
        }
        else if (command.includes('open') && command.includes('instagram')) {
            window.open('https://www.instagram.com/', '_blank')
            speak('Opening instagram')
            setPrompt('Opening instagram')
            setResponse(true)
            setTimeout(() => {
                setSpeaking(false)
            }, 5000)
        }
        else if (command.includes('date')) {
            let date = new Date().toLocaleString(undefined, {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            })
            speak(`Today's date is ${date}`)
            setPrompt(`Today's date is ${date}`)
            setResponse(true)
            setTimeout(() => {
                setSpeaking(false)
            }, 5000)
        }
        else if (command.includes('time')) {
            let date = new Date().toLocaleString(undefined, {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
            })
            speak(`Current time is ${date}`)
            setPrompt(`Current time is ${date}`)
            setResponse(true)
            setTimeout(() => {
                setSpeaking(false)
            }, 5000)
        }
        else if (command.includes('react documentation')) {
            window.open('https://react.dev/', '_blank')
            speak('Opening React documentation')
            setPrompt('Opening React documentation')
            setResponse(true)
            setTimeout(() => {
                setSpeaking(false)
            }, 5000)
        }
        else if (command.includes('javascript documentation')) {
            window.open('https://developer.mozilla.org/en-US/docs/Web/JavaScript', '_blank')
            speak('Opening JavaScript documentation')
            setPrompt('Opening JavaScript documentation')
            setResponse(true)
            setTimeout(() => {
                setSpeaking(false)
            }, 5000)
        }
        else if (command.includes('open my profile in github')) {
            window.open('https://github.com/Surajgupta001', '_blank')
            speak('Opening GitHub')
            setPrompt('Opening GitHub')
            setResponse(true)
            setTimeout(() => {
                setSpeaking(false)
            }, 5000)
        }
        else if (command.includes('open my profile in leetcode')) {
            window.open('https://leetcode.com/u/neZEZlegAW/', '_blank')
            speak('Opening leetcode')
            setPrompt('Opening leetcode')
            setResponse(true)
            setTimeout(() => {
                setSpeaking(false)
            }, 5000)
        }
        else {
            aiResponse(command)
        }
    }

    let value = {
        recognition,
        speaking,
        setSpeaking,
        prompt,
        setPrompt,
        response,
        setResponse,
    }

    return (
        <dataContext.Provider value={value}>
            {children}
        </dataContext.Provider>
    )
}

export default UserContext