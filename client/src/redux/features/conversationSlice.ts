import { User } from '@/utils/types';
import { createSlice } from '@reduxjs/toolkit';

export interface conversationSlice {
    conversations: {
        user: User;
        isOnline?: boolean
        lastTime?: Date
        typing: boolean
    }[];
    conversationsCollapse: {
        user: User;
    }[]
}

const initialState: conversationSlice = {
    conversations: [],
    conversationsCollapse: []
};
export const conversationSlice: any = createSlice({
    name: 'conversationSlice',
    initialState,
    reducers: {
        addConversation: (state, action) => {
           if(state.conversations.length >= 4){
              state.conversationsCollapse = [action.payload, ...state.conversationsCollapse]
              state.conversations = state.conversations.filter(conversation => conversation.user.id !== action.payload.user.id)
           }else{
            if (!state.conversations.some(conversation => conversation.user.id === action.payload.user.id)) {
                state.conversations = [action.payload, ...state.conversations];
                state.conversationsCollapse = state.conversationsCollapse.filter(conversation => conversation.user.id !== action.payload.user.id)
            }
           }
        },
        removeConversation: (state, action) => {
            state.conversations = state.conversations.filter(conversation => conversation.user.id !== action.payload.id)
        },
        addCollapseConversation: (state, action) => {
            state.conversationsCollapse = [action.payload, ...state.conversationsCollapse]
            state.conversations = state.conversations.filter(conversation => conversation.user.id !== action.payload.user.id)
        },
        removeCollapseConversation: (state, action) => {
            state.conversationsCollapse = state.conversationsCollapse.filter(conversation => conversation.user.id !== action.payload.user.id)
            state.conversations = [action.payload, ...state.conversations];
        }
    },
});

// Action creators are generated for each case reducer function
export const { addConversation, removeConversation, addCollapseConversation, removeCollapseConversation } = conversationSlice.actions;

export default conversationSlice.reducer;
