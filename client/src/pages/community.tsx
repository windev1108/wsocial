import { lazy, Suspense, useState } from 'react';
import { LoadingComponent, LoadingPage } from '@/components/Shared/Loading';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import FollowerItem from '@/components/Shared/Chilren/Followers';
import dynamic from 'next/dynamic';
const Layout = dynamic(() => import('@/components/Layout'), { ssr: true });
import { unstable_getServerSession as getServerSession } from 'next-auth';
import { GetServerSidePropsContext } from 'next';
import { authOptions } from './api/auth/[...nextauth]';
import { useSession } from 'next-auth/react';
import { useQuery } from '@apollo/client';
import USER_QUERIES from '@/graphql/queries/user';
import { User } from '@/utils/types';
import FollowingsItem from '@/components/Shared/Chilren/Followings';
import NotFriendComponent from '@/components/Shared/Chilren/NotFriend';

export const getServerSideProps = async ({
    req,
    res,
    locale,
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
            session,
            origin: `${
                req.headers.host?.includes('localhost') ? 'http' : 'https'
            }://${req.headers.host}`,
        },
    };
};

export default function Community() {
    const { data: session } = useSession();
    const [tab, setTab] = useState(1);
    const { data: communityData, loading }: any = useQuery(
        USER_QUERIES.getMyCommunity,
        {
            variables: {
                id: session?.user.id,
            },
        }
    );

    return (
        <Suspense fallback={<LoadingPage />}>
            <Layout>
                {loading ? (
                    <LoadingComponent />
                ) : (
                    <div className="h-screen space-y-6 bg-secondary lg:p-6 p-0 rounded-xl overflow-hidden">
                        <div className="grid grid-cols-4 bg-light lg:gap-3 gap-1 lg:p-4 p-2 rounded-lg">
                            <div
                                onClick={() => setTab(1)}
                                className={`${
                                    tab === 1
                                        ? 'bg-primary text-light'
                                        : 'bg-secondary text-text'
                                } border-[1px] border-gray-300 cursor-pointer flex items-center justify-center lg:py-2 py-1 rounded-lg lg:h-auto h-10`}>
                                <span className="font-semibold lg:text-base text-sm">{`${communityData?.getUserById.followers.length} Followers`}</span>
                            </div>
                            <div
                                onClick={() => setTab(2)}
                                className={`${
                                    tab === 2
                                        ? 'bg-primary text-light'
                                        : 'bg-secondary text-text'
                                } border-[1px] border-gray-300 cursor-pointer flex items-center justify-center py-2 rounded-lg lg:h-auto h-10`}>
                                <span className="font-semibold lg:text-base text-sm">{`${communityData?.getUserById.followings.length} Followings`}</span>
                            </div>

                            <div
                                onClick={() => setTab(3)}
                                className={`${
                                    tab === 3
                                        ? 'bg-primary text-light'
                                        : 'bg-secondary text-text'
                                } border-[1px] border-gray-300 cursor-pointer flex items-center justify-center py-2 rounded-lg lg:h-auto h-10`}>
                                <span className="font-semibold lg:text-base text-sm">{`${communityData?.getUserById.friends.length} Friends`}</span>
                            </div>

                            <div
                                onClick={() => setTab(4)}
                                className={`${
                                    tab === 4
                                        ? 'bg-primary text-light'
                                        : 'bg-secondary text-text'
                                } border-[1px] border-gray-300 cursor-pointer flex items-center justify-center py-2 rounded-lg lg:h-auto h-10`}>
                                <span className="font-semibold lg:text-base text-xs text-center">
                                    {' '}
                                    People You Might Know
                                </span>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 p-4 rounded-lg scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            {tab === 1 &&
                                communityData?.getUserById.followers?.map(
                                    (user: User) => (
                                        <FollowerItem
                                            id={user.id}
                                            avatar={user.image}
                                            key={user.id}
                                            name={user.name}
                                            location={user.liveAt!}
                                            facebookUrl={user.facebook!}
                                            instagramUrl={user.instagram!}
                                            twitterUrl={user.twitter!}
                                            linkedinUrl={user.linkedin!}
                                            isFollowed={communityData?.getUserById.followings.some((u : User) => u.id === user.id)}
                                        />
                                    )
                                )}
                            {tab === 2 &&
                                communityData?.getUserById.followings?.map(
                                    (user: User) => (
                                        <FollowingsItem
                                            id={user.id}
                                            avatar={user.image}
                                            key={user.id}
                                            name={user.name}
                                            location={user.liveAt!}
                                            facebookUrl={user.facebook!}
                                            instagramUrl={user.instagram!}
                                            twitterUrl={user.twitter!}
                                            linkedinUrl={user.linkedin!}
                                        />
                                    )
                                )}

                            {tab === 3 &&
                                communityData?.getUserById.friends?.map(
                                    (user: User) => (
                                        <FollowingsItem
                                            id={user.id}
                                            avatar={user.image}
                                            key={user.id}
                                            name={user.name}
                                            location={user.liveAt!}
                                            facebookUrl={user.facebook!}
                                            instagramUrl={user.instagram!}
                                            twitterUrl={user.twitter!}
                                            linkedinUrl={user.linkedin!}
                                        />
                                    )
                                )}

                            {tab === 4 &&
                                communityData?.getUserById.notFriends?.map(
                                    (user: User) => (
                                        <NotFriendComponent
                                            id={user.id}
                                            avatar={user.image}
                                            key={user.id}
                                            name={user.name}
                                            location={user.liveAt!}
                                            facebookUrl={user.facebook!}
                                            instagramUrl={user.instagram!}
                                            twitterUrl={user.twitter!}
                                            linkedinUrl={user.linkedin!}
                                            isSendAddFriend={
                                                user.isSendAddFriend
                                            }
                                            isReceiveAddFriend={user.isReceiveAddFriend}
                                            isFollowed={communityData?.getUserById.followings.some((u : User) => u.id === user.id)}
                                            isFollowing={communityData?.getUserById.followers.some((u : User) => u.id === user.id)}
                                        />
                                    )
                                )}
                        </div>
                    </div>
                )}
            </Layout>
        </Suspense>
    );
}
