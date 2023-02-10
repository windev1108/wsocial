import React, { useEffect } from 'react';
import { lazy } from 'react';
const Post = lazy(() => import('@/components//Widget/Items/Post'));
import { useQuery } from '@apollo/client';
import { LoadingComponent } from '@/components/Widget/Loading';
import { Post as PostModel, User } from '@/utils/types';
import POST_OPERATIONS from '@/graphql/operations/post';
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Image from 'next/image';
import { setOpenFormSubmitPost } from '@/redux/features/isSlice';
import { HiOutlinePhotograph } from 'react-icons/hi';
import { FiSmile } from 'react-icons/fi';
import { BsCameraVideo } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';

const Feed = () => {
    const { data: session } = useSession();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { socket } : any = useSelector<RootState>(state => state.socket)
    const { user } : any = useSelector<RootState>(state => state.socket)
    const { loading, data , refetch } = useQuery(POST_OPERATIONS.Queries.getPosts, {
        variables: {
            userId: session?.user.id,
            viewer: 'PUBLIC',
            take: 100,
        },
    });

    useEffect(() => {
         socket?.on("updatePost", () => {
             refetch({
                userId: session?.user.id,
                viewer: 'PUBLIC',
                take: 100,
             })
         })
    },[socket])


    return (
        <div className="col-span-12 p-4 lg:w-[50vw] w-full space-y-6 pb-11 overflow-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 overflow-x-hidden h-[90vh]">
            {/* Submit post */}
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

            {/* Posts */}
            <div className="relative flex-col space-y-8">
                {loading ? (
                    <LoadingComponent />
                ) : (
                    data?.getPosts?.map((post: PostModel) => (
                        <Post
                            key={post.id}
                            postId={post.id!}
                            author={post.author!}
                            content={post.content!}
                            files={post.files!}
                            viewer={post.viewer!}
                            likes={post.likes!}
                            comments={post.comments!}
                            countShares={post?._count?.postShared!}
                            countComment={post?._count?.comments!}
                            updatedAt={post.updatedAt!}
                            isLiked={post?.likes?.some(
                                (like: User) =>
                                    like.id === session?.user.id
                            )!}
                            activity={post.activity}
                            postSharedOf={post.postSharedOf}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Feed;
