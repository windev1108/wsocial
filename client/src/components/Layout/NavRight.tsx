import React from 'react'
import { BsSearch, BsThreeDots } from 'react-icons/bs'
import { NextPage } from 'next';
import { useQuery } from '@apollo/client';
import USER_OPERATIONS from '@/graphql/operations/user';
import { Session } from 'next-auth';
import { SocketUser, User } from '@/utils/types';
import ChatUser from '@/components/Widget/Items/ChatUser';



const FriendsList: NextPage<{session : Session , users: SocketUser[], className: string}> = ({session,users , className}) => {
    const { data: user } = useQuery(USER_OPERATIONS.Queries.getMyFriends, {
        variables: {
            id: session?.user?.id
        }
    })
 

    return (
        <div className={className}>
            <div className="px-4">
                <div className="border-gray-300 rounded-lg  flex px-2 items-center  border-[1px]"
                >
                    <div className="hover:bg-gray-200 text-dark cursor-pointer p-2 rounded-full  transition-all duration-700">
                        <BsSearch />
                    </div>
                    <input className="px-3 py-2 bg-transparent outline-none w-full text-sm" type="text" placeholder="Search friends" />
                </div >
            </div >
            {/* <div className="px-4">
                <div className="scrollbar-thumb-gray-400 scrollbar-track-gray-200 flex overflow-x-scroll space-x-2 py-4 p-2 overflow-y-hidden scrollbar-thin">
                    <div className="flex-col space-y-2">
                        <div className="cursor-pointer relative w-12 h-12 rounded-full border-[2px] border-primary">
                            <img className=" object-cover w-full h-full rounded-full " src="https://yt3.ggpht.com/AJnDs2AKFLcpQ_botAvlCQY0mi_R8iL3hyg8pEV-9wifIMnlm9PraqWrm-_dA_1SLeOyxDej6A=s88-c-k-c0x00ffffff-no-nd-rj" alt="" />
                            <div className="absolute -bottom-[20%] left-[50%] translate-x-[-50%] bg-white border-[1px] border-text rounded-full ">
                                <AiOutlinePlus size={14} />
                            </div>
                        </div>
                    </div>
                    <div className="flex-col space-y-2">
                        <div className="cursor-pointer relative w-12 h-12 rounded-full border-[2px] border-primary">
                            <img className=" object-cover w-full h-full rounded-full " src="https://yt3.ggpht.com/AJnDs2AKFLcpQ_botAvlCQY0mi_R8iL3hyg8pEV-9wifIMnlm9PraqWrm-_dA_1SLeOyxDej6A=s88-c-k-c0x00ffffff-no-nd-rj" alt="" />
                            <div className="absolute -bottom-[20%] left-[50%] translate-x-[-50%] bg-white border-[1px] border-text rounded-full ">
                                <AiOutlinePlus size={14} />
                            </div>
                        </div>
                    </div>
                    <div className="flex-col space-y-2">
                        <div className="cursor-pointer relative w-12 h-12 rounded-full border-[2px] border-primary">
                            <img className=" object-cover w-full h-full rounded-full " src="https://yt3.ggpht.com/AJnDs2AKFLcpQ_botAvlCQY0mi_R8iL3hyg8pEV-9wifIMnlm9PraqWrm-_dA_1SLeOyxDej6A=s88-c-k-c0x00ffffff-no-nd-rj" alt="" />
                            <div className="absolute -bottom-[20%] left-[50%] translate-x-[-50%] bg-white border-[1px] border-text rounded-full ">
                                <AiOutlinePlus size={14} />
                            </div>
                        </div>
                    </div>
                    <div className="flex-col space-y-2">
                        <div className="cursor-pointer relative w-12 h-12 rounded-full border-[2px] border-primary">
                            <img className=" object-cover w-full h-full rounded-full " src="https://yt3.ggpht.com/AJnDs2AKFLcpQ_botAvlCQY0mi_R8iL3hyg8pEV-9wifIMnlm9PraqWrm-_dA_1SLeOyxDej6A=s88-c-k-c0x00ffffff-no-nd-rj" alt="" />
                            <div className="absolute -bottom-[20%] left-[50%] translate-x-[-50%] bg-white border-[1px] border-text rounded-full ">
                                <AiOutlinePlus size={14} />
                            </div>
                        </div>
                    </div>
                    <div className="flex-col space-y-2">
                        <div className="cursor-pointer relative w-12 h-12 rounded-full border-[2px] border-primary">
                            <img className=" object-cover w-full h-full rounded-full " src="https://yt3.ggpht.com/AJnDs2AKFLcpQ_botAvlCQY0mi_R8iL3hyg8pEV-9wifIMnlm9PraqWrm-_dA_1SLeOyxDej6A=s88-c-k-c0x00ffffff-no-nd-rj" alt="" />
                            <div className="absolute -bottom-[20%] left-[50%] translate-x-[-50%] bg-white border-[1px] border-text rounded-full ">
                                <AiOutlinePlus size={14} />
                            </div>
                        </div>
                    </div>
                    <div className="flex-col space-y-2">
                        <div className="cursor-pointer relative w-12 h-12 rounded-full border-[2px] border-primary">
                            <img className=" object-cover w-full h-full rounded-full " src="https://yt3.ggpht.com/AJnDs2AKFLcpQ_botAvlCQY0mi_R8iL3hyg8pEV-9wifIMnlm9PraqWrm-_dA_1SLeOyxDej6A=s88-c-k-c0x00ffffff-no-nd-rj" alt="" />
                            <div className="absolute -bottom-[20%] left-[50%] translate-x-[-50%] bg-white border-[1px] border-text rounded-full ">
                                <AiOutlinePlus size={14} />
                            </div>
                        </div>
                    </div>

                </div>
            </div> */}

            <div className="flex px-4 text-dark">
                <span className="font-semibold flex-1">Friends</span>
                <BsThreeDots />
            </div>
            <div className="scrollbar-thumb-gray-400 flex-col overflow-y-scroll h-[65vh]  space-y-2 scrollbar-thin  scrollbar-track-transparent">
                {user?.getUserById?.friends?.map((user : User) => (
                     <ChatUser key={user.id} user={user} lastTime={users.find(u => u.userId === user?.id)?.lastTime!} isOnline={users.some((u : SocketUser) => u.userId === user?.id && u.isOnline)} />
                ))}``
            </div>
        </div >
    )
}

export default FriendsList