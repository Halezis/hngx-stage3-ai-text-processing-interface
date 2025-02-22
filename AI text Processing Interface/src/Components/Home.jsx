import { useState } from 'react'

import Queries from './Queries'
import Replies from './Replies'

import Langify from '/src/assets/Langify.png'

export default function Home() {
  const [text, setText] = useState('')
  const [submittedText, setSubmittedText] = useState('')
  const [queryLanguage, setQueryLanguage] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const [chats, setChats] = useState([])

  // Removes error message after a second
  const removeErrorAfterTimeout = (errorId) => {
    setTimeout(() => {
      setChats((prevChats) => prevChats.filter((chat) => chat.id !== errorId))
    }, 2000)
  }

  // sets the time of chat
  function getFormattedTime() {
    return new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  function handleTextChange(event) {
    setText(event.target.value)
  }

  // makes a call to the detection API and returns the detected laguage
  const handleTextSubmit = async () => {
    if (text.trim() === '') {
      const errorId = Date.now()
      setChats((prev) => [
        ...prev,
        {
          type: 'error',
          message: 'Message cannot be empty!',
          id: errorId,
        },
      ])
      removeErrorAfterTimeout(errorId)
      return
    }

    if (!self.ai || !self.ai.languageDetector) {
    const errorId = Date.now();
    setChats((prev) => [
      ...prev,
      {
        type: 'error',
        message: 'Language detection is not supported in your browser.',
        id: errorId,
      },
    ]);
    removeErrorAfterTimeout(errorId);
    setText('')
    return;
  }

    const summaryNeeded = text.length > 150

    try {
      setIsTranslating(true)

      // create the detetctor
      const detector = await self.ai.languageDetector.create()
      const results = await detector.detect(text)

      if (results.length === 0 || !results[0].detectedLanguage) {
        throw new Error('No language detected. Please try again.')
      }
      const detectedLanguage = results[0].detectedLanguage

      setSubmittedText(text)
      setQueryLanguage(detectedLanguage)

      setChats((prevChats) => [
        ...prevChats,
        {
          type: 'query',
          submittedText: text,
          language: detectedLanguage,
          id: Date.now(),
          timestamp: getFormattedTime(),
          summary: summaryNeeded,
        },
      ])
    } catch (error) {
      const errorId = Date.now()
      setChats((prevChats) => [
        ...prevChats,
        {
          type: 'error',
          message:
            error.message || 'Something went wrong with detection. Please try again.',
          id: errorId,
        },
      ])
      removeErrorAfterTimeout(errorId)
    } finally {
      setIsTranslating(false)
      setText('')
    }
  }

  const handleTranslate = async (
    queryLanguage,
    submittedText,
    targetLanguage
  ) => {
    if (!targetLanguage || queryLanguage === targetLanguage) {
      const errorId = Date.now()
      setChats((prevChats) => [
        ...prevChats,
        {
          type: 'error',
          message: 'Translation to the same language is not possible.',
          id: errorId,
        },
      ])
      removeErrorAfterTimeout(errorId)
      return
    }
    try {
      setIsTranslating(true)
      // Create a translator that translates from source to target language.
      const translator = await self.ai.translator.create({
        sourceLanguage: queryLanguage,
        targetLanguage: targetLanguage,
      })

      const result = await translator.translate(submittedText)
      if (!result) {
        throw new Error('Translation failed. Please try again.')
      }

      setChats((prevChats) => [
        ...prevChats,
        {
          type: 'reply',
          submittedText: result,
          language: targetLanguage,
          timestamp: getFormattedTime(),
          id: Date.now(),
        },
      ])
    } catch (error) {
      setIsTranslating(false)
      const errorId = Date.now()
      setChats((prevChats) => [
        ...prevChats,
        {
          type: 'error',
          message: error.message || 'Something went wrong with translation.',
          id: errorId,
        },
      ])
      removeErrorAfterTimeout(errorId)
    } finally {
      setIsTranslating(false)
    }
  }
  return (
    <>
      <header className="h-[5rem] fixed top-0 left-0 right-0 z-10 flex items-center justify-center gap-[1rem] bg-[#101728]">
        <img src={Langify} alt="Langify" className="w-[2rem] h-[2rem]" />
        <div className="font-montserrat text-[#FAFAFA] text-[2rem] font-extrabold">
          Langify
        </div>
      </header>

      <div className="relative mt-[5rem] mb-[7rem] md:mx-[12%] py-[1rem] px-[1.9rem] overflow-y-auto">
        {chats.map((chat) => (
          <div key={chat.id}>
            {chat.type === 'query' ? (
              <div className="flex justify-end mb-4">
                <Queries
                  inputQuery={{
                    input: chat.submittedText,
                    queryLanguage: chat.language,
                    time: chat.timestamp,
                    isSummary: chat.summary,
                  }}
                  onTranslate={handleTranslate}
                />
              </div>
            ) : chat.type === 'reply' ? (
              <div className="flex justify-start mb-4">
                <Replies
                  queryOutput={{
                    output: chat.submittedText,
                    targetLanguage: chat.language,
                    time: chat.timestamp,
                  }}
                />
              </div>
            ) : (
              <div className="flex justify-center mt-5 mb-4 text-red-500">
                {chat.message}
              </div>
            )}
          </div>
        ))}
      </div>

      {isTranslating && (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-20 flex justify-center items-center bg-[#101728] opacity-75">
          <div className="text-white text-lg">Text is being Processed</div>
        </div>
      )}

      <div className="h-[7rem] p-4 fixed bottom-0 left-0 right-0 z-10 bg-[#101728] flex justify-center items-center">
        <div className="flex items-center bg-[#29374f] rounded-[1.5rem] px-4 py-2 w-[80%] shadow-md">
          <textarea
            value={text}
            onChange={handleTextChange}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                handleTextSubmit()
              }
            }}
            className="flex-1 bg-transparent border-none outline-none text-[#FAFAFA] placeholder-gray-400 px-3 py-2 resize-none overflow-hidden"
            placeholder="Write your message..."
            rows="1"
          />
        </div>
        <button
          onClick={handleTextSubmit}
          className="ml-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white p-3 rounded-full shadow-md transition duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 -rotate-45"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </button>
      </div>
    </>
  )
}
