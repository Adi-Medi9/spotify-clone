console.log("lets write javascript")

let currentSong = new Audio()
let songs
function convertSecondsToMinutesSeconds(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(Math.abs(seconds) % 60); // Ensure positive and remove fractional part

    // Add leading zeros if necessary
    var minutesStr = minutes < 10 ? '0' + minutes : minutes;
    var secondsStr = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    return minutesStr + ':' + secondsStr;
}

async function getSongs(){

    let a = await fetch("http://127.0.0.1:3000/song/");
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith("mp3")){
            songs.push(element.href.split("/song/")[1])
        }   
    }
    return songs
}
// function remove(song){
//     // Original URL
// var originalURL = song;

// // Remove "http://127.0.0.1:3000/"
// var removedHTTP = originalURL.substring(originalURL.indexOf('/'));

// // Remove "(PagalWorld.com.cm).mp3"
// var removedFilename = removedHTTP.replace(/\.mp3$/, '');

// // var removedFilename_1 = removedFilename.replace(/\(PagalSongs\.Com\.IN\)\.mp3$/, '');

// // Replace "%20" with space
// var finalURL = decodeURIComponent(removedFilename.replace(/%20/g, ' '));

// return finalURL

//  }

const playMusic = (track , pause = false) =>{
    // let audio = new Audio("/song/" + track +"(PagalWorld.com.cm).mp3")
    // audio.play()
    currentSong.src = "/song/" + track 
    if(!pause){
        currentSong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main(){

    //get list of all songs.
    songs = await getSongs()
    playMusic(songs[0],true)
    // console.log(songs)


    //show all songs in playlist.
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> <img src="ms.svg" class="invert" alt="">
        <div class="info">
            <div>${decodeURIComponent(song)} </div>
            <div>Aditya</div>
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img src="play.svg" class="invert" alt="">
        </div>
  
        </li>`;
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
        
    })

    // add controls to the songbuttons
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "play.svg"
        }
    })

    //listen for time update
    currentSong.addEventListener("timeupdate" , ()=>{
        console.log(currentSong.currentTime , currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${convertSecondsToMinutesSeconds(currentSong.currentTime)} / ${convertSecondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //add an event listner to seek bar
    document.querySelector(".seekbar").addEventListener("click" , e=>{
        let percent = (e.offsetX / e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent)/100;

    })

    //add an event listner for hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
      document.querySelector(".left").style.left = "0"  
    })

    //add an event listner for close
    document.querySelector(".close img").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-120%"  
      })

    // add an event listner to previous
    previous.addEventListener("click", ()=>{
        console.log("previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index-1) >= 0){

            playMusic(songs[index-1])
        }
        
    })  

    // add an event listner to next
    next.addEventListener("click", ()=>{
        console.log("next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index+1) < songs.length){

            playMusic(songs[index+1])
        }
        
    })


    //add event listner to volume button in js
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log("setting volume to: ",e.target.value ,"/100")
        currentSong.volume = parseInt(e.target.value)/100
    })

}

main()