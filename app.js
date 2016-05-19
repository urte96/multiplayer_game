/*
 use myGame
 db.createCollection("account");
 db.createCollection("progress");
 db.createCollection("Message");

 show collections
 db
 show dbs
 db.dropDatabase()
 */
var mongojs = require("mongojs");
//var db = mongojs('mongodb://myGame:test@ds011412.mlab.com:11412/heroku_1fg7ssf2', ['account','progress','Message']);

var db = mongojs('localhost:27017/myGame', ['account','progress','Message']);

var express = require('express');
var app = express();
var server = require('http').createServer(app); // server - http server
var io = require('socket.io').listen(server);
/*, {
    log: true,
    "transports":["polling"],
    "pingInterval":10000,
    "pingTimeout":15000
});*/
var userss = {};

var port = process.env.PORT || 3000;
// tell server what port to listen
server.listen(port, function(){
    console.log('listening on ' + port);
});



// tell server what port to listen
//server.listen(3000 , function(){ // '0.0.0.0'
//    console.log('listening on *:3000');
//});

// creating rout
app.use(express.static(__dirname + '/client'));
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

// client connects to socket.io - server
var ck_username = /^[A-Za-z0-9_]{3,20}$/;  //chat tikrinimui
var check = -1; //chat tikrinimui

var t2p = function(t) { return t*TILE;             },
    p2t = function(p) { return Math.floor(p/TILE); };

var MAP      = { tw: 50, th: 30 }, // the size of the map (in tiles)
    TILE     = 16,                 // the size of each tile (in game pixels) 32
    METER    = TILE,               // abitrary choice for 1m
    GRAVITY  = METER * 9.8 * 6,    // very exagerated gravity (6x)
    MAXDX    = METER * 20,         // max horizontal speed (20 tiles per second)
    MAXDY    = METER * 60,         // max vertical speed   (60 tiles per second)
    ACCEL    = MAXDX * 2,          // horizontal acceleration -  take 1/2 second to reach maxdx
    FRICTION = MAXDX * 6,          // horizontal friction     -  take 1/6 second to stop from maxdx
    JUMP     = METER * 1500,       // (a large) instantaneous jump impulse
    KEY      = { SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 };

var t2p = function(t) { return t*TILE;             };
var p2t = function(p) { return Math.floor(p/TILE); };

var COLOR  = { BLACK: '#000000', YELLOW: '#ECD078', BRICK: '#575757', PINK: '#C3C3C3', PURPLE: '#542437', GREY: '#333', SLATE: '#53777A' };
var COLORS = [ COLOR.BLACK, COLOR.YELLOW, COLOR.BRICK, COLOR.PINK, COLOR.PURPLE, COLOR.GREY ];
var cells = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 3, 3, 3, 3, 3, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 3, 3, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 5, 5, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 3, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 3, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 5, 5, 5, 5, 5, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 3, 3, 3, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 5, 3, 3, 5, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 3, 5, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 3, 3, 3, 3, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 5, 5, 0, 0, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 5, 5, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 5, 5, 5, 0, 0, 0, 0, 0, 0, 5, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 3, 3, 5, 0, 5, 5, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
var cell  = function(x,y)   { return tcelll(p2t(x),p2t(y));  };
var tcell = function(tx,ty) { return cells[tx + (ty*MAP.tw)]; };


function bound(x, min, max) {
    return Math.max(min, Math.min(max, x));
}


var fps  = 60,
    step = 1/fps,
    dt   = 1/fps/*0,
 now, last = timestamp()*/;

var SOCKET_LIST = {};


