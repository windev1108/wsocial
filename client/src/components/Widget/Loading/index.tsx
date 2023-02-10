import React from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { GridLoader, ClipLoader } from 'react-spinners';

export const LoadingPage = () => {
    return (
        <div className="fixed before:absolute before:top-0 before:bottom-0 before:right-0 before:left-0 before:bg-primary before:bg-opacity-100 top-0 left-0 bottom-0 right-0 z-[10000] bg-no-repeat bg-cover  bg-[url('../assets/images/bg-social.png')] flex justify-center items-center">
            <GridLoader color="#fff" size={25} />
        </div>
    );
};

export const LoadingComponent = () => {
    return (
        <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[0%]">
            <ClipLoader color="#377dff" />
        </div>
    );
};

export const LoadingButton = () => {
    return (
        <button className="cursor-not-allowed py-2 flex justify-center items-center space-x-2">
            <AiOutlineLoading3Quarters className="animate-spin duration-500 transition-all ease-linear text-primary text-2xl" />
        </button>
    );
};

