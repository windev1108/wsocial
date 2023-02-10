import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { ImFacebook, ImHangouts } from 'react-icons/im'
import { FcGoogle } from 'react-icons/fc'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { toast, Toaster } from 'react-hot-toast'
import { signIn, useSession } from 'next-auth/react'
import { GetServerSideProps } from 'next'
import { unstable_getServerSession as getServerSession } from "next-auth";
import { useRouter } from 'next/router'
import { authOptions } from '@/pages/api/auth/[...nextauth]'


interface State {
    email: string,
    password: string,
    dataRemember: RememberData
    isRememberMe: boolean
    isShowPassword: boolean,
}

interface RememberData {
    email: string
    password: string
}



const Signin = () => {

    const handleSignIn = (provider: string) => {
        signIn(provider).catch((err) => {
            console.log(err);
            toast.error(`Unable to sign in with ${provider}`, {
                position: "bottom-right",
            });
        });
    };


    return (
        <>
            <Toaster />
            <div className="h-screen w-screen flex justify-center items-center overflow-hidden bg-no-repeat bg-cover bg-[url('../assets/images/bg-social.png')]">
                <div className="bg-light rounded-lg p-8 shadow-md lg:w-[30%] w-[90%] ">
                    <div className="flex cursor-pointer w-full justify-center my-8 space-x-1 items-center">
                        <ImHangouts className="text-primary text-5xl" />
                        <span className="text-4xl text-dark font-bold" >Signin</span>
                    </div>
                    <div className="!w-full space-y-4">
                        <div
                            onClick={() => handleSignIn("facebook")}
                            className="w-full hover:bg-blue-700 transition-all duration-500 shadow-md border-[1px] border-gray-200 cursor-pointer rounded-md flex space-x-2 justify-center items-center px-2 py-1 bg-primary">
                            <ImFacebook className="text-xl text-light" />
                            <span className="text-light">Facebook</span>
                        </div>
                        <div
                            onClick={() => handleSignIn("google")}
                            className="w-full hover:bg-gray-200 transition-all duration-500 shadow-md border-[1px] border-gray-200 cursor-pointer rounded-md flex space-x-2 justify-center items-center px-2 py-1 bg-light">
                            <FcGoogle className="text-xl text-light" />
                            <span className="text-text">Google</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signin


export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await getServerSession(req, res, authOptions);

    if (session?.user) {
        return {
            redirect: {
                destination: "/",
                permanent: true,
            },
            props: {},
        };
    }

    return {
        props: {
            session,
        },
    };
};