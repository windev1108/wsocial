import { createSlice } from '@reduxjs/toolkit';
import { Socket } from 'socket.io-client';

export interface socketSlice {
    socket: Socket | null 
    
}

const initialState: socketSlice = {
    socket: null
};
export const socketSlice: any = createSlice({
    name: 'socketSlice',
    initialState,
    reducers: {
        setSocket: (state, action) => {
            state.socket = action.payload
        },
    },
});

// Action creators are generated for each case reducer function
export const { setSocket} = socketSlice.actions;

export default socketSlice.reducer;
