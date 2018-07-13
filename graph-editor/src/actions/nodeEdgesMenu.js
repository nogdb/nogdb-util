const showNodeMenu = () => ({
    type: 'SHOW_NODE_MENU',
})
const hideNodeMenu = () => ({
    type: 'HIDE_NODE_MENU',
})
const showEdgeMenu = () => ({
    type: 'SHOW_EDGE_MENU',
})
const hideEdgeMenu = () => ({
    type: 'HIDE_EDGE_MENU',
})
const changeSizes = (nodeID,sizes)=>({
    type: 'EDIT_SIZE',
    nodeID: nodeID,
    size:sizes
})
const changeColorNode = (nodeID,color)=>({
    type:'CHANGE_COLOR_NODE',
    nodeID: nodeID,
    color:color
})

export {
    showNodeMenu,
    hideNodeMenu,
    showEdgeMenu,
    hideEdgeMenu,
    changeSizes,
    changeColorNode,
}