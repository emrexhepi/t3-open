Template.Play.created = function () {
    var self = this;
    self.autorun(function () {
        self.subscribe("board-auth");
    })
}

Template.Play.destroyed = function(){
    Meteor.call("board.leave");
}

Template.Play.helpers({
    board() {
        return Boards.findOne();
    },
    usersReady(){
        let board = Boards.findOne();
        return board.full;
    }
});