// TODO need to set up separate tracks for displaying html code and previewing html wysiwyg


// Initialize Firebase
  // var config = {
  //   apiKey: "AIzaSyCMw3ZMN5hu39Gz2m20Jk8mOB_08RasG6g",
  //   authDomain: "mymehproject.firebaseapp.com",
  //   databaseURL: "https://mymehproject.firebaseio.com",
  //   projectId: "mymehproject",
  //   storageBucket: "mymehproject.appspot.com",
  //   messagingSenderId: "700669945958"
  // };
  // firebase.initializeApp(config);

function makeRow(rowLength, rowNumber) {
  var newRow = '<tr>';
  for (i = 0; i < rowLength; i++) {
    newRow += '<td id="r' + i + 'c' + rowNumber + '" class="r' + rowNumber + ' c' + i + '"></td>';
  }
  newRow += '</tr>';
  return newRow;
}

function makeTable(numRows, numCols) {
  var newTable = '<table>';
  for (var j = 0; j < numRows; j++) {
    newTable += makeRow(numCols, j);
  }
  newTable += "</table>";
  return newTable;
}

function showTable(tableHTML) {
  $("#wysiwyg-HTML").append(tableHTML);
}

function showCode(tableHTML) { 
  var parsedHTML = buildParseStack(tableHTML);
  var codeStyleHTML = formatHTMLasCode(parsedHTML);
  $("#code-HTML").html(codeStyleHTML)
  // append(formattedRawHTML, Text);
}

function makeHeadInputRow(numCols) {
  var aRow = makeRow(numCols, 0)
  aRow = aRow.replace(/td/g, 'th');
  aRow = aRow.replace(/r([0-9])/g,  'h$1');
  $("#enter-column-labels").html(aRow);
}

function buildTag(inString, position) {
  var returnTag = inString[position];

  if (inString[position] != '<') {
      console.log("ERROR buildTag called incorrectly");
      return [-1, -1];
  }

  var j = position+1;

  do {
    if (j == inString.length) {
      console.log("ERROR closing '>' not found")
      return [-1, -1]
    }
    returnTag += inString[j];
    j++;
  } while (inString[j-1] != '>');

  return [returnTag, j-1]
}

function buildString(inString, position) {
  var j = position+1;

  if (inString[position] == '<') {
      console.log("ERROR buildString called incorrectly");
      return [-1, -1];
  }
  var returnString = inString[position];

  while (j < inString.length && inString[j] != '<') {
    returnString += inString[j];
    j++;
  }
  return [returnString, j-1]
}

function joinStack(inStack) {
  var outString = '';
  for (m=0; m < inStack.length; m++) {
    outString += inStack[m];
  }
  return outString;
}

function buildParseStack(inString) {
  var grammarStack = [];
  for (var i=0; i < inString.length; i++) {
    if (inString[i] == '<') {
      // returnVal is a 2 element vector.  the first is a gramatical unit
      // and the second is the position in the string being parsed
      var returnVal = buildTag(inString, i);
    } else {
      var returnVal = buildString(inString, i);
    }
    //add some error checking code here
    grammarStack.push(returnVal[0]);
    i = returnVal[1]
  }
  return grammarStack;
}

function formatHTMLasCode(parsedStack) {
  var formattedString = '';
  var indentLevel = 0;
  var indentWidth = 2;

  // format contents of parsedStack as "code" output string
  for (var i=0; i < parsedStack.length; i++) {
    var start = (parsedStack[i].slice(0,3));
    switch(start) {
      case '<ta':
        parsedStack[i]="&lt;"+parsedStack[i].slice(1);
        parsedStack[i]=parsedStack[i].slice(0,-1) + "&gt;";;
        if (indentLevel > 0) {
          for (spaces = 0; spaces < indentLevel*indentWidth; spaces++) {
            parsedStack[i] = "&nbsp;"+parsedStack[i]
          }
        }
        indentLevel++;
        parsedStack[i] += '<br>';
        break;
      case '<tr':
        parsedStack[i]="&lt;"+parsedStack[i].slice(1);
        parsedStack[i]=parsedStack[i].slice(0,-1) + "&gt;";;
        if (indentLevel > 0) {
          for (spaces = 0; spaces < indentLevel*indentWidth; spaces++) {
            parsedStack[i] = "&nbsp;"+parsedStack[i]
          }
        }
        indentLevel++;
        parsedStack[i] += '<br>';
        break;
      case '<td':
        parsedStack[i]="&lt;"+parsedStack[i].slice(1);
        parsedStack[i]=parsedStack[i].slice(0,-1) + "&gt;";;
        for (spaces = 0; spaces < indentLevel*indentWidth; spaces++) {
          parsedStack[i] = '&nbsp'+parsedStack[i];
        }
        indentLevel++;
        break;
      case '</t':
        if (indentLevel > 0) {indentLevel--;}
        if (parsedStack[i].slice(0,4) == '</tr') {
            parsedStack[i]="&lt;"+parsedStack[i].slice(1);
            parsedStack[i]=parsedStack[i].slice(0,-1) + "&gt;";;
            parsedStack[i] += "<br>";
            if (indentLevel > 0) {
              for (spaces = 0; spaces < indentLevel*indentWidth; spaces++) {
                parsedStack[i] = "&nbsp;"+parsedStack[i]
              }
            }
        } else if (parsedStack[i].slice(0,4) == '</td') {
            parsedStack[i]="&lt;"+parsedStack[i].slice(1);
            parsedStack[i]=parsedStack[i].slice(0,-1) + "&gt;";;
            parsedStack[i] += "<br>"
        } else if (parsedStack[i].slice(0,4) == '</ta') {
          parsedStack[i]="&lt;"+parsedStack[i].slice(1);
          parsedStack[i]=parsedStack[i].slice(0,-1) + "&gt;";;  
          parsedStack[i] += "<br>";
        }
        
        break;
    }
  }

  var HTMLasCode = joinStack(parsedStack);

  return HTMLasCode;
}