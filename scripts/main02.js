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
  console.log("makeTable called");
  var newTable = '<table>';
  for (var j = 0; j < numRows; j++) {
    newTable += makeRow(numCols, j);
  }
  newTable += "</table>";
  return newTable;
}

function showTable(tableHTML) {
  $("#formatted-HTML").append(tableHTML);
  var formattedRawHTML = formatHTML(tableHTML);
  console.log(formattedRawHTML)
  $("#raw-HTML").html(formattedRawHTML)
  // append(formattedRawHTML, Text);
}

function makeHeadInputRow(numCols) {
  // console.log("made it here")
  var aRow = makeRow(numCols, 0)
  // console.log(typeof aRow)
  aRow = aRow.replace(/td/g, 'th');
  aRow = aRow.replace(/r([0-9])/g,  'h$1');
  // aRow = aRow.replace(/td/g, 'th');
  // console.log(aRow);
  $("#enter-column-labels").append(aRow);
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
  var outString = ''
  for (m=0; m < inStack.length; m++) {
    outString += inStack[m];
  }
  return outString;
}

function buildParseStack(inString) {
  var grammarStack = [];
  for (var i=0; i < stringToFormat.length; i++) {
    if (stringToFormat[i] == '<') {
      // returnVal is a 2 element vector.  the first is a gramatical unit
      // and the second is the position in the string being parsed
      var returnVal = buildTag(stringToFormat, i);
    } else {
      var returnVal = buildString(stringToFormat, i);
    }
    //add some error checking code here
    grammarStack.push(returnVal[0]);
    i = returnVal[1]
  }
  return grammarStack;
}

function formatHTML(stringToFormat) {
  // var stringToFormat = "<tr id='smith'><td>trala</td><td>do re me</td><td>fa so la ti</td><td>do doe dough</td></tr>"
  var formattedString = '';
  var showStack = [];

  // if (returnVal[0] != -1) {
  //   var showVal = returnVal[0];
  //   showVal[0] = '&lt;';
  //   showVal[showVal.length-1] = '&gt;';
  // }

  //build a grammar stack with all the semantic units
  // for (var i=0; i < stringToFormat.length; i++) {
  //   if (stringToFormat[i] == '<') {
  //     // returnVal is a 2 element vector.  the first is a gramatical unit
  //     // and the second is the position in the string being parsed
  //     var returnVal = buildTag(stringToFormat, i);
  //     if (returnVal[0] != -1) {
  //       var showVal = returnVal[0];
  //       showVal[0] = '&lt;';
  //       showVal[showVal.length-1] = '&gt;';
  //     }
  //   } else {
  //     var returnVal = buildString(stringToFormat, i);
  //   }
  //   //add some error checking code here
  //   grammarStack.push(returnVal[0]);
  //   showStack.push(showVal);
  //   i = returnVal[1]
  // }

  // console.log(grammarStack);

  var indentLevel = 0;
  var indentWidth = 2;
  var outString = '';

  // format contents of showStack as output string
  for (var i=0; i < grammarStack.length; i++) {
    var start = (grammarStack[i].slice(0,3));
    switch(start) {
      case '<tr':
        // showStack[i] = "'" + grammarStack[i];
        for (spaces = 0; spaces < indentLevel*indentWidth; spaces++) {
          grammarStack[i] = " "+showStack[i]
        };
        indentLevel++;
        showStack[i] += '<br>';
        break;
      case '<td':
        // grammarStack[i] = "'" + grammarStack[i];
        for (spaces = 0; spaces < indentLevel*indentWidth; spaces++) {
          showStack[i] = " "+showStack[i];
        }
        indentLevel++;
        break;
      case '<ta':
        // grammarStack[i] = "'" + grammarStack[i];
        for (spaces = 0; spaces < indentLevel*indentWidth; spaces++) {
          showStack[i] = " "+showStack[i]
        }
        indentLevel++;
        showStack[i] += '<br>';
      case '</t':
        if (grammarStack[i].slice(0,4) == '</tr') {
          showStack[i] += "<br>";
        } else if (grammarStack[i].slice(0,4) == '</td') {
          showStack[i] += "<br>"
        } else if (grammarStack[i].slice(0,4) == '</ta') {
          showStack[i] += "<br>";
        }
        indentLevel--;
    }
  }

  var rawHTML = joinStack(showStack);

  console.log(rawHTML)
  return rawHTML
}