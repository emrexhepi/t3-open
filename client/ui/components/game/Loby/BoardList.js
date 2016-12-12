Template.BoardList.created = function () {
    var self = this;
    self.autorun(function () {
        self.subscribe("boards"); 
    })
}

Template.BoardList.helpers({
    board() {
        return Boards.find();
    },
    haveBoards(){
        return Boards.findOne();
    }
});