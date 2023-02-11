import Notification_OPERATIONS from '@/graphql/operations/notifications';
import { useMutation } from '@apollo/client';
import { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import { toast } from 'react-hot-toast';
import { AiFillLinkedin, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { BsFacebook, BsInstagram } from 'react-icons/bs';
import { ImLocation } from 'react-icons/im';
import { IoLogoTwitter } from 'react-icons/io';
import {
    NotificationInput,
    createNotificationResponse,
} from '@/utils/types';
import { MdPersonAddAlt1 } from 'react-icons/md';
import { FaUserPlus, FaUserTimes } from 'react-icons/fa';
import USER_OPERATIONS from '@/graphql/operations/user';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface NotFriendComponentProps {
    id: string;
    name: string;
    location: string;
    avatar: string;
    linkedinUrl: string;
    facebookUrl: string;
    instagramUrl: string;
    twitterUrl: string;
    isSendAddFriend: boolean;
    isReceiveAddFriend: boolean;
    isFollowed: boolean
    isFollowing: boolean
}

const NotFriendComponent: NextPage<NotFriendComponentProps> = ({
    id,
    name,
    avatar,
    location,
    linkedinUrl,
    facebookUrl,
    instagramUrl,
    twitterUrl,
    isSendAddFriend,
    isReceiveAddFriend,
    isFollowed,
    isFollowing
}) => {
    const { socket } : any = useSelector<RootState>(state => state.socket)
    const [createNotification, { loading: loadingCreateNotification }] =
        useMutation<createNotificationResponse, NotificationInput>(
            Notification_OPERATIONS.Mutations.createNotification
        );
    const [deleteNotification, { loading: loadingDeleteNotification }] =
        useMutation<createNotificationResponse, { userId: string }>(
            Notification_OPERATIONS.Mutations.deleteNotification
        );
    const [addFriendship, { loading: loadingAddFriendship }] = useMutation(
        USER_OPERATIONS.Mutations.addFriendship
    );
    const [followUser, { loading: loadingFollowUser }] = useMutation(
        USER_OPERATIONS.Mutations.followUser
    );
    const [unFollowUser, { loading: loadingUnfollow }] = useMutation(
        USER_OPERATIONS.Mutations.unFollowUser
    );
    const handleSendAddFriendRequest = async () => {
        try {
            const { errors } = await createNotification({
                variables: {
                    notification: {
                        toUserId: id,
                        type: 'ADD_FRIEND',
                    },
                },
                refetchQueries: ['getMyCommunity', 'getMyNotifications'],
                awaitRefetchQueries: true,
            });

            if (errors) {
                toast.error('Failed to send friend request');
                return;
            }

            toast.success('Send request added friend success');
            socket?.emit("updateNotification")
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleCancelAddFriendRequest = async (userId: string) => {
        try {
            const { errors } = await deleteNotification({
                variables: {
                    userId: id
                },
                refetchQueries: ['getMyCommunity', 'getMyNotifications'],
                awaitRefetchQueries: true,
            });
            if (errors) {
                toast.error('Something wrong!');
            }
            toast.success('Cancel request successfully');
            socket.emit("updateNotification")
        } catch (err: any) {
            toast.error(err.message, { duration: 2000 });
        }
    };

    const handleAcceptFriendship = async (userIdB: string) => {
        try {
            const { errors } = await addFriendship({
                variables: {
                    userIdB,
                },
                refetchQueries: ['getMyCommunity', 'getMyNotifications' , 'getMyInfo'],
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

    const unFollowings = async () => {
        try {
            const { errors } = await unFollowUser({
                variables: {
                    followingId: id,
                },
                refetchQueries: ['getMyCommunity'],
                awaitRefetchQueries: true,
            });
            if (errors) {
                toast.error('Some thing wrong!');
                return;
            }
            toast.success("Unfollow user success")
            socket?.emit("updateNotification")
        } catch (error: any){
            toast.error(error.message);
        }}
    
    const handleFollowUser = async () => {
        try {
            const { errors } = await followUser({
                variables: {
                    followingId: id,
                },
                refetchQueries: ['getMyCommunity'],
                awaitRefetchQueries: true,
            });
            if (errors) {
                toast.error('Something wrong!');
                return;
            }

            toast.success("Follow user success")
            socket?.emit("updateNotification")
        } catch (error: any) {
            toast.error(error.message);
        }
    }


    return (
        <div className="bg-light flex-col space-y-4 p-4 rounded-xl border-[1px] border-gray-300">
            <div className="flex space-x-4">
                <Link href={`/profile?id=${id}`}>
                    <img
                        className="object-cover w-11 h-11 rounded-full hover:opacity-60 cursor-pointer"
                        src={avatar}
                        alt=""
                    />
                </Link>
                <div className="flex-col flex-1">
                <Link href={`/profile?id=${id}`}>
                        <h1 className="text-dark hover:underline cursor-pointer">
                            {name}
                        </h1>
                    </Link>
                    {location && (
                        <div className="flex items-center space-x-1">
                            <ImLocation className="text-xs text-gray-400" />
                            <span className="text-gray-500 text-xs">
                                {location}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {facebookUrl || twitterUrl || instagramUrl || linkedinUrl &&
            <div className="flex justify-center items-center space-x-2">
                {facebookUrl &&
                <Link href={facebookUrl || 'https://www.facebook.com/'}>
                    <BsFacebook className="text-xl text-primary" />
                </Link>
                }
                {twitterUrl &&
                <Link href={twitterUrl || 'https://twitter.com/'}>
                    <IoLogoTwitter className="text-xl text-primary" />
                </Link>
                }
                
                {instagramUrl &&
                <Link href={instagramUrl || 'https://www.instagram.com/'}>
                    <BsInstagram className="text-2xl bg-gradient-to-tr from-[#f79402] via-[#f70a59] to-pink-[#f501c1] rounded-xl overflow-hidden text-white" />
                </Link>
                }

                {linkedinUrl &&
                <Link href={linkedinUrl || 'https://www.linkedin.com/'}>
                    <AiFillLinkedin className="text-2xl text-[#0A66C2]" />
                </Link>
                }
            </div>
            }
            
            <div className="flex gap-2 justify-around">
                  {!isFollowed && !isFollowing &&
                    (loadingUnfollow ? (
                        <button className="grid place-items-center hover:bg-opacity-70 w-1/2 py-2 rounded-lg bg-gray-200 text-dark cursor-not-allowed">
                            <AiOutlineLoading3Quarters className="animate-spin transition-all duration-500 ease-linear text-light" />
                        </button>
                    ) : (
                        <button
                        onClick={handleFollowUser}
                        className="hover:bg-opacity-70 w-1/2 p-1 rounded-lg bg-gray-200 text-dark font-semibold text-sm">
                            Follow
                        </button>
                    ))}

                   {isFollowed &&
                    (loadingUnfollow ? (
                        <button className="flex space-x-2 justify-center items-center hover:bg-opacity-70 w-1/2 py-2 rounded-lg bg-gray-200 font-semibold text-sm text-dark cursor-not-allowed">
                        <AiOutlineLoading3Quarters className="animate-spin transition-all duration-500 ease-linear " />
                        <span>UnFollow</span>
                    </button>
                    ) : (
                        <button
                        onClick={unFollowings}
                        className="hover:bg-opacity-70 w-1/2 p-1 rounded-lg bg-gray-200 text-dark font-semibold text-sm">
                            UnFollow
                        </button>
                    ))} 


                    {isFollowing && !isFollowed &&
                    (loadingFollowUser ? (
                        <button className="flex space-x-2 justify-center items-center hover:bg-opacity-70 w-1/2 py-2 rounded-lg bg-gray-200 font-semibold text-sm text-dark cursor-not-allowed">
                            <AiOutlineLoading3Quarters className="animate-spin transition-all duration-500 ease-linear " />
                            <span>Follow back</span>
                        </button>
                    ) : (
                        <button
                        onClick={handleFollowUser}
                        className="hover:bg-opacity-70 w-1/2 p-1 rounded-lg bg-gray-200 text-dark font-semibold text-sm">
                            Follow back
                        </button>
                    ))}

                {isSendAddFriend &&
                    (loadingDeleteNotification ? (
                        <div className="cursor-not-allowed justify-center hover:bg-blue-700 transition-colors duration-300 flex space-x-2 items-center p-2 rounded-md bg-primary text-light">
                            <AiOutlineLoading3Quarters className="animate-spin duration-500 transition-all ease-linear text-light text-xl" />
                            <span className="font-semibold text-sm whitespace-nowrap">
                                Cancel friend request
                            </span>
                        </div>
                    ) : (
                        <button
                            onClick={() => handleCancelAddFriendRequest(id)}
                            className="cursor-pointer justify-center hover:bg-blue-700 transition-colors duration-300 flex space-x-2 items-center p-2 rounded-md bg-primary text-light">
                            <FaUserTimes className="text-xl text-light" />
                            <span className="font-semibold text-sm whitespace-nowrap">
                                Cancel friend request
                            </span>
                        </button>
                    ))}

                {isReceiveAddFriend &&
                    (loadingAddFriendship ? (
                        <div className="cursor-not-allowed justify-center hover:bg-blue-700 transition-colors duration-300 flex space-x-2 items-center p-2 rounded-md bg-primary text-light">
                            <AiOutlineLoading3Quarters className="animate-spin duration-500 transition-all ease-linear text-light text-xl" />
                            <span className="font-semibold text-sm whitespace-nowrap">
                                Accept friend request
                            </span>
                        </div>
                    ) : (
                        <button
                            onClick={() => handleAcceptFriendship(id)}
                            className="cursor-pointer justify-center hover:bg-blue-700 transition-colors duration-300 flex space-x-2 items-center p-2 rounded-md bg-primary text-light">
                            <FaUserPlus className="text-lg text-light" />
                            <span className="font-semibold text-sm whitespace-nowrap">
                                Accept friend request
                            </span>
                        </button>
                    ))}

                {!isReceiveAddFriend && !isSendAddFriend && (
                    <>
                        {loadingCreateNotification ? (
                            <div className="cursor-not-allowed justify-center w-1/2 hover:bg-blue-700 transition-colors duration-300 flex space-x-2 items-center p-2 rounded-md bg-primary text-light">
                                <AiOutlineLoading3Quarters className="animate-spin duration-500 transition-all ease-linear text-light text-xl" />
                                <span className="font-semibold text-sm whitespace-nowrap">
                                    Add Friend
                                </span>
                            </div>
                        ) : (
                            <div
                                onClick={handleSendAddFriendRequest}
                                className="w-1/2 cursor-pointer justify-center hover:bg-blue-700 transition-colors duration-300 flex space-x-2 items-center p-2 rounded-md bg-primary text-light">
                                <MdPersonAddAlt1 className="text-xl" />
                                <span className="font-semibold text-sm">
                                    Add Friend
                                </span>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default NotFriendComponent;
