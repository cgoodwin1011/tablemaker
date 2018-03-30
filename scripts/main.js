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
    for (j = 0; j < numRows; j++) {
      newTable += makeRow(numCols, j);
    }
    newTable += "</table>"
    return newTable;
  }

  function showTable(tableHTML) {
    $("#formatted-HTML").append(tableHTML);
    $("#raw-HTML").text(tableHTML);
  }