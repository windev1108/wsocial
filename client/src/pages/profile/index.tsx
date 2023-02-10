import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {  BiUser } from 'react-icons/bi';
import {
    FaBirthdayCake,
    FaUserCheck,
    FaUserTimes,
} from 'react-icons/fa';
import {
    AiOutlineMessage,
    AiFillLinkedin,
    AiOutlineCloudUpload,
    AiOutlineLoading3Quarters,
} from 'react-icons/ai';
import { GoHome } from 'react-icons/go';
import { TbUserSearch } from 'react-icons/tb';
import { SlUserFollowing } from 'react-icons/sl';
import { BsCameraVideo, BsFacebook, BsInstagram } from 'react-icons/bs';
import Link from 'next/link';
import { IoLogoTwitter } from 'react-icons/io';
import Post from '@/components/Widget/Items/Post';
import { LoadingComponent, LoadingPage } from '@/components/Widget/Loading';
import dynamic from 'next/dynamic';
const Layout = dynamic(() => import('@/components/Layout'), { suspense: true });
import { unstable_getServerSession as getServerSession } from 'next-auth';
import { GetServerSidePropsContext, NextPage } from 'next';
import { authOptions } from '../api/auth/[...nextauth]';
import USER_OPERATIONS from '@/graphql/operations/user';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
    Conversation,
    createNotificationResponse,
    NotificationInput,
    Post as PostModel,
    SocketUser,
    User,
} from '@/utils/types';
import { formatFirstUppercase } from '@/utils/constants';
import moment from 'moment';
import USER_MUTATIONS from '@/graphql/operations/user';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { MdPersonAddAlt1 } from 'react-icons/md';
import CardUser from '@/components/Widget/Cards/CardUser';
import NOTIFICATION_OPERATIONS from '@/graphql/operations/notifications';
import { GiEarthAfricaEurope } from 'react-icons/gi';
import { HiOutlinePhotograph, HiUserRemove } from 'react-icons/hi';
import { RiUserFollowFill, RiUserUnfollowFill } from 'react-icons/ri';
import POST_OPERATIONS from '@/graphql/operations/post';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenFormSubmitPost } from '@/redux/features/isSlice';
import {
    addConversation,
    conversationSlice,
} from '@/redux/features/conversationSlice';
import { RootState } from '@/redux/store';
import Image from 'next/image';
import { FiSmile } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

export const getServerSideProps = async ({
    req,
    res,
    locale,
    query,
}: GetServerSidePropsContext) => {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
        return {
            redirect: {
                destination: '/signin',
                permanent: true,
            },
            props: {},
        };
    }

    return {
        props: {
            ...(await serverSideTranslations(locale!, ['common'])),
            profileId: query.id,
            session,
            origin: `${
                req.headers.host?.includes('localhost') ? 'http' : 'https'
            }://${req.headers.host}`,
        },
    };
};

interface Props {
    profileId: string;
}

