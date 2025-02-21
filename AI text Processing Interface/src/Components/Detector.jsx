export default function Detector() {
  const handleDetection = async () => {
    console.log('Waiting for the Detector')
    try {
      // create the detetctor
      const detector = await self.ai.languageDetector.create()

      const someUserText = 'My name is Harrison'
      const results = await detector.detect(someUserText)

      console.log(results[0].detectedLanguage)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <p>From the Detector</p>
      <button onClick={handleDetection}>Detect</button>
    </>
  )
}
