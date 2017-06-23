import { combineReducers } from 'redux'
import ForumFavorite from './ForumFavorite'
import ForumList from './ForumList';

const glimmerReducers = combineReducers({

    ForumFavorite,
    ForumList

})

export default glimmerReducers