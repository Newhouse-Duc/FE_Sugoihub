import { createAsyncThunk } from '@reduxjs/toolkit'
import { handleAddFriend, handleAllFriendShip, handleUpdateFriendShip } from '../../services/user';


export const addFriend = createAsyncThunk(
    'friend/add friend',
    async ({ data }, { rejectWithValue }) => {
        try {
            return await handleAddFriend(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)


export const allfriendship = createAsyncThunk(
    'friend/friendship',
    async ({ id }, { rejectWithValue }) => {
        try {
            return await handleAllFriendShip(id)
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const updateFriend = createAsyncThunk(
    'friend/ update',
    async ({ data }, { rejectWithValue }) => {
        try {
            return await handleUpdateFriendShip(data)
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)