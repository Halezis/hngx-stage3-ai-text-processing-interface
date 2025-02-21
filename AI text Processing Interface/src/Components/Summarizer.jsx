export default function Summarizer() {
  const handleSummarizer = async () => {
    console.log('Waiting for the Summarizer')

    const options = {
      sharedContext: 'This is a scientific article',
      type: 'key-points',
      format: 'markdown',
      length: 'medium',
    }

    try {
      // create the summarizer
      const summarizer = await self.ai.summarizer.create(options)

      const longText =
        "When summarizing content, it's best to remove any unnecessary data such as HTML markup. For content present on the page, you can achieve this by using the innerText property of an HTML element with the targeted text, as this property represents only the rendered text content of an element and its descendants"

      const summary = await summarizer.summarize(longText, {
        context: 'This article is intended for a tech-savvy audience.',
      })
      console.log(summary)

    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
    <p>From the Summarizer</p>
    <button onClick={handleSummarizer}>Summarize</button>
    </>
  )
}
