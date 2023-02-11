import { addConversation, conversationSlice } from '@/redux/features/conversationSlice';
import { RootState } from '@/redux/store';
import { User } from '@/utils/types'
import moment from 'moment';
import { NextPage } from 'next'
import Image from 'next/image';
import React, { useCallback } from 'react'
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

const ChatUser: NextPage<{ user: User , isOnline: boolean , lastTime: Date}> = ({user , isOnline , lastTime }) => {
    const dispatch = useDispatch();
    const { conversations }: conversationSlice | any = useSelector<RootState>(
        (state) => state.conversations
    );
    const handleOpenMessage = useCallback(async () => {
        try {
                dispatch(
                    addConversation({
                        user: {
                            id: user?.id,
                            name: user?.name,
                            image: user?.image,
                        },
                        isTyping: false,
                        isOnline,
                        lastTime 
                    })
                );
        } catch (error: any) {
            toast.error(error.message);
        }
    }, [conversations,user]);

  return (
    <div
    onClick={handleOpenMessage}
    className="hover:bg-gray-200 cursor-pointer py-1 rounded-lg flex items-center space-x-4 px-3 mx-2">
        <Image width={100} height={100} className=" object-cover lg:w-10 lg:h-10 w-8 h-8 rounded-full " src={user?.image} alt="" />
        <div className="flex-1">
            <span className="text-dark font-semibold text-sm">{user?.name}</span>
        </div>
        {lastTime &&
        <span className="lg:text-sm text-xs font-semibold text-light rounded-lg bg-primary p-1">{`${moment(new Date(lastTime), "x").fromNow()}`}</span>
        }
        {isOnline && 
        <div className="border-light bg-[#85c240] animate-ripple border-[3px] w-[.90rem] h-[.90rem] rounded-full"></div>
        }
    </div>
  )
}

export default React.memo(ChatUser)