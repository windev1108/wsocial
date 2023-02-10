import { Post, User } from '@/utils/types';
import { createSlice } from '@reduxjs/toolkit';

export interface isSliceState {
    showFormSubmitPost: {
        isOpen: boolean;
        post: Post | unknown
        author: {
            name: string
            image: string
        }
        avatar: {
            file: any;
            blobFile: {
                url: string;
                type: string
            }
        }
        background: {
            file: any
            blobFile: {
                url: string;
                type: string
            }
        }
    };
    showUserLikes: {
        likers: User[];
        isOpen: boolean;
    };
}

const initialState: isSliceState = {
    showFormSubmitPost: {
        isOpen: false,
        author: {
            name: "",
            image: ""
        },
        post: {},
        avatar: {
            file: {},
            blobFile: {
                type: "",
                url: ''
            }
        },
        background: {
            file: {},
            blobFile: {
                type: '',
                url: ''
            }
        }
    },
    showUserLikes: {
        likers: [],
        isOpen: false,
    },
};
export const isSlice = createSlice({
    name: 'isSlice',
    initialState,
    reducers: {
        setOpenFormSubmitPost: (state, action) => {
            state.showFormSubmitPost = action.payload;
        },
        setShowLikers: (state, action) => {
            state.showUserLikes = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const {
    setOpenFormSubmitPost,
    setShowLikers,
} = isSlice.actions;

export default isSlice.reducer;
