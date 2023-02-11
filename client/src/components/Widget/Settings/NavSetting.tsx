import { NextPage } from 'next';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { BiBlock, BiUser } from 'react-icons/bi';
import { IoMdNotificationsOutline } from 'react-icons/io';

interface Props {
    tab: number;
    setTab: (a: number) => void;
    className: string
}

const NavSetting: NextPage<Props> = ({ tab, setTab , className }) => {
    const { t } = useTranslation()

    return (
        <div className={className}>
            <div
                onClick={() => setTab(1)}
                className={`${tab === 1 && "bg-gray-200"} flex items-center rounded-lg space-x-2 px-4 py-2 border-b-[1px] border-gray-200 hover:bg-gray-200 cursor-pointer text-dark`}>
                <BiUser />
                <span className="lowercase first-letter:uppercase lg:block hidden">{`${t('common:edit')} ${t('common:profile')}`}</span>
            </div>
            <div
                onClick={() => setTab(2)}
                className={`${tab === 2 && "bg-gray-200"}  flex items-center rounded-lg space-x-2 px-4 py-2 border-b-[1px] border-gray-200 hover:bg-gray-200 cursor-pointer text-dark`}>
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2.25a.75.75 0 01.75.75v1.506a49.38 49.38 0 015.343.371.75.75 0 11-.186 1.489c-.66-.083-1.323-.151-1.99-.206a18.67 18.67 0 01-2.969 6.323c.317.384.65.753.998 1.107a.75.75 0 11-1.07 1.052A18.902 18.902 0 019 13.687a18.823 18.823 0 01-5.656 4.482.75.75 0 11-.688-1.333 17.323 17.323 0 005.396-4.353A18.72 18.72 0 015.89 8.598a.75.75 0 011.388-.568A17.21 17.21 0 009 11.224a17.17 17.17 0 002.391-5.165 48.038 48.038 0 00-8.298.307.75.75 0 01-.186-1.489 49.159 49.159 0 015.343-.371V3A.75.75 0 019 2.25zM15.75 9a.75.75 0 01.68.433l5.25 11.25a.75.75 0 01-1.36.634l-1.198-2.567h-6.744l-1.198 2.567a.75.75 0 01-1.36-.634l5.25-11.25A.75.75 0 0115.75 9zm-2.672 8.25h5.344l-2.672-5.726-2.672 5.726z" clipRule="evenodd"></path></svg>
                <span className="lg:block hidden">{t('common:language')}</span>
            </div>
            <div
                onClick={() => setTab(3)}
                className={`${tab === 3 && "bg-gray-200"}  flex items-center rounded-lg space-x-2 px-4 py-2 border-b-[1px] border-gray-200 hover:bg-gray-200 cursor-pointer text-dark`}>
                <BiBlock />
                <span className="first-letter:uppercase  lg:block hidden ">{t('common:blocking')}</span>
            </div>
            <div
                onClick={() => setTab(4)}
                className={`${tab === 4 && "bg-gray-200"}  flex items-center rounded-lg space-x-2 px-4 py-2 border-b-[1px] border-gray-200 hover:bg-gray-200 cursor-pointer text-dark`}>
                <IoMdNotificationsOutline />
                <span className="lg:block hidden">{t('common:notification')}</span>
            </div>
        </div>
    )
}

export default NavSetting