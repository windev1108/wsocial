import { removeCollapseConversation } from '@/redux/features/conversationSlice';
import Image from 'next/image';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

const ConversationCollapse: React.FC<{
    name: string;
    image: string;
    id: string;
    conversationId?: string;
}> = ({ id,  name, image, conversationId }) => {
    const dispatch = useDispatch();

    const handleRemoveConversationCollapse = useCallback(() => {
        dispatch(removeCollapseConversation({ user: {
            id,
            name,
            image
        }}))
    },[])
    return (
        <div 
        onClick={handleRemoveConversationCollapse}
        className="group relative mx-6 cursor-pointer">
            <Image
                src={image}
                width={1000}
                height={1000}
                className="w-14 h-14 object-cover rounded-full shadow-md"
                alt=""
            />
            <span className="group-hover:block hidden absolute top-0 right-[120%] font-semibold whitespace-nowrap  px-4 py-2 text-dark bg-light shadow-md rounded-lg">
               {name}
            </span>
        </div>
    );
};

export default React.memo(ConversationCollapse);
