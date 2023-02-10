import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { LoadingComponent, LoadingPage } from '@/components/Widget/Loading';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { unstable_getServerSession as getServerSession } from 'next-auth';
import { GetServerSidePropsContext } from 'next';
import { authOptions } from './api/auth/[...nextauth]';
import {  useQuery } from '@apollo/client';
import { useSession } from 'next-auth/react';
import { Notification as NotificationModel } from '@/utils/types';
import NOTIFICATION_OPERATIONS from '@/graphql/operations/notifications';
const Layout = dynamic(() => import('@/components/Layout'), { suspense: true });
import NotificationEmpty from '../assets/images/notification.png';
import Image from 'next/image';
import Notification from '@/components/Widget/Items/Notification';

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

const Notifications = () => {
    const { data: session }: any = useSession();
    const { data: notifications, loading } = useQuery(
        NOTIFICATION_OPERATIONS.Queries.getMyInfo,
        {
            variables: {
                id: session?.user.id,
            },
        }
    );


    return (
        <Suspense fallback={<LoadingPage />}>
            <Layout>
                <div className="lg:px-6 lg:py-6 rounded-xl h-screen overflow-hidden bg-secondary lg:pr-6 w-full">
                    <div className="relative flex flex-col bg-light w-full h-screen rounded-lg">
                        <h1 className="p-4 text-lg font-bold text-dark">
                            Notification
                        </h1>

                        {loading ? (
                            <LoadingComponent />
                        ) : notifications?.getUserById?.notificationsTo
                              .length === 0 ? (
                            <div className="absolute flex justify-center items-center top-[50%] left-[50%]  translate-x-[-50%] translate-y-[-50%]">
                                <Image
                                    src={NotificationEmpty}
                                    className="relative object-cover w-full h-full"
                                    alt=""
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                {notifications?.getUserById?.notificationsTo.map(
                                    (notification: NotificationModel) => (
                                        <Notification
                                            key={notification.id}
                                            id={notification.id}
                                            fromUsers={
                                                notification.fromUsers
                                            }
                                            type={notification.type}
                                            postId={notification.postId}
                                            updatedAt={notification.updatedAt}
                                        />
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Layout>
        </Suspense>
    );
};

export default Notifications;
