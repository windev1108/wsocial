import FormComment from '@/components/Widget/Input/FormComment';
import { LoadingComponent } from '@/components/Widget/Loading';
import Skeleton from '@/components/Widget/Skeleton';
import POST_OPERATIONS from '@/graphql/operations/post';
import { setShowLikers } from '@/redux/features/isSlice';
import { formatFirstUppercase } from '@/utils/constants';
import { File, Post, User } from '@/utils/types';
import { useMutation, useLazyQuery } from '@apollo/client';
import moment from 'moment';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, {
    useState,
    useLayoutEffect,
} from 'react';
import { toast } from 'react-hot-toast';
import {
    AiFillHeart,
    AiOutlineHeart,
    AiOutlineLoading3Quarters,
} from 'react-icons/ai';
import { FaRegComment, FaUserFriends } from 'react-icons/fa';
import { GrNext, GrPrevious, GrClose } from 'react-icons/gr';
import { MdPublic } from 'react-icons/md';
import { RiGitRepositoryPrivateFill, RiShareForwardLine } from 'react-icons/ri';
import { useDispatch } from 'react-redux';

const PostDetail: NextPage<{
    postId: string;
    q: string;
}> = ({ postId, q }) => {
    const dispatch = useDispatch();
    const { data: session } = useSession();
    const [toggleLike, { loading: isLoadingToggle }] = useMutation(
        POST_OPERATIONS.Mutations.toggleLikePost
    );
    const router = useRouter();
    const [getPostById, { data: post }] = useLazyQuery(
        POST_OPERATIONS.Queries.getPostById
    );
    const [state, setState] = useState<{
        index: number | null;
    }>({
        index: null,
    });
    const { index } = state;

    useLayoutEffect(() => {
        getPostById({
            variables: {
                id: postId,
            },
        }).then((res) => {
            setState({
                ...state,
                index: q === null ? 0 : 
                res?.data?.getPostById.files?.findIndex(
                    (file: File) => file.id === q
                )!
            });
            document.title = `Post of ${res?.data?.getPostById?.author?.name!}`;
        });
    }, [q]);

    const handleToggleLike = async () => {
        try {
            const { data, errors } = await toggleLike({
                variables: {
                    postId,
                    authorId: post?.getPostById.author?.id,
                    isLiked: post?.getPostById.likes?.some(
                        (like: User) =>
                            like.id === session?.user.id
                    )!
                },
                optimisticResponse: true,
                awaitRefetchQueries: true,
                refetchQueries: ['getPostById'],
            });

            if (errors) {
                toast.error('Something wrong!');
                return;
            }

            if (data) {
                toast.success(data.toggleLike.message);
            }
        } catch (error: any) {
            toast.error(error?.message as string);
        }
    };

    const handleNextFile = () => {
        setState({ ...state, index: index! + 1 });
        router.replace({
            pathname: `/post/${postId}`,
            query: {
                q: post?.getPostById?.files[index! + 1].id! as string,
            },
        });
    };

    const handlePrevFile = () => {
        setState({ ...state, index: index! - 1 });
        router.replace({
            pathname: `/post/${postId}`,
            query: {
                q: post?.getPostById.files[index! - 1]?.id! as string,
            },
        });
    };

    const handleClose = () => {
        router.back();
    };

    return (
        <div className={`${post?.getPostById.files.length > 0 ? 'grid grid-cols-10' : 'flex justify-center'} fixed top-0 left-0 right-0 bottom-0 z-[1000] bg-secondary`}>
          {post?.getPostById.files.length > 0 &&
           <div className="col-span-7 group relative flex justify-center items-center h-screen bg-dark">
           <div className="group-hover:opacity-100 opacity-0 transition-all duration-500 ease-in-out flex absolute top-[50%] left-0 right-0  justify-between px-2">
               <button
                   disabled={index! === 0}
                   onClick={handlePrevFile}
                   className={`${
                       index === 0
                           ? 'cursor-not-allowed opacity-20'
                           : 'cursor-pointer hover:opacity-100 '
                   } flex justify-center items-center rounded-full p-6 bg-gray-200 opacity-60`}>
                   <GrPrevious className="text-2xl text-dark" />
               </button>
               <button
                   onClick={handleNextFile}
                   disabled={
                       post?.getPostById?.files.length === index! + 1
                   }
                   className={`${
                       post?.getPostById?.files.length === index! + 1
                           ? 'cursor-not-allowed opacity-20'
                           : 'cursor-pointer hover:opacity-100'
                   }  flex justify-center items-center rounded-full p-6 bg-gray-200 opacity-60`}>
                   <GrNext className="text-2xl text-dark" />
               </button>
           </div>
           {post?.getPostById.files.length > 0 ? (
               <>
                   {post?.getPostById.files[index!]?.type.includes(
                       'video'
                   ) ? (
                       <video
                           src={post?.getPostById.files[index!]?.url}
                           autoPlay
                           controls></video>
                   ) : (
                       <Image 
                           width={500}
                           height={500}
                           src={post?.getPostById.files[index!]?.url}
                           className="object-contain h-full w-full"
                           alt=""
                       />
                   )}
               </>
           ) : (
               <div className="relative w-full h-full bg-gray-200">
                   <LoadingComponent />
               </div>
           )}
       </div>
          }
            <div className="col-span-3 relative h-screen bg-light px-6 py-12 overflow-y-scroll scrollbar-thumb-gray-400 scrollbar-track-100 scrollbar-thin max-h-screen">
                <div
                    onClick={handleClose}
                    className="absolute cursor-pointer hover:bg-gray-200 rounded-full  p-4 top-2 right-2">
                    <GrClose className="text-2xl text-gray-500" />
                </div>
                <div className="flex space-x-4">
                    {!post?.getPostById.author?.id ? (
                        <Skeleton width={40} height={40} rounded={50} />
                    ) : (
                        <Link href={`/profile?id=${post?.getPostById.author?.id}`}>
                            <Image
                                width={500}
                                height={500}
                                className="cursor-pointer object-cover w-10 h-10 rounded-full"
                                src={post?.getPostById.author?.image}
                                alt=""
                            />
                        </Link>
                    )}
                    <div className="flex-col space-y-1">
                        {!post?.getPostById.author?.id ? (
                            <Skeleton width={100} height={15} rounded={10} />
                        ) : (
                            <Link href={`/profile?id=${post?.getPostById.author?.id}`}>
                                <h1 className="text-dark leading-2 text-lg font-semibold cursor-pointer">
                                    {post?.getPostById.author?.name}
                                    {post?.getPostById.activity !== 'CREATED_POST' && (
                                    <span className="inline-block mx-1 font-normal text-base text-text">{`updated ${post?.getPostById.author.gender === 'FEMALE'
                                        ? 'her'
                                        : 'his'
                                        } ${post?.getPostById.activity === 'UPDATE_AVATAR' ? 'profile picture' : 'cover photo'}
                                  `}</span>
                                )}
                                </h1>
                            </Link>
                        )}

                        {!post?.getPostById.createdAt ? (
                            <Skeleton width={80} height={15} rounded={10} />
                        ) : (
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-500 text-[11px] font-semibold">
                                    {moment(
                                        post?.getPostById.createdAt,
                                        'x'
                                    ).fromNow()}
                                </span>
                                <div className="relative group">
                                    {post?.getPostById.viewer === 'FRIENDS' && (
                                        <FaUserFriends />
                                    )}
                                    {post?.getPostById.viewer === 'PUBLIC' && (
                                        <MdPublic />
                                    )}
                                    {post?.getPostById.viewer === 'PRIVATE' && (
                                        <RiGitRepositoryPrivateFill />
                                    )}
                                    <span className="group-hover:scale-100 duration-500 transition-all  origin-top-left scale-0 absolute top-[100%] left-[50%] bg-black bg-opacity-60 text-light rounded-md px-2 py-1 text-sm shadow-md">
                                        {formatFirstUppercase(
                                            post?.getPostById.viewer
                                        )}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex py-4">
                    {post?.getPostById?.content === undefined ? (
                        <Skeleton width={100} height={18} rounded={10} />
                    ) : (
                        <span className="text-dark">
                            {post?.getPostById?.content || post?.getPostById.postWidgetOf?.content || ""}
                        </span>
                    )}
                </div>
                <div className="flex justify-between py-2">
                    <div
                        onClick={() =>
                            dispatch(
                                setShowLikers({
                                    likers: post?.getPostById.likes,
                                    isOpen: true,
                                })
                            )
                        }
                        className="group relative flex cursor-pointer">
                        <div className="group-hover:scale-100 group-hover:opacity-100  duration-500 transition-all ease-in-out origin-bottom scale-0 opacity-0 absolute -top-[100%] right-0% bg-black bg-opacity-70 px-2 py-1 shadow-md rounded-md">
                            <span className="text-light text-sm whitespace-nowrap ">
                                The people liked
                            </span>
                        </div>
                        {!post?.getPostById.likes ? (
                            <Skeleton width={150} height={20} rounded={10} />
                        ) : (
                            <>
                                {post?.getPostById.likes
                                    ?.slice(0, 3)
                                    .map((user: any, index: number) =>
                                        index === 0 ? (
                                            <div
                                                key={user.id}
                                                className={`border-light z-[${index}]  w-8 h-8 border-[3px]  rounded-full overflow-hidden`}>
                                                <Image
                                                    width={500}
                                                    height={500}
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
                                                }] -translate-x-${
                                                    index * 3
                                                } w-8 h-8 border-[3px] rounded-full overflow-hidden`}>
                                                <Image
                                                    width={500}
                                                    height={500}
                                                    className={`object-cover w-full h-full`}
                                                    src={user.image}
                                                    alt=""
                                                />
                                            </div>
                                        )
                                    )}
                                {post?.getPostById.likes?.slice(3).length >
                                    0 && (
                                    <div className="border-light bg-gray-400 z-[4] -translate-x-9 flex justify-center items-center  rounded-full border-[2px] w-8 h-8 overflow-hidden">
                                        <span className="text-light">{`+${
                                            post?.likes?.slice(3).length
                                        }`}</span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <div className="flex space-x-3 text-gray-500">
                        {post?.getPostById._count.comments === undefined ? (
                            <Skeleton width={100} height={20} rounded={10} />
                        ) : (
                            <span>{`${post?.getPostById._count.comments} Comments`}</span>
                        )}
                        {post?.getPostById._count.postWidget === undefined ? (
                            <Skeleton width={100} height={20} rounded={10} />
                        ) : (
                            <span>{`${post?.getPostById._count.postWidget} Shares`}</span>
                        )}
                    </div>
                </div>
                <div className="border-gray-300 grid grid-cols-3 border-t-[1px] border-b-[1px] p-2">
                    {!post?.getPostById.likes ? (
                        <div className="flex justify-center items-center">
                            <Skeleton width={120} height={25} rounded={10} />
                        </div>
                    ) : (
                        <>
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
                                        post?.getPostById.likes.some(
                                            (user: User) =>
                                                user.id === session?.user.id
                                        )
                                            ? 'text-[#ed4956]'
                                            : 'text-text'
                                    }  hover:bg-gray-200 cursor-pointer rounded-xl py-2 flex justify-center items-center space-x-2`}>
                                    {post?.getPostById.likes.some(
                                        (user: User) =>
                                            user.id === session?.user.id
                                    ) ? (
                                        <AiFillHeart className="text-2xl" />
                                    ) : (
                                        <AiOutlineHeart className="text-2xl" />
                                    )}
                                    <span>Like</span>
                                </button>
                            )}
                        </>
                    )}

                    {!post?.getPostById.likes ? (
                        <div className="flex justify-center items-center">
                            <Skeleton width={120} height={25} rounded={10} />
                        </div>
                    ) : (
                        <div className="text-text hover:bg-gray-200 cursor-pointer rounded-xl py-2 flex justify-center items-center space-x-2">
                            <FaRegComment className="text-2xl" />
                            <span>Comment</span>
                        </div>
                    )}
                    {!post?.getPostById.likes ? (
                        <div className="flex justify-center items-center">
                            <Skeleton width={120} height={25} rounded={10} />
                        </div>
                    ) : (
                        <div className="text-text hover:bg-gray-200 cursor-pointer rounded-xl py-2 flex justify-center items-center space-x-2">
                            <RiShareForwardLine className="text-xl" />
                            <span>Share</span>
                        </div>
                    )}
                </div>

                {!post ? (
                    <LoadingComponent />
                ) : (
                    <FormComment
                        comments={post?.getPostById?.comments}
                        postId={post?.getPostById?.id}
                        authorId={post?.getPostById?.author.id}
                    />
                )}
            </div>
        </div>
    );
};

export default PostDetail;

export const getServerSideProps = (req: any, res: any) => {
    return {
        props: {
            postId: req.query.postId,
            q: req.query.q || null,
        },
    };
};
