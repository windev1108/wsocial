import React, { memo, useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import { RiGitRepositoryPrivateFill, RiShareForwardLine } from 'react-icons/ri';
import {
    AiFillHeart,
    AiOutlineDelete,
    AiOutlineHeart,
    AiOutlineLoading3Quarters,
    AiOutlineShareAlt,
} from 'react-icons/ai';
import { BsThreeDots } from 'react-icons/bs';
import { FaRegComment, FaUserFriends } from 'react-icons/fa';
import { NextPage } from 'next';
import { Comment, File, Post, SocketUser, User } from '@/utils/types';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { MdPublic } from 'react-icons/md';
import { destroyMultiple, formatFirstUppercase } from '@/utils/constants';
import { useMutation } from '@apollo/client';
import POST_MUTATIONS from '@/graphql/operations/post';
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenFormSubmitPost, setShowLikers } from '@/redux/features/isSlice';
import FormComment from '../Input/FormComment';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import CardUser from '../Cards/CardUser';
import { RootState } from '@/redux/store';
import { useTranslation } from 'react-i18next';

interface PostProps {
    postId: string;
    author: User;
    content: string;
    files: File[];
    viewer: string;
    likes: User[];
    comments: Comment[];
    postSharedOf: Post | any;
    countComment: number;
    countShares: number;
    updatedAt: string;
    activity: string;
    isLiked: boolean;
}

