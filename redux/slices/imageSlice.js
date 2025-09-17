// store/slices/imageSlice.js
import { createSlice } from '@reduxjs/toolkit'

const imageSlice = createSlice({
    name: 'image',
    initialState: {
        mode: 'single', // or "multiple"
        images: [], // [{ file, previewUrl }]
    },
    reducers: {
        setMode: (state, action) => {
            state.mode = action.payload
            state.images = [] // reset on mode switch
        },
        addImage: (state, action) => {
            if (state.mode === 'single') {
                state.images = [action.payload] // replace
            } else {
                state.images.push(action.payload) // add more
            }
        },
        removeImage: (state, action) => {
            state.images = state.images.filter((_, i) => i !== action.payload)
        },
        clearImages: (state) => {
            state.images = []
        },
    },
})

export const { setMode, addImage, removeImage, clearImages } =
    imageSlice.actions
export default imageSlice.reducer
