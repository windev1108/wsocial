import NOTIFICATION_OPERATIONS from '@/graphql/operations/notifications';
import USER_OPERATIONS from '@/graphql/operations/user';
import { addConversation } from '@/redux/features/conversationSlice';
import { RootState } from '@/redux/store';
import { invalidAction, sleep } from '@/utils/constants';
import { NotificationInput, User, createNotificationResponse } from '@/utils/types';
import { useMutation } from '@apollo/client';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { AiOutlineLoading3Quarters, AiOutlineMessage } from 'react-icons/ai';
import { FaUserCheck, FaUserFriends } from 'react-icons/fa';
import { HiUserRemove } from 'react-icons/hi';
import { ImLocation } from 'react-icons/im';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { MdModeEdit, MdPersonAddAlt1 } from 'react-icons/md';
import { RiUserFollowFill, RiUserUnfollowFill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';

interface Props {
    user: User;
    isFriend: boolean;
    isMySelf: boolean;
    isOnline: boolean
    isFollowing?: boolean
    lastTime?: Date
    isSendFriendRequest?: boolean
    isReceiveFriendRequest?: boolean
}

const CardUser: NextPage<Props> = ({ user, isFriend, isMySelf , isFollowing , isOnline ,  lastTime , isSendFriendRequest , isReceiveFriendRequest }) => {
    const { data: session } = useSession();
    const dispatch = useDispatch()
    const { socket } : any = useSelector<RootState>(state => state.socket)
    const [removeFriendship, { loading: loadingRemoveFriendship}] = useMutation(
        USER_OPERATIONS.Mutations.removeFriendship
    );
    const [isShowOptionFriend, setIsShowOptionFriend] = useState(false);
    const [unFollowUser, { loading: loadingUnfollow }] = useMutation(
        USER_OPERATIONS.Mutations.unFollowUser
    );
    const [followUser, { loading: loadingFollow }] = useMutation(
        USER_OPERATIONS.Mutations.followUser
    );
    const [createNotification, { loading: loadingCreateNotification }] =
    useMutation<createNotificationResponse, NotificationInput>(
        NOTIFICATION_OPERATIONS.Mutations.createNotification
    );
    const [deleteNotification, { loading: loadingDeleteNotification }] =
    useMutation(NOTIFICATION_OPERATIONS.Mutations.deleteNotification);


    const unFollowings = React.useCallback(async () => {
        try {
            const { errors } = await unFollowUser({
                variables: {
                    followingId: user.id,
                },
                refetchQueries: ['getUserById'],
                awaitRefetchQueries: true,
            });
            if (errors) {
                toast.error('Some thing wrong!');
                return;
            }
            toast.success("Unfollow user success")
            socket.emit("updateNotification")
        } catch (error: any) {}
    }, [loadingUnfollow]);

    const followings = React.useCallback(async () => {
        try {
            const { errors } = await followUser({
                variables: {
                    followingId: user.id,
                },
                refetchQueries: ['getUserById'],
                awaitRefetchQueries: true,
            });
            if (errors) {
                toast.error('Some thing wrong!');
                return;
            }
            toast.success("Unfollow user success")
            socket.emit("updateNotification")
        } catch (error: any) {}
    }, [loadingFollow]);


    const handleSendAddFriendRequest = React.useCallback(async () => {
        try {
            const { errors } = await createNotification({
                variables: {
                    notification: {
                        toUserId: user.id,
                        type: 'ADD_FRIEND',
                    },
                },
                refetchQueries: ['getUserById'],
                awaitRefetchQueries: true,
            });
            if (errors) {
                toast.error('Failed to send friend request');
                return;
            }
            toast.success('Send friend request success');
            socket.emit("updateNotification")
        } catch (err: any) {
            toast.error(err.message);
        }
    },[loadingCreateNotification,user])

    const handleCancelAddFriendRequest = React.useCallback(async () => {
        try {
            await deleteNotification({
                variables: {
                    fromUserId: session?.user.id,
                    toUserId: user.id,
                },
                refetchQueries: ['getUserById'],
                awaitRefetchQueries: true,
            });
            toast.success('Cancel request success');
        } catch (err: any) {
            toast.error(err.message, { duration: 2000 });
        }
    },[loadingDeleteNotification])

    useEffect(() => {
        return () => {
            setIsShowOptionFriend(false);
        };
    }, []);

    const handleUnfriend = async () => {
        try {
            await removeFriendship({
                variables: {
                    userIdA: session?.user.id,
                    userIdB: user.id,
                },
                refetchQueries: ['getUserById'],
                awaitRefetchQueries: true
            });
            socket.emit("updateNotification")
        } catch (err: any) {
            toast.error(err.message, { duration: 2000 });
        }
    };

    const handleOpenMessage = React.useCallback(async () => {
        try {
                dispatch(
                    addConversation({
                        user: {
                            id: user?.id,
                            name: user?.name,
                            image: user?.image,
                        },
                        isTyping: false,
                        isOnline,
                        lastTime
                    })
                );
        } catch (error: any) {
            toast.error(error.message);
        }
    }, [user]);

    return (
        <div className="absolute top-[50%] left-[50%] w-[20rem] space-y-2 rounded-lg p-4 z-[100] flex flex-col bg-light shadow-lg border">
            <div className="flex space-x-4">
                <Image
                    width={100}
                    height={100}
                    className="object-cover rounded-full w-16 h-16"
                    src={user.image}
                    alt=""
                />
                <div className="flex flex-col flex-1 space-y-2">
                    <h1 className="font-semibold">{user.name}</h1>

                    {user?.friends?.length! > 0 && (
                        <div className="flex items-center space-x-2">
                            <FaUserFriends className="text-sm" />
                            <span className="text-sm font-semibold">
                                {user?.friends?.length}
                            </span>
                            <div className="flex space-x-2">
                                <span className="text-sm">friends </span>
                            </div>
                        </div>
                    )}
                    {user?.liveAt && (
                        <div className="flex items-center space-x-2">
                            <ImLocation className="text-sm" />
                            <div className="flex space-x-2">
                                <span className="text-sm">Live at</span>
                            </div>
                            <span className="text-sm font-semibold">
                                {user?.liveAt}
                            </span>
                        </div>
                    )}
                </div>
            </div>
            {isMySelf ? (
                <div className="flex space-x-2 items-center w-full">
                    <div 
                    onClick={invalidAction}
                    className="w-1/2 justify-center cursor-pointer hover:bg-blue-700 flex space-x-2 items-center p-2 rounded-md bg-primary text-light">
                        <IoIosAddCircleOutline className="text-xl" />
                        <span className="font-semibold text-sm">Add story</span>
                    </div>

                    <div
                    onClick={invalidAction}
                    className="w-1/2 relative justify-center cursor-pointer hover:bg-gray-300 transition-colors duration-300 flex space-x-2 items-center p-2 rounded-md bg-gray-200 text-black ">
                        <MdModeEdit className="text-xl" />
                        <span className="font-semibold text-sm">
                            Edit profile
                        </span>
                    </div>
                </div>
            ) : isFriend ? (
                <div
                    className="flex space-x-2 items-center w-full">
                    <button
                    onClick={() => setIsShowOptionFriend(!isShowOptionFriend)}
                    className="w-1/2 relative justify-center cursor-pointer hover:bg-gray-300 transition-colors duration-300 flex space-x-2 items-center p-2 rounded-md bg-gray-200 text-black ">
                        <FaUserCheck className="text-xl" />
                        <span className="font-semibold text-sm">Friend</span>

                        {isShowOptionFriend && (
                            <div
                                className="absolute top-[110%] left-[50%] bg-light shadow-md flex flex-col border">
                                <button 
                                disabled={loadingRemoveFriendship}
                                onClick={handleUnfriend}
                                className={`${loadingRemoveFriendship ? "cursor-not-allowed" : "cursor-pointer"} flex items-center space-x-2 text-sm font-semibold px-4 py-1 hover:bg-gray-200`}>
                                    {loadingRemoveFriendship ?
                                    <AiOutlineLoading3Quarters className="animate-spin transition-all duration-500 ease-linear text-primary" />
                                    :
                                    <HiUserRemove size={20} />
                                  }
                                    <span>UnFriend</span>
                                </button>
                                {isFollowing ?
                                <button 
                                disabled={loadingUnfollow}
                                onClick={unFollowings}
                                className={`${loadingUnfollow ? "cursor-not-allowed" : "cursor-pointer"} flex items-center space-x-2 text-sm font-semibold px-4 py-1 hover:bg-gray-200`}>
                                    {loadingUnfollow ?
                                <AiOutlineLoading3Quarters className="animate-spin transition-all duration-500 ease-linear text-primary" />
                                 :
                                 <RiUserUnfollowFill size={18} />
                                }
                                    <span>UnFollowing</span>
                                </button>
                                :
                                <button 
                                disabled={loadingFollow}
                                onClick={followings}
                                className={`${loadingFollow ? "cursor-not-allowed" : "cursor-pointer"}" flex items-center space-x-2 text-sm font-semibold px-4 py-1 hover:bg-gray-200`}>
                                    {loadingFollow ? 
                                  <AiOutlineLoading3Quarters className="animate-spin transition-all duration-500 ease-linear text-primary" />
                                  :
                                  <RiUserFollowFill size={18} />
                                  }
                                    <span>Follow</span>
                                </button>
                            }
                            </div>
                        )}
                    </button>

                    <button 
                    onClick={handleOpenMessage}
                    className="w-1/2 justify-center cursor-pointer hover:bg-blue-700 flex space-x-2 items-center p-2 rounded-md bg-primary text-light">
                        <AiOutlineMessage className="text-xl" />
                        <span className="font-semibold text-sm">Message</span>
                    </button>
                </div>
            ) : (
                <div className="flex space-x-2 items-center w-full">
                    <button
                    disabled={loadingCreateNotification}
                    onClick={handleSendAddFriendRequest}
                    className={`${loadingCreateNotification ? "cursor-not-allowed" : "cursor-pointer"} w-1/2 justify-center cursor-pointer hover:bg-blue-700 transition-colors duration-300 flex space-x-2 items-center p-2 rounded-md bg-primary text-light`}>
                        {loadingCreateNotification ?
                        <AiOutlineLoading3Quarters className="animate-spin transition-all duration-500 ease-linear text-primary" />
                        :
                        <MdPersonAddAlt1 className="text-xl" />
                     }
                        <span className="font-semibold text-sm">
                            Add Friend
                        </span>
                    </button>

                    <div className="w-1/2 justify-center cursor-pointer hover:bg-gray-300 flex space-x-2 items-center p-2 rounded-md bg-gray-200 text-black">
                        <AiOutlineMessage className="text-xl" />
                        <span className="font-semibold text-sm">Message</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CardUser;
