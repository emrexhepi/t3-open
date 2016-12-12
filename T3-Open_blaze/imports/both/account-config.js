import {
    Accounts
} from 'meteor/accounts-base';

Accounts.config({
    sendVerificationEmail: false,
    forbidClientAccountCreation: false,
    //restrictCreationByEmailDomain: 'school.edu',
    //loginExpirationDays: 3, 
    //oauthSecretKey: 'assdferwp[po[rm,l1;l[a\|":g1987hjiorlknjadq][pp[]l*)(&&!*@0982)]', 
});

Meteor.users.deny({  
  update: function() {
    return true;
  }
});

if (Meteor.isServer){
    Accounts.onCreateUser(function (options, user) {
        let profile = {
            points:0,
            currentBoard : {
                id : "",
                password: ""
            }
        };

        user.profile = profile;

        return user;
    });
}

if (Meteor.isClient) {
    Accounts.ui.config({
        requestPermissions: {},
        requestOfflineToken: {},
        passwordSignupFields: 'USERNAME_ONLY',
    });
}