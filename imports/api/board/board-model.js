
export default class {
    constructor(_player, name, password){
        //set usernames
        this.ownerId = _player._id;
        this.ownerUsername = _player.username;
        this.createdAt = new Date();
        this.name = name;
        this.locked = false;
        if(password>""){
            this.locked = true;
        }
        this.password = password;
        this.turn = _player._id;
        this.full = false;
        this.playerOne = {
            id : _player._id,
            username : _player.username,
            symbol : "X",
            points : 0,
        };
        this.playerTwo = {
            id : null,
            username : "",
            symbol : "O",
            points : 0
        };
        this.board = [
            "", "", "",
            "", "", "",
            "", "", ""
        ];
        this.watchers = [];
        this.finished = false;
        this.won = "";
        this.scoreCalculated = false;
        this.chat = [];
    }
}