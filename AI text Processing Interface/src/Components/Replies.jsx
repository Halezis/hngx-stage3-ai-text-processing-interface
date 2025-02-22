import translateImg from '/src/assets/translate.png'
import languageMap from '../utils/languageMap'

export default function Replies(props) {
  const {output, targetLanguage, time} = props.queryOutput
  const fullLanguageName = languageMap[targetLanguage] || targetLanguage


  return (
    <div className="flex flex-col gap-[0.5rem] bg-[#324eff] p-[1rem] rounded-[1rem] w-[330px] sm:w-[450px] md:w-[550px] lg:w-[650px] xl:w-[750px] 2xl:w-[900px] max-w-[60%]">
      <div className="flex gap-[1rem] justify-start items-start text-[#FFF]">
        <img src={translateImg} alt="translate image" className='mt-[0.3rem]'/>
        <div className="">{output}</div>
      </div>
      <div className="flex justify-between items-center text-[0.8rem]">
        <div className="">language: {fullLanguageName}</div>
        <div className="">{time}</div>
      </div>
    </div>
  )
}