import CONVERSATION_OPERATIONS from '@/graphql/operations/conversations';
import {
    addCollapseConversation,
    removeConversation,
} from '@/redux/features/conversationSlice';
import { RootState } from '@/redux/store';
import { Message, User } from '@/utils/types';
import { useMutation, useQuery } from '@apollo/client';
import Image from 'next/image';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { AiFillLike, AiFillPlusCircle, AiOutlineMinus } from 'react-icons/ai';
import { BsCameraVideoFill, BsEmojiSmile, BsImages, BsTelephoneFill } from 'react-icons/bs';
import { GrFormClose } from 'react-icons/gr';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingComponent } from '../Loading';
import MESSAGE_OPERATIONS from '@/graphql/operations/message';
import { useSession } from 'next-auth/react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { setOpenStream } from '@/redux/features/streamSlice';
import { useRouter } from 'next/router';


const Conversation: React.FC<{
    conversationId?: string;
    user: User;
    sender: User | any;
    isOnline: boolean
    isTyping: boolean
    lastTimeConnected: Date
}> = ({ user, conversationId , lastTimeConnected , isOnline , isTyping , sender}) => {
    const dispatch = useDispatch();
    const { t } = useTranslation()
    const router = useRouter()
    const { data: session } = useSession()
    const { socket } : any = useSelector<RootState>(state => state.socket)
    const { conversationsCollapse }: any = useSelector<RootState>(
        (state) => state.conversations
    );
    const { data: conversation, loading: loadingConversation , refetch }= useQuery(CONVERSATION_OPERATIONS.Queries.findConversation, {
        variables: {
            userId: user?.id
        }
    })
    const [sendMessage, { loading: loadingSendMessage }] = useMutation(MESSAGE_OPERATIONS.Mutations.sendMessage)
    const [state, setState] = useState<{
        content: string
    }>({
        content: ''
    })
    const { content } = state
    const lastMessageRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        refetch({
            userId: user?.id
        })
       setTimeout(() => {
        if(lastMessageRef.current){
            handleScrollToLast()
        }
       },500)

        return () => {
            if(lastMessageRef.current){
                handleScrollToLast()
            } 
        }
    },[sender,loadingConversation , loadingSendMessage, isTyping])

     useEffect(() => {
            socket?.emit("userTyping", 
            { sender: {
                id: session?.user?.id,
            } , receiverId: user.id , isTyping: Boolean(content) })
     },[content,socket])


    const handleScrollToLast = React.useCallback(() => {
        lastMessageRef.current?.scrollIntoView({
            behavior: "auto",
        })
    },[lastMessageRef.current])

    const handleRemoveConversation = React.useCallback(() => {
        dispatch(removeConversation({ id: user?.id }));
    }, []);

    const handleCollapseConversation = React.useCallback(() => {
        try {
            if (
                !conversationsCollapse.some(
                    (conversation: any) => conversation.user.id === user.id
                )
            ) {
                dispatch(addCollapseConversation({ user }));
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    }, [user]);

    
    const handleSendMessage = React.useCallback(async (e: React.FormEvent) => {
        e.preventDefault()
        try {
           if(content){
            await sendMessage({
                variables: {
                        message: {
                        content,
                        toUserId: user.id,
                        conversationId: conversation?.findConversation?.id
                        }
                },
                refetchQueries: ['findConversation'],
                awaitRefetchQueries: true
            })
            socket.emit("sendMessage", { 
                sender: {
                id: session?.user?.id,
                name: session?.user?.name,
                image: session?.user?.image
            } , receiverId: user?.id})
            setState({ ...state, content: '' })
           }
        } catch (error: any) {
            toast.error(error.message)
        }
    }, [content, user, conversationId])

    const handleOpenStream = React.useCallback(async () => {
        toast.error(router.locale === "vi" ? "T??nh n??ng n??y ??ang c???p nh???t" : "This feature is coming soon")
        // const channelId = await createChannel(session?.user?.id + user.id)
        // const token = await generateToken(channelId)
        // socket.emit("calling", 
        // { caller: {
        //     id: session?.user?.id,
        //     name: session?.user?.name,
        //     image: session?.user?.image
        // },
        // receiverId: user.id,
        // channelId,
        // token
        // })
        dispatch(setOpenStream({
            isOpen: true,
            caller: {
                id: session?.user?.id,
                name: session?.user?.name,
                image: session?.user?.image
            },
            receiver: {
                id: user.id,
                name: user.name,
                image: user.image
            }
        }))

        
    },[])


    // const createChannel = async (channelName: string) : Promise<any> => {
    //     const res = await axios.post(
    //       "https://api.agora.io/v1/apps/" + process.env.NEXT_PUBLIC_AGORA_APP_ID + "/cloud_recording/resource",
    //       {
    //         cname: channelName
    //       },
    //       {
    //         headers: {
    //           "Content-Type": "application/json",
    //           "X-Agora-API-Key": process.env.NEXT_PUBLIC_AGORA_API_KEY,
    //           "X-Agora-App-Id": process.env.NEXT_PUBLIC_AGORA_APP_ID,
    //           "X-Agora-App-Certificate": process.env.NEXT_PUBLIC_AGORA_APP_CERTIFICATE
    //         }
    //       }
    //     );
    //     return res.data.channel_id;
    //   };


    //   const generateToken = async (channelId: string) => {
    //     const res = await axios.post(
    //       "https://api.agora.io/v1/apps/" + process.env.NEXT_PUBLIC_AGORA_APP_ID + "/tokens",
    //       {
    //         channel_id: channelId,
    //         uid: 0,
    //         role: "publisher"
    //       },
    //       {
    //         headers: {
    //           "Content-Type": "application/json",
    //           "X-Agora-API-Key": process.env.NEXT_PUBLIC_AGORA_API_KEY,
    //           "X-Agora-App-Id": process.env.NEXT_PUBLIC_AGORA_APP_ID,
    //           "X-Agora-App-Certificate": process.env.NEXT_PUBLIC_AGORA_APP_CERTIFICATE
    //         }
    //       }
    //     );
    //     return res.data.token;
    //   };


    return (
        <div className="border w-[23rem] h-full bg-white shadow-md lg:relative fixed top-0 right-0 bottom-0 left-0">
            <div className="flex border h-[10%] items-center">
                <div className="w-1/2 flex  p-2 space-x-2 items-center hover:bg-gray-100 cursor-pointer rounded-lg">
                   <div className="relative">
                    <Image
                        src={user?.image}
                        width={1000}
                        height={1000}
                        className="w-8 h-8 object-cover rounded-full"
                        alt=""
                    /> 
                    {isOnline &&
                      <div className="absolute bottom-0 right-0 border-light bg-[#85c240] animate-ripple border-[3px] w-[.70rem] h-[.70rem] rounded-full"></div>
                    }
                   </div>
                    <div className="flex flex-col leading-4">
                        <span className="font-semibold text-dark whitespace-nowrap">
                            {user.name}
                        </span>

                        {isOnline &&
                          <span className="text-xs whitespace-nowrap">
                          {t('common:active')}
                        </span>
                        }

                        {lastTimeConnected && 
                         <span className="text-xs whitespace-nowrap">
                         {`${t('common:active')} ${moment(new Date(lastTimeConnected), "x").fromNow()}`}
                       </span>
                        }
                      
                    </div>
                </div>
                <div className="w-1/2 flex justify-end items-center space-x-1">
                    <button className="hover:bg-gray-100 rounded-full p-2">
                        <BsTelephoneFill />
                    </button>
                    <button 
                    onClick={handleOpenStream}
                    className="hover:bg-gray-100 rounded-full p-2">
                        <BsCameraVideoFill />
                    </button>
                    <button
                        onClick={handleCollapseConversation}
                        className="hover:bg-gray-100 rounded-full p-2">
                        <AiOutlineMinus />
                    </button>
                    <button
                        onClick={handleRemoveConversation}
                        className="hover:bg-gray-100 rounded-full p-2">
                        <GrFormClose size={25} />
                    </button>
                </div>
            </div>
            <div className="relative flex flex-col h-[80%] p-3 space-y-2 overflow-y-scroll scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thin">
                {loadingConversation ?
                    <LoadingComponent />
                    :
                    conversation?.findConversation?.messages?.map((message: Message) => (
                               <React.Fragment key={message.id}>
                                   {message?.sender?.id === session?.user?.id ?
                                    <div className="flex justify-end space-x-2">
                                       <span className="text-sm text-light p-2 bg-primary rounded-lg max-w-[70%]">{message.content}</span>
                                    </div>
                                :
                                     <div className="flex justify-start space-x-2">
                                       <Image className="object-cover w-8 h-8 rounded-full" src={message?.sender?.image} alt="" width={500} height={500} />
                                       <span className="text-sm text-dark p-2 bg-gray-100 rounded-lg max-w-[70%]">{message.content}</span>
                                     </div>
                                }
                               </React.Fragment>
                    ))
                }

                {isTyping &&
                  <div className="flex justify-start space-x-8 items-center">
                  <Image className="object-cover w-8 h-8 rounded-full" src={user?.image} alt="" width={500} height={500} />
                  <div className="!ml-2 px-4 rounded-lg bg-gray-100" data-title="dot-typing">
                  <div className="flex items-center justify-center px-3 py-3 stage">
                        <div className="dot-typing"></div>
                        </div>
                  </div>
              </div>
                }
                <div ref={lastMessageRef}></div>
            </div>
            <form
                onSubmit={handleSendMessage}
                className="h-[10%] border flex p-1 justify-around">
                <button className="hover:bg-gray-100 rounded-full w-10 text-lg flex justify-center items-center text-primary">
                    <AiFillPlusCircle />
                </button>
                <button className="hover:bg-gray-100 rounded-full w-10 text-lg flex justify-center items-center text-primary">
                    <BsImages />
                </button>
                <button className="hover:bg-gray-100 rounded-full w-10 text-lg flex justify-center items-center text-primary">
                    <BsEmojiSmile />
                </button>
                <input
                    onChange={e => setState({ ...state, content: e.target.value })}
                    value={content}
                    type="text" className="outline-none border rounded-full w-1/2 text-dark px-4" />
                <button
                    type="submit"
                    className="hover:bg-gray-100 rounded-full w-10 text-lg flex justify-center items-center text-primary">
                    <AiFillLike />
                </button>
            </form>
        </div>
    );
};

export default React.memo(Conversation);
