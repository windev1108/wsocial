import ExploreCard from '@/components/Widget/Items/ExploreCard';
import { LoadingPage } from '@/components/Widget/Loading'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import React, { lazy, Suspense } from 'react'
const Layout = dynamic(() => import('@/components/Layout'), { suspense: true })
import { unstable_getServerSession as getServerSession } from "next-auth";
import { GetServerSidePropsContext } from 'next'
import { authOptions } from './api/auth/[...nextauth]'


export const getServerSideProps = async ({
    req,
    res,
    locale
}: GetServerSidePropsContext) => {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.email) {
        return {
            redirect: {
                destination: "/signin",
                permanent: true,
            },
            props: {},
        };
    }

    return {
        props: {
            ...(await serverSideTranslations(locale!, ["common"])),
            session,
            origin: `${req.headers.host?.includes("localhost") ? "http" : "https"
                }://${req.headers.host}`,
        },
    };
};


const Explore = () => {
    return (
        <Suspense fallback={<LoadingPage />}>
            <Layout>
                <div className="grid grid-cols-3 gap-4 p-6 bg-secondary h-screen rounded-[2rem] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 overflow-y-scroll max-h-[90%]">
                    <ExploreCard
                        thumbnail="https://i.ytimg.com/vi/vx9CSpnROfs/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLAnxEhGPDcJ31IrMjDCALwea7L9VA"
                        feature="Features"
                        title="BLACKPINK - ‘Kill This Love’ 0414 SBS Inkigayo
                        "
                        desc="Copyrightⓒ2019 SBS Contents Hub Co., Ltd. & YG Entertainment Inc. All rights reserved.
                        [BLACKPINK - ‘Kill This Love’ 0414 SBS Inkigayo] 
                        More about BLACKPINK @
                        "
                        link="https://www.youtube.com/watch?v=vx9CSpnROfs&list=RDGMEM0s70dY0AfCwh3LqQ-Bv1xg&index=11"
                        createdAt="Friday 13 August"
                    />
                    <ExploreCard
                        thumbnail="https://i.ytimg.com/vi/vx9CSpnROfs/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLAnxEhGPDcJ31IrMjDCALwea7L9VA"
                        feature="Features"
                        title="BLACKPINK - ‘Kill This Love’ 0414 SBS Inkigayo
                        "
                        desc="Copyrightⓒ2019 SBS Contents Hub Co., Ltd. & YG Entertainment Inc. All rights reserved.
                        [BLACKPINK - ‘Kill This Love’ 0414 SBS Inkigayo] 
                        More about BLACKPINK @
                        "
                        link="https://www.youtube.com/watch?v=vx9CSpnROfs&list=RDGMEM0s70dY0AfCwh3LqQ-Bv1xg&index=11"
                        createdAt="Friday 13 August"
                    />
                    <ExploreCard
                        thumbnail="https://i.ytimg.com/vi/vx9CSpnROfs/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLAnxEhGPDcJ31IrMjDCALwea7L9VA"
                        feature="Features"
                        title="BLACKPINK - ‘Kill This Love’ 0414 SBS Inkigayo
                        "
                        desc="Copyrightⓒ2019 SBS Contents Hub Co., Ltd. & YG Entertainment Inc. All rights reserved.
                        [BLACKPINK - ‘Kill This Love’ 0414 SBS Inkigayo] 
                        More about BLACKPINK @
                        "
                        link="https://www.youtube.com/watch?v=vx9CSpnROfs&list=RDGMEM0s70dY0AfCwh3LqQ-Bv1xg&index=11"
                        createdAt="Friday 13 August"
                    />
                    <ExploreCard
                        thumbnail="https://i.ytimg.com/vi/vx9CSpnROfs/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLAnxEhGPDcJ31IrMjDCALwea7L9VA"
                        feature="Features"
                        title="BLACKPINK - ‘Kill This Love’ 0414 SBS Inkigayo
                        "
                        desc="Copyrightⓒ2019 SBS Contents Hub Co., Ltd. & YG Entertainment Inc. All rights reserved.
                        [BLACKPINK - ‘Kill This Love’ 0414 SBS Inkigayo] 
                        More about BLACKPINK @
                        "
                        link="https://www.youtube.com/watch?v=vx9CSpnROfs&list=RDGMEM0s70dY0AfCwh3LqQ-Bv1xg&index=11"
                        createdAt="Friday 13 August"
                    />
                    <ExploreCard
                        thumbnail="https://i.ytimg.com/vi/vx9CSpnROfs/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLAnxEhGPDcJ31IrMjDCALwea7L9VA"
                        feature="Features"
                        title="BLACKPINK - ‘Kill This Love’ 0414 SBS Inkigayo
                        "
                        desc="Copyrightⓒ2019 SBS Contents Hub Co., Ltd. & YG Entertainment Inc. All rights reserved.
                        [BLACKPINK - ‘Kill This Love’ 0414 SBS Inkigayo] 
                        More about BLACKPINK @
                        "
                        link="https://www.youtube.com/watch?v=vx9CSpnROfs&list=RDGMEM0s70dY0AfCwh3LqQ-Bv1xg&index=11"
                        createdAt="Friday 13 August"
                    />
                    <ExploreCard
                        thumbnail="https://i.ytimg.com/vi/vx9CSpnROfs/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLAnxEhGPDcJ31IrMjDCALwea7L9VA"
                        feature="Features"
                        title="BLACKPINK - ‘Kill This Love’ 0414 SBS Inkigayo
                        "
                        desc="Copyrightⓒ2019 SBS Contents Hub Co., Ltd. & YG Entertainment Inc. All rights reserved.
                        [BLACKPINK - ‘Kill This Love’ 0414 SBS Inkigayo] 
                        More about BLACKPINK @
                        "
                        link="https://www.youtube.com/watch?v=vx9CSpnROfs&list=RDGMEM0s70dY0AfCwh3LqQ-Bv1xg&index=11"
                        createdAt="Friday 13 August"
                    />
                    <ExploreCard
                        thumbnail="https://i.ytimg.com/vi/vx9CSpnROfs/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLAnxEhGPDcJ31IrMjDCALwea7L9VA"
                        feature="Features"
                        title="BLACKPINK - ‘Kill This Love’ 0414 SBS Inkigayo
                        "
                        desc="Copyrightⓒ2019 SBS Contents Hub Co., Ltd. & YG Entertainment Inc. All rights reserved.
                        [BLACKPINK - ‘Kill This Love’ 0414 SBS Inkigayo] 
                        More about BLACKPINK @
                        "
                        link="https://www.youtube.com/watch?v=vx9CSpnROfs&list=RDGMEM0s70dY0AfCwh3LqQ-Bv1xg&index=11"
                        createdAt="Friday 13 August"
                    />
                    <ExploreCard
                        thumbnail="https://i.ytimg.com/vi/vx9CSpnROfs/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLAnxEhGPDcJ31IrMjDCALwea7L9VA"
                        feature="Features"
                        title="BLACKPINK - ‘Kill This Love’ 0414 SBS Inkigayo
                        "
                        desc="Copyrightⓒ2019 SBS Contents Hub Co., Ltd. & YG Entertainment Inc. All rights reserved.
                        [BLACKPINK - ‘Kill This Love’ 0414 SBS Inkigayo] 
                        More about BLACKPINK @
                        "
                        link="https://www.youtube.com/watch?v=vx9CSpnROfs&list=RDGMEM0s70dY0AfCwh3LqQ-Bv1xg&index=11"
                        createdAt="Friday 13 August"
                    />

                </div>

            </Layout>
        </Suspense>
    )
}

export default Explore