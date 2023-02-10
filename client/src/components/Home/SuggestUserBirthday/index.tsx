import React from 'react'
import SuggestUserBirthdayComponents from './SuggestUserBirthdayComponents'

const SuggestUserBirthday = () => {

  return (

    <div className="bg-light h-[40vh] shadow-lg rounded-xl">
      <div className="border-gray-200 text-text flex px-4 py-2 border-b-[1px]">
        <span className="flex-1 font-semibold text-sm">
          Birthday
        </span>
        <span className="cursor-pointer text-primary text-sm">See all</span>
      </div>
      <div className="scrollbar-thumb-gray-400 scrollbar-track-gray-100 h-[90%]  space-y-2 scrollbar-thin  overflow-scroll overflow-x-hidden">
        <SuggestUserBirthdayComponents
          name="Ronaldo"
          timeBirthday='Birthday today'
        />
        <SuggestUserBirthdayComponents
          name="Ronaldo"
          timeBirthday='Birthday today'
        />
        <SuggestUserBirthdayComponents
          name="Ronaldo"
          timeBirthday='Birthday today'
        />

      </div>
    </div>
  )
}

export default SuggestUserBirthday