const Profile: NextPage<Props> = ({ profileId }) => {
    const dispatch = useDispatch();
    const { data: session } = useSession();
    const { t } = useTranslation();
    const {
        data: user,
        loading,
    }: any = useQuery(USER_OPERATIONS.Queries.getUserById, {
        variables: { id: profileId },
    });
    const { conversations }: conversationSlice | any = useSelector<RootState>(
        (state) => state.conversations
    );
    const { users }:  any = useSelector<RootState>(
        (state) => state.session
    );
    const [getPostInProfile, { data: dataPost, loading: loadingPost }] =
        useLazyQuery(POST_OPERATIONS.Queries.getPostInProfile);
    const [createNotification, { loading: loadingCreateNotification }] =
        useMutation<createNotificationResponse, NotificationInput>(
            NOTIFICATION_OPERATIONS.Mutations.createNotification
        );
    const [deleteNotification, { loading: loadingDeleteNotification }] =
        useMutation(NOTIFICATION_OPERATIONS.Mutations.deleteNotification);
    const [addFriendship, { loading: loadingAddFriendship }] = useMutation(
        USER_MUTATIONS.Mutations.addFriendship
    );
    const [removeFriendship, { loading: loadingRemoveFriendship }] =
        useMutation(USER_MUTATIONS.Mutations.removeFriendship);
    const [unFollowUser, { loading: loadingUnFollowUser }] = useMutation<
        any,
        { followingId: String }
    >(USER_MUTATIONS.Mutations.unFollowUser);
    const [followUser, { loading: loadingFollowUser }] = useMutation<
        any,
        { followingId: String }
    >(USER_MUTATIONS.Mutations.followUser);

    const [state, setState] = useState({
        background: {},
        blobBackground: '',
        isLoading: false,
        mouseEnter: '',
        isShowOptionFriend: false,
    });
    const {
        blobBackground,
        mouseEnter,
        isShowOptionFriend,
    } = state;

    useEffect(() => {
        getPostInProfile({
            variables: {
                id: profileId,
                isFriend: user?.getUserById.friends.some(
                    (u: User) => u.id === profileId
                ),
                isMySelf: profileId === session?.user.id,
            },
        });
        if (user?.getUserById.name) {
            document.title = `${user?.getUserById.name} | WSocial`;
        }
    }, [profileId]);

    const onBackgroundChange = (e: any) => {
        const file = e.target.files[0];
        setState({
            ...state,
            blobBackground: URL?.createObjectURL(file),
        });
        dispatch(
            setOpenFormSubmitPost({
                isOpen: true,
                background: {
                    file: file,
                    blobFile: {
                        url: URL?.createObjectURL(file),
                        type: file.type,
                    },
                },
            })
        );
    };

    const onAvatarChange = (e: any) => {
        const file = e.target?.files[0];
        dispatch(
            setOpenFormSubmitPost({
                isOpen: true,
                avatar: {
                    file: file,
                    blobFile: {
                        url: URL?.createObjectURL(file),
                        type: file.type,
                    },
                },
            })
        );
    };

    const handleSendAddFriendRequest = async () => {
        try {
            const { errors } = await createNotification({
                variables: {
                    notification: {
                        toUserId: profileId,
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
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleAcceptFriendRequest = async () => {
        try {
            const { errors } = await addFriendship({
                variables: {
                    userIdB: user?.getUserById?.id,
                },
                refetchQueries: ['getUserById', 'getMyNotifications'],
                awaitRefetchQueries: true,
            });

            if (errors) {
                toast.error('Something wrong!');
            }
            toast.success('Add friend success');
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleCancelAddFriendRequest = async () => {
        try {
            await deleteNotification({
                variables: {
                    fromUserId: session?.user.id,
                    toUserId: profileId,
                },
                refetchQueries: ['getUserById'],
                awaitRefetchQueries: true,
            });
            toast.success('Cancel request success');
        } catch (err: any) {
            toast.error(err.message, { duration: 2000 });
        }
    };

    const handleUnFriendship = async () => {
        try {
            const { data, errors } = await removeFriendship({
                variables: {
                    userIdB: profileId,
                    type: 'ADD_FRIEND',
                },
                awaitRefetchQueries: true,
                refetchQueries: ['getUserById'],
            });
            if (errors) {
                errors.forEach((err) => toast.error(err.message));
                return;
            }
            toast.success(data.removeFriendship.message);
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleUnFollowUser = useCallback(async () => {
        try {
            unFollowUser({
                variables: {
                    followingId: user?.getUserById.id,
                },
                refetchQueries: ['getUserById'],
                awaitRefetchQueries: true,
            });
        } catch (error: any) {
            toast.error(error.message);
        }
    }, [user?.getUserById.id]);

    const handleFollowUser = useCallback(async () => {
        try {
            followUser({
                variables: {
                    followingId: user?.getUserById.id,
                },
                refetchQueries: ['getUserById'],
                awaitRefetchQueries: true,
            });
        } catch (error: any) {
            toast.error(error.message);
        }
    }, [user?.getUserById.id]);

    const handleOpenMessage = useCallback(async () => {
        try {
            if (
                !conversations.some(
                    (conversation: any) =>
                        conversation.user.id === user?.getUserById?.id
                )
            ) {
                dispatch(
                    addConversation({
                        user: {
                            id: user?.getUserById.id,
                            name: user?.getUserById.name,
                            image: user?.getUserById.image,
                        },
                    })
                );
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    }, [conversations,user]);
  

    return (
        <Suspense fallback={<LoadingPage />}>
            <Layout>
                {loading ? (
                    <LoadingComponent />
                ) : (
                    <div className="w-full rounded-xl overflow-y-scroll pb-20 overflow-x-hidden h-screen scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-400">
                        <div className="relative w-full lg:h-[20rem] h-[30vh] shadow-xl border lg:rounded-t-[2rem]">
                            {blobBackground || user?.getUserById.background ? (
                                <Image
                                    width={1000}
                                    height={1000}
                                    className="object-cover w-full h-full rounded-t-[2rem]"
                                    alt=""
                                    src={
                                        blobBackground ||
                                        user?.getUserById.background
                                    }
                                />
                            ) : (
                                <div className="w-full h-full lg:rounded-t-[2rem] bg-gradient-to-t from-gray-200 to-light"></div>
                            )}
                            {user?.getUserById.isMySelf && (
                                <div className="absolute lg:bottom-5 bottom-[-30%] right-5 shadow-md rounded-lg">
                                        <label
                                            onChange={onBackgroundChange}
                                            htmlFor="uploadBg"
                                            className="relative z-20 cursor-pointer transition-all duration-500 hover:bg-gray-300 px-4 py-2 rounded-lg bg-secondary flex items-center space-x-2">
                                            <AiOutlineCloudUpload
                                                className="text-dark"
                                                size={25}
                                            />
                                            <span className="text-dark lg:text-base text-sm ">
                                                Edit Cover Photo
                                            </span>
                                            <input
                                                id="uploadBg"
                                                type="file"
                                                hidden
                                            />
                                        </label>
                                </div>
                            )}
                            <div className="absolute lg:bottom-[-38%] bottom-[-60%] left-0 right-0 z-10 lg:px-8 px-4 pb-10 shadow-md rounded-b-[2rem]">
                                <div className="relative lg:h-[180px] lg:w-[180px] w-[120px] h-[120px]">
                                    <Image
                                        className="rounded-full w-full h-full shadow-md lg:border-[6px] border-[3px] border-light"
                                        alt=""
                                        width={600}
                                        height={600}
                                        src={user?.getUserById.image}
                                    />

                                    {user?.getUserById.id === session?.user.id &&
                                    <div className="absolute lg:right-3 right-0 bottom-0 lg:bottom-3 lg:w-10 lg:h-10 cursor-pointer justify-center rounded-full shadow-md z-20 transition-all duration-500 hover:bg-gray-300 bg-secondary flex items-center space-x-2">
                                        <label
                                            onChange={onAvatarChange}
                                            htmlFor="uploadAvatar"
                                            className="relative lg:w-14 lg:h-14 w-9 h-9 shadow-md cursor-pointer transition-all duration-500 rounded-full hover:bg-gray-300 lg:px-4 lg:py-2 px-2 py-2 bg-secondary flex items-center space-x-2">
                                            <AiOutlineCloudUpload
                                                className="text-dark"
                                                size={25}
                                            />
                                            <input
                                                id="uploadAvatar"
                                                type="file"
                                                hidden
                                                accept="image/*"
                                            />
                                        </label>
                                    </div>
                                    }
                                </div>
                                <div className="flex lg:ml-12 ml-5 justify-between">
                                    <div className="text-center">
                                        <h1 className="font-bold text-lg text-dark">
                                            {user?.getUserById.name}
                                        </h1>
                                        <span className="text-sm text-gray-400">
                                            {user?.getUserById.nickname}
                                        </span>
                                    </div>
                                    {!user?.getUserById?.isMySelf && (
                                        <>
                                            {user?.getUserById.isFriend ? (
                                                <div className="flex space-x-2 items-center z-[1]">
                                                    <div
                                                        onClick={() =>
                                                            setState({
                                                                ...state,
                                                                isShowOptionFriend:
                                                                    !isShowOptionFriend,
                                                            })
                                                        }
                                                        className="relative cursor-pointer hover:bg-gray-300 transition-colors duration-300 flex space-x-2 items-center p-2 rounded-md bg-gray-200 text-black ">
                                                        <FaUserCheck className="text-xl" />
                                                        <span className="font-semibold text-sm">
                                                            Friend
                                                        </span>
                                                        {isShowOptionFriend && (
                                                            <div className="absolute top-[110%] left-[50%] bg-light shadow-md flex flex-col border">
                                                                <button
                                                                    disabled={
                                                                        loadingRemoveFriendship
                                                                    }
                                                                    onClick={
                                                                        handleUnFriendship
                                                                    }
                                                                    className={`${
                                                                        loadingRemoveFriendship
                                                                            ? 'cursor-not-allowed'
                                                                            : 'cursor-pointer'
                                                                    } flex items-center space-x-2 text-sm font-semibold px-4 py-1 hover:bg-gray-200`}>
                                                                    {' '}
                                                                    {loadingRemoveFriendship ? (
                                                                        <AiOutlineLoading3Quarters className="animate-spin transition-all duration-500 ease-linear" />
                                                                    ) : (
                                                                        <HiUserRemove
                                                                            size={
                                                                                20
                                                                            }
                                                                        />
                                                                    )}
                                                                    <span>
                                                                        UnFriend
                                                                    </span>
                                                                </button>
                                                                {user
                                                                    ?.getUserById
                                                                    .isFollowing ? (
                                                                    <button
                                                                        disabled={
                                                                            loadingUnFollowUser
                                                                        }
                                                                        onClick={
                                                                            handleUnFollowUser
                                                                        }
                                                                        className={`${
                                                                            loadingUnFollowUser
                                                                                ? 'cursor-not-allowed'
                                                                                : 'cursor-pointer'
                                                                        } flex items-center space-x-2 text-sm font-semibold px-4 py-1 hover:bg-gray-200`}>
                                                                        {loadingUnFollowUser ? (
                                                                            <AiOutlineLoading3Quarters className="animate-spin transition-all duration-500 ease-linear" />
                                                                        ) : (
                                                                            <RiUserUnfollowFill
                                                                                size={
                                                                                    18
                                                                                }
                                                                            />
                                                                        )}
                                                                        <span>
                                                                            UnFollowing
                                                                        </span>
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        disabled={
                                                                            loadingFollowUser
                                                                        }
                                                                        onClick={
                                                                            handleFollowUser
                                                                        }
                                                                        className={`${
                                                                            loadingUnFollowUser
                                                                                ? 'cursor-not-allowed'
                                                                                : 'cursor-pointer'
                                                                        } flex items-center space-x-2 text-sm font-semibold px-4 py-1 hover:bg-gray-200`}>
                                                                        {loadingFollowUser ? (
                                                                            <AiOutlineLoading3Quarters className="animate-spin transition-all duration-500 ease-linear" />
                                                                        ) : (
                                                                            <RiUserFollowFill
                                                                                size={
                                                                                    18
                                                                                }
                                                                            />
                                                                        )}
                                                                        <span>
                                                                            Follow
                                                                        </span>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div
                                                        onClick={
                                                            handleOpenMessage
                                                        }
                                                        className="cursor-pointer hover:bg-blue-700 flex space-x-2 items-center p-2 rounded-md bg-primary text-light">
                                                        <AiOutlineMessage className="text-xl" />
                                                        <span className="font-semibold text-sm">
                                                            Message
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex space-x-2 items-center">
                                                    {user?.getUserById
                                                        .isSendAddFriend && (
                                                        <button
                                                            disabled={
                                                                loadingDeleteNotification
                                                            }
                                                            onClick={
                                                                handleCancelAddFriendRequest
                                                            }
                                                            className={`${
                                                                loadingAddFriendship
                                                                    ? 'cursor-not-allowed'
                                                                    : 'cursor-pointer'
                                                            } hover:bg-blue-700 transition-colors duration-300 flex space-x-2 items-center p-2 rounded-md bg-primary text-light`}>
                                                            {loadingDeleteNotification ? (
                                                                <AiOutlineLoading3Quarters className="animate-spin transition-all duration-500 ease-linear" />
                                                            ) : (
                                                                <FaUserTimes className="text-xl" />
                                                            )}
                                                            <span className="font-semibold text-sm">
                                                                Cancel friend
                                                                request
                                                            </span>
                                                        </button>
                                                    )}

                                                    {user?.getUserById
                                                        .isReceiveAddFriend && (
                                                        <button
                                                            disabled={
                                                                loadingAddFriendship
                                                            }
                                                            onClick={
                                                                handleAcceptFriendRequest
                                                            }
                                                            className={`${
                                                                loadingAddFriendship
                                                                    ? 'cursor-not-allowed'
                                                                    : 'cursor-pointer'
                                                            } hover:bg-blue-700 transition-colors duration-300 flex space-x-2 items-center p-2 rounded-md bg-primary text-light`}>
                                                            {loadingAddFriendship ? (
                                                                <AiOutlineLoading3Quarters className="animate-spin transition-all duration-500 ease-linear" />
                                                            ) : (
                                                                <FaUserTimes className="text-xl" />
                                                            )}

                                                            <span className="font-semibold text-sm">
                                                                Accept friend
                                                                request
                                                            </span>
                                                        </button>
                                                    )}

                                                    {!user?.getUserById
                                                        .isSendAddFriend &&
                                                        !user?.getUserById
                                                            .isReceiveAddFriend && (
                                                            <button
                                                                disabled={
                                                                    loadingCreateNotification
                                                                }
                                                                onClick={() =>
                                                                    handleSendAddFriendRequest()
                                                                }
                                                                className={`${
                                                                    loadingCreateNotification
                                                                        ? 'cursor-not-allowed'
                                                                        : 'cursor-pointer'
                                                                } hover:bg-blue-700 transition-colors duration-300 flex space-x-2 items-center p-2 rounded-md bg-primary text-light`}>
                                                                {loadingCreateNotification ? (
                                                                    <AiOutlineLoading3Quarters className="animate-spin transition-all duration-500 ease-linear" />
                                                                ) : (
                                                                    <MdPersonAddAlt1 className="text-xl" />
                                                                )}
                                                                <span className="font-semibold text-sm">
                                                                    Add Friend
                                                                </span>
                                                            </button>
                                                        )}

                                                    <div className="cursor-pointer hover:bg-gray-300 flex space-x-2 items-center p-2 rounded-md bg-gray-200 text-black">
                                                        <AiOutlineMessage className="text-xl" />
                                                        <span className="font-semibold text-sm">
                                                            Message
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-12 h-auto mt-[10rem] bg-secondary lg:py-6 py-0 space-x-6 lg:px-6 px-4  rounded-t-[2rem]">
                            {/* Intro */}
                            <div className="lg:block hidden lg:col-span-3 space-y-4">
                                <div className="p-4 bg-light rounded-xl">
                                    <span className="font-bold uppercase text-lg text-dark">
                                        Intro
                                    </span>
                                    <div className="flex-col space-y-5 my-4">
                                        {user?.getUserById.gender && (
                                            <div className="flex items-center space-x-2">
                                                <BiUser />
                                                <span>
                                                    {formatFirstUppercase(
                                                        user?.getUserById.gender
                                                    )}
                                                </span>
                                            </div>
                                        )}

                                        {user?.getUserById.birthday && (
                                            <div className="flex items-center space-x-2">
                                                <FaBirthdayCake />
                                                <span>
                                                    {moment(
                                                        user?.getUserById
                                                            .birthday,
                                                        'x'
                                                    ).format('DD MMMM YYYY')}
                                                </span>
                                            </div>
                                        )}
                                        {user?.getUserById.liveAt && (
                                            <div className="flex items-center space-x-2">
                                                <GoHome size={20} />
                                                <span>
                                                    {user?.getUserById.liveAt}
                                                </span>
                                            </div>
                                        )}

                                        {user?.getUserById.website && (
                                            <div className="flex items-center space-x-2">
                                                <GiEarthAfricaEurope
                                                    size={20}
                                                />
                                                <Link
                                                    target="_blank"
                                                    href={
                                                        user?.getUserById
                                                            .website
                                                    }>
                                                    <span className="hover:underline text-primary">
                                                        {
                                                            user?.getUserById
                                                                .website
                                                        }
                                                    </span>
                                                </Link>
                                            </div>
                                        )}

                                        {user?.getUserById.followers.length >
                                            0 && (
                                            <div className="flex items-center space-x-2">
                                                <TbUserSearch size={20} />
                                                <span>
                                                    {`${user?.getUserById.followers.length} Followers`}
                                                </span>
                                            </div>
                                        )}

                                        {user?.getUserById.followings.length >
                                            0 && (
                                            <div className="flex items-center space-x-3">
                                                <SlUserFollowing />
                                                <span>
                                                    {`${user?.getUserById.followings.length} Followings`}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex justify-around items-center space-x-2 py-4">
                                            <Link
                                                target="_blank"
                                                href={
                                                    user?.getUserById
                                                        .facebook ||
                                                    'https://www.facebook.com'
                                                }>
                                                <BsFacebook className="text-2xl hover:scale-125 transition-all duration-500  text-primary" />
                                            </Link>
                                            <Link
                                                target="_blank"
                                                href={
                                                    user?.getUserById.twitter ||
                                                    'https://twitter.com'
                                                }>
                                                <IoLogoTwitter className="text-2xl hover:scale-125 transition-all duration-500  text-primary" />
                                            </Link>
                                            <Link
                                                target="_blank"
                                                href={
                                                    user?.getUserById
                                                        .instagram ||
                                                    'https://www.instagram.com'
                                                }>
                                                <BsInstagram className="text-2xl hover:scale-125 transition-all duration-500  bg-gradient-to-tr from-[#f79402] via-[#f70a59] to-pink-[#f501c1] rounded-xl overflow-hidden text-white" />
                                            </Link>
                                            <Link
                                                target="_blank"
                                                href={
                                                    user?.getUserById
                                                        .linkedin ||
                                                    'https://www.linkedin.com'
                                                }>
                                                <AiFillLinkedin className="text-2xl hover:scale-125 transition-all duration-500  text-[#0A66C2]" />
                                            </Link>
                                        </div>
                                        {user?.getUserById.isMySelf && (
                                            <Link
                                                href="/setting"
                                                className="flex bg-secondary font-semibold text-dark justify-center items-center py-2 px-4 hover:bg-gray-200 cursor-pointer transition-all duration-500 rounded-lg">
                                                <span>Edit Details</span>
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                <div className="p-4 bg-light rounded-xl space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h1 className="font-bold text-dark">
                                            Friends
                                        </h1>
                                        <span className="text-sm underline text-primary cursor-pointer">
                                            See all friends
                                        </span>
                                    </div>
                                    <span className="font-semibold text-sm text-gray-400">{`${user?.getUserById.friends.length} friends`}</span>
                                    <div className="grid grid-cols-3 gap-2">
                                        {user?.getUserById.friends
                                            .slice(0, 9)
                                            .map((user: User) => (
                                                <div
                                                    key={user.id}
                                                    onMouseEnter={() =>
                                                        setState({
                                                            ...state,
                                                            mouseEnter: user.id,
                                                        })
                                                    }
                                                    onMouseLeave={() => {
                                                        setState({
                                                            ...state,
                                                            mouseEnter: '',
                                                        });
                                                    }}
                                                    className="group relative">
                                                    <Link
                                                        href={`/profile?id=${user.id}`}
                                                        className="flex flex-col space-x-2 space-y-1">
                                                        <Image
                                                            width={100}
                                                            height={100}
                                                            className="object-cover w-full !h-[120px] rounded-md"
                                                            src={user.image}
                                                            alt=""
                                                        />
                                                        <span className="font-semibold text-sm">
                                                            {user.name}
                                                        </span>
                                                    </Link>
                                                    {mouseEnter ===
                                                        user?.id && (
                                                        <CardUser
                                                            isFriend={
                                                                user?.friends?.some(
                                                                    (u: User) =>
                                                                        u.id ===
                                                                        session
                                                                            ?.user
                                                                            .id
                                                                )!
                                                            }
                                                            isMySelf={
                                                                user?.id ===
                                                                session?.user.id
                                                            }
                                                            isSendFriendRequest={user?.isSendAddFriend}
                                                            isReceiveFriendRequest={user?.isReceiveAddFriend}
                                                            isFollowing={user?.followers?.some(u => u.id === session?.user?.id)!}
                                                            isOnline={Boolean(users.find((u: SocketUser) => u.userId === user.id)?.isOnline)}
                                                            lastTime={users.find((u: SocketUser) => u.userId === user.id)?.lastTime || null}
                                                            user={user}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-6 col-span-12 space-y-6 lg:!mx-6 lg:my-0 my-6 !mx-0">
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
                                <div className="relative flex-col space-y-6">
                                    {loadingPost ? (
                                        <LoadingComponent />
                                    ) : (
                                        dataPost?.getUserById?.posts.map(
                                            (post: PostModel) => (
                                                <Post
                                                    key={post.id}
                                                    author={post.author!}
                                                    postId={post.id!}
                                                    content={post.content!}
                                                    files={post.files!}
                                                    viewer={post.viewer!}
                                                    likes={post.likes!}
                                                    comments={post.comments!}
                                                    countShares={
                                                        post?._count
                                                            ?.postShared!
                                                    }
                                                    countComment={
                                                        post?._count?.comments!
                                                    }
                                                    isLiked={
                                                        post?.likes?.some(
                                                            (like: User) =>
                                                                like.id ===
                                                                session?.user.id
                                                        )!
                                                    }
                                                    activity={post.activity}
                                                    updatedAt={post.updatedAt!}
                                                    postSharedOf={
                                                        post?.postSharedOf!
                                                    }
                                                />
                                            )
                                        )
                                    )}
                                </div>
                            </div>
                           
                        </div>
                    </div>
                )}
            </Layout>
        </Suspense>
    );
};

export default Profile;
