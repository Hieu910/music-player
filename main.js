const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = "F8_PLAYER";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app= {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
    setConfig: function(key, value){
      this.config[key] = value;
      localStorage.setItem(PlAYER_STORAGE_KEY ,JSON.stringify(this.config))
    },
    songs: [
        {
          name: "Boom Boom Boom Boom",
          singer: "Vengaboys",
          path: "/asset/music/boom boom boom boom - vengaboys.mp3",
          image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
        },
        {
          name: "She wanna go",
          singer: "Colby O Donis ft Paul Wall - DJ Elvis Lucio remix",
          path: "/asset/music/colby o donis ft paul wall - she wanna go - dj elvis lucio remix.mp3",
          image:
            "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
        },
        {
          name: "Dark soul III Main Theme",
          singer: "Dark soul III",
          path: "/asset/music/Dark Souls III  - Main Theme.mp3",
          image: "https://banthe247.com/pictures/images/dark-souls-3%20(8)-min.jpg"
        },
        {
          name: "Prelude",
          singer: "Nobuo Uematsu",
          path: "/asset/music/Final Fantasy Brave Exvius - Prelude (OST).mp3",
          image: "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
        },
        {
          name: "Reloaded games music",
          singer: "Reloaded games",
          path: "/asset/music/reloaded games music (2014).mp3",
          image:
            "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
        },
        {
          name: "Team",
          singer: "Lorde",
          path: "/asset/music/team-lorde-3084164-1.mp3",
          image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
        },
        {
          name: "Tình nhi nữ",
          singer: "Hòa tấu",
          path: "/asset/music/TinhNuNhi-HoaTau-3089111.mp3",
          image: "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
        },
        {
            name: "Vì yêu",
            singer: "Kasim Hoàng Vũ",
            path: "/asset/music/viyeuremix2014-djrumbarcadikasimhoangvu-3292689.mp3",
            image: "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
        },
      ],
    render: function(){
        let htmls=this.songs.map((song,index) =>{
            return ` 
            <div class="song ${index === this.currentIndex ? 'active':''}" song-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                 </div>
             </div>`
        })
        $('.playlist').innerHTML = htmls.join('')
        randomBtn.classList.toggle('active', app.isRandom);   
        repeatBtn.classList.toggle('active', app.isRepeat);
    },
    definePropertie: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function(){
        //cuon chuot
        let cdWidth = $('.cd').offsetWidth;
        document.onscroll = function(){
            let scrollTop = window.scrollY || document.documentElement.scrollTop ;
            let newcdWidth = cdWidth - scrollTop;
            $('.cd').style.width = newcdWidth>0 ? newcdWidth+'px' : 0; 
            $('.cd').style.opacity = newcdWidth / cdWidth;
        }
        //play-pause
        const cdThumbAnimate = cdThumb.animate([{
          transform: 'rotate(360deg)'
        }], {duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();
        playBtn.onclick = function(){
          if(app.isPlaying)
          {
            audio.pause();
          }
          else{
            audio.play();
          }
        }
        audio.onplay=function(){
          player.classList.add('playing');
          app.isPlaying = true;
          cdThumbAnimate.play();
        }
        audio.onpause=function(){
          player.classList.remove('playing');
          app.isPlaying = false;
          cdThumbAnimate.pause();
        }
        // Progress bar
        let checkOnmouseAndTouch = true;
        function ChangeProgress(e) {
          const seekTime = audio.duration / 100 * e.target.value;
          audio.currentTime = seekTime;
          audio.play();
          checkOnmouseAndTouch = true;
        }
        function ChangeAudioTime() {
          if(audio.duration && checkOnmouseAndTouch) {
              const progressPercent = audio.currentTime/audio.duration*100;
              progress.value = progressPercent;
          }
        }
        // Khi bài hát được tua
        
        progress.onmousedown = function() {
            checkOnmouseAndTouch = false;
        }
        progress.onmouseup = function(e) {
          ChangeAudioTime()
          ChangeProgress(e)
        }
        progress.onchange = function(e){
          ChangeProgress(e);
        } ;
        
        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
          ChangeAudioTime();
        } 

        // Next Song
        nextBtn.onclick = function(){
          if(app.isRandom){
            app.randomSong();
          }
          else{
            app.nextSong();
          }
          app.render();
          app.scrollToActiveSong();
        }
        // Previous Song
        prevBtn.onclick = function(){
          if(app.isRandom){
            app.randomSong();
          }
          else{
            app.previousSong();
          }
          app.render();
          app.scrollToActiveSong();
        }

        // Toggle Random
        randomBtn.onclick = function(){
          app.isRandom = !app.isRandom;
          app.setConfig('isRandom',app.isRandom);
          randomBtn.classList.toggle('active', app.isRandom);
        }
        // Toggle Repeat
        repeatBtn.onclick = function(){
          app.isRepeat = !app.isRepeat;
          app.setConfig('isRepeat',app.isRepeat);
          repeatBtn.classList.toggle('active', app.isRepeat);
        }
        //Next song when ended
        audio.onended =function(){
          if(app.isRepeat)
          {
            app.loadCurrentSong();
            audio.play();
          }
          else{
            if(app.isRandom){
              app.randomSong();
            }
            else{
              app.nextSong();
            }
          }
        }
        //Click to play song
        playlist.onclick = function(e){
          const songNode = e.target.closest('.song:not(.active)') ;
          const songOption = e.target.closest('.option')
          if(songNode|| songOption)
          {
            if(songNode)
            {
              app.currentIndex=Number(e.target.closest('.song:not(.active)').getAttribute('song-index'))
              app.loadCurrentSong();
              app.render();
              console.log(app.currentIndex);
              audio.play()
            }
            if(songOption)
            {

            }
          }
        }
        
    },
    scrollToActiveSong: function(){    
      if($('.playlist .song:first-child.active') || $('.playlist .song:nth-child(2).active') || $('.playlist .song:nth-child(3).active'))
      {
        document.body.scrollTop=0;
        document.documentElement.scrollTop=0;
      }
      else{
      $('.song.active').scrollIntoView({
        behavior: "smooth", block: "start"
      });
      }
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src= this.currentSong.path;
    },
    //nạp cấu hình
    LoadConfig: function(){
      app.isRandom = app.config.isRandom
      app.isRepeat = app.config.isRepeat
      
      
    },
    nextSong: function(){
      this.currentIndex++;
      if(this.currentIndex>=this.songs.length){
        app.currentIndex=0;
      }
      this.loadCurrentSong();
      audio.play();
    },
    previousSong: function(){
      this.currentIndex--;
      if(this.currentIndex < 0){
        app.currentIndex=app.songs.length - 1;
      }
      this.loadCurrentSong();
      audio.play();
    },
    randomSong: function(){
      let newIndex;
      do{
        newIndex = Math.floor(Math.random() * this.songs.length);
      }
      while(this.currentIndex === newIndex)
      app.currentIndex = newIndex;
      this.loadCurrentSong() ;
      audio.play()
    },
    start: function(){

        this.LoadConfig();
        this.definePropertie();
        this.handleEvents();
        this.loadCurrentSong();
        this.render();  
       
    }
}

app.start();
