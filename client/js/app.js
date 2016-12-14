(function() {



    var app = angular.module("tictactoe", []);


    var mainController = function($scope) {


        $scope.message = "";


        // Creating 2d array to store value clicked on particular square

        var board = new Array(3);
        for(var i=0;i<3;i++){

            board[i] = new Array(3);
        }

        for (var i = 0; i<3; i++) {
            for (var j = 0; j < 3; j++) {
                board[i][j] = "";
            }
        }




                // Array to calculate computer next move. every time a square ic clicked, corresponding index
        // element will be deleted from this array and then computer will pick available index randomly.

      //  var availableSpotsInBoard = ['00','01','02','10','11','12','20','21','22'];



       // Call this function when game is over to re-initialize all the variables to start new game.

        $scope.initializeGame = function(){

            $scope.message = "";
           // availableSpotsInBoard = ['00','01','02','10','11','12','20','21','22'];
            var element = null;

            for (var i = 0 ; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    board[i][j] = "";
                    element =  document.getElementById(i+""+j);
                    element.src= "";
                    element.removeAttribute("class");

                }
            }
        };


        // Method called on user turn

        $scope.draw = function(e){

            if($scope.message.length>0 || !$scope.isMovesLeft(board)){
                $scope.initializeGame();
                return;
            }

            var squareClicked = e.target;
            var squareId = e.target.id;
            var rowIndex = squareId.charAt(0);
            var columnIndex = squareId.charAt(1);

            board[rowIndex][columnIndex] = "x";
            squareClicked.src = "img/cross.png";

            // var indexToBeDeleted = availableSpotsInBoard.indexOf(squareId);
            // availableSpotsInBoard.splice(indexToBeDeleted, 1);

            var returnObj = $scope.checkResult(squareId,'x',3);

            if(returnObj.result=="win"){

                $scope.message = "You win!!";
                $scope.blinkRow(squareId,returnObj.pattern,3);
                $scope.playSound("applause");
            }
            else if(returnObj.result=="draw"){

                $scope.message = "Match draw!!";
            }
            else{
                $scope.callComputerTurn();

            }
        };


        // Method for Computer turn.

        $scope.callComputerTurn = function(){


            var generatedIndex = $scope.findBestMove();


           // var generatedIndex = $scope.getRandomIndex();
            var squareClicked = document.getElementById(generatedIndex);

           // var nextMoveId = $scope.calculateNextMove();


            var squareId = generatedIndex;
            var rowIndex = squareId.charAt(0);
            var columnIndex = squareId.charAt(1);

            board[rowIndex][columnIndex] = "o";
            squareClicked.src = "img/zero.png";

            // var indexToBeDeleted = availableSpotsInBoard.indexOf(squareId);
            // availableSpotsInBoard.splice(indexToBeDeleted, 1);

            var returnObj = $scope.checkResult(squareId,'o',3);


            if(returnObj.result=="win"){

                $scope.message = "You lose!!";
                $scope.blinkRow(squareId,returnObj.pattern,3);
                $scope.playSound("lose");
            }
            else if(returnObj.result=="draw"){

                $scope.message = "Match draw!!";
            }
        };

        $scope.findBestMove = function(){

                var bestVal = -1000;
                var bestMove = "";

                // Traverse all cells, evalutae minimax function for
                // all empty cells. And return the cell with optimal
                // value.
                for (var i = 0; i<3; i++)
                {
                    for (var j = 0; j<3; j++)
                    {
                        // Check if celll is empty
                        if (board[i][j]== "")
                        {
                            // Make the move
                            board[i][j] = 'o';

                            // compute evaluation function for this
                            // move.
                            var moveVal = $scope.minimax(board, 0, false);

                            // Undo the move
                            board[i][j] = "";

                            // If the value of the current move is
                            // more than the best value, then update
                            // best/
                            if (moveVal > bestVal)
                            {
                                bestVal = moveVal;

                                bestMove = i+""+j;

                            }
                        }
                    }
                }

                return bestMove;
        };

        // This is the minimax function. It considers all
        // the possible ways the game can go and returns
        // the value of the board

        $scope.minimax = function(board, depth, isMax)
        {
            var score = $scope.evaluate(board,depth);

            // If Maximizer has won the game return his/her
            // evaluated score
            if (score == 10)
                return score;

            // If Minimizer has won the game return his/her
            // evaluated score
            if (score == -10)
                return score;

            // If there are no more moves and no winner then
            // it is a tie

            if ($scope.isMovesLeft(board)==false)
                return 0;

            // If this maximizer's move
            if (isMax)
            {
                var best = -1000;
                var calculatedScore;

                // Traverse all cells
                for (var i = 0; i<3; i++)
                {
                    for (var j = 0; j<3; j++)
                    {
                        // Check if cell is empty
                        if (board[i][j]=="")
                        {
                            // Make the move
                            board[i][j] = 'o';

                            // Call minimax recursively and choose
                            // the maximum value

                            calculatedScore =  $scope.minimax(board, depth+1, !isMax);
                            best = best > calculatedScore ? best : calculatedScore;


                            // Undo the move
                            board[i][j] = "";
                        }
                    }
                }
                return best;
            }

            // If this minimizer's move
            else
            {
                var best = 1000;
                var calculatedScore;


                // Traverse all cells
                for (var i = 0; i<3; i++)
                {
                    for (var j = 0; j<3; j++)
                    {
                        // Check if cell is empty
                        if (board[i][j]=="")
                        {
                            // Make the move
                            board[i][j] = 'x';

                            // Call minimax recursively and choose
                            // the minimum value

                            calculatedScore =  $scope.minimax(board, depth+1, !isMax);
                            best = best < calculatedScore ? best : calculatedScore;


                            // Undo the move
                            board[i][j] = "";
                        }
                    }
                }
                return best;
            }
        };


        // This function returns true if there are moves
        // remaining on the board. It returns false if
        // there are no moves left to play.
        $scope.isMovesLeft = function(board)
        {
            for (var i = 0; i<3; i++)
            for (var j = 0; j<3; j++)
            if (board[i][j]=="")
                return true;
            return false;
        };



        // This is the evaluation function as discussed
        // in the previous article ( http://goo.gl/sJgv68 )

        $scope.evaluate = function(board,depth){

            // Checking for Rows for X or O victory.

            for (var row = 0; row<3; row++)
            {
                if (board[row][0]==board[row][1] && board[row][1]==board[row][2])
                {
                    if (board[row][0]=='o')
                        return 10;
                    else if (board[row][0]=='x')
                        return -10;
                }
            }

            // Checking for Columns for X or O victory.

            for (var col = 0; col<3; col++)
            {
                if (board[0][col]==board[1][col] && board[1][col]==board[2][col])
                {
                    if (board[0][col]=='o')
                        return 10;

                    else if (board[0][col]=='x')
                        return -10;
                }
            }

            // Checking for Diagonals for X or O victory.

            if (board[0][0]==board[1][1] && board[1][1]==board[2][2])
            {
                if (board[0][0]=='o')
                    return 10;
                else if (board[0][0]== 'x')
                    return -10;
            }

            if (board[0][2]==board[1][1] && board[1][1]==board[2][0])
            {
                if (board[0][2]=='o')
                    return 10;
                else if (board[0][2]=='x')
                    return -10;
            }

            // Else if none of them have won then return 0
            return 0;
        };





        // It will return index randomly for computer turn where computer will put 'O'.

        // $scope.getRandomIndex = function(){
        //
        //     return availableSpotsInBoard[Math.floor(Math.random() * availableSpotsInBoard.length)];
        // };


        //After each user/computer turn, this method will be called to check match Result.
        // It can be WIN, LOSE or DRAW.

        $scope.checkResult = function(indexClicked,letter,length){

            var rowIndex = indexClicked.charAt(0);
            var columnIndex = indexClicked.charAt(1);
            var rowCount = 0;
            var columnCount = 0;
            var diagonalbttCount = 0;
            var diagonalttbCount = 0;

             for(var i=0;i<length;i++){

                  if(board[rowIndex][i] == letter){
                    rowCount++;
                  }
                  if(board[i][columnIndex] == letter){
                      columnCount++;
                  }
                  if(board[i][i] == letter){

                      diagonalttbCount++;
                  }
                 if(board[length-1-i][i] == letter){

                     diagonalbttCount++;
                 }
            }


            if(rowCount == length){

                return {result:"win",pattern: "row"};

            }
            else if(columnCount == length){

                return {result:"win",pattern: "column"};

            }
            else if(diagonalbttCount == length){

                return {result:"win",pattern: "diagonalbtt"};

            }
            else if(diagonalttbCount == length){

                return {result:"win",pattern: "diagonalttb"};

            }
            else if(!$scope.isMovesLeft(board)){

                return {result: "draw"};
            }

            return {result:"none"};


        };


        // On match win/lose, it will blink the row for which pattern is matched.

        $scope.blinkRow = function(squareId,pattern,length){

            var rowIndex = squareId.charAt(0);
            var columnIndex = squareId.charAt(1);
            var element = null;

            for(var i=0;i<length;i++){


                if(pattern=="row"){

                    element = document.getElementById(rowIndex+""+i);
                    element.className = "blinkElement";

                }
                else if(pattern=="column"){

                    element = document.getElementById(i+""+columnIndex);
                    element.className = "blinkElement";

                }
                else if(pattern=="diagonalbtt"){

                    element = document.getElementById((length-1-i)+""+i);
                    element.className = "blinkElement";



                }
                else if(pattern=="diagonalttb"){

                    element = document.getElementById(i+""+i);
                    element.className = "blinkElement";


                }
            }
        };

        // On match start/win/lose/draw, it will play the sound

        $scope.playSound = function(type){

            var audio = new Audio("sound/"+type+".mp3");
            audio.play();
        };

        $scope.playSound("gamestart");

    };


    app.controller("mainController", mainController);



}());
