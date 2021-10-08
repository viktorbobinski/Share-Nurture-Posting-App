var input = {//change that textinput returns false and make it throw an error so everywhere the stupid check can be ommited
  
  warningButtonInput(message) {
    var response = ui.alert("Warning", message, ui.ButtonSet.YES_NO);
    if (response == ui.Button.CANCEL || response == ui.Button.CLOSE) {
      throw new Error("Incorrect input in warningButtonInput. Provided response: " + response);
    }
    return response;
  },
  
  buttonInput(message) {
    var response = ui.alert(message, ui.ButtonSet.YES_NO);
    if (response == ui.Button.CANCEL || response == ui.Button.CLOSE) {
      throw new Error("Incorrect input in buttonInput. Provided response: " + response);
    }
    return response;
  },
  
  numberInput(message) {
    var response = ui.prompt(message, ui.ButtonSet.OK).getResponseText();
    response = parseInt(response, 10);
    if (!Number.isInteger(response) || response == ui.Button.CANCEL || response == ui.Button.CLOSE) {
      throw new Error("Incorrect input in numberInput. Provided response: " + response); 
    }
    return response;
  },
  
  textInput(message) {
    var response = ui.prompt(message, ui.ButtonSet.OK).getResponseText();
    if (response == "" || response == ui.Button.CANCEL || response == ui.Button.CLOSE) {
      throw new Error("Incorrect input in textInput. Provided response " + response);
    }
    return response;
  },
}
