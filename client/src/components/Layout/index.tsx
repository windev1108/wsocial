import { NextPage } from 'next';
import React, { ReactNode, memo, useEffect, Suspense , useState } from 'react';
import FriendsList from './NavRight';
import NavBar from './NavLeft';
import Header from './Header';
import { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router';
import FormSubmitPost from '@/components/Widget/Modals/FormSubmitPost';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import UserLiked from '@/components/Widget/Modals/UserLiked';
import Conversation from '@/components/Widget/Modals/Conversation';
import { useSession } from 'next-auth/react';
import { useQuery} from '@apollo/client';
import NOTIFICATION_OPERATIONS from '@/graphql/operations/notifications';
import ConversationCollapse from '@/components/Widget/Modals/ConversationCollapse';
import { User } from '@/utils/types';
import io, { Socket } from 'socket.io-client'
import { addConversation } from '@/redux/features/conversationSlice';
import { setSession, setSessionUsers } from '@/redux/features/sessionSlice';
import { setSocket } from '@/redux/features/socketSlice';
import { LoadingButton } from '../Widget/Loading';
import dynamic from 'next/dynamic';
import Meta from '@/components/Widget/Meta';
const NavBarMobile = dynamic(() => import("@/components/Widget/Modals/NavBarMobile"))


interface LayoutProps {
    children: ReactNode;
}



const socket: Socket = io(process.env.NEXT_PUBLIC_SERVER || "http://localhost:5000")

const Layout: NextPage<LayoutProps> = ({ children }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [ users , setUsers ] = useState([])
    const { showFormSubmitPost, showUserLikes }: any = useSelector<RootState>(
        (state) => state.is
    );
    const { stream , answer }: any = useSelector<RootState>(
        (state) => state.stream
    );
    const [userTyping, setUserTyping] = useState<{
        id: string
        name: string
        image: String
        isTyping: boolean
        isOnline?: boolean
        lastTime?: Date
    }[]>([])
    const [sender, setSender ] = useState<{
        id: string
        name: string
        image: String
        isOnline?: boolean
        lastTime?: Date
    } | any>(null)
    const { conversations, conversationsCollapse }: any =
        useSelector<RootState>((state) => state.conversations);
    const { data: session }: any = useSession();
    const { data, loading , refetch } = useQuery(NOTIFICATION_OPERATIONS.Queries.getMyInfo, {
        variables: {
            id: session?.user.id,
        }
    })
    const [ isOpenNavbarMobile , setIsOpenNavBarMobile ] = useState(false)

    useEffect(() => {
     dispatch(setSession({
            id: data?.getUserById.id,
            name: data?.getUserById.name,
            image: data?.getUserById.image
     }))
   },[data])


   useEffect(() => {
       socket.on('connect', () => {
        console.log('Socket connected')
            socket?.emit("user-connected", { userId: session?.user?.id})
            dispatch(setSocket(socket))
       })
       socket.on("users", (users) => {
          setUsers(users)
          dispatch(setSessionUsers(users))
       }) 
       socket.on("receive_message", ({sender}) => {
        setSender({...sender, typing: true})
        dispatch(
            addConversation({
                user: {
                    id: sender?.id!,
                    name: sender?.name!,
                    image: sender?.image!,
                },
                isOnline: sender?.isOnline!,
                lastTime: sender?.lastTime!
            })
        );
       })

       socket.on("user-typing", ({sender, isTyping}) => {
        if(isTyping){
            setUserTyping([...userTyping, sender])
        }else{
            setUserTyping(userTyping.filter(u => u.id !== sender.id))
        }
       })

    //    socket.on("calling" , ({caller, channelId, token}) => {
    //        dispatch(setOpenAnswer({
    //            isOpen: true,
    //            caller,
    //            channelId,
    //            token
    //        }))
    //              console.log("channelId :",channelId);
    //              console.log("token :",token);
    //    })

       socket.on("updateNotification", () => {
         console.log("updateNotification");
         refetch({
            id: session?.user.id,
         })
       })

       socket.on("acceptCall", ({peerId}: { peerId : string}) => {
        console.log("acceptCall", );
        console.log("peerId", peerId );
    })

       return () => {
         socket.off("connect")
         socket.off("users")
         socket.off("receive_message")
         socket.off("user-typing")
       }
   },[])


          
   const openNavBarMobile = React.useCallback(() => {
       setIsOpenNavBarMobile(true)
   },[isOpenNavbarMobile])


   const closeNavBarMobile = React.useCallback(() => {
    setIsOpenNavBarMobile(false)
   },[isOpenNavbarMobile])
   

    return (
        <>
            {showFormSubmitPost.isOpen && <FormSubmitPost />}
            {showUserLikes.isOpen && <UserLiked />}
            {/* {stream.isOpen && <VideoCall /> } */}
            <Suspense fallback={<LoadingButton />}>
            <NavBarMobile
            friends={data?.getUserById?.friends}
            session={session}
            users={users}
            notifications={data?.getUserById?.notificationsTo}  
            isLoadingNotification={loading}
            setClose={closeNavBarMobile} open={isOpenNavbarMobile} />
            </Suspense>


            {conversations.length > 0 && (
                <div className="absolute bottom-0 right-10 h-[32rem] flex lg:space-x-2 z-[10001]">
                    {conversations?.map((conversation: any) => (
                        <Conversation
                            key={conversation?.user?.id}
                            sender={sender ? sender : null}
                            user={conversation?.user}
                            isOnline={conversation?.isOnline}
                            isTyping={userTyping.some(u => u.id === conversation?.user?.id)}
                            lastTimeConnected={conversation?.lastTime}
                        />
                    ))}
                </div>
            )}

            {conversationsCollapse.length > 0 && (
                <div className="absolute bottom-5 right-0 flex space-y-4 z-[10000] flex-col justify-end">
                    {conversationsCollapse?.map(({id, user}: { id: string , user : User }) => (
                        <ConversationCollapse
                            key={user?.id}
                            id={user?.id}
                            image={user?.image}
                            name={user?.name}
                            conversationId={id}
                        />
                    ))}
                </div>
            )}
            <Toaster />
            <Meta 
             image={"/favicon.png"} 
             title='Wsocial' 
             description={"This is Wsocial app"} />
             
            <div className="relative bg-light h-screen w-screen overflow-hidden">
                
                <Header setOpen={openNavBarMobile} image={data?.getUserById?.image!} />
                <div className="grid grid-cols-12">

                    <NavBar
                        className="lg:block hidden relative bg-light flex-col space-y-2 h-screen col-span-2 shadow-md px-4 py-6"
                        notifications={data?.getUserById?.notificationsTo}  
                        isLoadingNotification={loading}
                        session={session}
                    />
                    <main
                        className={`${
                            router.asPath === '/community' ||
                            router.asPath === '/notification' ||
                            router.asPath === '/'
                                ? 'lg:col-span-8 col-span-12'
                                : 'lg:col-span-10 col-span-12'
                        }`}>
                        {children}
                    </main>
                    {router.asPath === '/community' ||
                    router.asPath === '/notification' ||
                    router.asPath === '/' ? (
                        <FriendsList className={"lg:block hidden bg-light col-span-2 space-y-4 shadow-md"} friends={data?.getUserById?.friends!} users={users} />
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </>
    );
};

export default memo(Layout);

