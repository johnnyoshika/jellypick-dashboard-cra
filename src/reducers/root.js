import { combineReducers } from 'redux';
import entities from './entities/';
import routes from './routes/';
import likeState from './likeState';
import commentState from './commentState';
import refresher from './refresher';
import uploader from './uploader';
import subscriber from './subscriber';
import { reducer as toastrReducer } from 'react-redux-toastr';

export default combineReducers({
  entities,
  routes,
  likeState,
  commentState,
  refresher,
  uploader,
  subscriber,
  toastr: toastrReducer
});
