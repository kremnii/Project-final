

var hero = document.getElementById("hero");
var map = document.getElementById("game");
var bg = document.getElementById("bg");
var lvl = document.getElementById("lvl");
const gravity = 2;
var SCORE = 0;
const date = Date.now();
var flag = false;
var flag_game_start = false;
var difficulty = 0;
var bushes = 0;

function load() {
    map.style.position = 'absolute';
    hero.style.position = 'absolute';
    lvl.style.position = 'absolute';
    bg.style.height = document.documentElement.clientHeight + 'px';
    map.style.left = 15 + 'vw';
    map.style.top = 150 + 'px';
    map.style.width = 70 / 100 * document.documentElement.clientWidth + 'px';
    map.style.height = 300 + 'px';

    hero.style.left = 15 + 'vw';
    hero.style.top = 310 + 'px';
    lvl.style.left = 0 + 'px';
}

function resize() {
    load();
    bg.style.height = 450 + 'px';
    if(parseInt(bg.style.height) != Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight)
        )
        bg.style.height = Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
            ) + 'px';
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function addBush() {
    bushes++;
    let img = document.createElement("img");
    img.style.position = 'absolute';
    img.style.left = getComputedStyle(lvl).left;
    img.src = "../img/bush.gif";
    document.getElementById("lvl").appendChild(img);
    lvl.lastChild.style.position = getComputedStyle(lvl).position;
    lvl.lastChild.style.left = 130 / 100 * document.documentElement.clientWidth + 'px';
}

async function score() {
    while(flag_game_start == true) {
        await sleep(200);
        document.getElementById("SCORE").innerHTML = SCORE;
        SCORE++;
    }
}

async function endGAME() {
    [].slice.apply(document.images).filter(is_gif_image).map(freeze_gif);
    flag_game_start = false;
    difficulty = 0;
}

async function moveBush(bush) {
    let can_create = true;
    while(parseInt(bush.style.left) > -128) {
        if(flag_game_start == false) {
            bush.parentNode.removeChild(bush.parentNode.children[1]);
            console.log(bush.parentNode.children, parseInt(getComputedStyle(hero).top), parseInt(getComputedStyle(bush).left), 
            parseInt(getComputedStyle(bush).left), parseInt(getComputedStyle(hero).left), flag_game_start, bushes);
            return
        }
        if(difficulty < 100)
            bush.style.left = parseInt(bush.style.left) - (10 + difficulty * 0.1) + 'px';
        else
            bush.style.left = parseInt(bush.style.left) - 20 + 'px';
        await sleep(1);
        
        if(parseInt(bush.style.left) < 0) {
            if(can_create == true && flag_game_start == true) {
                can_create = false;
                createBushes();
                if(difficulty < 500) {
                    bush.parentNode.lastChild.style.left = 
                        parseInt(getComputedStyle(bush.parentNode.lastChild).left) + 
                        Math.floor(Math.random() * difficulty) - 
                        document.documentElement.clientWidth * 0.001 *
                        Math.floor(Math.random() * difficulty) + 'px';
                }
                else {
                    bush.parentNode.lastChild.style.left = 
                        parseInt(getComputedStyle(bush.parentNode.lastChild).left) + 
                        Math.floor(Math.random() * 500) - 
                        document.documentElement.clientWidth * 0.001 *
                        Math.floor(Math.random() * 500) + 'px';
                }
                difficulty++;
            }
        }
        if(parseInt(getComputedStyle(hero).top) > 182 && parseInt(getComputedStyle(bush).left) < 110 &&
            parseInt(getComputedStyle(bush).left) > 0 && flag_game_start == true) {
            endGAME();
         
            return;
        }
    }
    bush.parentNode.removeChild(bush);
    bushes--;
}

async function createBushes() {
    addBush();
    moveBush(document.getElementById("lvl").lastChild);

}

async function jump() {
    if(flag_game_start == false) {
        SCORE = 0;
        flag_game_start = true;
        [].slice.apply(document.images).filter(is_gif_image).map(unfreeze_gif);
        score();
        createBushes();
    }
    let speed = 24;
    do {
        hero.style.top = parseInt(hero.style.top) - speed + 'px';
        speed = speed - gravity;
        await sleep(20);
    } while(hero.style.top = parseInt(hero.style.top) < 310);
    flag = false;
}

async function delay(ms) {
    await sleep(ms);
}

window.addEventListener('load', load);
window.addEventListener('resize', resize);

window.addEventListener('keydown', (event) =>{
    let speed = 0;
    if(event.key == 'ArrowUp' && flag == false) {
        flag = true
        jump();
    }
})

function is_gif_image(i) {
    return /^(?!data:).*\.gif/i.test(i.src);
}

function freeze_gif(i) {
    if(i.flag == false || i.flag == undefined) {
        i.flag = true;
        var c = document.createElement('canvas');
        var w = c.width = i.width;
        var h = c.height = i.height;
        c.getContext('2d').drawImage(i, 0, 0, w, h);
        c.style.position = getComputedStyle(i).position;
        c.style.left = getComputedStyle(i).left;
        i.parentNode.appendChild(c);
        i.jpg = Array.prototype.indexOf.call(i.parentNode.children, i.parentNode.lastChild);       
    }
    i.style.display = 'none';
    i.parentNode.children[i.jpg].style.display = 'inline';
    if(i.parentNode.id == 'lvl') {
        i.style.display = 'none';
    }
}

function unfreeze_gif(i) {
    if(i.jpg) {
        i.style.display = 'inline';
        i.parentNode.removeChild(i.parentNode.lastChild);
        if(i.parentNode.id == 'lvl')
            i.parentNode.removeChild(i.parentNode.lastChild);
        i.flag = false;
    }
    else {
        freeze_gif(i);
        unfreeze_gif(i);
    }
}