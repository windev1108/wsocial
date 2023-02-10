import POST_OPERATIONS from '@/graphql/operations/post';
import {
    File,
    User,
    deleteCommentResponse,
    toggleLikeCommentResponse,
    Comment as CommentModel,
} from '@/utils/types';
import { useMutation } from '@apollo/client';
import moment from 'moment';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import React, { memo, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { AiFillHeart, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import FormReplyComment from '../../../Input/FormReplyComment';
import { HiReply } from 'react-icons/hi';
import ChildCommentComponent from './ChildComment';
import { useDispatch } from 'react-redux';
import { setShowLikers } from '@/redux/features/isSlice';
import Link from 'next/link';
import Image from 'next/image';

const ChildComment: NextPage<{
    id: string;
    postId: string;
    author: User;
    content: string;
    createdAt: string;
    updatedAt: string;
    file: File;
    likes: User[];
    childComment: CommentModel[];
    replyToUser: User;
    isLiked: boolean;
}> = ({
    postId,
    id,
    author,
    content,
    likes,
    file,
    createdAt,
    updatedAt,
    isLiked,
    replyToUser,
    childComment,
}) => {
    const dispatch = useDispatch();
    const [state, setState] = useState({
        openOptionComment: false,
        isOpenFormReply: false,
        isOpenChildComment: false,
    });
    const { isOpenFormReply, isOpenChildComment } = state;
    const { data: session } = useSession();
    const [deleteComment, { loading: loadingDeleteComment }] = useMutation<
        deleteCommentResponse,
        {
            id: string;
        }
    >(POST_OPERATIONS.Mutations.deleteComment);
    const [toggleLikeComment, { loading: loadingToggleLikeComment }] =
        useMutation<
            toggleLikeCommentResponse,
            {
                commentId: string;
                isLiked: boolean;
                authorId: string;
            }
        >(POST_OPERATIONS.Mutations.toggleLikeComment);

    const handleDeleteComment = useCallback(async () => {
        try {
            await deleteComment({
                variables: {
                    id,
                },
                refetchQueries: ['getPosts', 'getPostInProfile'],
                awaitRefetchQueries: true,
            });
        } catch (error: any) {
            toast.error(error.message);
        }
    }, []);

    const handleToggleLikeComment = useCallback(async () => {
        try {
            await toggleLikeComment({
                variables: {
                    commentId: id,
                    isLiked,
                    authorId: author.id,
                },
                refetchQueries: ['getPosts', 'getPostInProfile'],
                awaitRefetchQueries: true,
            });
        } catch (error: any) {
            toast.error(error.message);
        }
    }, [isLiked]);

    return (
        <div className="flex space-x-2">
                <Image
                    width={100}
                    height={100}
                    className="object-cover lg:w-10 lg:h-10 w-8 h-8 rounded-full"
                    src={author.image}
                    alt=""
                />
            <div className="flex flex-col flex-1 space-y-2">
                <div className="w-fit flex flex-col rounded-2xl bg-gray-100 px-4 py-2">
                    <Link href={author.id}>
                        <h1 className="font-semibold text-dark lg:text-base text-sm">
                            {author.name}
                        </h1>
                    </Link>
                    <div className="flex space-x-2 items-center lg:text-base text-sm">
                        {replyToUser && (
                            <span className="bg-blue-200 px-1 rounded-lg whitespace-nowrap">
                                {`@${replyToUser.name}`}
                            </span>
                        )}
                        <span className="text-dark">{content}</span>
                    </div>
                </div>
                {file && (
                    <Image
                        width={500}
                        height={500}
                        className="max-w-[50%] w-fit object-cover max-h-[20rem]"
                        src={file.url}
                        alt=""
                    />
                )}
                <div className="flex justify-between items-center">
                    <div className="flex space-x-3 items-center">
                        {loadingToggleLikeComment ? (
                            <AiOutlineLoading3Quarters className="animate-spin transition-all duration-500 ease-linear text-primary" />
                        ) : (
                            <button
                                onClick={handleToggleLikeComment}
                                className={`${
                                    isLiked ? 'text-primary' : 'text-dark'
                                } hover:underline lg:text-sm text-xs font-semibold`}>
                                Like
                            </button>
                        )}
                        <button
                            onClick={() =>
                                setState({
                                    ...state,
                                    isOpenFormReply: !isOpenFormReply,
                                })
                            }
                            className={`${
                                isOpenFormReply ? 'text-primary' : 'text-dark'
                            } hover:underline lg:text-sm text-xs font-semibold`}>
                            Reply
                        </button>
                        <span className="hover:underline lg:text-sm text-xs whitespace-nowrap">
                            {' '}
                            {moment(createdAt, 'x').fromNow()}
                        </span>
                        {createdAt !== updatedAt && (
                            <span className="hover:underline text-sm">
                                Edited
                            </span>
                        )}
                    </div>

                    {likes.length > 0 && (
                        <button
                            onClick={() =>
                                dispatch(
                                    setShowLikers({
                                        likers: likes.map((like) => {
                                            return { user: like };
                                        }),
                                        isOpen: true,
                                    })
                                )
                            }
                            className="flex items-center shadow-md rounded-xl bg-gray-100 p-1 cursor-pointer">
                            <AiFillHeart className="text-xl text-[#ed4956]" />
                            <span className="text-dark">{likes.length}</span>
                        </button>
                    )}
                </div>

                {childComment.length > 0 &&
                    (isOpenChildComment ? (
                        <div className="flex flex-col space-y-2">
                            {childComment.map((comment: CommentModel) => (
                                <ChildCommentComponent
                                    key={comment.id}
                                    author={comment.user}
                                    content={comment.content}
                                    likes={comment.likes}
                                    file={comment.file!}
                                    createdAt={comment.createdAt}
                                    updatedAt={comment.updatedAt}
                                    id={comment.id}
                                    isLiked={comment.likes?.some(
                                        (like) => like.id === session?.user.id
                                    )}
                                    postId={postId}
                                    replyToUser={comment.replyToUser!}
                                    parentId={id}
                                />
                            ))}
                        </div>
                    ) : (
                        <button
                            onClick={() =>
                                setState({ ...state, isOpenChildComment: true })
                            }
                            className="flex items-centers space-x-2 cursor-pointer hover:underline">
                            <HiReply className="rotate-[180deg]" />
                            <span className="text-sm font-semibold">{`${childComment.length} Reply`}</span>
                        </button>
                    ))}

                {isOpenFormReply && (
                    <FormReplyComment
                        parentId={id}
                        authorName={author.name}
                        authorId={author.id}
                        postId={postId}
                    />
                )}
            </div>
            {author.id === session?.user?.id && (
                <div className="group relative flex hover:bg-gray-100 rounded-full w-10 h-10  items-center justify-center cursor-pointer z-[1000]">
                    <BiDotsHorizontalRounded size={20} />
                    <div className="group-hover:!block !hidden absolute top-[100%] right-[0%] shadow-xl border z-[1001]">
                        <button
                            disabled={loadingDeleteComment}
                            onClick={handleDeleteComment}
                            className={`${
                                loadingDeleteComment
                                    ? 'cursor-not-allowed'
                                    : 'cursor-pointer'
                            } whitespace-nowrap text-dark font-semibold hover:bg-gray-200 py-2 px-3 w-full bg-secondary`}>
                            {loadingDeleteComment && (
                                <AiOutlineLoading3Quarters className="animate-spin transition-all duration-500 ease-linear text-primary inline mx-2" />
                            )}
                            Delete comment
                        </button>

                        {/* <button className="whitespace-nowrap text-dark font-semibold hover:bg-gray-200 py-2 px-3 w-full bg-secondary">
                            Edit comment
                        </button> */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(ChildComment);
