import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const fetchMovieById = createAsyncThunk("Movie/getMovie", async (payload) => {
    console.log(`to jest id: ${payload}`);
    try {
        const response = await axiosInstance.get(`/movie/${payload}`);
        if(response.status !== 200) {
            throw new Error("No movie");
        }
        return response.data;
        }
        catch (error) {
        throw new Error(error.message);
    }
});

export const sendComment = createAsyncThunk("Movie/sendComment", async (payload) => {
    try {
        const response = await axiosInstance.post(`/movie/comment/${payload.id}`, {
            comment: payload.comment
        });
        if(response.status !== 200) {
            throw new Error("No movie");
        }
        return response.data;
        }
        catch (error) {
        throw new Error(error.message);
    }
});

const movieSlice = createSlice({
    name: 'Movie',
    initialState: {
        id: null,
        title: null,
        tagline: null,
        released: null,
        tagline: null,
        comments: [],
        poster_path: null,
        director: [],
        actors: [],
        image_urls: [],
        rating: null,
        genre: null,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchMovieById.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(fetchMovieById.fulfilled, (state, action) => {
            state.loading = false;
            state.id = action.payload.movie.id;
            state.title = action.payload.movie.title;
            state.released = action.payload.movie.released;
            state.tagline = action.payload.movie.tagline;
            state.poster_path = action.payload.movie.poster_path;
            state.director = action.payload.director;
            state.actors = action.payload.actors;
            state.image_urls = action.payload.movie.image_urls;
            state.rating = action.payload.movie.rating;
            state.genre = action.payload.movie.genre;
            state.comments = action.payload.comments;
        });
        builder.addCase(fetchMovieById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    }
});

export default movieSlice.reducer;