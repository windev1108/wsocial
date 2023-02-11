import { createSlice } from '@reduxjs/toolkit';

export interface callStreamSlice {
    stream: {
        isOpen: boolean
        caller: {
            id: string
            name: string
            image: string
        } | null
        receiver: {
            id: string
            name: string
            image: string
        } | null
    },
    answer: {
        isOpen: boolean
        caller: {
            id: string,
            name: string
            image: string
        } | null
    }
    
}

const initialState: callStreamSlice = {
    stream: {
        isOpen: false,
        caller: {
            id: "",
            name: "",
            image: "",
        },
        receiver: {
            id: "",
            name: "",
            image: "",
        },
    },
    answer: {
        isOpen: false,
        caller: {
            id: "",
            name: "",
            image: "",
        } 
    }
};
export const callStreamSlice: any = createSlice({
    name: 'callStreamSlice',
    initialState,
    reducers: {
        setOpenStream: (state, action) => {
            state.stream = action.payload
            state.answer = {
                isOpen: false,
                caller: null
            }
        },
    },
});

// Action creators are generated for each case reducer function
export const { setOpenStream  } = callStreamSlice.actions;

export default callStreamSlice.reducer;
