// import { useState, useEffect } from 'react'

export default function Translator() {
  const handleTranslation = async () => {
    console.log("Waiting for Translator..")
    try {
      // Create a translator that translates from English to French.
      const translator = await self.ai.translator.create({
        sourceLanguage: 'en',
        targetLanguage: 'fr',
      })

      const result = await translator.translate(
        'Where is the next bus stop, please?'
      )
      console.log(result)
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <>
    <p className="">From the Translator</p>
    <button onClick={handleTranslation}>Translate</button>
    </>
  )
}
