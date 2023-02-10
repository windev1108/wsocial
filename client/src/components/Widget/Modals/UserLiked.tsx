import { setShowLikers } from '@/redux/features/isSlice';
import { RootState } from '@/redux/store';
import { User } from '@/utils/types';
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { memo } from 'react';
import { GrFormClose } from 'react-icons/gr';
import { useDispatch, useSelector } from 'react-redux';

const UserLiked = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { showUserLikes }: any = useSelector<RootState>((state) => state.is);

    const redirectProfile = (id: string) => {
        router.replace(`/profile?id=${id}`);
        dispatch(setShowLikers({ likers: [], isShow: false }));
    };
    return (
        <>
            <div
                onClick={() =>
                    dispatch(setShowLikers({ likers: [], isShow: false }))
                }
                className="fixed top-0 left-0 bottom-0 right-0 z-[20001] bg-black bg-opacity-60"></div>
            <div className="fixed lg:top-[50%] lg:left-[50%] lg:bottom-auto lg:right-auto top-0 right-0 bottom-0 left-0 z-[20002] lg:translate-x-[-50%] lg:translate-y-[-50%] lg:w-[500px] w-full bg-light shadow-md lg:rounded-md">
                <h1 className="text-center p-4 w-full">Users Liked</h1>
                <div className="absolute top-3 right-3">
                    <GrFormClose
                        onClick={() =>
                            dispatch(
                                setShowLikers({ likers: [], isShow: false })
                            )
                        }
                        className="bg-gray-200 text-text rounded-full text-3xl hover:bg-slate-300 cursor-pointer"
                    />
                </div>
                <div className="flex flex-col p-4 space-y-2 overflow-y-scroll scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 max-h-[400px]">
                    {showUserLikes?.likers.map((user: User) => (
                        <div
                            onClick={() => redirectProfile(user.id)}
                            key={user.id}
                            className="flex items-center space-x-2 hover:underline cursor-pointer">
                            <Image
                                width={100}
                                height={100}
                                className="object-cover w-9 h-9 rounded-full hover:opacity-80"
                                src={user.image}
                                alt=""
                            />
                            <span className="text-sm font-semibold">
                                {user.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default memo(UserLiked);
