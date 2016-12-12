import {Template} from "meteor/templating";


Template.New.events({
    "submit form"(event){
        event.preventDefault();
        var target = event.target;
        var name = target.boardName.value;
        var pass = target.boardPass.value;

        Meteor.call("boards.insert", name, pass, function(error, result){
            if(result.type=="error"){
                alert(result.message);
            } else {
                FlowRouter.go("/board/play/");
            }
        });
    }
})