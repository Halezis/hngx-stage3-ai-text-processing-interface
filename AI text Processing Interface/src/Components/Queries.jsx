import { useState } from 'react'
import languageMap from '../utils/languageMap'

export default function Queries(props) {
  const { input, queryLanguage, time, isSummary } = props.inputQuery
  const [selectedLang, setSelectedLang] = useState('en')
  const [summaryMessage, setSummaryMessage] = useState('')
  const fullLanguageName = languageMap[queryLanguage] || queryLanguage

  function handleLangChange(event) {
    setSelectedLang(event.target.value)
  }

  function handleTranslate() {
    props.onTranslate(queryLanguage, input, selectedLang)
  }

  function handleSummary() {
    setSummaryMessage('Summary is coming soon...')
    setTimeout(() => setSummaryMessage(''), 3000)
  }

  return (
    <div className='flex flex-col'>
      <div className="flex flex-col gap-[0.5rem] bg-[#515b6d] p-[1rem] rounded-[1rem] w-[330px] sm:w-[450px] md:w-[550px]">
        <div className="text-[#FFF]">{input}</div>
        <div className="">Detected: {fullLanguageName}</div>
        <div className="flex items-center gap-4 rounded-lg flex-wrap justify-between">
          <select
            value={selectedLang}
            onChange={handleLangChange}
            className="bg-[#29374f] text-white p-2 px-3 rounded-lg outline-none focus:ring-2 focus:ring-[#324eff] w-full sm:w-auto"
          >
            <option value="en">English</option>
            <option value="pt">Portuguese</option>
            <option value="es">Spanish</option>
            <option value="ru">Russian</option>
            <option value="tr">Turkish</option>
            <option value="fr">French</option>
          </select>

          <button
            onClick={handleTranslate}
            className="bg-[#324eff] text-white px-4 py-2 rounded-lg hover:bg-[#29374f] transition-colors w-full sm:w-auto"
          >
            Translate
          </button>
          {isSummary ? (
            <button
              onClick={handleSummary}
              className="bg-[#4a93b0] text-white px-4 py-2 rounded-lg hover:bg-[#155b76] transition-colors w-full sm:w-auto"
            >
              Summary
            </button>
          ) : (
            ''
          )}
          <div className="text-[0.8rem] text-white mt-2 sm:mt-0">{time}</div>
        </div>
      </div>
      {summaryMessage && (
        <div className="text-[#ffcc80] mt-2 text-center">{summaryMessage}</div>
      )}
    </div>
  )
}
