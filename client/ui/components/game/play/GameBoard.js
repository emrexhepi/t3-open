import {Template} from "meteor/templating";

Template.GameBoard.onCreated(function(){

});

Template.GameBoard.helpers({
    
});

Template.GameBoard.events({
    'click .unlock-table .square'(event){
        console.log(event.target);
        console.log($(event.target).data("id"));
    }
});