var Entity = function(){


    var self = {
        x:320,
        y:320,
        x2:320,
        y2:320,
        id:"",

        h: 25,
        w: 18,

        dx: 0,
        dy: 0,
        dxxxx: 0,
        dyyyy: 0,
        dead: false,
        hp: 100,
        color: "",

    }


    self.update = function(){
        self.updatePosition();
    }
    self.updatePosition = function(){

        self.x2 += self.dxxxx;
        self.y2 += self.dyyyy;

        var wasleft  = self.dx < 0,
            wasright = self.dx > 0,
            falling  = self.falling,
            falling2  = self.falling2;

        self.ddx = 0;
        self.ddy = GRAVITY;

        self.ddx2 = 0;
        self.ddy2 = GRAVITY;


        if (self.left) {
            self.ddx = self.ddx - ACCEL;     // self wants to go left
            self.ddx2 = self.ddx2 - self.maxSpd;
        }
        else if (wasleft) {
            self.ddx = self.ddx + FRICTION;  // self was going left, but not any more
            self.ddx2 = 0;
        }
        if (self.right) {
            self.ddx = self.ddx + ACCEL;     // self wants to go right
            self.ddx2 = self.ddx2 + self.maxSpd;

        }
        else if (wasright) {
            self.ddx = self.ddx - FRICTION;  // self was going right, but not any more
            self.ddx2 = 0;
        }
        if (self.jump && !self.jumping && !falling) {
            self.ddy = self.ddy - JUMP;     // apply an instantaneous (large) vertical impulse
            self.jumping = true;
            self.ddy2 =  self.ddy2 - JUMP;
        }

        self.y  = Math.floor(self.y  + (dt * self.dy));
        self.x  = Math.floor(self.x  + (dt * self.dx));
        self.dx = bound(self.dx + (dt * self.ddx), -MAXDX, MAXDX);
        self.dy = bound(self.dy + (dt * self.ddy), -MAXDY, MAXDY);

        self.y2  = Math.floor(self.y2  + (dt * self.dy));
        self.x2  = Math.floor(self.x2  + (dt * self.dx));


        if ((wasleft  && (self.dx > 0)) ||
            (wasright && (self.dx < 0))) {
            self.dx = 0; // clamp at zero to prevent friction from making us jiggle side to side

        }
    }
    self.getDistance = function(pt){
        return Math.sqrt(Math.pow(self.x2 - pt.x,2) + Math.pow(self.y2 - pt.y,2));
    }


    return self;

}

