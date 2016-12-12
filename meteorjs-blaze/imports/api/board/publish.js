Meteor.publish("boards", function () {
    if (!this.userId) return false;
    return Boards.find({
        finished: false
    }, {
        fields: {
            name: 1,
            full: 1,
            locked: 1,
            _id: 1,
            ownerUsername: 1
        }
    });
});

Meteor.publish("board", function (id) {
    if (!this.userId) return false;
    return Boards.find({
        _id: id
    }, {
        fields: {
            name: 1,
            full: 1,
            locked: 1,
            ownerUsername: 1,
            _id: 1
        }
    });
});

Meteor.publish("board-auth", function () {
    if (!this.userId) return false;
    var user = Meteor.users.findOne({
        _id: this.userId
    });
    var boardId = user.profile.currentBoard.id
    var boardPass = user.profile.currentBoard.password;

    return Boards.find({
        _id: boardId,
        password: boardPass
    });
});