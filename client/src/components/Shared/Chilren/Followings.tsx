import { useMutation } from '@apollo/client';
import { NextPage } from 'next';
import Link from 'next/link';
import React, { useCallback } from 'react';
import { AiFillLinkedin, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { BsFacebook, BsInstagram } from 'react-icons/bs';
import { ImLocation } from 'react-icons/im';
import { IoLogoTwitter } from 'react-icons/io';
import USER_OPERATIONS from '@/graphql/operations/user';
import { toast } from 'react-hot-toast';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';

const FollowingsItem: NextPage<{
    id: string;
    name: string;
    location: string;
    avatar: string;
    linkedinUrl: string;
    facebookUrl: string;
    instagramUrl: string;
    twitterUrl: string;
}> = ({
    id,
    name,
    avatar,
    location,
    linkedinUrl,
    facebookUrl,
    instagramUrl,
    twitterUrl,
}) => {
    const { socket } : any = useSelector<RootState>(state => state.socket)
    const { user } : any = useSelector<RootState>(state => state.session)
    const [unFollowUser, { loading: loadingUnfollow }] = useMutation(
        USER_OPERATIONS.Mutations.unFollowUser
    );

    const unFollowings = useCallback(async () => {
        try {
            const { errors } = await unFollowUser({
                variables: {
                    followingId: id,
                },
                refetchQueries: ['getMyCommunity'],
                awaitRefetchQueries: true,
            });
            if (errors) {
                toast.error('Some thing wrong!');
                return;
            }
            toast.success("Unfollow user success")
            socket?.emit("updateNotification")
        } catch (error: any) {}
    }, []);

    return (
        <div className="bg-light flex-col space-y-4 p-4 rounded-xl border-[1px] border-gray-300">
            <div className="flex space-x-4">
                <Link href={`/profile?id=${id}`}>
                    <img
                        className="object-cover w-11 h-11 rounded-full hover:opacity-60 cursor-pointer"
                        src={avatar}
                        alt=""
                    />
                </Link>
                <div className="flex-col flex-1">
                    <Link href={`/profile?id=${id}`}>
                        <h1 className="text-dark hover:underline cursor-pointer">
                            {name}
                        </h1>
                    </Link>
                    {location &&
                    <div className="flex items-center space-x-1">
                        <ImLocation className="text-xs text-gray-400" />
                        <span className="text-gray-500 text-xs">
                            {location}
                        </span>
                    </div>
                    }
                </div>
            </div>
            {facebookUrl || twitterUrl || instagramUrl || linkedinUrl &&
            <div className="flex justify-center items-center space-x-2">
                {facebookUrl &&
                <Link href={facebookUrl || 'https://www.facebook.com/'}>
                    <BsFacebook className="text-xl text-primary" />
                </Link>
                }
                {twitterUrl &&
                <Link href={twitterUrl || 'https://twitter.com/'}>
                    <IoLogoTwitter className="text-xl text-primary" />
                </Link>
                }
                
                {instagramUrl &&
                <Link href={instagramUrl || 'https://www.instagram.com/'}>
                    <BsInstagram className="text-2xl bg-gradient-to-tr from-[#f79402] via-[#f70a59] to-pink-[#f501c1] rounded-xl overflow-hidden text-white" />
                </Link>
                }

                {linkedinUrl &&
                <Link href={linkedinUrl || 'https://www.linkedin.com/'}>
                    <AiFillLinkedin className="text-2xl text-[#0A66C2]" />
                </Link>
                }
            </div>
            }
            <div className="flex gap-2 w-full items-center">
                  {(loadingUnfollow ? (
                        <button className="grid place-items-center hover:bg-blue-700 w-full py-2 rounded-lg bg-primary text-white cursor-not-allowed">
                            <AiOutlineLoading3Quarters className="animate-spin transition-all duration-500 ease-linear text-light" />
                        </button>
                    ) : (
                        <button
                        onClick={unFollowings}
                        className="hover:bg-blue-700 w-full p-1 rounded-lg bg-primary text-white">
                            Unfollow
                        </button>
                    ))}
            </div>
        </div>
    );
};

export default React.memo(FollowingsItem);
