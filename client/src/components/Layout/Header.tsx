import { NextPage } from 'next';
import React from 'react';
import { useTranslation } from 'next-i18next';
import { BsSearch } from 'react-icons/bs';
import { ImHangouts } from 'react-icons/im';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Skeleton from '../Shared/Skeleton';
import { AiOutlineBars } from 'react-icons/ai';

const MainHeader: NextPage<{
    image: string
    setOpen: () => void
}> = ({
    image,
    setOpen
}) => {
    const { t } = useTranslation();
    const { status }: any = useSession();

    return (
        <div
            className={`bg-light flex justify-between lg:grid grid-cols-12 py-2 h-[10vh] shadow-md items-center w-full`}>
            <div className="lg:col-span-2 col-span-9 ">
                <Link href="/" className="flex px-6 items-center gap-1">
                    <ImHangouts className="text-3xl text-primary" />
                    <h1 className={`text-dark text-2xl font-bold `}>WSocial</h1>
                </Link>
            </div>
            <div
                className={`lg:flex hidden border-gray-300 text-dark col-span-6 rounded-lg w-full h-[40px] space-x-3  px-2 items-center 0 border-[1px]`}>
                <div className="cursor-pointer p-2  rounded-full hover:bg-gray-200 transition-all duration-700">
                    <BsSearch />
                </div>
                <input
                    className={`outline-none bg-transparent w-full`}
                    type="text"
                    placeholder="Search for something here..."
                />
            </div>
            <div className="lg:flex col-span-4 hidden px-4 items-center justify-end ">
                {status === 'authenticated' && (
                    <div className="relative">
                        <div className="flex items-center  py-2 space-x-2 px-4 gap-2  rounded-full cursor-pointer">
                            {image ?
                            <Image
                                width={100}
                                height={100}
                                className="object-cover w-10 h-10  rounded-full"
                                src={image}
                                alt=""
                            />
                            :
                            <Skeleton height={40} width={40} rounded={50} />
                        }
                        </div>
                    </div>
                )}
            </div>

            <button 
             onClick={setOpen}
             className="lg:hidden block px-6">
                  <AiOutlineBars className="text-3xl" />
             </button>
        </div>
    );
};

export default React.memo(MainHeader);
