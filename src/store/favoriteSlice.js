import { createSlice } from '@reduxjs/toolkit'

const MAX_REGISTER = 10

const initialState = {
    favorites: []
}

const favoriteSlice = createSlice({
    name: 'favorite',
    initialState,
    reducers: {
        addToFavorites(state, action) {
            if (state.favorites.length >= MAX_REGISTER) {
                alert(chrome.i18n.getMessage("warn_fav_max_exceeded", MAX_REGISTER.toString()))
            } else {
                if (!state.favorites.includes(action.payload)) {
                    state.favorites.push(action.payload)
                }
            }
        },
        removeFromFavorites(state, action) {
            if (state.favorites.includes(action.payload)) {
                const idx = state.favorites.indexOf(action.payload)
                state.favorites.splice(idx, 1)
            }
        },
        resetFavoriteState(state, action) {
            state.favorites = initialState.favorites
        }
    }
})

const selectFavorites = state => state.favorite.favorites

const selectShowFavoritesContainer = state => state.favorite.favorites.length > 0

export const {
    addToFavorites,
    removeFromFavorites,
    resetFavoriteState
} = favoriteSlice.actions

export {
    selectFavorites,
    selectShowFavoritesContainer
}

export default favoriteSlice.reducer