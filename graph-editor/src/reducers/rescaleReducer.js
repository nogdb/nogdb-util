const componentScale = {
    isFullscreen : false,
    nodeMenu : false,
    edgeMenu : false
}

const rescaleReducer = (state = componentScale,action) => {
    switch(action.type){
        case 'SET_FULLSCREEN':
        return  {
            ...state,
            isFullscreen:true
          }
          break;
        
        case 'EXIT_FULLSCREEN':
        return  {
              ...state,
              isFullscreen:false
            }
            break;
///////////////////////////////////////////////////////////////////////

        case 'SHOW_NODE_MENU':
        return  {
              ...state,
              nodeMenu:true
            }
            break;
        
        case 'HIDE_NODE_MENU':
        return  {
              ...state,
              nodeMenu:false
            }
            break;
//////////////////////////////////////////////////////////////////////////
        case 'SHOW_EDGE_MENU':
        return {
            ...state,
            edgeMenu:true
        }
        break;

        case 'HIDE_EDGE_MENU':
        return {
            ...state,
            edgeMenu:false
        }
        break;
        


        default:
            state = {
              ...state
            }
            return state;
            break;
    }
}
export default rescaleReducer;