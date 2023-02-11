import { SocketUser, User, UserSession } from '@/utils/types'
import { NextPage } from 'next'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { AiOutlineArrowLeft, AiOutlineSetting, AiOutlineUser } from 'react-icons/ai'
import { BiMessageAltDots } from 'react-icons/bi'
import { FaUsers } from 'react-icons/fa'
import { FiLogOut } from 'react-icons/fi'
import { ImHangouts } from 'react-icons/im'
import { IoMdClose, IoMdNotificationsOutline } from 'react-icons/io'
import { RxDashboard } from 'react-icons/rx'
import ChatUser from '../Items/ChatUser'

const NavBarMobile: NextPage<{
  open: boolean, 
  setClose: () => void,   
  notifications: Notification[]
  session: UserSession
  friends: User[]
  users: SocketUser[]
  isLoadingNotification: boolean
}> = ({open , setClose , notifications, friends , users ,isLoadingNotification , session }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [ isOpenFriendsList , setIsOpenFriendsList ] = React.useState(false)


  return (
    <>
    <div onClick={() => {
        setClose()
        setIsOpenFriendsList(false)
    }} className={`${!open ? "translate-x-[-100%] opacity-0" : "translate-x-0 opacity-100"} lg:hidden fixed top-0 left-0 right-0 bottom-0 bg-[#11111170] z-[19999]`}>
    </div>
    <div className={`${!open ? "translate-x-[-100%] opacity-100" : "translate-x-0 opacity-100"} lg:hidden fixed left-0 top-0 bottom-0 w-[70vw] bg-secondary z-[20000] 
     shadow-md transition-all duration-500 ease-in-out flex flex-col p-4`}>
          <Link href="/" className="flex px-6 items-center gap-1 mb-8">
                    <ImHangouts className="text-3xl text-primary" />
                    <h1 className={`text-dark text-2xl font-bold `}>WSocial</h1>
          </Link>

          <Link href="/">
                <div
                    className={`${
                        router.asPath === '/' ? 'bg-primary' : 'bg-transparent'
                    } group cursor-pointer flex gap-2 rounded-lg hover:bg-primary  px-4 py-2 my-2`}>
                    <RxDashboard
                        className={` ${
                            router.asPath === '/' ? 'text-white' : 'text-text'
                        } text-dark group-hover:text-white text-2xl`}
                    />
                    <span
                        className={`${
                            router.asPath === '/' ? 'text-white' : 'text-text'
                        } group-hover:text-white font-semibold `}>
                        {t('common:feed')}
                    </span>
                </div>
            </Link>

            {/* Community  */}
            <Link href="/community">
                <div
                    className={`${
                        router.asPath === '/community'
                            ? 'bg-primary'
                            : 'bg-transparent'
                    } group cursor-pointer flex gap-2 rounded-lg hover:bg-primary px-4 py-2 my-2`}>
                    <FaUsers
                        className={`text-dark ${
                            router.asPath === '/community'
                                ? 'text-white'
                                : 'text-dark'
                        } group-hover:text-white text-2xl`}
                    />
                    <span
                        className={`text-dark" ${
                            router.asPath === '/community'
                                ? 'text-white'
                                : 'text-dark'
                        } group-hover:text-white font-semibold `}>
                        {t('common:community')}
                    </span>
                </div>
            </Link>

            {/* <Link href="/messages">
                <div
                    className={`${
                        router.asPath === '/messages'
                            ? 'bg-primary text-white'
                            : 'bg-transparent text-dark'
                    } group cursor-pointer flex gap-2 rounded-lg hover:bg-primary text-dark px-4 py-2 my-2`}>
                    <BiMessageAltDots
                        className={`group-hover:text-white text-2xl`}
                    />
                    <span className={`group-hover:text-white font-semibold `}>
                        {t('common:message')}
                    </span>
                </div>
            </Link> */}

            <Link href="/notification">
                <div
                    className={`${
                        router.asPath === '/notification'
                            ? 'bg-primary text-white'
                            : 'bg-transparent text-dark'
                    } group cursor-pointer items-center flex gap-2 rounded-lg hover:bg-primary  px-4 py-2 my-2`}>
                    <IoMdNotificationsOutline
                        className={`group-hover:text-white text-2xl`}
                    />
                    <span className={`group-hover:text-white font-semibold `}>
                        {t('common:notification')}
                    </span>
                    {!isLoadingNotification &&
                        notifications?.length > 0 && (
                            <div className="flex justify-center items-center p-1 rounded-full w-6 h-6 shadow-md bg-red-500 ">
                                <span className="text-sm font-semibold text-light">
                                    {notifications?.length}
                                </span>
                            </div>
                        )}
                </div>
            </Link>

            
            <Link href="/setting">
                <div
                    className={`${
                        router.asPath === '/setting'
                            ? 'bg-primary text-light'
                            : 'bg-transparent text-dark'
                    } group cursor-pointer flex gap-2 rounded-lg hover:bg-primary  px-4 py-2 my-2`}>
                    <AiOutlineSetting
                        className={`group-hover:text-white text-2xl`}
                    />
                    <span className={`group-hover:text-white font-semibold `}>
                        {t('common:setting')}
                    </span>
                </div>
            </Link>

            <Link href={`/profile?id=${session?.user?.id}`}>
                <div
                    className={`${
                        router.asPath === `/profile?q=${session?.user?.id}`
                            ? 'bg-primary text-light'
                            : 'bg-transparent text-dark'
                    } group cursor-pointer flex gap-2 rounded-lg hover:bg-primary  px-4 py-2 my-2`}>
                    <AiOutlineUser
                        className={`group-hover:text-white text-2xl`}
                    />
                    <span className={`group-hover:text-white font-semibold `}>
                        {t('common:profile')}
                    </span>
                </div>
            </Link>

            <div
            onClick={() => setIsOpenFriendsList(true)}
                    className={`bg-transparent text-dark group cursor-pointer flex gap-2 rounded-lg hover:bg-primary  px-4 py-2 my-2`}>
                    <FaUsers
                        className={`group-hover:text-white text-2xl`}
                    />
                    <span className={`group-hover:text-white font-semibold `}>
                        {t('common:friends')}
                    </span>
                </div>


            {session?.user && (
                <div
                    onClick={() => signOut()}
                    className={`group cursor-pointer flex gap-2 rounded-lg hover:bg-primary  px-4 py-2 my-2`}>
                    <FiLogOut className={`group-hover:text-white text-2xl`} />
                    <span className={`group-hover:text-white font-semibold `}>
                        {t('common:logout')}
                    </span>
                </div>
            )}
    </div>

    <div className={`${!isOpenFriendsList ? "translate-x-[-100%] opacity-100" : "translate-x-0 opacity-100"} lg:hidden fixed left-0 top-0 bottom-0 w-[70vw] shadow-md bg-secondary z-[20000] flex-col transition-all duration-500 ease-in-out`}>
          <button
          onClick={() => setIsOpenFriendsList(false)}
          className="p-2 hover:bg-gray-300 bg-gray-200 w-8 h-8 absolute top-1 right-1 rounded-full flex justify-center items-center">
             <AiOutlineArrowLeft className="text-dark"/>
          </button>
        
        <h1 className="text-center py-4 text-dark font-semibold">Friends</h1>
        <div className="flex flex-col space-y-2 overflow-y-scroll scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
         {isOpenFriendsList && friends?.map((user) => (
            <ChatUser key={user.id} user={user} lastTime={users.find(u => u.userId === user?.id)?.lastTime!} isOnline={users.some((u : SocketUser) => u.userId === user?.id && u.isOnline)} />
         ))}
        </div>
    </div>
    </>
  )
}

export default React.memo(NavBarMobile)