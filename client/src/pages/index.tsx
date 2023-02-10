
import Feed from '@/components/Main/Feed'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { LoadingPage } from '@/components/Widget/Loading'
const Layout = dynamic(() => import('@/components/Layout'), { ssr: false })
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
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
      props: {
      },
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



const Home = () => {

  return (
    <Suspense fallback={<LoadingPage />}>
      <Layout>
        <div className="grid grid-cols-12 place-content-center place-items-center rounded-xl w-full bg-secondary overflow-hidden">
          {/* Feed */}
          <Feed />
        </div>
      </Layout>
    </Suspense>
  )
}
export default Home


