const addNodeToCanvas = (newNode) => ({
    type: 'ADD_NODE_ACTION',
    payload:newNode
})

const addNodeToDatabase = (newNode) => ({
    type: 'ADD_NODE_DB',
    payload:newNode
})
const clearCanvas = (nullCanvas) => ({
    type: 'CLEAR_CANVAS',
    payload:nullCanvas
})
const fullscreen =() => ({
    type: 'SET_FULLSCREEN',
})
const exitFullscreen =() => ({
    type: 'EXIT_FULLSCREEN'
})
const addNodeToDBError =() => ({
        type: 'ADD_NODE_DB_ERROR'
    })


export {
    addNodeToCanvas,
    addNodeToDatabase,
    clearCanvas,
    fullscreen,
    exitFullscreen,
    addNodeToDBError
}