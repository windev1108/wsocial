import { NextPage } from 'next'
import React from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa'

interface Props {
    thumbnail: string
    feature: string
    title: string
    desc: string
    link: string
    createdAt: string

}

const ExploreCard: NextPage<Props> = ({
    thumbnail,
    feature,
    title,
    desc,
    link,
    createdAt }) => {
    return (
        <div className="flex flex-col h-[25rem] bg-light rounded-xl border-[1px] border-gray-300">
            <div className="h-[50%]">
                <img className="object-cover h-full w-full" src={thumbnail} alt="" />
            </div>
            <div className="flex flex-col p-3 space-y-2">
                <div className="flex space-x-2 items-center">
                    <div className="px-2 py-1 bg-red-100 rounded-sm ">
                        <span className="text-red-500">{feature}</span>
                    </div>
                    <span className="text-sm text-text">{createdAt}</span>
                </div>
                <h1 className="text-dark font-bold">{title}</h1>
                <span className="text-ellipsis overflow-hidden text-xs text-text">{desc}</span>
                <button className="flex justify-center items-center w-1/2 rounded-lg hover:bg-primary hover:text-light transition-all duration-500 space-x-2 px-4 py-2 border-[1px] border-primary text-primary">
                    <span>Read More</span>
                    <FaExternalLinkAlt />
                </button>
            </div>
        </div>
    )
}

export default ExploreCard