var Player = function(id){


    var self = Entity();
    self.id = id;
    //self.number = "" + Math.floor(10 * Math.random());



   // self.id = id;
    //self.number = "" + Math.floor(10 * Math.random());
    //Server cant take information if buttton pressed or not
    //client need to send to server information about key pressed
    //self.pressingRight = false;
   // self.pressingLeft = false;
   //// self.pressingUp = false;
    //self.pressingDown = true;
    //self.maxSpd = 10;

    self.pressingAttack = false;
    self.mouseAngle = 0;
    self.maxSpd = 10;
    self.score = 0;



    //Update speed and entity position
    var super_update = self.update;
    self.update = function() {
        self.updateSpd();
        super_update();
        if(self.pressingAttack){

            for(var i = -1; i < 2; i++)
                self.shootBullet(i * 8 + self.mouseAngle);
        }

    }
    self.shootBullet = function(angle){
        var b = Bullet(self.id,angle);
        b.x2 = self.x;
        b.y2 = self.y;
    }

    //self.shootBullet = function(angle){
    //    var b = Bullet(self.id, angle);
    //    b.x = self.x;
    //    b.y = self.y;
    //}

    //Update speed
    self.updateSpd = function(){



        var tx        = p2t(self.x),
            ty        = p2t(self.y),
            nx        = self.x%TILE,         // true if self overlaps right
            ny        = self.y%TILE,         // true if self overlaps below
            cell      = tcell(tx,     ty),
            cellright = tcell(tx + 1, ty),
            celldown  = tcell(tx,     ty + 1),
            celldiag  = tcell(tx + 1, ty + 1),
            tx2       = p2t(self.x2),
            ty2       = p2t(self.y2),
            nx2       = self.x2%TILE,         // true if self overlaps right
            ny2       = self.y2%TILE,         // true if self overlaps below
            cell2      = tcell(tx2,     ty2),
            cellright2 = tcell(tx2 + 1, ty2),
            celldown2  = tcell(tx2,     ty2 + 1),
            celldiag2  = tcell(tx2 + 1, ty2 + 1);

//+==========================================
      /*  if(self.pressingRight){
            if (self.velX < self.speed){
            self.velX ++;
            }
        }

        if(self.pressingLeft){
            if (self.velX > -self.speed){
                self.velX--;
            }
        }
        if(self.pressingUp) {
            if(!self.jumping){
                self.jumping = true;
                self.velY = -self.speed*2.8;
            }
        }*/
//=================================================================

        if (self.dy > 0) {
            if ((celldown && !cell) ||
                (celldiag && !cellright && nx)) {
                self.y = t2p(ty);       // clamp the y position to avoid falling into platform below
                self.dy = 0;            // stop downward velocity
                self.falling = false;   // no longer falling
                self.jumping = false;   // (or jumping)
                ny = 0;                   // - no longer overlaps the cells below
            }
        }
        else if (self.dy < 0) {
            if ((cell      && !celldown) ||
                (cellright && !celldiag && nx)) {
                self.y = t2p(ty + 1);   // clamp the y position to avoid jumping into platform above
                self.dy = 0;            // stop upward velocity
                cell      = celldown;     // self is no longer really in that cell, we clamped them to the cell below
                cellright = celldiag;     // (ditto)
                ny        = 0;            // self no longer overlaps the cells below
            }

        }

        if (self.dx > 0) {
            if ((cellright && !cell) ||
                (celldiag  && !celldown && ny)) {
                self.x = t2p(tx);       // clamp the x position to avoid moving into the platform we just hit
                self.dx = 0;            // stop horizontal velocity
            }
        }
        else if (self.dx < 0) {
            if ((cell     && !cellright) ||
                (celldown && !celldiag && ny)) {
                self.x = t2p(tx + 1);  // clamp the x position to avoid moving into the platform we just hit
                self.dx = 0;           // stop horizontal velocity
            }
        }

///////////////////////////////////////////////////////////////////
        if (self.dyyyy > 0) {
            if ((celldown2 && !cell2) ||
                (celldiag2 && !cellright2 && nx2)) {
                self.y2 = t2p(ty2);       // clamp the y position to avoid falling into platform below
                self.dyyyy = 0;            // stop downward velocity
                self.falling2 = false;   // no longer falling
                self.jumping = false;   // (or jumping)
                ny2 = 0;                   // - no longer overlaps the cells below
            }
        }
        else if (self.dyyyy < 0) {
            if ((cell2      && !celldown2) ||
                (cellright2 && !celldiag2 && nx2)) {
                self.y2 = t2p(ty2 + 1);   // clamp the y position to avoid jumping into platform above
                self.dyyyy = 0;            // stop upward velocity
                cell2      = celldown2;     // self is no longer really in that cell, we clamped them to the cell below
                cellright2 = celldiag2;     // (ditto)
                ny2        = 0;            // self no longer overlaps the cells below
            }

        }

        if (self.dxxxx > 0) {
            if ((cellright2 && !cell2) ||
                (celldiag2  && !celldown2 && ny2)) {
                self.x2 = t2p(tx2);       // clamp the x position to avoid moving into the platform we just hit
                self.dxxxx = 0;            // stop horizontal velocity
            }
        }
        else if (self.dxxxx < 0) {
            if ((cell2     && !cellright2) ||
                (celldown2 && !celldiag2 && ny2)) {
                self.x2 = t2p(tx2 + 1);  // clamp the x position to avoid moving into the platform we just hit
                self.dxxxx = 0;           // stop horizontal velocity
            }
        }
        self.falling = ! (celldown || (nx && celldiag));
        self.falling2 = ! (celldown2 || (nx2 && celldiag2));



//+==========================================

    }

    Player.list[id] = self; //zaidejas automatiskai irasomas i PLAYER_LIST
    return self;
}