const Post: NextPage<PostProps> = ({
    postId,
    author,
    content,
    files,
    viewer,
    likes,
    comments,
    postSharedOf,
    countShares,
    countComment,
    updatedAt,
    activity,
    isLiked,
}) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { users }: any = useSelector<RootState>((state) => state.session);
    const { socket }: any = useSelector<RootState>((state) => state.socket);
    const { data: session } = useSession();
    const [deletePost, { loading: loadingDelete }] = useMutation(
        POST_MUTATIONS.Mutations.deletePost
    );
    const [toggleLikePost, { loading: isLoadingToggle }] = useMutation(
        POST_MUTATIONS.Mutations.toggleLikePost
    );

    const [state, setState] = useState({
        isOpenFormComment: false,
    });
    const { isOpenFormComment } = state;

    useEffect(() => {
        router.locale === 'en' ? moment.locale('en') : moment.locale('vi');
    }, [router.locale]);

    const handleDeletePost = () => {
        try {
            deletePost({
                variables: {
                    id: postId,
                },
                refetchQueries: ['getPosts', 'getPostInProfile'],
                awaitRefetchQueries: true,
            });
            if (files.length > 0) {
                destroyMultiple(files);
            }
            socket.emit('updatePost');
        } catch (error: any) {
            toast.error(error.message);
        }
    };
    const handleToggleLike = async () => {
        try {
            const { errors } = await toggleLikePost({
                variables: {
                    postId,
                    isLiked,
                    authorId: author.id,
                },
                awaitRefetchQueries: true,
                refetchQueries: ['getPosts', 'getPostInProfile'],
            });

            if (errors) {
                toast.error('Something wrong!');
                return;
            }

            socket?.emit('updatePost');
            socket?.emit('updateNotification');
        } catch (error: any) {
            toast.error(error?.message as string);
        }
    };

    const handleOpenSharePost = () => {
        try {
            if (postSharedOf) {
                dispatch(
                    setOpenFormSubmitPost({
                        isOpen: true,
                        post: {
                            id: postSharedOf.id,
                            content: postSharedOf.content,
                            author: postSharedOf.author,
                            files: postSharedOf.files,
                            viewer: postSharedOf.viewer,
                            updatedAt: postSharedOf.updatedAt,
                            activity: postSharedOf.activity,
                        },
                    })
                );
            } else {
                dispatch(
                    setOpenFormSubmitPost({
                        isOpen: true,
                        post: {
                            id: postId,
                            content,
                            author,
                            files,
                            viewer,
                            activity,
                            updatedAt,
                        },
                    })
                );
            }
        } catch (error: any) {
            toast.error(error?.message as string);
        }
    };

    const handleToggleFormComment = useCallback(() => {
        setState({ ...state, isOpenFormComment: !isOpenFormComment });
    }, [isOpenFormComment]);

    return (
        <div className="bg-light flex-col gap-2 shadow-sm border-[1px] border-gray-200 rounded-lg h-auto overflow-hidden">
            <div className="flex gap-4 items-center justify-between p-4">
                <div className="flex space-x-4">
                    <div className="group relative">
                        <Link href={`/profile?id=${author.id}`}>
                            <Image
                                width={100}
                                height={100}
                                className="cursor-pointer object-cover w-10 h-10  rounded-full"
                                src={author.image}
                                alt=""
                            />
                        </Link>
                        <div className="group-hover:block hidden">
                            <CardUser
                                isFollowing={
                                    author?.followers?.some(
                                        (u) => u.id === session?.user?.id
                                    )!
                                }
                                isOnline={Boolean(
                                    users.find(
                                        (u: SocketUser) =>
                                            u.userId === author.id
                                    )?.isOnline
                                )}
                                isMySelf={author.id === session?.user?.id}
                                lastTime={
                                    users.find(
                                        (u: SocketUser) =>
                                            u.userId === author.id
                                    )?.lastTime || null
                                }
                                isFriend={
                                    author.friends?.some(
                                        (u) => u.id === session?.user?.id
                                    )!
                                }
                                user={author}
                            />
                        </div>
                    </div>
                    <div className="flex-col">
                        <div className="group relative">
                            <Link href={`/profile?id=${author.id}`}>
                                <h1 className="text-dark leading-2 lg:text-lg text-sm font-semibold cursor-pointer w-auto">
                                    {author.name}
                                    <span className="lg:inline-block inline mx-1 font-normal lg:text-base text-sm text-text">
                                        {author.gender === 'MALE' &&
                                            activity === 'UPDATE_AVATAR' &&
                                            t(
                                                'common:updated_his_profile_picture'
                                            )}
                                        {author.gender === 'FEMALE' &&
                                            activity === 'UPDATE_AVATAR' &&
                                            t(
                                                'common:updated_her_profile_picture'
                                            )}

                                        {author.gender === 'FEMALE' &&
                                            activity === 'UPDATE_BACKGROUND' &&
                                            t('common:updated_her_cover_photo')}
                                        {author.gender === 'MALE' &&
                                            activity === 'UPDATE_BACKGROUND' &&
                                            t('common:updated_his_cover_photo')}
                                    </span>
                                </h1>
                            </Link>
                            <div className="group-hover:block hidden">
                                <CardUser
                                    isFollowing={
                                        author?.followers?.some(
                                            (u) => u.id === session?.user?.id
                                        )!
                                    }
                                    isOnline={Boolean(
                                        users.find(
                                            (u: SocketUser) =>
                                                u.userId === author.id
                                        )?.isOnline
                                    )}
                                    isMySelf={author.id === session?.user?.id}
                                    lastTime={
                                        users.find(
                                            (u: SocketUser) =>
                                                u.userId === author.id
                                        )?.lastTime || null
                                    }
                                    isFriend={
                                        author.friends?.some(
                                            (u) => u.id === session?.user?.id
                                        )!
                                    }
                                    user={author}
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-500 text-[11px] font-semibold">
                                {moment(updatedAt, 'x').fromNow()}
                            </span>
                            <div className="relative group">
                                {viewer === 'FRIENDS' && <FaUserFriends />}
                                {viewer === 'PUBLIC' && <MdPublic />}
                                {viewer === 'PRIVATE' && (
                                    <RiGitRepositoryPrivateFill />
                                )}
                                <span className="first-letter:uppercase whitespace-nowrap group-hover:scale-100 duration-500 transition-all  origin-top-left scale-0 absolute top-[100%] left-[50%] bg-black bg-opacity-60 text-light rounded-md px-2 py-1 text-sm shadow-md">
                                    {viewer === 'FRIENDS' &&
                                        t('common:friends')}
                                    {viewer === 'PUBLIC' && t('common:public')}
                                    {viewer === 'PRIVATE' &&
                                        t('common:private')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative group hover:bg-secondary rounded-md p-1 z-[10]">
                    <BsThreeDots className="text-xl text-dark" />
                    <div className="group-hover:block rounded-lg absolute hidden top-[100%] right-0 bg-secondary shadow-md">
                        <button
                            onClick={handleOpenSharePost}
                            className="whitespace-nowrap flex space-x-2 items-center font-semibold cursor-pointer px-4 py-2 hover:bg-gray-200 rounded-t-lg">
                            <AiOutlineShareAlt className="text-[#ffab00]" />
                            <span>{t('common:share')}</span>
                        </button>
                        {session?.user.id === author.id &&
                            (loadingDelete ? (
                                <button
                                    disabled={loadingDelete}
                                    className="w-full whitespace-nowrap flex space-x-2 items-center font-semibold px-4 py-2 hover:bg-gray-200 rounded-b-lg cursor-not-allowed ">
                                    <AiOutlineLoading3Quarters className="animate-spin transition-all duration-500 ease-linear text-primary" />
                                    <span className="first-letter:uppercase">
                                        {t('common:delete')}
                                    </span>
                                </button>
                            ) : (
                                <button
                                    onClick={handleDeletePost}
                                    className="w-full whitespace-nowrap flex space-x-2 items-center font-semibold cursor-pointer px-4 py-2 hover:bg-gray-200 rounded-b-lg">
                                    <AiOutlineDelete className="text-red-400" />
                                    <span className="first-letter:uppercase">
                                        {t('common:delete')}
                                    </span>
                                </button>
                            ))}
                    </div>
                </div>
            </div>
            <div className="flex lg:px-4 lg:py-4 px-4 py-2">
                <span className="text-dark lg:text-base text-sm">
                    {content}
                </span>
            </div>

            <div className="h-h-auto">
                {activity === 'UPDATE_AVATAR' && (
                    <div className="relative w-full lg:h-[90%] h-[10rem]">
                        <div className="h-full w-full">
                            {author.background ? (
                                <Image
                                    src={author.background}
                                    width={1000}
                                    height={1000}
                                    alt=""
                                    className="h-1/2 w-full object-cover"
                                />
                            ) : (
                                <div className="h-1/2 w-full bg-gradient-to-t from-gray-200 to-light"></div>
                            )}
                        </div>
                        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] border-white border-[5px] overflow-hidden rounded-full lg:w-[30rem] w-[11rem] h-[11rem] lg:h-[20rem]">
                            <Link
                                href={`/post/${postId}`}
                                className="w-full h-full">
                                <Image
                                    src={files[0].url}
                                    width={1000}
                                    height={1000}
                                    alt=""
                                    className="w-full h-full object-fill"
                                />
                            </Link>
                        </div>
                    </div>
                )}

                {activity === 'UPDATE_BACKGROUND' && (
                    <div className="relative w-full h-[90%]">
                        <div className="h-full w-full">
                            <Link
                                href={`/post/${postId}`}
                                className="w-full h-full">
                                <Image
                                    src={author?.background!}
                                    width={1000}
                                    height={1000}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            </Link>
                        </div>
                    </div>
                )}

                {activity === 'CREATED_POST' && files?.length > 0 && (
                    <div
                        className={`${
                            files.length > 3
                                ? 'grid-cols-3 grid-rows-3'
                                : `grid-cols-${files.length} grid-rows-1`
                        } grid w-full gap-1 lg:h-[90%] h-auto`}>
                        {files.length > 4 ? (
                            <>
                                {files.slice(0, 3).map((file, index) =>
                                    file.type.includes('video') ? (
                                        <Link
                                            key={file.url}
                                            href={`/post/${postId}?q=${file.id}`}
                                            className={`${
                                                files.length >= 3 &&
                                                index === 0 &&
                                                'row-span-3 col-span-2'
                                            } w-full`}>
                                            <video
                                                className={`${
                                                    files.length >= 3 &&
                                                    index === 0 &&
                                                    'row-span-3 col-span-2'
                                                } ${
                                                    files.length === 1
                                                        ? 'object-contain h-auto'
                                                        : 'object-cover h-full'
                                                } w-full`}
                                                controls={index === 0}
                                                src={file.url}></video>
                                        </Link>
                                    ) : (
                                        <Link
                                            key={file.url}
                                            href={`/post/${postId}?q=${file.id}`}
                                            className={`${
                                                files.length >= 3 &&
                                                index === 0 &&
                                                'row-span-3 col-span-2'
                                            } w-full`}>
                                            <Image
                                                width={1000}
                                                height={1000}
                                                className={`${
                                                    files.length === 1
                                                        ? 'object-contain h-full'
                                                        : 'object-cover h-full '
                                                }w-full`}
                                                src={file.url}
                                                alt=""
                                            />
                                        </Link>
                                    )
                                )}
                                {files[3].type.includes('video') ? (
                                    <Link
                                        key={files[3].url}
                                        href={`/post/${postId}?q=${files[3].id}`}
                                        className={`w-full`}>
                                        <video
                                            className={` ${
                                                files.length === 1
                                                    ? 'object-contain  h-auto'
                                                    : 'object-cover h-full '
                                            }w-full`}
                                            src={files[3].url}></video>
                                    </Link>
                                ) : (
                                    <Link
                                        key={files[3].url}
                                        href={`/post/${postId}?q=${files[3].id}`}
                                        className={`w-full relative before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-[#11111160]`}>
                                        <Image
                                            width={1000}
                                            height={1000}
                                            className={`h-full object-cover w-full`}
                                            src={files[3].url}
                                            alt=""
                                        />
                                        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                                            <span className="font-semibold text-light lg:text-5xl text-3xl">{`+${
                                                files.slice(3).length
                                            }`}</span>
                                        </div>
                                    </Link>
                                )}
                            </>
                        ) : (
                            files.map((file, index) =>
                                file.type.includes('video') ? (
                                    <Link
                                        key={file.url}
                                        href={`/post/${postId}?q=${file.id}`}
                                        className={`${
                                            files.length >= 3 &&
                                            index === 0 &&
                                            'row-span-3 col-span-2'
                                        } w-full`}>
                                        <video
                                            className={`${
                                                files.length >= 3 &&
                                                index === 0 &&
                                                'row-span-3 col-span-2'
                                            } ${
                                                files.length === 1
                                                    ? 'object-contain h-full'
                                                    : 'object-cover h-full '
                                            }w-full`}
                                            controls={index === 0}
                                            src={file.url}></video>
                                    </Link>
                                ) : (
                                    <Link
                                        key={file.url}
                                        href={`/post/${postId}?q=${file.id}`}
                                        className={`${
                                            files.length >= 3 &&
                                            index === 0 &&
                                            'row-span-3 col-span-2'
                                        }  w-full`}>
                                        <Image
                                            width={1000}
                                            height={1000}
                                            className={`${
                                                files.length === 1
                                                    ? 'object-contain h-full'
                                                    : 'object-cover h-full '
                                            }w-full`}
                                            src={file.url}
                                            alt=""
                                        />
                                    </Link>
                                )
                            )
                        )}
                    </div>
                )}

                {activity === 'CREATED_POST' && postSharedOf && (
                    <div className="flex-col border rounded-xl mx-4 h-[90%]">
                        {postSharedOf?.files?.length! > 0 && (
                            <div
                                className={`${
                                    postSharedOf?.files?.length! > 3
                                        ? 'grid-cols-3 grid-rows-3 h-fit'
                                        : `grid-cols-${files.length} grid-rows-1 h-full`
                                } grid w-full gap-1 h-full`}>
                                {postSharedOf?.files?.length! > 4 ? (
                                    <>
                                        {postSharedOf?.files
                                            ?.slice(0, 3)
                                            .map((file: File, index: number) =>
                                                file.type.includes('video') ? (
                                                    <Link
                                                        key={file.url}
                                                        href={`/post/${postSharedOf.id}?q=${file.id}`}
                                                        className={`${
                                                            postSharedOf?.files
                                                                ?.length! >=
                                                                3 &&
                                                            index === 0 &&
                                                            'row-span-3 col-span-2'
                                                        } w-full`}>
                                                        <video
                                                            className={`${
                                                                postSharedOf
                                                                    ?.files
                                                                    ?.length! >=
                                                                    3 &&
                                                                index === 0 &&
                                                                'row-span-3 col-span-2'
                                                            } ${
                                                                postSharedOf
                                                                    ?.files
                                                                    ?.length! ===
                                                                1
                                                                    ? 'object-contain  h-full'
                                                                    : 'object-cover h-full'
                                                            } w-full`}
                                                            controls={
                                                                index === 0
                                                            }
                                                            src={
                                                                file.url
                                                            }></video>
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        key={file.url}
                                                        href={`/post/${postSharedOf.id}?q=${file.id}`}
                                                        className={`${
                                                            postSharedOf?.files
                                                                ?.length! >=
                                                                3 &&
                                                            index === 0 &&
                                                            'row-span-3 col-span-2'
                                                        }  w-full`}>
                                                        <Image
                                                            className={`${
                                                                postSharedOf
                                                                    ?.files
                                                                    ?.length! ===
                                                                1
                                                                    ? 'object-contain  h-full'
                                                                    : 'object-cover h-full '
                                                            }w-full`}
                                                            width={100}
                                                            height={100}
                                                            src={file.url}
                                                            alt=""
                                                        />
                                                    </Link>
                                                )
                                            )}
                                        {postSharedOf?.files[3].type.includes(
                                            'video'
                                        ) ? (
                                            <Link
                                                key={postSharedOf.files[3].url}
                                                href={`/post/${postSharedOf.id}?q=${postSharedOf?.files[3].id}`}
                                                className={`w-full`}>
                                                <video
                                                    className={` ${
                                                        postSharedOf?.files
                                                            .length === 1
                                                            ? 'object-contain  h-auto'
                                                            : 'object-cover h-full '
                                                    }w-full`}
                                                    src={
                                                        postSharedOf?.files[3]
                                                            .url
                                                    }></video>
                                            </Link>
                                        ) : (
                                            <Link
                                                key={postSharedOf?.files[3].url}
                                                href={`/post/${postSharedOf.id}?q=${postSharedOf?.files[3].id}`}
                                                className={`w-full relative before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-[#11111160]`}>
                                                <Image
                                                    width={100}
                                                    height={100}
                                                    className={`object-cover w-full h-auto`}
                                                    src={
                                                        postSharedOf?.files[3]
                                                            .url
                                                    }
                                                    alt=""
                                                />
                                                <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                                                    <span className="font-semibold text-light lg:text-5xl text-3xl">{`+${
                                                        postSharedOf?.files.slice(
                                                            3
                                                        ).length
                                                    }`}</span>
                                                </div>
                                            </Link>
                                        )}
                                    </>
                                ) : (
                                    postSharedOf?.files.map(
                                        (file: File, index: number) =>
                                            file.type.includes('video') ? (
                                                <Link
                                                    key={file.url}
                                                    href={`/post/${postId}?q=${file.id}`}
                                                    className={`${
                                                        postSharedOf?.files
                                                            .length >= 3 &&
                                                        index === 0 &&
                                                        'row-span-3 col-span-2'
                                                    } w-full`}>
                                                    <video
                                                        className={`${
                                                            postSharedOf?.files
                                                                .length >= 3 &&
                                                            index === 0 &&
                                                            'row-span-3 col-span-2'
                                                        } ${
                                                            postSharedOf?.files
                                                                .length === 1
                                                                ? 'object-contain h-[35rem]'
                                                                : 'object-cover h-full '
                                                        }w-full`}
                                                        controls={index === 0}
                                                        src={file.url}></video>
                                                </Link>
                                            ) : (
                                                <Link
                                                    key={file.url}
                                                    href={`/post/${postId}?q=${file.id}`}
                                                    className={`${
                                                        postSharedOf?.files
                                                            .length >= 3 &&
                                                        index === 0 &&
                                                        'row-span-3 col-span-2'
                                                    } w-full`}>
                                                    <Image
                                                        width={100}
                                                        height={100}
                                                        className={`${
                                                            postSharedOf?.files
                                                                .length === 1
                                                                ? 'object-contain h-[35rem]'
                                                                : 'object-cover h-auto '
                                                        }w-full`}
                                                        src={file.url}
                                                        alt=""
                                                    />
                                                </Link>
                                            )
                                    )
                                )}
                            </div>
                        )}

                        <div className="flex gap-4 items-center justify-between p-4">
                            <div className="flex space-x-4">
                                <Link
                                    href={`/profile?id=${postSharedOf.author.id}`}>
                                    <Image
                                        width={100}
                                        height={100}
                                        className="cursor-pointer object-cover w-10 h-10  rounded-full"
                                        src={postSharedOf.author.image}
                                        alt=""
                                    />
                                </Link>
                                <div className="flex-col">
                                    <Link
                                        href={`/profile?id=${postSharedOf.author.id}`}>
                                        <h1 className="text-dark leading-2 text-lg font-semibold cursor-pointer">
                                            {postSharedOf.author.name}
                                        </h1>
                                    </Link>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-500 text-[11px] font-semibold">
                                            {moment(
                                                postSharedOf.updatedAt,
                                                'x'
                                            ).fromNow()}
                                        </span>
                                        <div className="relative group">
                                            {postSharedOf.viewer ===
                                                'FRIENDS' && <FaUserFriends />}
                                            {postSharedOf.viewer ===
                                                'PUBLIC' && <MdPublic />}
                                            {postSharedOf.viewer ===
                                                'PRIVATE' && (
                                                <RiGitRepositoryPrivateFill />
                                            )}
                                            <span className="first-letter:uppercase whitespace-nowrap group-hover:scale-100 duration-500 transition-all  origin-top-left scale-0 absolute top-[100%] left-[50%] bg-black bg-opacity-60 text-light rounded-md px-2 py-1 text-sm shadow-md">
                                                {postSharedOf.viewer ===
                                                    'FRIENDS' &&
                                                    t('common:friends')}

                                                {postSharedOf.viewer ===
                                                    'PUBLIC' &&
                                                    t('common:public')}
                                                {postSharedOf.viewer ===
                                                    'PRIVATE' &&
                                                    t('common:private')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex lg:px-4 lg:py-4 py-2 px-4">
                            <span className="text-dark lg:text-base text-sm">
                                {postSharedOf?.content}
                            </span>
                        </div>
                    </div>
                )}

                <div className="flex justify-between p-4">
                    <div
                        onClick={() =>
                            dispatch(
                                setShowLikers({ likers: likes, isOpen: true })
                            )
                        }
                        className="group relative flex cursor-pointer">
                        <div className="group-hover:scale-100 group-hover:opacity-100  duration-500 transition-all ease-in-out origin-bottom scale-0 opacity-0 absolute -top-[100%] right-0% bg-black bg-opacity-70 px-2 py-1 shadow-md rounded-md">
                            <span className="text-light text-sm whitespace-nowrap ">
                                The people liked
                            </span>
                        </div>
                        {likes?.slice(0, 3).map((like: any, index: number) =>
                            index === 0 ? (
                                <div
                                    key={like.id}
                                    className={`border-light z-[${index}]  w-8 h-8 border-[3px]  rounded-full overflow-hidden`}>
                                    <Image
                                        width={100}
                                        height={100}
                                        className="object-cover w-full h-full"
                                        src={like.image}
                                        alt=""
                                    />
                                </div>
                            ) : (
                                <div
                                    key={like.id}
                                    className={`border-light z-[${
                                        index * 3
                                    }] -translate-x-${
                                        index * 3
                                    } w-8 h-8 border-[3px] rounded-full overflow-hidden`}>
                                    <Image
                                        width={100}
                                        height={100}
                                        className={`object-cover w-full h-full`}
                                        src={like.image}
                                        alt=""
                                    />
                                </div>
                            )
                        )}
                        {likes?.slice(3).length > 0 && (
                            <div className="border-light bg-gray-400 z-[4] -translate-x-9 flex justify-center items-center  rounded-full border-[2px] w-8 h-8 overflow-hidden">
                                <span className="text-light">{`+${
                                    likes?.slice(3).length
                                }`}</span>
                            </div>
                        )}
                    </div>
                    <div className="lowercase flex space-x-3 text-gray-500 lg:text-base text-sm">
                        <span>{`${countComment} ${t('common:comment')}`}</span>
                        <span>{`${countShares} ${t('common:share')}`}</span>
                    </div>
                </div>

                <div className="h-[10%] border-gray-300 grid grid-cols-3 border-t-[1px] p-2">
                    {isLoadingToggle ? (
                        <button
                            disabled={true}
                            className="cursor-not-allowed rounded-xl py-2 flex justify-center items-center space-x-2">
                            <AiOutlineLoading3Quarters className="animate-spin transition-all duration-500 ease-linear text-primary" />
                        </button>
                    ) : (
                        <button
                            onClick={handleToggleLike}
                            className={`${
                                isLiked ? 'text-[#ed4956]' : 'text-text'
                            }  hover:bg-gray-200 cursor-pointer rounded-xl py-2 flex justify-center items-center space-x-2 lg:text-base text-sm`}>
                            {isLiked ? (
                                <AiFillHeart className="lg:text-2xl text-xl" />
                            ) : (
                                <AiOutlineHeart className="lg:text-2xl text-xl" />
                            )}
                            <span>{t('common:like')}</span>
                        </button>
                    )}
                    <div
                        onClick={handleToggleFormComment}
                        className="first-letter:uppercase text-text hover:bg-gray-200 cursor-pointer rounded-xl py-2 flex justify-center items-center space-x-2 lg:text-base text-sm">
                        <FaRegComment className="lg:text-2xl text-lg" />
                        <span>{t('common:comment')}</span>
                    </div>
                    <button
                        onClick={handleOpenSharePost}
                        className="first-letter:uppercase text-text hover:bg-gray-200 cursor-pointer rounded-xl py-2 flex justify-center items-center space-x-2 lg:text-base text-sm">
                        <RiShareForwardLine className="lg:text-xl text-xl" />
                        <span>{t('common:share')}</span>
                    </button>
                </div>
            </div>
            {isOpenFormComment && (
                <FormComment
                    comments={comments}
                    postId={postId}
                    authorId={author.id}
                />
            )}
        </div>
    );
};

export default memo(Post);
