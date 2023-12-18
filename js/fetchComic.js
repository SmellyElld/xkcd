document.comicNr = "latest";
document.comics = "latest";
var loadedComics = {};
var randomComic = [];
var onLoad = true;

window.onload = function(){
    //ladar in knaparna
    var firstButton = document.getElementById("first");
    var lastButton = document.getElementById("last");
    var randButton = document.getElementById("rand");
    var nextButton = document.getElementById("next");
    var latestButton = document.getElementById("latest");

    //.onlick för knapparna
    firstButton.onclick = function(){ //första
        document.comicNr = 1;
        getComic(document.comicNr, nextButton, lastButton, firstButton, latestButton);
    }
    lastButton.onclick = function(){ //förra
        if(!(document.comicNr - 1 < 1)){
            document.comicNr--;
            getComic(document.comicNr, nextButton, lastButton, firstButton, latestButton);
        } 
    }
    nextButton.onclick = function(){ //nästa
        if(!(document.comicNr + 1 > document.comics)){
            document.comicNr++;
            getComic(document.comicNr, nextButton, lastButton, firstButton, latestButton);
        }
    }
    latestButton.onclick = function(){ //senaste
        document.comicNr = document.comics;
        getComic(document.comicNr, nextButton, lastButton, firstButton, latestButton);
    }
    randButton.onclick = function(){ //random
        document.comicNr = randomComic[0];
        //tar bort den fösrta siffran i "randomComic" så att en ny kan genereras
        randomComic.splice(0,1);
        getComic(document.comicNr, nextButton, lastButton, firstButton, latestButton);
    }
    
    //hämtar comicen om för första gången
    getComic(document.comicNr, nextButton, lastButton, firstButton, latestButton);
}

//hämtar den comicen man vill ha "which" och laddar in comicen före och efter den
function getComic(which, nextButton, lastButton, firstButton, latestButton){
    fetchComic(which); 
 
    //avaktiverar knappar som inte går att använda
    if(which + 1 > document.comics){
        nextButton.className = "unactive";
        latestButton.className = "unactive";
    }else{
        nextButton.className = "";
        latestButton.className = "";
    }
    if(which - 1 < 1){
        lastButton.className = "unactive";
        firstButton.className = "unactive";
    }else{
        lastButton.className = "";
        firstButton.className = "";
    }

    //ladar in comicsen brevid
    if(which != "latest"){
        if(!(which - 1 <= 0)){
            fetchComic(which-1, true);
        }
        if(!(which + 1 > document.comics)){
            fetchComic(which+1, true);
        }
    }
}

//bygger comicen
//"loadedComics" är ett objekt som innehåller alla laddade comics i from av arrayer
function buildComic(data, loadedComics, lodading){
    //sätter mängden comics
    if(document.comicNr === "latest"){
        document.comics = data.num;
        onLoad = true;
    }
    //"loading" används då en comic bara ska laddas in och inte visas
    if(!lodading){
        document.comicNr = data.num;
    }

    //bygger upp comicen
    elements = [];

    elements.push(titel = document.createElement("H1"));
    titel.innerHTML = data.title;

    elements.push(imgFigure = document.createElement("FIGURE"));
    let img = document.createElement("IMG");
    img.src = data.img;
    imgFigure.appendChild(img)

    let bildText = document.createElement("FIGCAPTION");
    bildText.innerHTML = "Comic nr: "+ data.num
    imgFigure.appendChild(bildText);

    elements.push(datum = document.createElement("p"));
    datum.innerHTML = `${data.day}-${data.month}-${data.year}`;

    //sätter elementen i loadedComics så att elementen kan användas i "appendComic"
    loadedComics[data.num] = elements;
}

//sätter in elemnten från en viss comic, "which", i "mainComic" diven
function appendComic(which){
    let mainComic = document.getElementById("mainComic");
    mainComic.innerHTML = "";

    for(let element of loadedComics[which]){
        mainComic.appendChild(element);
    }
    
}

//hämtar comics
function fetchComic(which, lodading){

    //om comicen redan finns laddad, laddas den inte igen
    if(loadedComics[which] == null){
        //om inte which skulle funka sätts den till comic 403
        if((!onLoad && isNaN(which)) | which === 404){
            which = 403;
        }

        //hämtar comicen
        fetch("https://xkcd.vercel.app?comic=" + which)
        .then(function(response){
            if(response.status == 200){
            return response.json();
            }
        })
        .then(function(data){
            buildComic(data, loadedComics, lodading);

            //om comicen bara laddas in visas den inte
            if(!lodading){
                appendComic(document.comicNr);
            }
            
            //sätter 2 random tal i en array med 2 tal för random knappen
            //Laddar in 2 stycken random comics så det går snabbt att få se dem
            if(onLoad){
                randomComic[0] = Math.floor(Math.random() * document.comics - 1) + 1;
                randomComic[1] = Math.floor(Math.random() * document.comics - 1) + 1;
                fetchComic(randomComic[0], true);
                fetchComic(randomComic[1], true);
                fetchComic(document.comics - 1, true)
                fetchComic(1, true);
                onLoad = false;
            }
            //fyller på arrayen med tal när ett har blivigt använt 
            if(randomComic.length < 2){
                console.log("Du kom hit")
                randomComic.push(Math.floor(Math.random() * document.comics));
                fetchComic(randomComic[1], true);
            }
        })
    }else{
        if(!lodading){
            appendComic(which);
        }
    }
}