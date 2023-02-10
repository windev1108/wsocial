import POST_MUTATIONS from '@/graphql/operations/post';
import USER_OPERATIONS from '@/graphql/operations/user';
import { setOpenFormSubmitPost } from '@/redux/features/isSlice';
import { RootState } from '@/redux/store';
import {
    Viewers,
    formatFirstUppercase,
    uploadMultiple,
} from '@/utils/constants';
import { File } from '@/utils/types';
import { useMutation } from '@apollo/client';
import moment from 'moment';
import { NextPage } from 'next';
import Image from 'next/image';
import React, { FormEvent, useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
    AiFillCaretDown,
    AiOutlineLoading3Quarters,
    AiOutlinePicture,
} from 'react-icons/ai';
import { BsEmojiLaughing } from 'react-icons/bs';
import { FaUserFriends, FaUserTag } from 'react-icons/fa';
import { GrFormClose } from 'react-icons/gr';
import { MdLocationPin, MdPublic } from 'react-icons/md';
import { RiGitRepositoryPrivateFill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';

interface State {
    content: string;
    files: any[];
    blobFiles: any[];
    viewerOption: string;
    isLoading: boolean;
    showOpenModalPost: boolean;
    showOptionViewer: boolean;
}

const FormSubmitPost: NextPage = () => {
    const dispatch = useDispatch();
    const { socket } : any = useSelector<RootState>(state => state.socket)
    const { showFormSubmitPost }: any = useSelector<RootState>(
        (state) => state.is
    );
    const { user } : any = useSelector<RootState>(state => state.session)

    const [state, setState] = useState<State>({
        content: '',
        viewerOption: 'Public',
        blobFiles: [],
        files: [],
        isLoading: false,
        showOpenModalPost: false,
        showOptionViewer: false,
    });
    const {
        content,
        blobFiles,
        files,
        viewerOption,
        showOptionViewer,
        isLoading,
    } = state;
    const inputRef = useRef<any>();
    const [createPost, { error, loading }] = useMutation(
        POST_MUTATIONS.Mutations.createPost
    );
    const [updateUser, { loading: loadingUpdateUser }] = useMutation(
        USER_OPERATIONS.Mutations.updateUser
    );

    const handleCloseFormPostSubmit = () => {
        dispatch(
            setOpenFormSubmitPost({
                isOpen: false,
                post: {},
            })
        );
    };

    useEffect(() => {
        inputRef.current.focus();

        return () => {
            setState({
                ...state,
                viewerOption: 'Public',
                content: '',
                blobFiles: [],
                files: [],
            });
        };
    }, []);
    const onSubmitPost = async (e: FormEvent) => {
        e.preventDefault();
        try {
            if (
                !content &&
                !showFormSubmitPost.post &&
                !showFormSubmitPost.avatar &&
                !showFormSubmitPost.background
            ) {
                toast.error('Please enter your post content', {
                    duration: 2000,
                });
                return;
            }

            if (error) {
                toast.error(error.message);
                return;
            }

            if (files.length > 0) {
                setState({ ...state, isLoading: true });
                const urls = await uploadMultiple(files);
                await createPost({
                    variables: {
                        post: {
                            viewer: viewerOption.toUpperCase(),
                            files: urls,
                            content,
                            activity: 'CREATED_POST',
                        },
                    },
                    refetchQueries: ['getPosts', 'getPostInProfile'],
                    awaitRefetchQueries: true,
                });
                setState({ ...state, isLoading: false });
                handleCloseFormPostSubmit();
                toast.success('Post created success');
            } else {
                if (showFormSubmitPost.post) {
                    await createPost({
                        variables: {
                            post: {
                                viewer: viewerOption.toUpperCase(),
                                content,
                                postIdShared: showFormSubmitPost.post.id,
                                activity: 'CREATED_POST',
                            },
                        },
                        refetchQueries: ['getPosts', 'getUserById'],
                        awaitRefetchQueries: true,
                    });
                } else {
                    if (showFormSubmitPost?.avatar || showFormSubmitPost?.background) {
                        const urls = await uploadMultiple([
                            showFormSubmitPost?.avatar?.file ?? showFormSubmitPost?.background?.file,
                        ]);
                        if (showFormSubmitPost?.avatar?.file) {
                            await updateUser({
                                variables: {
                                    user: {
                                        image: urls[0].url
                                    }
                                },
                            });
                        } else {
                            await updateUser({
                                variables: {
                                    user: {
                                        background: urls[0].url
                                    }
                                },
                            });
                        }
                        await createPost({
                            variables: {
                                post: {
                                    viewer: viewerOption.toUpperCase(),
                                    content,
                                    activity: showFormSubmitPost?.avatar ? 'UPDATE_AVATAR' : 'UPDATE_BACKGROUND',
                                    files: [{ publicId: urls[0].publicId, url: urls[0].url, type: urls[0].type }]
                                },
                            },
                            refetchQueries: [
                                'getPosts',
                                'getPostInProfile',
                                'getMyInfo',
                            ],
                            awaitRefetchQueries: true,
                        });
                        toast.success('Update profile picture success');
                        handleCloseFormPostSubmit();
                        return
                    }
                    await createPost({
                        variables: {
                            post: {
                                viewer: viewerOption.toUpperCase(),
                                content,
                                activity: 'CREATED_POST',
                            },
                        },
                        refetchQueries: [
                            'getPosts',
                            'getPostInProfile',
                            'getMyInfo',
                        ],
                        awaitRefetchQueries: true,
                    });
                }
                toast.success('Post created success');
                handleCloseFormPostSubmit();
            }

            socket.emit("updatePost")
        } catch (err: any) {
            toast.success(err.message);
        }
    };

    const onFileChange = (e: any) => {
        let files = e.target.files;

        if (files.length > 100) {
            toast.error("Can't choose more than 100 files", {
                duration: 1000,
            });
        } else {
            const blobs = Array.from(files).map((file: any) => {
                return {
                    url: URL.createObjectURL(file),
                    type: file.type,
                };
            });
            setState({ ...state, blobFiles: blobs, files: files });
        }
    };


    return (
        <>
            <div
                onClick={handleCloseFormPostSubmit}
                className="fixed top-0 left-0 bottom-0 right-0 z-[100] bg-black bg-opacity-60"></div>
            <div className="fixed left-[50%] z-[101] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-light shadow-md  w-[95vw] max-h-[90vh] lg:w-[600px] lg:max-h-[50rem]">
                <button
                    onClick={handleCloseFormPostSubmit}
                    className="absolute top-1 right-1 hover:bg-gray-100 rounded-full p-2 cursor-pointer">
                    <GrFormClose size={25} />
                </button>
                <h1 className="text-center p-3">Create Post</h1>
                <div className="border"></div>
                <form
                    onSubmit={onSubmitPost}
                    className="p-6 flex flex-col space-y-2 max-h-[80vh]">
                    <div className="flex space-x-3 items-center">
                        <Image
                            width={100}
                            height={100}
                            className="object-cover w-10 h-10 rounded-full"
                            src={user?.image}
                            alt=""
                        />
                        <div className="flex flex-col space-y-2">
                            <span className="text-dark font-semibold leading-3 space-x-2 lg:text-base text-sm">
                                {user?.name}
                                {showFormSubmitPost.avatar && (
                                    <span className="inline-block mx-1 text-text font-light">
                                        updated profile picture
                                    </span>
                                )}
                                {showFormSubmitPost.background && (
                                    <span className="inline-block mx-1 text-text font-light">
                                        updated cover photo
                                    </span>
                                )}

                            </span>
                            <div className="relative w-24">
                                <div
                                    onClick={() =>
                                        setState({
                                            ...state,
                                            showOptionViewer: !showOptionViewer,
                                        })
                                    }
                                    className="flex items-center space-x-2 cursor-pointer bg-gray-200 rounded-md px-2 py-1">
                                    {viewerOption === 'Friends' && (
                                        <FaUserFriends />
                                    )}
                                    {viewerOption === 'Public' && <MdPublic />}
                                    {viewerOption === 'Private' && (
                                        <RiGitRepositoryPrivateFill />
                                    )}
                                    <span className="lg:text-sm text-xs font-semibold">
                                        {viewerOption}
                                    </span>
                                    <AiFillCaretDown />
                                </div>
                                {showOptionViewer && (
                                    <div className="absolute top-[105%] left-0 right-0 !m-0 transition-all duration-500 ease-in-out flex flex-col ">
                                        {Viewers.filter(
                                            (v) => v !== viewerOption
                                        ).map((viewer) => (
                                            <div
                                                onClick={() =>
                                                    setState({
                                                        ...state,
                                                        viewerOption: viewer,
                                                        showOptionViewer: false,
                                                    })
                                                }
                                                key={viewer}
                                                className="relative flex items-center space-x-2 cursor-pointer bg-gray-200 rounded-md !m- px-2 py-1">
                                                {viewer === 'Friends' && (
                                                    <FaUserFriends />
                                                )}
                                                {viewer === 'Public' && (
                                                    <MdPublic />
                                                )}
                                                {viewer === 'Private' && (
                                                    <RiGitRepositoryPrivateFill />
                                                )}
                                                <span className="lg:text-sm text-xs font-semibold">
                                                    {viewer}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    

                    <div className="overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <div className="flex flex-col">
                        <textarea
                            disabled={loading || isLoading}
                            ref={inputRef}
                            value={content}
                            onChange={(e) =>
                                setState({ ...state, content: e.target.value })
                            }
                            className="outline-none lg:max-h-20 max-h-10 h-full lg:text-base text-sm"
                            placeholder={`${user?.name}, ${showFormSubmitPost.avatar || showFormSubmitPost.background
                                ? 'write a caption?'
                                : 'what are you thinking?'
                                }`}
                            name=""
                            id=""
                            cols={30}
                            rows={5}></textarea>

                  {showFormSubmitPost.avatar && (
                            <div className="rounded-lg flex-col mb-2 h-auto">
                                <Image
                                    width={100}
                                    height={100}
                                    className="w-full lg:h-[25rem] h-full object-contain "
                                    src={showFormSubmitPost.avatar.blobFile.url}
                                    alt=""
                                />
                            </div>
                        )}

                        {showFormSubmitPost.background &&
                            <div className="rounded-lg flex-col mb-2 h-auto">
                                <Image
                                    width={100}
                                    height={100}
                                    className="w-full lg:h-[25rem] h-full object-contain "
                                    src={showFormSubmitPost.background.blobFile.url}
                                    alt=""
                                />
                            </div>
                        }
                        {showFormSubmitPost.post ? (
                            <div className="border rounded-lg flex-col mb-2 h-auto">
                                {showFormSubmitPost.post.files?.length > 0 && (
                                    <div
                                        className={`${showFormSubmitPost.post.files
                                            .length > 3
                                            ? 'grid-cols-3 grid-rows-3'
                                            : `grid-cols-${showFormSubmitPost.post.files.length} grid-rows-1`
                                            } grid w-full gap-1 h-full`}>
                                        {showFormSubmitPost.post.files.length >
                                            4 ? (
                                            <>
                                                {showFormSubmitPost.post.files
                                                    .slice(0, 3)
                                                    .map(
                                                        (
                                                            file: File,
                                                            index: number
                                                        ) =>
                                                            file.type.includes(
                                                                'video'
                                                            ) ? (
                                                                <div
                                                                    key={
                                                                        file.url
                                                                    }
                                                                    className={`${showFormSubmitPost
                                                                        .post
                                                                        .files
                                                                        .length >=
                                                                        3 &&
                                                                        index ===
                                                                        0 &&
                                                                        'row-span-3 col-span-2'
                                                                        } w-full`}>
                                                                    <video
                                                                        className={`${showFormSubmitPost
                                                                            .post
                                                                            .files
                                                                            .length >=
                                                                            3 &&
                                                                            index ===
                                                                            0 &&
                                                                            'row-span-3 col-span-2'
                                                                            } ${showFormSubmitPost
                                                                                .post
                                                                                .files
                                                                                .length ===
                                                                                1
                                                                                ? 'object-contain h-[35rem]'
                                                                                : 'object-cover h-full'
                                                                            } w-full`}
                                                                        controls={
                                                                            index ===
                                                                            0
                                                                        }
                                                                        src={
                                                                            file.url
                                                                        }></video>
                                                                </div>
                                                            ) : (
                                                                <div
                                                                    key={
                                                                        file.url
                                                                    }
                                                                    className={`${showFormSubmitPost
                                                                        .post
                                                                        .files
                                                                        .length >=
                                                                        3 &&
                                                                        index ===
                                                                        0 &&
                                                                        'row-span-3 col-span-2'
                                                                        }  w-full`}>
                                                                    <Image
                                                                        width={1000}
                                                                        height={1000}
                                                                        className={`${showFormSubmitPost
                                                                            .post
                                                                            .files
                                                                            .length ===
                                                                            1
                                                                            ? 'object-contain h-[35rem]'
                                                                            : 'object-cover h-full '
                                                                            } w-full`}
                                                                        src={
                                                                            file.url
                                                                        }
                                                                        alt=""
                                                                    />
                                                                </div>
                                                            )
                                                    )}
                                                {showFormSubmitPost.post.files[3].type.includes(
                                                    'video'
                                                ) ? (
                                                    <div
                                                        key={
                                                            showFormSubmitPost
                                                                .post.files[3]
                                                                .url
                                                        }
                                                        className={`w-full`}>
                                                        <video
                                                            className={` ${showFormSubmitPost
                                                                .post.files
                                                                .length ===
                                                                1
                                                                ? 'object-contain h-[35rem]'
                                                                : 'object-cover h-full '
                                                                }w-full`}
                                                            src={
                                                                showFormSubmitPost
                                                                    .post
                                                                    .files[3]
                                                                    .url
                                                            }></video>
                                                    </div>
                                                ) : (
                                                    <div
                                                        key={
                                                            showFormSubmitPost
                                                                .post.files[3]
                                                                .url
                                                        }
                                                        className={`w-full relative before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-[#11111160]`}>
                                                        <Image
                                                            width={1000}
                                                            height={1000}
                                                            className={`${showFormSubmitPost
                                                                .post
                                                                .files
                                                                .length ===
                                                                1
                                                                ? 'object-contain h-[25rem]'
                                                                : 'object-cover h-full '
                                                                } w-full`}
                                                            src={
                                                                showFormSubmitPost
                                                                    .post
                                                                    .files[3]
                                                                    .url
                                                            }
                                                            alt=""
                                                        />
                                                        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                                                            <span className="font-semibold text-light lg:text-5xl text-3xl">{`+${showFormSubmitPost.post.files.slice(
                                                                3
                                                            ).length
                                                                }`}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            showFormSubmitPost.post.files.map(
                                                (file: File, index: number) =>
                                                    file.type.includes(
                                                        'video'
                                                    ) ? (
                                                        <div
                                                            key={file.url}
                                                            className={`${showFormSubmitPost
                                                                .post.files
                                                                .length >=
                                                                3 &&
                                                                index === 0 &&
                                                                'row-span-3 col-span-2'
                                                                } w-full`}>
                                                            <video
                                                                className={`${showFormSubmitPost
                                                                    .post
                                                                    .files
                                                                    .length >=
                                                                    3 &&
                                                                    index ===
                                                                    0 &&
                                                                    'row-span-3 col-span-2'
                                                                    } ${showFormSubmitPost
                                                                        .post
                                                                        .files
                                                                        .length ===
                                                                        1
                                                                        ? 'object-contain h-[35rem]'
                                                                        : 'object-cover h-full '
                                                                    }w-full`}
                                                                controls={
                                                                    index === 0
                                                                }
                                                                src={
                                                                    file.url
                                                                }></video>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            key={file.url}
                                                            className={`${showFormSubmitPost
                                                                .post.files
                                                                .length >=
                                                                3 &&
                                                                index === 0 &&
                                                                'row-span-3 col-span-2'
                                                                }  w-full`}>
                                                            <Image
                                                                width={1000}
                                                                height={1000}
                                                                className={`${showFormSubmitPost
                                                                    .post
                                                                    .files
                                                                    .length ===
                                                                    1
                                                                    ? 'object-contain h-[25rem]'
                                                                    : 'object-cover h-full '
                                                                    } w-full`}
                                                                src={file.url}
                                                                alt=""
                                                            />
                                                        </div>
                                                    )
                                            )
                                        )}
                                    </div>
                                )}
                                <div className="flex gap-4 items-center justify-between p-4">
                                    <div className="flex space-x-4">
                                        <div>
                                            <img
                                                className="cursor-pointer object-cover w-10 h-10  rounded-full"
                                                src={
                                                    showFormSubmitPost.post
                                                        .author.image
                                                }
                                                alt=""
                                            />
                                        </div>
                                        <div className="flex-col">
                                            <div>
                                                <h1 className="text-dark leading-2 lg:text-lg text-sm font-semibold cursor-pointer">
                                                    {
                                                        showFormSubmitPost.post
                                                            .author.name
                                                    }
                                                    {showFormSubmitPost.post?.activity !== 'CREATED_POST' && (
                                                        <span className="inline-block mx-1 font-normal text-base text-text">{`updated ${showFormSubmitPost.post?.author.gender === 'FEMALE'
                                                            ? 'her'
                                                            : 'his'
                                                            } ${showFormSubmitPost.post?.activity === 'UPDATE_AVATAR' ? 'profile picture' : 'cover photo'}
                                  `}</span>
                                                    )}
                                                </h1>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-gray-500 text-[11px] font-semibold">
                                                    {moment(
                                                        showFormSubmitPost.post
                                                            .updatedAt,
                                                        'x'
                                                    ).fromNow()}
                                                </span>
                                                <div className="relative group">
                                                    {showFormSubmitPost.post
                                                        .viewer ===
                                                        'FRIENDS' && (
                                                            <FaUserFriends />
                                                        )}
                                                    {showFormSubmitPost.post
                                                        .viewer ===
                                                        'PUBLIC' && (
                                                            <MdPublic />
                                                        )}
                                                    {showFormSubmitPost.post
                                                        .viewer ===
                                                        'PRIVATE' && (
                                                            <RiGitRepositoryPrivateFill />
                                                        )}
                                                    <span className="group-hover:scale-100 duration-500 transition-all  origin-top-left scale-0 absolute top-[100%] left-[50%] bg-black bg-opacity-60 text-light rounded-md px-2 py-1 text-sm shadow-md">
                                                        {formatFirstUppercase(
                                                            showFormSubmitPost
                                                                .post.viewer
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex lg:py-4 lg:px-4 px-4 py-2">
                                    <span className="text-dark lg:text-base text-sm">
                                        {showFormSubmitPost.post.content}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <>
                                {blobFiles?.length > 0 && (
                                    <div
                                        className={`${blobFiles.length > 3
                                            ? 'grid-cols-3 grid-rows-3'
                                            : `grid-cols-${blobFiles.length} grid-rows-1`
                                            } grid w-full gap-1 overflow-y-scroll h-auto max-h-[20rem] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100`}>
                                        {blobFiles.length > 4 ? (
                                            <>
                                                {blobFiles
                                                    .slice(0, 3)
                                                    .map((file, index) =>
                                                        file.type.includes(
                                                            'video'
                                                        ) ? (
                                                            <div
                                                                key={file.url}
                                                                className={`${blobFiles.length >=
                                                                    3 &&
                                                                    index ===
                                                                    0 &&
                                                                    'row-span-3 col-span-2'
                                                                    } w-full`}>
                                                                <video
                                                                    className={`${blobFiles.length >=
                                                                        3 &&
                                                                        index ===
                                                                        0 &&
                                                                        'row-span-3 col-span-2'
                                                                        } ${blobFiles.length ===
                                                                            1
                                                                            ? 'object-contain h-[35rem]'
                                                                            : 'object-cover h-full'
                                                                        } w-full`}
                                                                    controls={
                                                                        index ===
                                                                        0
                                                                    }
                                                                    src={
                                                                        file.url
                                                                    }></video>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                className={`${blobFiles.length >=
                                                                    3 &&
                                                                    index ===
                                                                    0 &&
                                                                    'row-span-3 col-span-2'
                                                                    } w-full`}>
                                                                <img
                                                                    className={`${blobFiles.length ===
                                                                        1
                                                                        ? 'object-contain h-[35rem]'
                                                                        : 'object-cover h-full '
                                                                        }w-full`}
                                                                    src={
                                                                        file.url
                                                                    }
                                                                    alt=""
                                                                />
                                                            </div>
                                                        )
                                                    )}
                                                {blobFiles[3].type.includes(
                                                    'video'
                                                ) ? (
                                                    <div
                                                        key={blobFiles[3].url}
                                                        className={` w-full`}>
                                                        <video
                                                            className={` ${blobFiles.length ===
                                                                1
                                                                ? 'object-contain h-[35rem]'
                                                                : 'object-cover h-full '
                                                                }w-full`}
                                                            src={
                                                                blobFiles[3].url
                                                            }></video>
                                                    </div>
                                                ) : (
                                                    <div
                                                        key={blobFiles[3].url}
                                                        className={`w-full relative before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-[#11111160]`}>
                                                        <img
                                                            className={`h-full object-cover w-full`}
                                                            src={
                                                                blobFiles[3].url
                                                            }
                                                            alt=""
                                                        />
                                                        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                                                            <span className="font-semibold text-light lg:text-5xl text-3xl">{`+${blobFiles.slice(
                                                                3
                                                            ).length
                                                                }`}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            blobFiles.map((file, index) =>
                                                file.type.includes('video') ? (
                                                    <div
                                                        key={file.url}
                                                        className={`${blobFiles.length >=
                                                            3 &&
                                                            index === 0 &&
                                                            'row-span-3 col-span-2'
                                                            } w-full`}>
                                                        <video
                                                            className={`${blobFiles.length >=
                                                                3 &&
                                                                index === 0 &&
                                                                'row-span-3 col-span-2'
                                                                } ${blobFiles.length ===
                                                                    1
                                                                    ? 'object-contain h-[35rem]'
                                                                    : 'object-cover h-full '
                                                                } w-full`}
                                                            controls={
                                                                index === 0
                                                            }
                                                            src={
                                                                file.url
                                                            }></video>
                                                    </div>
                                                ) : (
                                                    <div
                                                        key={file.url}
                                                        className={`${blobFiles.length >=
                                                            3 &&
                                                            index === 0 &&
                                                            'row-span-3 col-span-2'
                                                            } w-full`}>
                                                        <img
                                                            className={`${blobFiles.length ===
                                                                1
                                                                ? 'object-contain h-[35rem]'
                                                                : 'object-cover h-full '
                                                                }w-full`}
                                                            src={file.url}
                                                            alt=""
                                                        />
                                                    </div>
                                                )
                                            )
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                    </div>
                    </div>

                    <div className="flex px-4 py-2 w-full rounded-md border ">
                        <div className="w-1/2">
                            <span className="lg:text-base text-sm">Add your post</span>
                        </div>
                        <div className="w-1/2 flex justify-around space-x-2 items-center">
                            <label htmlFor="postFiles" onChange={onFileChange}>
                                <input
                                    id="postFiles"
                                    multiple
                                    hidden
                                    type="file"
                                    disabled={showFormSubmitPost.post || showFormSubmitPost.avatar}
                                />
                                <AiOutlinePicture
                                    className={`${showFormSubmitPost.post || showFormSubmitPost.avatar
                                        ? 'cursor-not-allowed text-text'
                                        : 'cursor-pointer text-primary'
                                        }  text-lg`}
                                />
                            </label>
                            <FaUserTag className="text-lg" />
                            <BsEmojiLaughing className="text-lg" />
                            <MdLocationPin className="text-lg" />
                        </div>
                    </div>

                    <button
                        disabled={loading || isLoading || loadingUpdateUser}
                        type="submit"
                        className={`${loading || isLoading || loadingUpdateUser
                            ? 'cursor-not-allowed'
                            : 'cursor-pointer'
                            } py-2 flex w-full bg-primary justify-center rounded-md hover:bg-opacity-70 text-light`}>
                        {loading || isLoading || loadingUpdateUser ? (
                            <AiOutlineLoading3Quarters className="animate-spin duration-500 ease-linear my-[2px] text-light text-xl" />
                        ) : (
                            <span>{`${showFormSubmitPost.post ? 'Share post' : 'Post'
                                }`}</span>
                        )}
                    </button>
                </form>
            </div>
        </>
    );
};

export default FormSubmitPost;
