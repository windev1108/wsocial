import React, { Suspense, useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { LoadingPage } from '@/components/Widget/Loading';
import NavSetting from '@/components/Widget/Settings/NavSetting';
import dynamic from 'next/dynamic';
const Layout = dynamic(() => import('@/components/Layout'), { suspense: true });
const EditProfile = dynamic(
    () => import('@/components/Widget/Settings/Profile'),
    { suspense: true }
);
const EditLanguage = dynamic(
    () => import('@/components/Widget/Settings/Language'),
    { suspense: true }
);
import { unstable_getServerSession as getServerSession } from 'next-auth';
import { GetServerSidePropsContext } from 'next';
import { authOptions } from './api/auth/[...nextauth]';

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

const Setting = () => {
    const [tab, setTab] = useState<number>(1);

    return (
        <Suspense fallback={<LoadingPage />}>
            <Layout>
                <div className="h-screen overflow-hidden bg-secondary w-full">
                    <div className="grid grid-cols-10 shadow-md h-full bg-secondary">
                        <NavSetting className={"lg:col-span-2 col-span-10 w-full lg:h-full h-20 p-4 border-r-[3px] border-gray-200 space-y-2 lg:block flex justify-around"} tab={tab} setTab={setTab} />
                        <div className="lg:col-span-8 col-span-10 relative">
                            {tab === 1 && <EditProfile />}

                            {tab === 2 && <EditLanguage />}
                        </div>
                    </div>
                </div>
            </Layout>
        </Suspense>
    );
};

export default Setting;