Player.list = {};


var Bullet = function(parent,angle){
    var self = Entity();
    self.id = Math.random();
    self.dxxxx = Math.cos(angle/180*Math.PI) * 10;
    self.dyyyy = Math.sin(angle/180*Math.PI) * 10;
    self.parent = parent;
    self.timer = 0;
    self.toRemove = false;
    var super_update = self.update;
    self.update = function(){
        if(self.timer++ > 100)
            self.toRemove = true;
        super_update();

        for(var i in Player.list){
            var p = Player.list[i];
            if(self.getDistance(p) < 16 && self.parent !== p.id){ //32
                //handle collision. ex: hp--;
                self.toRemove = true;
                console.log('Hp: ' + p.hp);
                SOCKET_LIST[p.id].emit('sendHp', {hpp: p.hp});

                if(p.hp <= 0){
                    p.toRemove = true;
                    p.dead = true;
                    SOCKET_LIST[p.id].emit('gameLost', {var: p.id});

                } else {
                    p.hp--;
                    //parent.hp--;

                  //  if (p.dead) {
                   //     self.score++;
                   //     console.log(self.score);
                  //  }
                }

            }
        }
    }
    Bullet.list[self.id] = self;
    return self;
}



Bullet.list = {};

Bullet.update = function(){
    var pack = [];
    for(var i in Bullet.list){
        var bullet = Bullet.list[i];
        bullet.update();
        if(bullet.toRemove)
            delete Bullet.list[i];
        else
            pack.push({
                x:bullet.x2,
                y:bullet.y2,
                hp:bullet.hp,
                dead:bullet.dead,
            });
    }
    return pack;
}

Player.Check = function(socket){
   // var player = Player(socket);
    //if(player.dead) {
       // socket.emit('gameLost', {state:true});

   // }




       // if(p.hp <= 0) {
          //  socket.emit('gameLost', {state:true});

            //socket.on('startAgain', function (data) {
            //  if(data.start){
            //     player.hp = 100;
            //     player.x = 320;
            //    player.y = 320;
            //    player.x2 = 320;
            //     player.y2 = 320;
            //   player.dx = 0;
            //    player.dy = 0;
            //   player.dxxxx = 0;
            //   player.dyyyy = 0;

            // }

            //});

        //}


}

Player.onConnect = function(socket, data){
    var player = Player(socket.id);


    player.color = data.color;


    var clientx = 0;
    var clienty = 0;


    socket.on('KeyPress',function(data){
        if( data.inputId === KEY.RIGHT)
        {
            player.right = data.state;
        }
        else if( data.inputId === KEY.LEFT)
        {
            player.left = data.state;
        }
        else if( data.inputId === KEY.SPACE)
        {
            player.jump = data.state;
        }
        else if( data.inputId === 'attack')
        {
            player.pressingAttack = data.state;
            var newx = -player.x + clientx - 2;
            var newy = -player.y + clienty - 2;
            player.mouseAngle = Math.atan2(newy, newx) / Math.PI * 180;


        }

        else if( data.inputId === 'mouseAngle')
        {

            //player.mouseAngle = data.state;
            clientx = data.xclient;
            clienty = data.yclient;
        }
    });
}


//Istrinam zaideja kai issijungia
Player.onDisconnect = function(socket){
    delete Player.list[socket.id];
    delete Bullet.list[socket.id];
}

Player.update = function(){
    var pack = [];  //saugomi visi prisijunge zaidejai
    for(var i in Player.list){
        var player = Player.list[i];
        player.update();
        if(player.toRemove)
            delete Player.list[i];
        pack.push({
            x:player.x,
            y:player.y,
            hp:player.hp,
            dead:player.dead,
            color:player.color,

        });
    }
    return pack;
}

var USERS = {
    "bob":"asd",
    "bob1":"asd1",
    "bob2":"asd2",
    "msg": String

}

