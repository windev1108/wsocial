import React, { useEffect, useMemo } from 'react';
import { lazy } from 'react';
const Post = lazy(() => import('../Shared/Chilren/Post'));
import PostSubmit from './FormPost';
import { useQuery } from '@apollo/client';
import { LoadingComponent } from '../Shared/Loading';
import { Post as PostModel, User } from '@/utils/types';
import POST_OPERATIONS from '@/graphql/operations/post';
import { useSession } from 'next-auth/react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const Feed = () => {
    const { data: session } = useSession();
    const { socket } : any = useSelector<RootState>(state => state.socket)
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
            <PostSubmit />

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
