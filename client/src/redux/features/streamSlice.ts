import { createSlice } from '@reduxjs/toolkit';

export interface callStreamSlice {
    stream: {
        isOpen: boolean
        caller: {
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
        setOpenAnswer: (state,action) => {
            state.answer = action.payload
            state.stream = {
                isOpen: false,
                caller: null
            }
        }
    },
});

// Action creators are generated for each case reducer function
export const { setOpenStream , setOpenAnswer } = callStreamSlice.actions;

export default callStreamSlice.reducer;
