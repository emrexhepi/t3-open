Template.BoardItem.helpers({

})

Template.BoardItem.events({
    "click li.play"(event){
        if(this.locked) {
            FlowRouter.go("/board/pass/"+this._id);
        } else {
            Meteor.call("boards.enter", this._id, '', function(error, result){
                if(result) {
                    FlowRouter.go("/board/play/");
                }
            });
        }
    },
    "click li.watch"(event){
        console.log("going to watch");
        if(this.locked) {
            FlowRouter.go("/board/pass/"+this._id);
        } else {
            Meteor.call("boards.watch", this._id, '', function(error, result){
                if(result) {
                    FlowRouter.go("/board/watch/");
                }
            });
        }
    }
});