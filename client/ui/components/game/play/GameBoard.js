import {Template} from "meteor/templating";



Template.GameBoard.onCreated(function(){

});

Template.GameBoard.helpers({
    
});

Template.GameBoard.events({
    'click .unlock-table .hover'(event){
        var board = Template.instance().data.board;
        var userSpace = Template.instance().data.userSpace;

        //if it is not the turn terminate
        if(!board[userSpace].turn) return;

        
        var gameBoard = Template.instance().data.board.board;
        var symbol = board[userSpace].symbol;
        var squareIndex = event.target.getAttribute("data-index");

        //if the square is filled dont do anything
        if(gameBoard[squareIndex] !== "") return;

        gameBoard[squareIndex] = symbol;
        
        var winner = checkForWinner(gameBoard);

        Meteor.call("board.userPlay", squareIndex,winner);

    }
});