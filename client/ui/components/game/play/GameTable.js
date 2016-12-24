Template.GameTable.onCreated(function(){
    this.Board = new ReactiveVar(false);
    this.Turn = new ReactiveVar(false);

    
    var self = this;
    self.autorun(function () {
        self.Board.set(Boards.findOne());
    });

    var board = this.Board.get();

    this.userSpace = "playerTwo";
    if(board.playerOne.id === Meteor.user()._id) {
        this.userSpace = "playerOne";
    }
    self.autorun(function () {
        self.Turn.set(Boards.findOne()[self.userSpace].turn);
    });
});

Template.GameTable.helpers({
    board() {
        return Template.instance().Board.get();
    },
    turn(){
        return Template.instance().Turn.get();
    }
});