
jQuery(function($){


    var socket = io.connect(); //http://192.168.1.117:3000 https://game1337.herokuapp.com
    //===============================================================
    //==================// LOGIN CODE //=============================
    //===============================================================
    var contentWrap = document.getElementById('contentWrap');
    var usernameWrap = document.getElementById('usernameWrap');
    var signDiv = document.getElementById('signDiv');
    var signDivUsername = document.getElementById('signDiv-username');
    var signDivPassword = document.getElementById('signDiv-password');
    var signDivSignIn = document.getElementById('signDiv-signIn');
    var signDivSignUp = document.getElementById('signDiv-signUp');
    var nickname = document.getElementById('nickname');
    var wrapInfo = document.getElementById('wrapInfo');
    var color = document.getElementById('inputP');
    var color2 = document.getElementById('inputPP');


    $('[name="unique-name-1"]').paletteColorPicker({
        colors: [
            {"#4BACC6": "#4BACC6"},
            {"#FF0000": "#FF0000"},
            {"#FFC000": "#FFC000"},
            {"#FFFF00": "#FFFF00"},
            {"#0070C0": "#0070C0"},
            {"#00B050": "#00B050"},
            {"#8064A2": "#8064A2"},
            {"#1F497D": "#1F497D"},
            {"#B2A1C7": "#B2A1C7"}

        ],
    });

    $('[name="unique-name-2"]').paletteColorPicker({
        colors: [
            {"#4BACC6": "#4BACC6"},
            {"#FF0000": "#FF0000"},
            {"#FFC000": "#FFC000"},
            {"#FFFF00": "#FFFF00"},
            {"#0070C0": "#0070C0"},
            {"#00B050": "#00B050"},
            {"#8064A2": "#8064A2"},
            {"#1F497D": "#1F497D"},
            {"#B2A1C7": "#B2A1C7"}

        ],
    });

    signDivSignIn.onclick = function(){

        socket.emit('signIn', {username:signDivUsername.value, password:signDivPassword.value, color:color.value });
    }

    signDivSignUp.onclick = function(){
        socket.emit('signUp',{username:signDivUsername.value,password:signDivPassword.value});
    }

    var nick = '';
    socket.on('signInResponse',function(data){
        if(data.success){
            signDiv.style.display = 'none'; //none
            //gameDiv.style.display = 'inline-block';
            canvas.style.display = 'inline-block';
            contentWrap.style.display = 'inline-block'; //flex
            usernameWrap.style.display = 'none'; //none
            $('#wrapInfo').show("slide");
            wrapInfo.style.display = 'inline-block';
            $('#wrapper').show("slide");

            nick = data.username;
            nickname.innerHTML = nickname.innerHTML + '> logged in as: ' + nick;

        } else
            alert("Sign in unsuccessful.");
    });

    socket.on('signUpResponse',function(data){
        if(data.success){
            alert("Sign up successful.");
        } else
            alert("Sign up unsuccessful.");
    });



    //===============================================================
    //==================// GAME CODE //==============================
    //===============================================================
    $("#mycanvas").attr("tabindex", "0");
    //======================================================================
    var canvas = document.getElementById("mycanvas");

    var gameDiv = document.getElementById("gameDiv");
    var infoo = document.getElementById("info");




    // canvas.addEventListener('keydown', doKeyDown, true);
    var ctx = canvas.getContext("2d");
    var width = canvas.width;
    var height = canvas.height;
    canvas.width = 50 * 16;
    canvas.height = 30 * 16;


    ctx.font = '30px Arial';
    //======================================================================
    //$('#mycanvas').attr('tabIndex', 0).focus();


    var MAP = { tw: 50, th: 30 }; // the size of the map (in tiles)
    var TILE = 16;
    var width    = canvas.width  = MAP.tw * TILE;
    var height   = canvas.height = MAP.th * TILE;

    var COLOR  = { BLACK: '#000000', YELLOW: '#ECD078', BRICK: '#575757', PINK: '#C3C3C3', PURPLE: '#542437', GREY: '#333', SLATE: '#53777A', TEST: '#DEE952' },
        COLORS = [ COLOR.BLACK, COLOR.YELLOW, COLOR.BRICK, COLOR.PINK, COLOR.PURPLE, COLOR.GREY ];
    var cells = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 3, 3, 3, 3, 3, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 3, 3, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 5, 5, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 3, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 3, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 5, 5, 5, 5, 5, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 3, 3, 3, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 5, 3, 3, 5, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 3, 5, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 3, 3, 3, 3, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 5, 5, 0, 0, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 5, 5, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 5, 5, 5, 0, 0, 0, 0, 0, 0, 5, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 3, 3, 5, 0, 5, 5, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        cell  = function(x,y)   { return tcelll(p2t(x),p2t(y));  },
        tcell = function(tx,ty) { return cells[tx + (ty*MAP.tw)]; };

    //======================================================================

    var img = new Image();
    img.src = "img/player.png";

    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

socket.on('newPosition', function(data) {
        ctx.clearRect(0,0,width,height);

        var x, y;
        for(y = 0 ; y < MAP.th ; y++) {
            for(x = 0 ; x < MAP.tw ; x++) {
            ctx.fillStyle = COLORS[tcell(x,y)];
            ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
            }
        }



        for(var i = 0; i < data.player.length; i++) {


                //ctx.drawImage(img, data[i].x, data[i].y, 18, 25);
                ctx.fillStyle = data.player[i].color;
                ctx.fillRect(data.player[i].x, data.player[i].y, TILE, TILE);

                //ctx.drawImage(img,
                // 0,0,18,25,
                //  data[i].x, data[i].y,18,25);

       }



        for(var i = 0; i < data.bullet.length; i++) {
            //ctx.drawImage(img, data[i].x, data[i].y, 18, 25);

                ctx.fillStyle = getRandomColor();
                ctx.fillRect(data.bullet[i].x - 2, data.bullet[i].y - 2, 4, 4);


           //ctx.drawImage(img,
            // 0,0,18,25,
            //  data[i].x, data[i].y,18,25);

        }


    });
   // socket.on('newPosition', function(data){
       // ctx.clearRect(0,0,width,height);
       // for(var i = 0; i < data.length; i++) {
           // ctx.fillText(data[i].number, data[i].x, data[i].y);
      //  }

    //});

    document.addEventListener('keydown', function(ev) { return onkey(ev, ev.keyCode, true);  }, false);
    document.addEventListener('keyup',   function(ev) { return onkey(ev, ev.keyCode, false); }, false);

    function onkey(ev, key, down) {
        switch(key) {
            case 37: /*player.left  = down;*/ socket.emit('KeyPress', {inputId:37, state:down}); return false;
            case 39: /*player.right = down;*/ socket.emit('KeyPress', {inputId:39, state:down}); return false;
            case 38: /*player.jump  = down;*/ socket.emit('KeyPress', {inputId:32, state:down}); return false;
        }
    }


    var interval;
    document.onmousedown = function(event){
        if (!canvas.disabled) {
            socket.emit('KeyPress', {inputId: 'attack', state: true});
            interval = setInterval(function () {
                socket.emit('KeyPress', {inputId: 'attack', state: false});
            }, 20); //
        }
    }
    document.onmouseup = function(event){
        if (!canvas.disabled) {
            socket.emit('KeyPress', {inputId: 'attack', state: false});
            clearInterval(interval);
        }
    }

   // socket.on('newPosition', function(data) {
        document.onmousemove = function (event) {

            //var x = -data.player[i].x + event.clientX - 2;
            //var y = -data.player[i].y + event.clientY - 2;
            //var x = event.clientX - document.getElementById('mycanvas').getBoundingClientRect().left - 16;
            // var y = event.clientY - document.getElementById('mycanvas').getBoundingClientRect().top - 16;

            //var angle = Math.atan2(y, x) / Math.PI * 180;
            if (!canvas.disabled){
                socket.emit('KeyPress', {inputId: 'mouseAngle', xclient: event.clientX, yclient: event.clientY});
            }





        }
   // });

    var progressBar;


    progressBar = new ProgressBar("my-progressbar", {'width':'100%', 'height':'10px'});
    progressBar.setPercent(100);
    var hpp = 0;
    socket.on('sendHp',function(data){
        hpp = data.hpp;
        infoo.innerHTML = ' HP: ' + hpp;
        progressBar.setPercent(hpp);

    });


    var startAgain = document.getElementById('checkme');
    var check = document.getElementById('check');
    socket.on('gameLost',function(data){
       // if(data.player.hp <= 0) {
            //ctx.clearRect(data.player[i].x, data.player[i].y, TILE, TILE);
            canvas.style.display = 'none';
            check.style.display = 'table';
            wrapInfo.style.display = 'none';
            canvas.disabled = true;
        startAgain.onclick = function(){
            canvas.style.display = 'inline-block';
            check.style.display = 'none';
            canvas.disabled = false;
            wrapInfo.style.display = 'inline-block';
            infoo.innerHTML = ' HP: ' + 100;
            progressBar.setPercent(100);

            socket.emit('startAgain', {id: data.var, color:color2.value});
        }


    });


/*
    //siunciame serveriui informacija apie paspaustus mygtukus
    document.onkeydown = function(event) {
        if(event.keyCode === 39)        // D - key
            socket.emit('keyPress', {
                inputId:'right', state:true
            });
        else if(event.keyCode === 40)   // S - key
            socket.emit('keyPress', {
                inputId:'down', state:true
            });
        else if(event.keyCode === 37)   // A - key
            socket.emit('keyPress', {
                inputId:'left', state:true
            });
        else if(event.keyCode === 38)   // W - key
            socket.emit('keyPress', {
                inputId:'up', state:true
            });
    }

    document.onkeyup = function(event){
        if(event.keyCode === 39)        // D - key
            socket.emit('keyPress',{
                inputId:'right',state:false
            });
        else if(event.keyCode === 40)   // S - key
            socket.emit('keyPress',{
                inputId:'down',state:true
            });
        else if(event.keyCode === 37)   // A - key
            socket.emit('keyPress',{
                inputId:'left',state:false
            });
        else if(event.keyCode === 38)   // W - key
            socket.emit('keyPress',{
                inputId:'up',state:false
            });
    }


*/

    //===============================================================
    //==================// CHAT CODE //==============================
    //===============================================================
    //username - nickname
    var $usrForm = $('#setUsername');
    //var $usrError = $('#usernameError');
    var $usrBox = $('#username');
    var $users = $('#users');
    //chat content
    var $messageForm= $('#send-message');
    var $messageBox = $('#message');
    var $chat = $('#chat');

    function showError2() {
        alert("Bad Username format!\nSupports alphabets and numbers no special characters \n" +
            "except underscore('_') min 3 and max 20 characters. ");
    }

    function showError3() {
        alert("You don't have a username!");
    }

/*
  //  $usrForm.text()
    $usrForm.submit(function(e){
        e.preventDefault();
        socket.emit('new user', $usrBox.val(), function(data){
            if(data == -1){
                showError2();
            } else if(data){
                $('#usernameWrap').hide();
                $('#wrapper').show("slide");
            } else{
                //$usrError.html('Username already exists! Choose another.');
                function showError() {
                    alert("Username already exists!\nChoose another.");

                }
                showError();
            }

        });
        $usrBox.val('');
    }); */



    socket.on('usernames', function(data){
        var html = '';
        for(var i = 0; i < data.length; i++){
            html += '<span class="user">' + ' > ' + data[i] + '</span><br/>'
        }
        $users.html(html);
    });



    $messageForm.submit(function(e){
            // stops page refresh
            e.preventDefault();

            socket.emit('send message', $messageBox.val(), function (data) {
                if(data == true) {
                    $chat.append('<span class="error">' + data + '</span><br/>');
                }else {
                    showError3();
                }
            });
            $messageBox.val('');
            $(document).ready(function () {
                $('#chat').animate({
                    scrollTop: $('#chat')[0].scrollHeight
                }, 100);
            });
    });

    socket.on('new message', function(data){
        $chat.append('<span class="msg"><b>' + data.username + ':</b>' + data.msg + '</span><br/>');

        
    });

    socket.on('whisper', function(data){
            $chat.append('<span class="whisper"><b>' + data.username + ':</b>' + data.msg + '</span><br/>');

    });

});




