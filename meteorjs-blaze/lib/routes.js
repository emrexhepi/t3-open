//import BlazeLayout from "meteor/blaze-layout"
Accounts.onLogin(function () {
    FlowRouter.go("New");
    if(Meteor.isClient) {
        if($(window).width()<845)
        $(".navbar-toggle").click();
    }
});

Accounts.onLogout(function() {
    FlowRouter.go("Home");
    if(Meteor.isClient) {
        if($(window).width()<845)
        $(".navbar-toggle").click();
    }
});

FlowRouter.triggers.enter([function(){
    if(!Meteor.userId()){
        FlowRouter.go("Home");
    }
}]);

FlowRouter.route("/", {
    name : "Home",
    action : function() {
            if(Meteor.userId()){
                FlowRouter.go("New");
            }
        BlazeLayout.render('MainLayout', {main : "HomeLayout"});;
    }
});

/*board Routes*/
FlowRouter.route("/board/", {
    name: "Board",
    action: function() {
        FlowRouter.go("New");
    }
});

FlowRouter.route("/board/play/", {
    name: "Play",
    action: function() {
        BlazeLayout.render("GameLayout", {main : "Play"});
    }
});

FlowRouter.route("/board/pass/:id", {
    name: "BoardPassword",
    action: function() {
        BlazeLayout.render("GameLayout", {main : "BoardPassword"});
    }
}); 

FlowRouter.route("/board/new", {
    name: "New",
    action: function() {
        BlazeLayout.render("GameLayout", {main : "New"});
    }
}); 

FlowRouter.route("/board/random", {
    name: "Random",
    action: function() {
        BlazeLayout.render("GameLayout", {main : "Random"});
    }
});

FlowRouter.route("/board/loby", {
    name: "Loby",
    action: function() {
        BlazeLayout.render("GameLayout", {main : "Loby"});
    }
});
