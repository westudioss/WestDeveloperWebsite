let str = "";
let arr = [

    {
        ref : 'onlinegames.html',
        img : "../imgs/joystick.png",
        name : 'Online Games'
    },
    {
        ref : 'publishedgames.html',
        img : "../imgs/gamefolder.png",
        name : 'Published Games'
    },
    {
        ref : 'https://discord.gg/HrH8CsvMwK',
        img : "../imgs/discord.png",
        name : 'Discord'
    },
    {
        ref : 'index.html',
        img : "../imgs/home.png",
        name : 'Home'
    },
    {
        ref : 'chatroom.html',
        img : "../imgs/chat.png",
        name : 'Chatroom'
    },
    {
        ref : 'login.html',
        img : "../imgs/enter.png",
        name : 'Login'
    },

]

for (var i = 0; i < arr.length; i++) {

    str += "<a class='navdiv' href=" + arr[i].ref + "><div>";
    str += "<input type='image' class='navlogo' src=" + arr[i].img + ">";
    str += "<p class='navtext'>" + arr[i].name + "</p></div></a>";

}

document.getElementById("nav").innerHTML = str;