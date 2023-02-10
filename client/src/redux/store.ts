import { configureStore  } from '@reduxjs/toolkit';
import isSliceReducer from '../redux/features/isSlice';
import StreamSlice from './features/streamSlice';
import ConversationReducer from '@/redux/features/conversationSlice'
import SessionReducer from '@/redux/features/sessionSlice'
import SocketReducer from '@/redux/features/socketSlice'



export const store = configureStore({
    reducer: {
        is: isSliceReducer,
        conversations: ConversationReducer,
        stream: StreamSlice,
        session: SessionReducer,
        socket: SocketReducer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
