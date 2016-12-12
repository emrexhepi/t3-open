//import Template from "meteor/templating";

import "./UserPoints.html";

Template.UserPoints.helpers({
    userInitials() {
        const initials = Meteor.user().username.substring(0,2).toUpperCase();
        return initials;
    },
    userPoints(){
        return Meteor.user().profile.points.toString();
    }
});