import VideoCall from '@/components/Shared/Calling/VideoCall';
import { LoadingPage } from '@/components/Shared/Loading'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { lazy, Suspense, useState } from 'react'
import dynamic from 'next/dynamic';
import { AiOutlineSend } from 'react-icons/ai';
import { BiLinkAlt } from 'react-icons/bi';
import { BsCameraVideo, BsSearch } from 'react-icons/bs';
import { FiSmile } from 'react-icons/fi';
import { IoIosCall } from 'react-icons/io'
import { RiErrorWarningLine } from 'react-icons/ri';
const Layout = dynamic(() => import('../components/Layout'), { suspense: true })
import { unstable_getServerSession as getServerSession } from "next-auth";
import { GetServerSidePropsContext } from 'next'
import { authOptions } from './api/auth/[...nextauth]'
import { useQuery } from '@apollo/client';
import CONVERSATION_OPERATIONS from '@/graphql/operations/conversations';
import moment from 'moment';
import Image from 'next/image';


export const getServerSideProps = async ({
    req,
    res,
    locale
}: GetServerSidePropsContext) => {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.email) {
        return {
            redirect: {
                destination: "/signin",
                permanent: true,
            },
            props: {},
        };
    }

    return {
        props: {
            ...(await serverSideTranslations(locale!, ["common"])),
            session,
            origin: `${req.headers.host?.includes("localhost") ? "http" : "https"
                }://${req.headers.host}`,
        },
    };
};

const Message = () => {
    const { data: conversations } = useQuery(CONVERSATION_OPERATIONS.Queries.getConversations)


    return (
        <Suspense fallback={<LoadingPage />}>
            <Layout>
                <div className="grid grid-cols-10 p-6 gap-4 bg-secondary  h-full  rounded-[2rem]">
                    <div className="col-span-3 space-y-4 rounded-xl bg-light flex flex-col h-[90%]">
                        <div className="border-gray-300 rounded-lg m-4 flex px-2 items-center  border-[1px]"
                        >
                            <div className="hover:bg-gray-200 text-dark cursor-pointer p-2 rounded-full  transition-all duration-700">
                                <BsSearch />
                            </div>
                            <input className="px-3 py-2 bg-transparent outline-none w-full text-sm" type="text" placeholder="Search friends" />
                        </div >
                        <div className="flex flex-col max-h-[85%] px-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                            {conversations?.conversations?.map((conversation : any) => (
                            <div key={conversation.id} className="cursor-pointer hover:bg-gray-200 rounded-xl flex p-4 space-x-3 items-center">
                                <div className="relative w-10 h-10 ">
                                    <Image  className="object-cover w-full h-full rounded-full" src={conversation?.user?.image} width={100} height={100}  alt="" />
                                    <div className="border-[3px] border-light absolute bottom-0 -right-0 w-4 h-4 rounded-full bg-[#85c240]">
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col">
                                    <h1 className="font-semibold">{conversation.user.name}</h1>
                                    <span className="text-sm text-text whitespace-nowrap truncate">{conversation?.latestMessage?.content}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-400">{moment(conversation?.latestMessage?.updatedAt,"x").fromNow()}</span>
                               
                               {conversation?._count?.messages > 0  &&
                                    <div className="flex justify-end items-center">
                                        <div className="flex items-center justify-center text-light w-4 h-4 p-2 text-xs rounded-sm bg-red-500">
                                            <span>{conversation?._count?.messages}</span>
                                        </div>
                                    </div>
                               }
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                    <div className="col-span-7 relative rounded-xl bg-light h-[90%]">
                        <div className="h-[10%] flex px-4 py-2 space-x-3 items-center">
                            <img className="object-cover w-12 h-12 rounded-full" src="https://yt3.ggpht.com/ytc/AMLnZu9AEyF9bcY8Fb8RPPKTDrHTX3TsxV0Hh9jzFyO1FG8=s88-c-k-c0x00ffffff-no-rj" alt="" />
                            <div className="flex-1 flex flex-col">
                                <h1 className="font-semibold">Ronaldo</h1>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-text">Active now</span>
                                    <div className="animate-ripple border-[3px] border-light w-4 h-4 rounded-full bg-[#85c240]">
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-around space-x-2 text-xl text-primary">
                                <div className="hover:bg-gray-200 rounded-full w-10 h-10 flex justify-center items-center cursor-pointer p-2">
                                    <IoIosCall />
                                </div>
                                <div
                                    className="hover:bg-gray-200 rounded-full w-10 h-10 flex justify-center items-center cursor-pointer p-2">
                                    <BsCameraVideo />
                                </div>
                                <div className="hover:bg-gray-200 rounded-full w-10 h-10 flex justify-center items-center cursor-pointer p-2">
                                    <RiErrorWarningLine />
                                </div>
                            </div>
                        </div>
                        <div className="h-[80%] flex flex-col p-4 space-y-4 bg-light border-y-[1px] border-gray-300">
                            <div className="flex flex-col space-y-2">
                                <span className="text-center text-gray-400 text-sm font-semibold">August 11 08 2001</span>
                                <div className="flex flex-col space-x-2">
                                    <div className="flex w-1/2 space-x-3">
                                        <div className="flex relative w-10 h-10 ">
                                            <img className="object-cover w-full h-full rounded-full" src="https://yt3.ggpht.com/ytc/AMLnZu9AEyF9bcY8Fb8RPPKTDrHTX3TsxV0Hh9jzFyO1FG8=s88-c-k-c0x00ffffff-no-rj" alt="" />
                                            <div className="border-[3px] border-light absolute bottom-0 -right-0 w-4 h-4 rounded-full bg-[#85c240]">
                                            </div>
                                        </div>
                                        <span className="flex-1 p-3 bg-[#E4E6Eb] text-dark rounded-lg">
                                            The lorem ipsum is based on De finibus bonorum et malorum, a Latin text written by Cicero in 45 BC. Typographers and printers have used passages from this work for formatting since the 16th century
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                                <span className="text-center text-gray-400 text-sm font-semibold">August 11 08 2001</span>
                                <div className="flex flex-row-reverse space-y-3 space-x-2">
                                    <div className="flex w-1/2 space-x-3">
                                        <span className="flex-1 p-3 bg-primary text-light rounded-lg">
                                            The lorem ipsum is based on De finibus bonorum et malorum, a Latin text written by Cicero in 45 BC. Typographers and printers have used passages from this work for formatting since the 16th century
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="h-[10%] space-x-2 p-4 flex items-center">
                            <div className="flex flex-1 space-x-2 rounded-lg bg-secondary px-4 py-2 items-center">
                                <input className="outline-none w-full bg-transparent" type="text" placeholder="Type something here..." />
                                <div className="hover:bg-primary hover:bg-opacity-20 rounded-full p-2 active:animate-ripple">
                                    <BiLinkAlt className="cursor-pointer text-lg text-primary" />
                                </div>
                                <div className="hover:bg-primary hover:bg-opacity-20 rounded-full p-2 active:animate-ripple">
                                    <FiSmile className="cursor-pointer text-lg text-primary" />
                                </div>
                            </div>
                            <div className="group bg-blue-200 rounded-lg p-3 transition-all duration-700 ease-in-out cursor-pointer hover:bg-primary">
                                <AiOutlineSend className="group-hover:text-white transition-all duration-700 ease-in-out text-lg text-primary" />
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </Suspense>
    )
}

export default Message