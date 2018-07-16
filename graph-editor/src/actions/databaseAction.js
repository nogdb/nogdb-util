const executeConsole = SQL => ({
    type: 'EXECUTE',
    payload: SQL
  });

const addRespondFromConsole = (respond) => ({
    type: 'CONSOLE_RESPOND',
    payload: respond
})



  export {
      executeConsole,
      addRespondFromConsole
  }