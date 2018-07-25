const componentScale = {
  isFullscreen: false,
  nodeMenu: false,
  edgeMenu: false,
  historyBar: false,
  editAlert : false,
};

const rescaleReducer = (state = componentScale, action) => {
  switch (action.type) {
    case "SET_FULLSCREEN":
      return {
        ...state,
        isFullscreen: true
      };

    case "EXIT_FULLSCREEN":
      return {
        ...state,
        isFullscreen: false
      };
    ///////////////////////////////////////////////////////////////////////

    case "SHOW_NODE_MENU":
      return {
        ...state,
        nodeMenu: true
      };

    case "HIDE_NODE_MENU":
      return {
        ...state,
        nodeMenu: false
      };
    //////////////////////////////////////////////////////////////////////////
    case "SHOW_EDGE_MENU":
      return {
        ...state,
        edgeMenu: true
      };

    case "HIDE_EDGE_MENU":
      return {
        ...state,
        edgeMenu: false
      };

    //////////////////////////////////////////////////////////////////////////
    case "DISPLAY_HISTORY":
      return {
        ...state,
        historyBar: true
      };

    case "UNDISPLAY_HISTORY":
      return {
        ...state,
        historyBar: false
      };
    case "ALERT_EDIT_MESSAGE_TRUE":
      return {
        ...state,
        editAlert:true
      };

    case "ALERT_EDIT_MESSAGE_FALSE":
      return {
        ...state,
        editAlert: false
      };

    default:
      state = {
        ...state
      };
      return state;
  }
};
export default rescaleReducer;
