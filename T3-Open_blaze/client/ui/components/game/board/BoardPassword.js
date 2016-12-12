Template.BoardPassword.created = function () {
    var self = this;
    self.autorun(function () {
        self.subscribe("board",FlowRouter.current().params.id); 
    })
}

Template.BoardPassword.helpers({
    board() {
        return Boards.findOne({_id:FlowRouter.current().params.id});
    }
});

Template.BoardPassword.events({
    "submit form"(event) {
        event.preventDefault();
        let boardId = FlowRouter.current().params.id;
        let pass = event.target.boardPass.value;
        Meteor.call("boards.tryPassword", boardId, pass, function(err, result){
            if(result){
                Meteor.call("boards.enter", boardId, pass, function(err,result){
                    if(result){
                        FlowRouter.go("Play");
                    } else {
                        FlowRouter.go("Loby");
                    }
                });
            } else {
                alert("Wrong password! Please try again!");
            }
        });
    }
})