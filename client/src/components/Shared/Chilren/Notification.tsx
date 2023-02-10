import NOTIFICATION_OPERATIONS from '@/graphql/operations/notifications';
import USER_OPERATIONS from '@/graphql/operations/user';
import { RootState } from '@/redux/store';
import { User } from '@/utils/types';
import { useMutation } from '@apollo/client';
import moment from 'moment';
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { toast } from 'react-hot-toast';
import {
    AiFillHeart,
    AiOutlineLoading3Quarters,
} from 'react-icons/ai';
import { GoCommentDiscussion } from 'react-icons/go';
import { IoIosShareAlt } from 'react-icons/io';
import { MdComment } from 'react-icons/md';
import { RiUserAddFill, RiUserSearchFill } from 'react-icons/ri';
import { useSelector } from 'react-redux';

const Notification: NextPage<{
    id: string;
    type: string;
    fromUsers: User[];
    postId: string;
    updatedAt: string;
}> = ({ id, type, fromUsers, postId, updatedAt }) => {
    const [addFriendship, { loading: loadingAddFriend }] = useMutation(
        USER_OPERATIONS.Mutations.addFriendship
    );
    const [deleteNotification, { loading: loadingDeleteNotification }] =
        useMutation(NOTIFICATION_OPERATIONS.Mutations.deleteNotification);
        const { socket } : any = useSelector<RootState>(state => state.socket)

    const handleAcceptFriendship = async (
        userIdB: string,
        notificationId: string
    ) => {
        try {
            const {  errors } = await addFriendship({
                variables: {
                    userIdB,
                    notificationId,
                },
                refetchQueries: ['getMyInfo'],
                awaitRefetchQueries: true,
            });

            if (errors) {
                toast.error('Something wrong!');
            }
            toast.success("Add friend success");
            socket?.emit("updateNotification")
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleDeleteNotification = async (id: string) => {
        try {
            const { errors } = await deleteNotification({
                variables: {
                    id,
                },
                refetchQueries: ['getMyInfo'],
                awaitRefetchQueries: true,
            });

            if (errors) {
                toast.error('Something wrong!');
            }
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    return (
        <div
            key={id}
            className="cursor-pointer hover:bg-gray-100 flex lg:space-x-6 space-x-2 border-t-[1px] py-3 px-4 items-center">
            {type === 'ADD_FRIEND' && (
                <div className="flex items-center justify-center p-2 h-8 w-8 text-primary bg-primary bg-opacity-20 rounded-full">
                    <RiUserAddFill size={20} />
                </div>
            )}

            {type === 'FOLLOW_USER' && (
                <div className="flex items-center justify-center p-2 h-8 w-8 text-primary bg-primary bg-opacity-20 rounded-full">
                    <RiUserSearchFill size={20} />
                </div>
            )}

            {type === 'LIKE_POST' && (
                <div className="flex items-center justify-center p-2 h-8 w-8 text-[#ff5630] bg-[#ff5630] bg-opacity-10 rounded-full">
                    <AiFillHeart size={20} />
                </div>
            )}

            {type === 'LIKE_COMMENT' && (
                <div className="flex items-center justify-center p-2 h-8 w-8 text-[#ff5630] bg-[#ff5630] bg-opacity-20 rounded-full">
                    <AiFillHeart size={20} />
                </div>
            )}

            {type === 'COMMENT_REPLY' && (
                <div className="flex items-center justify-center p-2 h-8 w-8 text-[#38cb89] bg-[#38cb89] bg-opacity-20 rounded-full">
                    <GoCommentDiscussion size={20} />
                </div>
            )}

            {type === 'COMMENT_POST' && (
                <div className="flex items-center justify-center p-2 h-8 w-8 text-[#38cb89] bg-[#38cb89] bg-opacity-20 rounded-full">
                    <MdComment size={20} />
                </div>
            )}

            {type === 'SHARE_POST' && (
                <div className="flex items-center justify-center p-2 h-8 w-8 text-[#ffab00] bg-[#ffab00] bg-opacity-10 rounded-full">
                    <IoIosShareAlt size={20} />
                </div>
            )}

            <div className="flex flex-1 items-center space-x-2">
                <div className="flex items-center">
                    {fromUsers
                        ?.slice(0, 3)
                        .reverse()
                        .map((user: any, index: number) =>
                            index === 0 ? (
                                <div
                                    key={user.id}
                                    className={`border-light z-[${index}]  w-10 h-10 border-[3px]  rounded-full overflow-hidden`}>
                                    <Image
                                        width={50}
                                        height={50}
                                        className="object-cover w-full h-full"
                                        src={user.image}
                                        alt=""
                                    />
                                </div>
                            ) : (
                                <div
                                    key={user.id}
                                    className={`border-light z-[${
                                        index * 3
                                    } -translate-x-${
                                        index * 3
                                    }  w-10 h-10 border-[3px] rounded-full overflow-hidden`}>
                                    <Image
                                        width={50}
                                        height={50}
                                        className={`object-cover w-full h-full`}
                                        src={user.image}
                                        alt=""
                                    />
                                </div>
                            )
                        )}
                    {fromUsers?.slice(3).length > 0 && (
                        <div className="border-light bg-gray-400 z-[4] -translate-x-9 flex justify-center items-center  rounded-full border-[2px] w-8 h-8 overflow-hidden">
                            <span className="text-light">{`+${
                                fromUsers?.slice(3).length
                            }`}</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col">
                    <div className="flex space-x-2">
                        <span className="font-semibold inline">
                            {fromUsers
                                .slice(0, 3)
                                .reverse()
                                .map((user, index: number) => (
                                    <Link
                                        href={`/profile?id=${user.id}`}
                                        key={user.id}
                                        className="inline hover:underline">
                                        {index !== 0
                                            ? `,${user.name}`
                                            : `${user.name}`}
                                    </Link>
                                ))}
                            {fromUsers.slice(3).length > 0 && (
                                <span className="font-normal inline">{` and ${
                                    fromUsers.length - 1
                                } another people`}</span>
                            )}
                        </span>

                        {type === 'ADD_FRIEND' && (
                            <span>want to be friends with you</span>
                        )}

                        {type === 'FOLLOW_USER' && <span>following you</span>}
                        {type === 'COMMENT_POST' && (
                            <span>
                                commented on your{` `}
                                <Link
                                    className="hover:underline"
                                    href={`/post/${postId}`}>
                                    post
                                </Link>
                            </span>
                        )}

                        {type === 'COMMENT_REPLY' && (
                            <span>
                                reply your{' '}
                                <Link
                                    className="hover:underline"
                                    href={`/post/${postId}`}>
                                    comment
                                </Link>
                            </span>
                        )}

                        {type === 'LIKE_POST' && (
                            <span>
                                liked your{' '}
                                <Link
                                    className="hover:underline"
                                    href={`/post/${postId}`}>
                                    post
                                </Link>
                            </span>
                        )}

                        {type === 'LIKE_COMMENT' && (
                            <span>
                                liked your{' '}
                                <Link
                                    className="hover:underline"
                                    href={`/post/${postId}`}>
                                    comment
                                </Link>
                            </span>
                        )}

                        {type === 'SHARE_POST' && (
                            <span>
                                shared your{' '}
                                <Link
                                    className="hover:underline inline"
                                    href={`/post/${postId}`}>
                                    post
                                </Link>
                            </span>
                        )}
                    </div>
                    <span className="text-gray-400">
                        {moment(updatedAt as string, 'x').fromNow()}
                    </span>
                </div>
            </div>
            <div className="flex space-x-2 items-center">
                {type === 'ADD_FRIEND' && (
                    <button
                        onClick={() => {
                            handleAcceptFriendship(fromUsers[0].id, id);
                        }}
                        disabled={loadingAddFriend}
                        className={`${
                            loadingAddFriend && 'cursor-not-allowed'
                        } font-semibold text-sm flex space-x-2 hover:bg-blue-700 px-4 py-2 bg-primary text-light rounded-lg`}>
                        {loadingAddFriend && (
                            <AiOutlineLoading3Quarters className="animate-spin transition-all duration-500 ease-linear" />
                        )}
                        <span>Accept</span>
                    </button>
                )}

                {loadingDeleteNotification ? (
                    <button className="flex justify-center space-x-2 items-center font-semibold text-sm hover:bg-gray-300 px-4 py-2 bg-gray-200 text-dark rounded-lg cursor-not-allowed">
                        <AiOutlineLoading3Quarters className="animate-spin transition-all duration-500 ease-linear" />
                        <span>Delete</span>
                    </button>
                ) : (
                    <button
                        onClick={() => handleDeleteNotification(id)}
                        className="font-semibold text-sm hover:bg-gray-300 px-4 py-2 bg-gray-200 text-dark rounded-lg">
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
};

export default Notification;
