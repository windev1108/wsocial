import POST_OPERATIONS from '@/graphql/operations/post';
import { createCommentInput, createCommentResponse } from '@/utils/types';
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
import { uploadMultiple } from '@/utils/constants';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const FormReplyComment: NextPage<{
    parentId: string;
    postId: string
    authorName: string;
    authorId: string
}> = ({ postId , parentId, authorName , authorId  }) => {
    const { user } : any = useSelector<RootState>(state => state.session)
    const [state, setState] = useState<{
        blobPicture: string;
        content: string;
        file: any;
        isReplyTo: boolean;
    }>({
        content: '',
        blobPicture: '',
        file: {},
        isReplyTo: true,
    });
    const { content, blobPicture, file, isReplyTo } = state;
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
                if (!content) {
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
                                parentId,
                                file: files[0],
                                replyUserId: isReplyTo ? authorId : null
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
                                parentId,
                                replyUserId: isReplyTo ? authorId : null
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

    const handleChangeInput = (e:  any) => {
        if (e.which === 8 && !content) {
            setState({ ...state, isReplyTo: false });
        }
    };



    return (
        <div className="flex flex-col w-fit">
            <form
                onSubmit={handleSubmitComment}
                className="flex space-x-2 items-center p-1">
                <div className="flex justify-self-end h-full">
                    <Image
                         width={100}
                         height={100}
                         className="object-cover lg:w-12 lg:h-10 rounded-full"
                        src={user.image!}
                        alt=""
                    />
                </div>
                <div className="flex flex-col space-y-2  items-center lg:w-full">
                    <div className="flex flex-1 rounded-lg items-center w-full bg-secondary pl-2">
                        {isReplyTo && (
                            <span className="bg-blue-200 px-1 rounded-sm whitespace-nowrap lg:text-base text-sm">
                                {authorName}
                            </span>
                        )}
                        <input
                            ref={commentInputRef}
                            className="flex-1 p-2 bg-transparent outline-none lg:text-base text-sm"
                            type="text"
                            disabled={loadingCreateComment}
                            placeholder={`Replying to ${authorName} `}
                            value={content}
                            onKeyDown={handleChangeInput}
                            onChange={(e) => setState({...state, content: e.target.value})}
                        />
                        <div className="flex space-x-2 px-3">
                            <label onChange={onFileChange} htmlFor="picture">
                                <input id="picture" type="file" hidden />
                                <BsImage className="hover:scale-110 transition-all duration-700 ease-in-out text-lg cursor-pointer text-text" />
                            </label>
                        </div>
                    </div>
                    {blobPicture &&
                    <div className="flex justify-start w-full">
                        <img
                            className="object-cover max-w-[10rem] h-auto"
                            src={blobPicture}
                            alt=""
                        />
                    </div>
                    }
                </div>
                {loadingCreateComment ? (
                    <button
                        disabled
                        className="group bg-blue-200 rounded-lg p-3 transition-all duration-700 ease-in-out cursor-not-allowed hover:bg-primary">
                        <AiOutlineLoading3Quarters className="animate-spin transition-all duration-500 ease-linear text-primary" />
                    </button>
                ) : (
                    <button
                        type="submit"
                        className="group bg-blue-200 rounded-lg p-3 transition-all duration-700 ease-in-out cursor-pointer hover:bg-primary">
                        <AiOutlineSend className="group-hover:text-white transition-all duration-700 ease-in-out text-lg text-primary" />
                    </button>
                )}
            </form>
        </div>
    );
};

export default memo(FormReplyComment);
