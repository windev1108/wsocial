import { useMutation, useQuery } from '@apollo/client';
import React, { memo, useState, useMemo } from 'react';
import {
    AiFillLinkedin,
    AiOutlineLoading3Quarters,
    AiOutlineTool,
} from 'react-icons/ai';
import {
    BsFacebook,
    BsGenderAmbiguous,
    BsGenderFemale,
    BsGenderMale,
    BsInstagram,
} from 'react-icons/bs';
import { GiEarthAfricaEurope } from 'react-icons/gi';
import USER_OPERATIONS from '@/graphql/operations/user';
import { useSession } from 'next-auth/react';
import { LoadingComponent } from '../Loading';
import { toast } from 'react-hot-toast';
import USER_MUTATIONS from '@/graphql/operations/user';
import { IoLogoTwitter } from 'react-icons/io';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

const EditProfile = () => {
    const [state, setState] = useState<any>({
        phoneCountry: '',
        isChangeData: false,
    });
    const { phoneCountry, isChangeData } = state;
    const [formData, setFormData] = useState<any>({});
    const {
        name,
        email,
        nickname,
        liveAt,
        birthday,
        phone,
        gender,
        website,
        facebook,
        instagram,
        twitter,
        linkedin,
    } = formData;
    const { data: session } = useSession();
    const { data, loading, refetch } = useQuery(USER_OPERATIONS.Queries.getUserById, {
        variables: {
            id: session?.user.id,
        },
    });
    const [updateUser, { loading: loadingUpdate }] = useMutation(
        USER_MUTATIONS.Mutations.updateUser
    );
    const { t } = useTranslation()
    useMemo(() => {
        setState({
            ...state,
            isChangeData: Object.values(formData).some((i) => i !== ''),
        });
    }, [formData]);

    const handleSubmitSetting = async () => {
        try {
            if ((phone && `${phone}`.length < 9) || `${phone}`.length > 11) {
                toast.error('Please enter a valid phone number', {
                    duration: 2000,
                });
                return;
            }
            await updateUser({
                variables: {
                    userId: session?.user.id,
                    user: {
                        ...formData,
                        phone: `${phoneCountry}${
                            phone || data?.getUserById.phone
                        }`,
                        birthday: new Date(birthday),
                    },
                },
            });
            await refetch();
            toast.success('Update user successfully!', {
                duration: 2000,
            });
            setFormData({});
            setState({
                avatar: {},
                blobAvatar: '',
                phoneCountry: '84',
            });
        } catch (err) {
            toast.error(err as string, { duration: 200 });
        }
    };

    return (
        <>
            {loading ? (
                <LoadingComponent />
            ) : (
                <div className="p-6 space-y-3  overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 overflow-x-hidden lg:h-full h-[70%]">
                    <div className="flex items-center space-x-2">
                        <AiOutlineTool size={20} className="text-primary" />
                        <h1 className="lg:text-lg text-base font-bold text-dark first-letter:uppercase lowercase">
                            {`${t('common:edit')} ${t('common:profile')}`}
                        </h1>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-2">
                            <span className="font-semibold lg:text-base text-sm">{t('common:fullname')}</span>
                            <input
                                defaultValue={data?.getUserById?.name}
                                value={name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                className="placeholder:first-letter:uppercase placeholder:lowercase outline-none border-[1px] border-gray-300 px-4 py-2 rounded-lg lg:text-base text-sm"
                                type="text"
                                placeholder={`${t("common:enter")} ${t("common:fullname")}`}
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <span className="font-semibold lg:text-base text-sm">{t("common:nickname")}</span>
                            <input
                                defaultValue={data?.getUserById?.nickname}
                                value={nickname}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        nickname: e.target.value,
                                    })
                                }
                                className="placeholder:lowercase outline-none border-[1px] border-gray-300 px-4 py-2 rounded-lg lg:text-base text-sm"
                                type="text"
                                placeholder={`${t('common:enter')} ${t('common:nickname')}`}
                            />
                        </div>
                        <div className="flex flex-col space-y-2 lg:text-base text-sm">
                            <span className="font-semibold">Email</span>
                            <input
                                defaultValue={data?.getUserById?.email}
                                value={email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                                className="outline-none border-[1px] border-gray-300 px-4 py-2 rounded-lg lg:text-base text-sm"
                                type="email"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="flex flex-col space-y-2 lg:text-base text-sm">
                            <span className="font-semibold first-letter:uppercase">{t('common:birth_day')}</span>
                            <input
                                defaultValue={moment(
                                    data?.getUserById.birthday,
                                    'x'
                                ).format('YYYY-MM-DD')}
                                value={birthday}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        birthday: e.target.value,
                                    })
                                }
                                className="outline-none border-[1px] border-gray-300 px-4 py-2 rounded-lg"
                                type="date"
                            />
                        </div>

                        <div className="flex flex-col space-y-2 lg:text-base text-sm">
                            <span className="font-semibold first-letter:uppercase">{t('common:gender')}</span>
                            <div className="grid grid-cols-3 order-[1px] w-full border-gray-300  border-[1px] rounded-lg ">
                                <div
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            gender: 'MALE',
                                        })
                                    }
                                    className={`${
                                        gender === 'MALE' ||
                                        data?.getUserById.gender === 'MALE'
                                            ? 'bg-primary text-light'
                                            : 'bg-light text-dark'
                                    } flex items-center justify-center space-x-2 rounded-l-lg cursor-pointer  text-center px-4 py-2`}>
                                    <BsGenderMale />
                                    <span className="font-semibold lg:block hidden">{t('common:male')}</span>
                                </div>
                                <div
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            gender: 'FEMALE',
                                        })
                                    }
                                    className={`${
                                        gender === 'FEMALE' ||
                                        data?.getUserById.gender === 'FEMALE'
                                            ? 'bg-primary text-light'
                                            : 'bg-light text-dark'
                                    } flex items-center justify-center space-x-2 cursor-pointer  text-center px-4 py-2 border-x-[1px]`}>
                                    <BsGenderFemale />
                                    <span className="font-semibold lg:block hidden">
                                      {t('common:female')}
                                    </span>
                                </div>
                                <div
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            gender: 'OTHER',
                                        })
                                    }
                                    className={`${
                                        gender === 'OTHER' ||
                                        data?.getUserById.gender === 'OTHER'
                                            ? 'bg-primary text-light'
                                            : 'bg-light text-dark'
                                    } first-letter:uppercase lowercase flex items-center justify-center  space-x-2 rounded-r-lg cursor-pointer  text-center px-4 py-2`}>
                                    <BsGenderAmbiguous />
                                    <span className="font-semibold lg:block hidden first-letter:uppercase">{t('common:other')}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-2 lg:text-base text-sm">
                            <span className="font-semibold first-letter:uppercase">{t('common:phone_number')}</span>
                            <div className="flex border-[1px]  border-gray-300  rounded-lg">
                                <select
                                    onChange={(e) =>
                                        setState({
                                            ...state,
                                            phoneCountry: e.target.value,
                                        })
                                    }
                                    className="px-2 text-center border-r-[1px] border-gray-300 outline-none"
                                    defaultValue={data?.getUserById.phone?.slice(0, 2)}
                                    value={phoneCountry}>
                                    <option className="outline-none border-none" value="1">+1</option>
                                    <option className="outline-none border-none" value="84">+84</option>
                                </select>
                                <input
                                defaultValue={data?.getUserById.phone?.slice(2)}
                                    value={phone}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            phone: e.target.value,
                                        })
                                    }
                                    className="placeholder:first-letter:!uppercase py-2 w-full outline-none px-4"
                                    type="text"
                                    placeholder={`${t('common:enter')} ${t('common:phone_number')}`}
                                  />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-2 lg:text-base text-sm">
                            <span className="font-semibold first-letter:uppercase">{t('common:website')}</span>
                            <input
                                defaultValue={data?.getUserById.website}
                                value={website}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        website: e.target.value,
                                    })
                                }
                                className="placeholder:first-letter:!uppercase outline-none border-[1px] border-gray-300 px-4 py-2 rounded-lg"
                                type="text"
                                placeholder={`${t('common:enter')} ${t('common:website')}`}
                            />
                        </div>

                        <div className="flex flex-col space-y-2 lg:text-base text-sm">
                            <span className="font-semibold first-letter:uppercase">{t('common:living_at')}</span>
                            <input
                                defaultValue={data?.getUserById.liveAt}
                                value={liveAt}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        liveAt: e.target.value,
                                    })
                                }
                                className="placeholder:first-letter:!uppercase outline-none border-[1px] border-gray-300 px-4 py-2 rounded-lg"
                                type="text"
                                placeholder={`${t('common:enter')} ${t('common:living_at')}`}
                            />
                        </div>

                        <div className="col-span-2 py-4 flex space-x-2 items-center">
                            <GiEarthAfricaEurope
                                size={20}
                                className="text-primary"
                            />
                            <span className="font-bold text-dark lg:text-lg text-base first-letter:uppercase">
                                {t('common:social_link')}
                            </span>
                        </div>

                        <div className="flex flex-col space-y-2 lg:text-base text-sm">
                            <div className="flex items-center space-x-2">
                                <BsFacebook className="text-xl text-primary" />
                                <span className="font-semibold">Facebook</span>
                            </div>
                            <input
                                defaultValue={data?.getUserById.facebook}
                                value={facebook}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        facebook: e.target.value,
                                    })
                                }
                                className="placeholder:first-letter:!uppercase outline-none border-[1px] border-gray-300 px-4 py-2 rounded-lg"
                                type="text"
                                placeholder={`${t('common:enter')} Facebook`}
                            />
                        </div>

                        <div className="flex flex-col space-y-2 lg:text-base text-sm">
                            <div className="flex items-center space-x-2">
                                <IoLogoTwitter className="text-xl text-primary" />
                                <span className="font-semibold">Twitter</span>
                            </div>
                            <input
                                defaultValue={data?.getUserById.twitter}
                                value={twitter}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        twitter: e.target.value,
                                    })
                                }
                                className="placeholder:first-letter:!uppercase outline-none border-[1px] border-gray-300 px-4 py-2 rounded-lg"
                                type="text"
                                placeholder={`${t('common:enter')} Twitter`}
                            />
                        </div>

                        <div className="flex flex-col space-y-2 lg:text-base text-sm">
                            <div className="flex items-center space-x-2">
                                <BsInstagram className="text-2xl bg-gradient-to-tr from-[#f79402] via-[#f70a59] to-pink-[#f501c1] rounded-xl overflow-hidden text-white" />
                                <span className="font-semibold">Instagram</span>
                            </div>
                            <input
                                defaultValue={data?.getUserById.instagram}
                                value={instagram}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        instagram: e.target.value,
                                    })
                                }
                                className="placeholder:first-letter:!uppercase outline-none border-[1px] border-gray-300 px-4 py-2 rounded-lg"
                                type="text"
                                placeholder={`${t('common:enter')} Instagram`}
                            />
                        </div>

                        <div className="flex flex-col space-y-2 lg:text-base text-sm">
                            <div className="flex items-center space-x-2">
                                <AiFillLinkedin className="text-2xl text-[#0A66C2]" />
                                <span className="font-semibold">LinkedIn</span>
                            </div>
                            <input
                                defaultValue={data?.getUserById.linkedin}
                                value={linkedin}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        linkedin: e.target.value,
                                    })
                                }
                                className="placeholder:first-letter:!uppercase outline-none border-[1px] border-gray-300 px-4 py-2 rounded-lg "
                                type="text"
                                placeholder={`${t('common:enter')} LinkedIn`}
                            />
                        </div>

                        <div className="col-span-2 py-2 flex justify-end space-x-2">
                            <button
                                onClick={handleSubmitSetting}
                                disabled={!isChangeData}
                                className={`${
                                    !isChangeData &&
                                    'cursor-not-allowed bg-opacity-50'
                                } rounded-lg px-4 py-1 text-light bg-primary first-letter:uppercase`}>
                                {loadingUpdate ? (
                                    <AiOutlineLoading3Quarters className="animate-spin duration-500 mx-4 my-1 ease-linear transition-all" />
                                ) : (
                                    t('common:submit')
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default memo(EditProfile);
