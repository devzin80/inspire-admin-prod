import { configureStore } from '@reduxjs/toolkit'
import { categoryApi } from './services/category'
import { classApi } from './services/class'
import { subCategoryApi } from './services/subCagegory'
import { subjectApi } from './services/subject'
import { bookApi } from './services/book'
import imageReducer from './slices/imageSlice'
import { setupListeners } from '@reduxjs/toolkit/query'
import { chapterApi } from './services/chapter'
import { topicApi } from './services/topic'
import { couponApi } from './services/coupon'
import { logoApi } from './services/logo'
import { footerApi } from './services/footer'
import { aboutApi } from './services/about'
import { mediaApi } from './services/media'
import { bannerApi } from './services/banner'
import { promotionalBannerApi } from './services/promotionalBanner'
import { videoApi } from './services/video'
import { noteApi } from './services/note'
import { quizApi } from './services/quiz'

export const store = configureStore({
    reducer: {
        image: imageReducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [classApi.reducerPath]: classApi.reducer,
        [subCategoryApi.reducerPath]: subCategoryApi.reducer,
        [subjectApi.reducerPath]: subjectApi.reducer,
        [bookApi.reducerPath]: bookApi.reducer,
        [chapterApi.reducerPath]: chapterApi.reducer,
        [topicApi.reducerPath]: topicApi.reducer,
        [couponApi.reducerPath]: couponApi.reducer,
        [logoApi.reducerPath]: logoApi.reducer,
        [footerApi.reducerPath]: footerApi.reducer,
        [aboutApi.reducerPath]: aboutApi.reducer,
        [mediaApi.reducerPath]: mediaApi.reducer,
        [bannerApi.reducerPath]: bannerApi.reducer,
        [videoApi.reducerPath]: videoApi.reducer,
        [noteApi.reducerPath]: noteApi.reducer,
        [quizApi.reducerPath]: quizApi.reducer,
        [promotionalBannerApi.reducerPath]: promotionalBannerApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat([
            categoryApi.middleware,
            classApi.middleware,
            subCategoryApi.middleware,
            subjectApi.middleware,
            bookApi.middleware,
            chapterApi.middleware,
            topicApi.middleware,
            couponApi.middleware,
            logoApi.middleware,
            footerApi.middleware,
            aboutApi.middleware,
            videoApi.middleware,
            noteApi.middleware,
            mediaApi.middleware,
            bannerApi.middleware,
            promotionalBannerApi.middleware,
            quizApi.middleware,
        ]),
})

setupListeners(store.dispatch)
