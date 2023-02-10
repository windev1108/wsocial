import React, { useEffect } from 'react';
import { RxDashboard } from 'react-icons/rx';
import { FaUsers } from 'react-icons/fa';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { AiOutlineSetting, AiOutlineUser } from 'react-icons/ai';
import { FiLogOut } from 'react-icons/fi';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { signOut } from 'next-auth/react';
import { Notification, UserSession } from '@/utils/types';


const NavBar: NextPage<{
    notifications: Notification[]
    isLoadingNotification: boolean
    session: UserSession
    className: string
}> = ({
    notifications,
    isLoadingNotification,
    session,
    className
}) => {
    const router = useRouter();
    const { t } = useTranslation();

 
    return (
        <div
            className={className}>
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

            {/* <Link href="/explore">
                <div
                    className={`${
                        router.asPath === '/explore'
                            ? 'bg-primary text-light'
                            : 'bg-transparent text-dark'
                    } group cursor-pointer flex gap-2 rounded-lg hover:bg-primary  px-4 py-2 my-2`}>
                    <GiEarthAfricaEurope
                        className={`group-hover:text-white text-2xl`}
                    />
                    <span className={`group-hover:text-white font-semibold `}>
                        {t('common:explore')}
                    </span>
                </div>
            </Link> */}

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
    );
};

export default React.memo(NavBar);
