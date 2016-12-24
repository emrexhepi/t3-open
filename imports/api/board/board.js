import { Mongo } from 'meteor/mongo';

import Board from "./board-model";

import {check} from "meteor/check";

Boards = new Mongo.Collection("boards");

Meteor.methods({
    "boards.insert"(_name, pass){
        //if user not loged in return false
        if(!Meteor.user()) return false;

        //check parametters for code injection
        check(_name, String);
        check(pass, String);

        //Check if board with the same name already exists
        if(Boards.findOne({name: _name})){
            return {type:"error", message: "Another board with the exact name Exists!"};
        }

        //get user
        let user = Meteor.users.findOne({_id: this.userId});

        //create the new board from the board model
        let board = new Board(user, _name, pass);
        //insert the new board and get the id
        let boardId = Boards.insert(board);

        //update the users profile with the current game
        let profile = user.profile;
        profile.currentBoard.id = boardId;
        profile.currentBoard.password = pass;

        Meteor.users.update({_id: this.userId}, {$set: {profile: profile}});

        //return the new board id to the user
        return true;
    },
    "boards.enter"(boardId, password){
        //find the board with id and password match
        let board = Boards.findOne({_id: boardId, password: password});

        // check if board exists and
        // player2 has not enter yet
        // procced player2 assignment
        if(board && !board.full) {
            //get user
            let user = Meteor.users.findOne({_id: this.userId});
            //get current board
            //set users board to current board id
            let profile = user.profile;

            //set users current board id to boardId
            profile.currentBoard.id = boardId;
            //set users currentboard password to password0
            profile.currentBoard.password = password;

            // update users profile
            Meteor.users.update({_id: this.userId}, {$set: {profile: profile}});

            //update the board with users information
            let playerTwo = board.playerTwo;
            playerTwo.id = this.userId;
            playerTwo.username = user.username;

            //update the board with the player details and make the board full
            //so nobody can enter the game anymore
            Boards.update(
                {_id: boardId}, 
                {
                    $set: {    
                        playerTwo: playerTwo,
                        full: true
                    }
                }
            );
            return true;
        }
        return false;
    },
    //test if password is right
    "boards.tryPassword"(boardId, password) {
        //try to find a board with the exact id and password
        let board = Boards.findOne({_id: boardId, password: password});
        
        //if there is a match return true else return false
        return board ? true: false;
    },
    "board.scoreHandler"(winner,playerOne,playerTwo){

    },
    "board.leave"(_userId){
        //get user id
        let userId = _userId || this.userId;

        //get current user profile
        let user = Meteor.users.findOne({_id: userId});

        //destruct user profile in profile and currentBoard
        let { profile : {currentBoard : currentBoard}, profile } = user;
        
        //find the board user was in
        let board = Boards.findOne({_id: currentBoard._id});

        // if no board found or board finished
        // terminate method by returning false
        // and delete board from user profile
        if(!board || barod.finished) {
            //delete board from users profile
            currentBoard = {
                id : "",
                password : ""
            }
            profile.currentBoard = currentBoard;
            //update user then terminate the method
            Meteor.users.update({_id: userId} , {$set : {profile: profile}});
            return false;
        }
        
        //set game status to finished
        board.finished = true

        //destructure the board
        let {playerOne, playerTwo, gamesNO} = board;

        //while leaving board without beign finnished
        //automatically the counter party wins
        //set wining party
        if(board.full) {
            board.won = userId === playerOne.id ? playerOne.id : playerTwo.id;
            Meteor.call("board.scoreHandler", board.won, playerOne,playerTwo, gamesNO);
        }

    }
});