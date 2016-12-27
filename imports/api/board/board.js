import {
    Mongo
} from 'meteor/mongo';

import Board from "./board-model";

import {
    check
} from "meteor/check";

Boards = new Mongo.Collection("boards");

Meteor.methods({
    "boards.insert" (_name, pass) {
        //if user not loged in return false
        if (!Meteor.user()) return false;

        //check parametters for code injection
        check(_name, String);
        check(pass, String);

        //Check if board with the same name already exists
        if (Boards.findOne({
                name: _name
            })) {
            return {
                type: "error",
                message: "Another board with the exact name Exists!"
            };
        }

        //get user
        let user = Meteor.users.findOne({
            _id: this.userId
        });

        //create the new board from the board model
        let board = new Board(user, _name, pass);
        //insert the new board and get the id
        let boardId = Boards.insert(board);

        //update the users profile with the current game
        let profile = user.profile;
        profile.currentBoard.id = boardId;
        profile.currentBoard.password = pass;

        Meteor.users.update({
            _id: this.userId
        }, {
            $set: {
                profile: profile
            }
        });

        //return the new board id to the user
        return true;
    },
    "boards.enter" (boardId, password) {
        //find the board with id and password match
        let board = Boards.findOne({
            _id: boardId,
            password: password
        });

        // check if board exists and
        // player2 has not enter yet
        // procced player2 assignment
        if (board && !board.full) {
            //get user
            let user = Meteor.users.findOne({
                _id: this.userId
            });
            //get current board
            //set users board to current board id
            let profile = user.profile;

            //set users current board id to boardId
            profile.currentBoard.id = boardId;
            //set users currentboard password to password0
            profile.currentBoard.password = password;

            // update users profile
            Meteor.users.update({
                _id: this.userId
            }, {
                $set: {
                    profile: profile
                }
            });

            //update the board with users information
            let playerTwo = board.playerTwo;
            playerTwo.id = this.userId;
            playerTwo.username = user.username;

            //update the board with the player details and make the board full
            //so nobody can enter the game anymore
            Boards.update({
                _id: boardId
            }, {
                $set: {
                    playerTwo: playerTwo,
                    full: true
                }
            });
            return true;
        }
        return false;
    },
    //test if password is right
    "boards.tryPassword" (boardId, password) {
        //try to find a board with the exact id and password
        let board = Boards.findOne({
            _id: boardId,
            password: password
        });

        //if there is a match return true else return false
        return board ? true : false;
    },
    "board.leave" (_userId) {
        //get user id
        let userId = _userId || this.userId;

        //get current user profile
        let user = Meteor.users.findOne({
            _id: userId
        });

        //destruct user profile in profile and currentBoard
        let {
            profile: {
                currentBoard: currentBoard
            },
            profile
        } = user;

        //find the board user was in
        let board = Boards.findOne({
            _id: currentBoard.id
        });

        // and delete board from user profile
        //delete board from users profile
        currentBoard = {
            id: "",
            password: ""
        }
        profile.currentBoard = currentBoard;
        //update user then terminate the method
        Meteor.users.update({
            _id: userId
        }, {
            $set: {
                profile: profile
            }
        });
        
        // if no board found or board finished
        // terminate method by returning false
        if (!board || board.finished) {
            return false;
        }

        //end game
        Meteor.call("board.endGame", user, board._id);

    },
    "board.userPlay" (squareIndex, checkWinner) {

        //get player board
        var currentBoardId = Meteor.user().profile.currentBoard.id;
        let board = Boards.findOne({
            _id: currentBoardId
        });

        //get the players
        var currentPlayer = "playerOne";
        var otherPlayer = "playerTwo";
        if (board.playerTwo.id == Meteor.user()._id) {
            currentPlayer = "playerTwo";
            otherPlayer = "playerOne";
        }
        //if it is not the player turn return false
        if (!board[currentPlayer].turn) {
            return false;
        }

        //if the square is not empty return false
        if (board.board[squareIndex] !== "") {
            return false;
        }
        //fill square
        var currentPlayerSymbol = board[currentPlayer].symbol;
        board.board[squareIndex] = currentPlayerSymbol;

        //change turns
        board[currentPlayer].turn = false;
        board[otherPlayer].turn = true;

        var won = ""

        //add move to board
        board.moves++;

        if (checkWinner && checkForWinner(board.board) || board.moves > 8) {
            //stop users ability to play
            board[currentPlayer].turn = false;
            board[otherPlayer].turn = false;

            if (board.moves < 9) {
                won = board[currentPlayer].username;
                board[currentPlayer].points += 2;
            } else {
                board[currentPlayer].points++;
                board[otherPlayer].points++;
            }

            //finish current game
            board.moves = 9;
        }


        //update database
        Boards.update({
            _id: board._id
        }, {
            $set: {
                board: board.board,
                playerOne: board.playerOne,
                playerTwo: board.playerTwo,
                moves: board.moves,
                won: won
            }
        });
    },
    "board.replay" () {
        //get player board
        var currentBoardId = Meteor.user().profile.currentBoard.id;
        let board = Boards.findOne({
            _id: currentBoardId
        });

        if (board.moces < 9) return;

        var currentPlayer = "playerOne";
        var otherPlayer = "playerTwo";
        if (board.playerTwo.id == Meteor.user()._id) {
            currentPlayer = "playerTwo";
            otherPlayer = "playerOne";
        }
        var currentPlayerSymbol = board[currentPlayer].symbol;

        board.replayCounter++;
        if (board.replayCounter < 2) {
            board[currentPlayer].replay = true;
        } else {
            board.replayCounter = 0;
            board.playerOne.replay = false;
            board.playerTwo.replay = false;
            board.moves = 0;
            board.board = [
                "", "", "",
                "", "", "",
                "", "", ""
            ];

            //the winner gets the turn
            //setting the turn and 
            if (board.won === Meteor.user().username) {
                board[currentPlayer].turn = true;
            } else {
                board[otherPlayer].turn = true;
            }

            //changing the symbols
            board[currentPlayer].symbol = board[otherPlayer].symbol;
            board[otherPlayer].symbol = currentPlayerSymbol;
        }

        //update database
        Boards.update({
            _id: board._id
        }, {
            $set: {
                board: board.board,
                playerOne: board.playerOne,
                playerTwo: board.playerTwo,
                moves: board.moves,
                replayCounter: board.replayCounter
            }
        });
    },
    "board.endGame" (_user, _currentBoardId) {
        //get current user
        var currentUser = _user || Meteor.user();
        //get the board
        var currentBoardId = _currentBoardId || currentUser.profile.currentBoard.id;
        var board = Boards.findOne({
            _id: currentBoardId
        });
        
        //set user players
        var currentPlayer = "playerOne";
        var otherPlayer = "playerTwo";
        if (board.playerTwo.id === currentUser._id) {
            currentPlayer = "playerTwo";
            otherPlayer = "playerOne";
        }

        //if the game is not finished atuomatically oponent wins
        if (board.won == "" && board.moves < 9) {
            board[otherPlayer].points += 2;
        }

        //update players
        board.playerOne.turn = false;
        board.playerTwo.turn = false;

        //update players points
        Meteor.users.update({
            _id: board.playerOne.id
        }, {
            $inc: {
                "profile.points": board.playerOne.points
            }
        });
        Meteor.users.update({
            _id: board.playerTwo.id
        }, {
            $inc: {
                "profile.points": board.playerTwo.points
            }
        });

        //update the board
        Boards.update(
            {_id : board._id},
            {
                $set : {
                    finished: true,
                    playerOne : board.playerOne,
                    playerTwo : board.playerTwo
                }
            }
        );
    }
});