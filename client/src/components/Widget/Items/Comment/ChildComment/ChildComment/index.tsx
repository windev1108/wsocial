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
import FormReplyComment from '../../../../Input/FormReplyComment';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const ChildComment: NextPage<{
    id: string;
    postId: string;
    author: User;
    content: string;
    createdAt: string;
    updatedAt: string;
    file: File;
    likes: User[];
    isLiked: boolean;
    parentId: string;
    replyToUser: User;
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
    parentId,
    replyToUser,
}) => {
    const [state, setState] = useState({
        openOptionComment: false,
        isOpenFormReply: false,
        isOpenChildComment: false,
    });
    const { t } = useTranslation()
    const { isOpenFormReply } = state;
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
            <div className="">
                <Image
                    width={100}
                    height={100}
                    className="object-cover w-10 h-10 rounded-full"
                    src={author.image}
                    alt=""
                />
            </div>
            <div className="flex flex-col flex-1 space-y-2">
                <div className="w-fit flex flex-col rounded-2xl bg-gray-100 px-4 py-2">
                    <Link href={author.id}>
                        <h1 className="font-semibold text-dark">
                            {author.name}
                        </h1>
                    </Link>
                    <div className="flex space-x-2 items-center">
                        {replyToUser && (
                            <span className="bg-blue-200 px-1 rounded-lg whitespace-nowrap">
                                {`@${replyToUser.name}`}
                            </span>
                        )}
                        <span className="text-dark">{content}</span>
                    </div>
                </div>
                {file && (
                    <img
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
                                } first-letter:uppercase hover:underline text-sm font-semibold`}>
                                {t('common:like')}
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
                            } first-letter:uppercase hover:underline text-sm font-semibold`}>
                            {t('common:reply')}
                        </button>
                        <span className="hover:underline text-sm">
                            {' '}
                            {moment(createdAt, 'x').fromNow()}
                        </span>
                        {createdAt !== updatedAt && (
                            <span className="first-letter:uppercase hover:underline text-sm">
                                {t('common:edited')}
                            </span>
                        )}
                    </div>

                    {likes.length > 0 && (
                        <div className="flex items-center shadow-md rounded-xl bg-gray-100 p-1 cursor-pointer">
                            <AiFillHeart className="text-xl text-[#ed4956]" />
                            <span className="text-dark">{likes.length}</span>
                        </div>
                    )}
                </div>

                {isOpenFormReply && (
                    <FormReplyComment
                        parentId={parentId}
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
                            {`${t('common:delete')} ${t("common:comment")}`}
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
