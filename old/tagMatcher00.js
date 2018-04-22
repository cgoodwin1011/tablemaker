function formatHTML(stringToFormat) {
  var stringToFormat = "<tr id='smith'><td>trala</td><td>do re me</td><td>fa so la ti</td><td>do doe dough</td></tr>"
  var formattedString = '';
  var insideTag = false;
  var inOpenTag = false;
  var inCloseTag = false;
  var grammarStack = [];

  var curPos= 0;
  //

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
        for (spaces = 0; spaces < indentLevel*indentWidth; spaces++) {
          grammarStack[i] = " "+grammarStack[i]  
        }
        indentLevel++;
        grammarStack[i] += "\n";
        break;
      case '<td':
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