var isValidPassword = function(data, cb) {
    //MongoDB

    db.account.find({username:data.username,password:data.password}, function(err,res){
        if(res.length > 0)
         cb(true);
        else
         cb(false);
    });
    /*
    setTimeout(function(){
        cb(USERS[data.username] === data.password);

    },10);
     */
}

var isUsernameTaken = function(data, cb) {
    //MongoDB

    db.account.find({username:data.username}, function(err,res){
        if(res.length > 0)
            cb(true);
        else
            cb(false);
    });
    /*
    setTimeout(function(){
        cb(USERS[data.username]);
    },10);
     */
}


var addUser = function(data, cb) {
    //MongoDB

    db.account.insert({username:data.username,password:data.password}, function(err,res){
       cb();
    });

    /*
    setTimeout(function(){
        USERS[data.username] = data.password;
        cb();
    },10);
    */
}

io.sockets.on('connection', function(socket){
        socket.id = Math.random();          //prisijungusiam zaidejui priskiria random skaiciu
        SOCKET_LIST[socket.id] = socket;    //iraso prisijungusi zaideja i SOCKET_LIST


    socket.on('startAgain',function(data){
        // var player = Player(data.id);
        console.log(data.id);
        console.log(data.color);
        Player.onConnect(SOCKET_LIST[data.id], data);

    });
    console.log(socket.id);
    socket.on('signIn', function(data){
        isValidPassword(data, function(res) {
            if (res) {





                Player.onConnect(socket, data);
                //console.log(socket);


                socket.username = data.username;
                userss[socket.username] = socket;
                updateUsernames();
                socket.emit('signInResponse', {success: true, username: socket.username});

            } else {
                socket.emit('signInResponse', {success: false})
            }
        });
    });

    socket.on('signUp', function(data){
        isUsernameTaken(data, function(res) {
            if (res) {
                socket.emit('signUpResponse', {success: false});
            } else {
                addUser(data, function(){
                    socket.emit('signUpResponse', {success: true})
                });
            }
        });
    });






    // send message function
    socket.on('send message', function(data, callback){
        if(typeof socket.username !== 'undefined') {
        var msg = data.trim();
        if (msg.substr(0, 3) === '/w ') {
            msg = msg.substr(3);
            var ind = msg.indexOf(' ');
            if (ind !== -1) {
                var name = msg.substring(0, ind);
                var msg = msg.substring(ind + 1);
                if (name in userss) {
                    userss[name].emit('whisper', {msg: msg, username: socket.username});
                    console.log('whisper!');
                } else {
                    callback('Error! Enter a valid username.')
                }

            } else {
                callback('Error! Please enter a message for your whisper.');
            }
        } else {
            db.Message.insert({msg:msg, username: socket.username}, function(err,res){
                if(err) throw err;
                io.sockets.emit('new message', {msg: msg, username: socket.username});
            });
        }
        } else {
            callback(false);
        }
    });






    socket.on('disconnect', function(){
        if(!socket.username) return;
        delete userss[socket.username];
        updateUsernames();

    });

    //console.log("a client has connected: " + socket.id + 'with number ' + socket.number);
    socket.on('disconnect', function(){
        delete SOCKET_LIST[socket.id];
        Player.onDisconnect(socket);
        console.log(socket.id+" has disconnected");
    });
});
function updateUsernames(){
    io.sockets.emit('usernames', Object.keys(userss));
}





setInterval(function() {

    var pack = {
        player:Player.update(),
        bullet:Bullet.update(),
    }


   // var pack = Player.update();

    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        //siuncia client'ui
        socket.emit('newPosition', pack);

    }

},1000/60);


//========================================================
//===============// CHAT //===============================
//========================================================
/*
io.sockets.on('connection', function(socket){
    socket.on('new user', function(data, callback) {
        if (!ck_username.test(data)) {
            callback(check);
        }  else if (data in USERS) {
            callback(false);
        } else {
            callback(true);
            socket.username = data;
            USERS[socket.username] = socket;
            updateUsernames();
        }


    });



});
*/