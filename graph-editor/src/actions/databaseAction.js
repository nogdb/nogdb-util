const executeConsole = SQL => ({
    type: 'EXECUTE',
    payload: SQL
  });

const addRespondFromConsole = (respond) => ({
    type: 'CONSOLE_RESPOND',
    payload: respond
})
const getAllClassFromDatabase =(selectID) => ({
    type: 'GET_ALL_CLASS_FROM_DATABASE',
    payload:selectID
  
})

const sendAllClassFromDatabaseToState=(allClass) => ({
    type: 'SEND_ALL_CLASS_FROM_DATABASE_TO_STATE',
    payload : allClass
})





  export {
      executeConsole,
      addRespondFromConsole,
      getAllClassFromDatabase,
      sendAllClassFromDatabaseToState,
     
  }