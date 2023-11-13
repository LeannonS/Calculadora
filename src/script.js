let displayValue = "0";
let memoryValue = 0;
let operator = "";
let isResultDisplayed = false;
let isChangeSign = false;
let isMemory = false;
let lastChar = null;

document.addEventListener("DOMContentLoaded", function ()
{
  updateDisplay();

  document.body.addEventListener("keydown", handleKey);
  
  document.getElementById("clearMemory").addEventListener("click", clearMemory);
  document.getElementById("addToMemory").addEventListener("click", addToMemory);
  document.getElementById("subtractFromMemory").addEventListener("click", subtractFromMemory);
  document.getElementById("recallMemory").addEventListener("click", recallMemory);
  document.getElementById("clearDisplay").addEventListener("click", clearDisplay);
  document.getElementById("changeSign").addEventListener("click", changeSign);

  const numberButtons = document.querySelectorAll(".number, .operation");
  numberButtons.forEach(function (button)
  {
    button.addEventListener("click", function ()
    {
      appendToDisplay(button.textContent);
    });
  });
  

  document.getElementById("equal-button").addEventListener("click", calculateResult);
});

function handleKey(e)
{
  switch (e.key)
  {
    case "Backspace":
      clearDisplay();
      break;
      
    case "Enter":
    case "=":
      calculateResult();
      break;
      
    case "*":
      appendToDisplay("*");
      break;
      
    case "+":
      appendToDisplay("+");
      break;
      
    case "-":
      appendToDisplay("-");
      break;
      
    case ":":
      appendToDisplay("/");
      break;
      
    case ".":
      appendToDisplay(".");
      break;
      
    case "0": case "1": case "2": case "3": case "4": case "5": case "6": case "7": case "8": case "9":
      appendToDisplay(e.key);
      break;

    case "e":
      subtractFromMemory();
      break;
      
    case "w":
      addToMemory();
      break;
      
    case "c":
      clearMemory();
      break;
      
    case "r":
      recallMemory();
      break;
  }
}

function isOperator(char)
{
  return ['+', '-', '*', '/'].includes(char);
}

function isDigit(char)
{
  return ['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(char);
}

function updateDisplay()
{
  document.getElementById("result").value = displayValue;
}

function clearMemory()
{
  memoryValue = 0;
}

function addToMemory()
{
  memoryValue += parseFloat(displayValue);
}

function subtractFromMemory()
{
  memoryValue -= parseFloat(displayValue);
}

function recallMemory()
{
  if (isOperator(lastChar) && !isMemory)
  {
    displayValue += memoryValue.toString();
  }
  else
  {
    displayValue = memoryValue.toString();
  }
  updateDisplay();
  isResultDisplayed = false;
  isMemory = true;
}

function clearDisplay()
{
  displayValue = "0";
  isResultDisplayed = false;
  lastChar = '0';
  updateDisplay();

  document.querySelectorAll("button").forEach(function (button)
  {
    button.disabled = false;
  });
}

function changeSign()
{
  isChangeSign = true;
  if(isResultDisplayed || isMemory)
  {
    displayValue = (-parseFloat(displayValue)).toString();
  }
  else
  {
    const index = displayValue.lastIndexOf(lastDigit());
    displayValue = displayValue.substring(0, index) + (-parseFloat(displayValue.substring(index))).toString();
  }
  updateDisplay();
}

function appendToDisplay(value)
{
  if(lastChar === '.' && value === '.')
  {
    return;
  }

  if (isResultDisplayed)
  {
    if(isDigit(value) || value === '.')
    {
      clearDisplay();
    }
    else
    {
      isResultDisplayed = false;
      updateDisplay();
    } 
  }

  if (displayValue === "0" && value !== ".")
  {
    displayValue = value;
  }
  else if (((isOperator(value) && isOperator(lastChar)) || (isOperator(value) && lastChar === '.')) && isChangeSign !== true && isMemory !== true)
  {
    displayValue = displayValue.slice(0, -1) + value;
  }
  else if(isOperator(lastChar) && value === '.' && !isMemory)
  {
    displayValue = displayValue + 0 + value;
  }
  else if(isMemory && isDigit(value))
  {
    displayValue = value;
  }
  else if(isMemory && value === '.')
  {
    displayValue = '0' + value;
  }
  else
  {
    displayValue += value;
  }

  isChangeSign = false;
  isMemory = false;
  lastChar = value;
  updateDisplay();
}

function calculateResult()
{
  if (isResultDisplayed || (isOperator(lastChar) && !isMemory))
  {
    return;
  }

  try
  {
    displayValue = eval(displayValue).toString();
    isResultDisplayed = true;
    updateDisplay();
  }
  catch (error)
  {
    let i = 0;
    displayValue = "Error";
    updateDisplay();

    document.querySelectorAll("button").forEach(function (button)
    {
      button.disabled = true;
      if(i === 4)
      {
        button.disabled = false;
      }
      i++;
    });
  }
}

function lastDigit()
{
  return displayValue.charAt(displayValue.length - 1);
}
