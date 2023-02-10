import { NextPage } from 'next';
import React from 'react'
import { AiOutlineSend } from 'react-icons/ai';


interface Props {
    name: string
    timeBirthday: string

}

const SuggestUserBirthdayComponents: NextPage<Props> = ({
    name,
    timeBirthday
}) => {

    return (
        <div className="bg-light border-gray-200 border-t-[1px]  flex-col space-y-4 p-4">
            <div className="flex space-x-4">
                <img className="object-cover w-11 h-11  rounded-lg" src="https://yt3.ggpht.com/4ffrJrze6zBmxEfzUhR3TqYXBHWU_O6sii9jILfUdMbd8HhBAtk7CYeBEM-fp_S6RYu81Szsnw=s88-c-k-c0x00ffffff-no-rj" alt="" />
                <div className="flex-col flex-1">
                    <h1 className="text-dark">{name}</h1>
                    <span className="text-gray-500 text-xs">{timeBirthday}</span>
                </div>
            </div>
            <div className="bg-secondary flex items-center rounded-lg shadow-sm">
                <div className="w-[80%]">
                    <input className={`text-gray-400 placeholder:text-gray-400 px-3 py-1 outline-none bg-transparent`} type="text" placeholder="Write on his inbox" />
                </div>
                <div className="w-[20%] group rounded-lg flex justify-center items-center p-2 transition-all duration-700 ease-in-out cursor-pointer hover:bg-primary">
                    <AiOutlineSend className="group-hover:text-white transition-all duration-700 ease-in-out text-xl text-primary" />
                </div>
            </div>
        </div>
    )
}

export default SuggestUserBirthdayComponents