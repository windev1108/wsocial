import { SocketUser } from '@/utils/types';
import { createSlice } from '@reduxjs/toolkit';

export interface sessionSlice {
    user: {
        id: string
        name: string
        image: string
    },
    users: SocketUser[]
}

const initialState: sessionSlice = {
    user: {
        id: '',
        name: '',
        image: ''
    },
    users: []
};
export const sessionSlice: any = createSlice({
    name: 'sessionSlice',
    initialState,
    reducers: {
        setSession: (state, action) => {
            state.user = action.payload
        },
        setSessionUsers: (state,action) => {
            state.users = action.payload
        }
    },
});

// Action creators are generated for each case reducer function
export const { setSession , setSessionUsers } = sessionSlice.actions;

export default sessionSlice.reducer;
