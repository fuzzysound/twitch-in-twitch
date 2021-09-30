import { combineReducers } from 'redux'
import contentReducer from './contentSlice'
import favoriteReducer from './favoriteSlice'

const rootReducer = combineReducers({
  content: contentReducer,
  favorite: favoriteReducer
})

export default rootReducer
