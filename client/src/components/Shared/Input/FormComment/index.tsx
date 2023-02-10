import POST_OPERATIONS from '@/graphql/operations/post';
import {
    Comment as CommentModel,
    createCommentInput,
    createCommentResponse,
} from '@/utils/types';
import { useMutation } from '@apollo/client';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import React, {
    useRef,
    useEffect,
    memo,
    useCallback,
    useState,
    FormEvent,
} from 'react';
import { toast } from 'react-hot-toast';
import {
    AiOutlineFileGif,
    AiOutlineLoading3Quarters,
    AiOutlineSend,
} from 'react-icons/ai';
import { BsImage } from 'react-icons/bs';
import { FiSmile } from 'react-icons/fi';
import Comment from '../../Chilren/Comment';
import { uploadMultiple } from '@/utils/constants';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Image from 'next/image';

const FormComment: NextPage<{
    postId: string;
    authorId: string
    comments: CommentModel[];
}> = ({ postId, comments , authorId }) => {
    const { user } : any = useSelector<RootState>(state => state.session)
    const [state, setState] = useState<{
        blobPicture: string;
        content: string;
        file: any;
        isLoadingSubmit: boolean;
    }>({
        content: '',
        blobPicture: '',
        file: {},
        isLoadingSubmit: false,
    });
    const { content, blobPicture, file } = state;
    const [createComment, { loading: loadingCreateComment }] = useMutation<
        createCommentResponse,
        createCommentInput
    >(POST_OPERATIONS.Mutations.createComment);

    const commentInputRef = useRef<any>();

    useEffect(() => {
        commentInputRef.current.focus();
    }, []);

    const handleSubmitComment = useCallback(
        async (e: FormEvent) => {
            e.preventDefault();
            try {
                if (!content && !blobPicture) {
                    toast.error('Please enter comment content');
                    return;
                }

                if (blobPicture) {
                    const files = await uploadMultiple([file]);

                    await createComment({
                        variables: {
                            comment: {
                                content,
                                postId,
                                file: files[0],
                            },
                            authorId
                        },
                        refetchQueries: ['getPosts', 'getPostInProfile'],
                        awaitRefetchQueries: true,
                    });
                } else {
                    await createComment({
                        variables: {
                            comment: {
                                content,
                                postId,
                            },
                            authorId
                        },
                        refetchQueries: ['getPosts', 'getPostInProfile'],
                        awaitRefetchQueries: true,
                    });
                }

                setState({ ...state, content: '', blobPicture: '', file: {} });
                toast.success('Comment post success');
            } catch (error: any) {
                toast.error(error.message);
            }
        },
        [content, blobPicture]
    );

    const onFileChange = (e: any) => {
        const file = e.target.files[0];

        setState({ ...state, blobPicture: URL?.createObjectURL(file), file });
    };

    return (
        <div className="flex flex-col">
            <form
                onSubmit={handleSubmitComment}
                className="flex space-x-2 items-center border-t-[1px] p-3 w-full">
            <div className="flex flex-col w-full">
            <div className="flex w-full space-x-2">
              <Image
                        width={100}
                        height={100}
                        className="object-cover lg:w-10 lg:h-10 w-8 h-8 rounded-full"
                        src={user?.image}
                        alt=""
                    />
                    <div className="flex flex-1 rounded-lg items-center lg:w-full w-full bg-secondary ">
                        <input
                            disabled={loadingCreateComment}
                            ref={commentInputRef}
                            className="flex-1 py-2  px-4 bg-transparent outline-none lg:text-base text-sm"
                            type="text"
                            placeholder="Write a comment..."
                            value={content}
                            onChange={(e) =>
                                setState({ ...state, content: e.target.value })
                            }
                        />
                        <div className="flex space-x-2 px-3 items-center h-full">
                            <label onChange={onFileChange} htmlFor="picture">
                                <input id="picture" type="file" hidden />
                                <BsImage className="lg:text-base text-sm hover:scale-110 transition-all duration-700 ease-in-out cursor-pointer text-text" />
                            </label>
                        </div>
                    </div>
              <div className="">
              {loadingCreateComment ? (
                    <button
                        disabled
                        className="group bg-blue-200 rounded-lg lg:p-3 p-2 transition-all duration-700 ease-in-out cursor-not-allowed hover:bg-primary">
                        <AiOutlineLoading3Quarters className="animate-spin transition-all duration-500 ease-linear text-primary" />
                    </button>
                ) : (
                    <button
                        type="submit"
                        className="group bg-blue-200 rounded-lg lg:p-3 p-2 transition-all duration-700 ease-in-out cursor-pointer hover:bg-primary">
                        <AiOutlineSend className="group-hover:text-white transition-all duration-700 ease-in-out text-lg text-primary" />
                    </button>
                )}
              </div>
            </div>
            {blobPicture &&
                    <div className="flex justify-start w-full px-10 py-2">
                        <img
                            className="object-cover max-w-[10rem] h-auto"
                            src={blobPicture}
                            alt=""
                        />
                    </div>
                    }
            </div>
            </form>
           
            <div className="flex flex-col p-4 space-y-4">
                {comments.map((comment: CommentModel) => (
                    <Comment
                        key={comment.id}
                        author={comment.user}
                        content={comment.content}
                        likes={comment.likes}
                        file={comment.file!}
                        createdAt={comment.createdAt}
                        updatedAt={comment.updatedAt}
                        id={comment.id}
                        isLiked={comment.likes.some(
                            (like) => like.id === user.id
                        )}
                        postId={postId}
                        childComment={comment.childComment}
                    />
                ))}
            </div>
        </div>
    );
};

export default memo(FormComment);
