import { combineReducers } from 'redux'
import graphCanvasReducer from './graphCanvasReducer'
import rescaleReducer from './rescaleReducer';
import dataReducer from './dataRecuder';


export default combineReducers({
  graph: graphCanvasReducer,
  scale: rescaleReducer,
  data : dataReducer,
})