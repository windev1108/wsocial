import { NextPage } from 'next'
import Link from 'next/link'
import React, { memo } from 'react'
import { AiFillLinkedin, } from 'react-icons/ai'
import { BsFacebook, BsInstagram } from 'react-icons/bs'
import { ImLocation } from 'react-icons/im'
import { IoLogoTwitter } from 'react-icons/io'


interface SuggestProps {
    name: string
    location: string
    linkedinUrl: string
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
}

const SuggestUser: NextPage<SuggestProps> = ({
    name,
    location,
    linkedinUrl,
    facebookUrl,
    instagramUrl,
    twitterUrl,
}) => {

    return (
        <div className="bg-light border-gray-200 border-t-[1px] flex-col space-y-4 p-4">
            <div className="flex space-x-4">
                <img className="object-cover w-11 h-11  rounded-full" src="https://yt3.ggpht.com/4ffrJrze6zBmxEfzUhR3TqYXBHWU_O6sii9jILfUdMbd8HhBAtk7CYeBEM-fp_S6RYu81Szsnw=s88-c-k-c0x00ffffff-no-rj" alt="" />
                <div className="flex-col flex-1">
                    <h1 className="text-dark">{name}</h1>
                    <div className="flex items-center space-x-1">
                        <ImLocation className="text-xs text-gray-400" />
                        <span className="text-gray-500 text-xs">{location}</span>
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center space-x-2">
                <Link href={facebookUrl}>
                    <BsFacebook className="text-xl text-primary" />
                </Link>
                <Link href={twitterUrl}>
                    <IoLogoTwitter className="text-xl text-primary" />
                </Link>
                <Link href={instagramUrl}>
                    <BsInstagram className="text-2xl bg-gradient-to-tr from-[#f79402] via-[#f70a59] to-pink-[#f501c1] rounded-xl overflow-hidden text-white" />
                </Link>
                <Link href={linkedinUrl}>
                    <AiFillLinkedin className="text-2xl text-[#0A66C2]" />
                </Link>
            </div>
            <div className="flex gap-2 justify-around">
                <button className="hover:bg-gray-200 bg-white w-1/2 p-1 rounded-lg border-[1px] border-gray-300 text-text">Ignore</button>
                <button className="hover:bg-blue-700 w-1/2 p-1 rounded-lg bg-primary text-white">Add friend</button>
            </div>
        </div>
    )
}

export default memo(SuggestUser)