import { UserSession } from '@/utils/types'
import { NextPage } from 'next'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { AiOutlineSetting, AiOutlineUser } from 'react-icons/ai'
import { BiMessageAltDots } from 'react-icons/bi'
import { FaUsers } from 'react-icons/fa'
import { FiLogOut } from 'react-icons/fi'
import { ImHangouts } from 'react-icons/im'
import { IoMdNotificationsOutline } from 'react-icons/io'
import { RxDashboard } from 'react-icons/rx'

const NavBarMobile: NextPage<{
  open: boolean, 
  setClose: () => void,   
  notifications: Notification[]
  session: UserSession
  isLoadingNotification: boolean
}> = ({open , setClose , notifications, isLoadingNotification , session }) => {
  const router = useRouter();
  const { t } = useTranslation();


  return (
    <>
    <div onClick={setClose} className={`${!open ? "translate-x-[-100%] opacity-0" : "translate-x-0 opacity-100"} lg:hidden fixed top-0 left-0 right-0 bottom-0 bg-[#11111170] z-[19999]`}>
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
    </>
  )
}

export default React.memo(NavBarMobile)