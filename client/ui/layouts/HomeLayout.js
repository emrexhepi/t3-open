import {Template} from "meteor/templating";

Template.HomeLayout.events({
    "click #playNow"(){
        if($(".navbar-toggle").css("display") !== "none") {
            $(".navbar-toggle").click();
            setTimeout(function() {
                $(".dropdown-toggle").click();
            }, 400);
        } else {
            setTimeout(function() {
                $(".dropdown-toggle").click();
            }, 50);
        }
    }
})