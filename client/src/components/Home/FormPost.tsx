import React from 'react';
import { useTranslation } from 'next-i18next';
import { BsCameraVideo } from 'react-icons/bs';
import { FiSmile } from 'react-icons/fi';
import { HiOutlinePhotograph } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenFormSubmitPost } from '@/redux/features/isSlice';
import Image from 'next/image';
import { useQuery } from '@apollo/client';
import { RootState } from '@/redux/store';
import { useSession } from 'next-auth/react';


const PostSubmit = () => {
    const dispatch = useDispatch();
    const { user } : any = useSelector<RootState>(state => state.session)
    const { t } = useTranslation();

    return (
        <div className="bg-light flex-col gap-2 p-4 border-[1px] border-gray-200 shadow-sm rounded-lg">
            <div className="flex space-x-4 items-center">
                {!user?.image ?
              <div  className="w-10 h-10 rounded-full bg-secondary">
              </div>    
            :
                <Image
                    width={100}
                    height={100}
                    className="object-cover w-10 h-10  rounded-full"
                    src={user?.image}
                    alt=""
                />
            }
                <div className="flex-1">
                    <div
                        onClick={() =>
                            dispatch(
                                setOpenFormSubmitPost({
                                    isOpen: true,
                                })
                            )
                        }
                        className="bg-secondary cursor-pointer hover:bg-gray-200 duration-300 transition-all outline-none p-3 text-text rounded-lg w-full">
                        <span>What's happening</span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2 p-2">
                <div className="py-2 hover:bg-gray-300 border cursor-pointer justify-center rounded-lg shadow-sm flex items-center space-x-2">
                    <HiOutlinePhotograph className="text-dark" />
                    <span className="lg:text-base text-sm text-dark">{`${t('common:photo')}/${t(
                        'common:video'
                    )}`}</span>
                </div>
                <div className="py-2 hover:bg-gray-300 border cursor-pointer text-dark justify-center rounded-lg shadow-sm flex items-center space-x-2">
                    <FiSmile />
                    <span className="lg:text-base text-sm">{`${t('common:felling')}`}</span>
                </div>
                <div className="py-2 hover:bg-gray-300 border cursor-pointer text-dark justify-center rounded-lg shadow-sm flex items-center space-x-2">
                    <BsCameraVideo />
                    <span className="lg:text-base text-sm whitespace-nowrap">{t('common:live_video')}</span>
                </div>
            </div>
        </div>
    );
};

export default PostSubmit;
