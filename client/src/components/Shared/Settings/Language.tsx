import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

interface State {
  isShowOptionLang: boolean | undefined
}
const EditLanguage = () => {
  const router = useRouter()
  const [state, setState] = useState<State>({
    isShowOptionLang: false,
  })
  const { isShowOptionLang } = state



  const handleChangeLang = (lang: string) => {
    router.push(router.asPath, undefined, { locale: lang })
    setState({ ...state, isShowOptionLang: !isShowOptionLang })
  }

  return (
    <div className="p-6 flex flex-col space-y-4 lg:h-[70%] h-screen">
      <h1 className="text-lg text-text font-bold">Language</h1>
      <span className="text-text font-semibold ">
        Choose your language
      </span>

      <div className="relative flex ">
        <button
          onClick={() => setState({ ...state, isShowOptionLang: !isShowOptionLang })}
          className="relative w-44 top-0 left-0 flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4  font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600" type="button">
          {router.locale === "en" ?
            <div className="inline-flex items-center space-x-3">
              <Image className="w-full h-full" width="20" height="20" src={require("@/assets/images/en-flag.png")} alt="" />
              <span>English</span>
            </div>
            :
            <div className="inline-flex items-center space-x-3">
              <Image className="w-full h-full" width="20" height="20" src={require("@/assets/images/vi-flag.png")} alt="" />
              <span>Vietnamese</span>
            </div>
          }

        </button>
        <div id="dropdown-states" className={`${isShowOptionLang ? "scale-100 opacity-100" : "scale-0 opacity-0"} z-10 absolute top-[100%] left-0 right-0 origin-top transition-all duration-500 ease-in-out bg-white divide-y divide-gray-100 rounded shadow w-44 dark:bg-gray-700`}>

          <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="states-button">
            {router.locale === "en" ?
              <li>
                <button
                  onClick={() => handleChangeLang('vi')}
                  type="button" className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white">
                  <div className="inline-flex items-center space-x-2">
                    <Image className="w-full h-full" width="20" height="20" src={require("@/assets/images/vi-flag.png")} alt="" />
                    <span>Vietnamese</span>
                  </div>
                </button>
              </li>
              :
              <li>
                <button
                  onClick={() => handleChangeLang('en')}
                  type="button" className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white">
                  <div className="inline-flex items-center space-x-2">
                    <Image className="w-full h-full" width="20" height="20" src={require("@/assets/images/en-flag.png")} alt="" />
                    <span>English</span>
                  </div>
                </button>
              </li>
            }

          </ul>
        </div>
      </div>

    </div >
  )
}

export default EditLanguage