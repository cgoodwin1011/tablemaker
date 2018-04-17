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
  var newTable = '<table>'
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
  $("#raw-HTML").text(formattedRawHTML)
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

function formatHTML(stringToFormat) {
  // var stringToFormat = "<tr id='smith'><td>trala</td><td>do re me</td><td>fa so la ti</td><td>do doe dough</td></tr>"
  var formattedString = '';
  var grammarStack = [];

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

  //build a grammar stack with all the semantic units
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

  function joinStack(inStack) {
    var outString = ''
    for (m=0; m < inStack.length; m++) {
      outString += inStack[m];
    }
    return outString;
  }

  console.log(grammarStack);

  var indentLevel = 0;
  var indentWidth = 2;
  var outString = '';


  // format contents of grammarStack as output string
  for (var i=0; i < grammarStack.length; i++) {
    var start = (grammarStack[i].slice(0,3));
    switch(start) {
      case '<tr':
        grammarStack[i] = "'" + grammarStack[i]
        for (spaces = 0; spaces < indentLevel*indentWidth; spaces++) {
          grammarStack[i] = " "+grammarStack[i]  
        }
        indentLevel++;
        grammarStack[i] += "'<br>";
        break;
      case '<td':
      grammarStack[i] = "'" + grammarStack[i];
        for (spaces = 0; spaces < indentLevel*indentWidth; spaces++) {
          grammarStack[i] = " "+grammarStack[i]  
        }
        indentLevel++;
        break;
      case '</t':
        if (grammarStack[i].slice(0,4) == '</tr') {
          grammarStack[i] += "\n"
        } else if (grammarStack[i].slice(0,4) == '</td') {
          grammarStack[i] += "\n"
        }
        indentLevel--;
    }
  }

  var rawHTML = joinStack(grammarStack);

  console.log(rawHTML)
  return rawHTML
}