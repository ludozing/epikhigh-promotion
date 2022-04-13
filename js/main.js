let playDataNo = 0;
function processFile(file) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", file, false);
    xmlhttp.send();
    //파일 로드 성공 시 파일에서 읽은 텍스트를 content에 담음
    if (xmlhttp.status == 200) { 
      return xmlhttp.responseText;
    }
}
// json 파일 받아오는 함수
function loadData(){
    return fetch('/data/data.json')
    .then(res => res.json())
    .then(json=>json.musics)
}
// json 데이터를 html요소로 변환해 화면에 출력
function displayData(datas){
    const container = document.querySelector('.songInfoGroup');
    container.innerHTML = datas.map(data => {
        return (
            `
            <div class="songInfo">
                <h2 class="musicTitle">${data.title}<span></span></h2>
                <div class="vidNlyr">
                    <div class="videoArea" id="data${data.no}">
                        <iframe src="https://www.youtube.com/embed/${data.url.split('=')[1]}" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    </div>
                    <div class="lyricArea">
                        <p class="lyric">
                            ${processFile(data.lyric)}
                        </p>
                    </div>
                </div>
            </div>

            `
        )
    }).join(' ')
}
loadData()
.then(datas => {
    displayData(datas)
})

// 스크롤 이벤트
let headerNav = document.querySelector('.headerNav');
let scrollSect = document.querySelectorAll('.section');
let horizSect = document.querySelectorAll('.discBg');
let currentHS = 0;
const lastSectIndex = scrollSect.length - 1;
let currentScrollIndex = 0;
let albumLi = document.querySelectorAll('#chronology>li');
function moveHS(secNo){
    albumLi.forEach(element=>{
        element.classList.remove('on');
    })
    console.log(albumLi[secNo])
    albumLi[secNo].classList.add('on')
    horizSect.forEach(item => {
        item.style.transform = `translate(-${100*secNo}%,0%)`;
    })
}
albumLi.forEach((element, index, array) => {
    element.addEventListener('click',()=>{
        currentHS = index;
        moveHS(currentHS);
    })
});
Array.from(headerNav.children, (navLi, index)=>{
    navLi.addEventListener('click',()=>{
        if(index===1){
            currentHS = 0;
            moveHS(currentHS);
            doScroll(index);
        }else{
            doScroll(index);
        }
    })
})
function doScroll(s_index){
    s_index = s_index < 0 ? 0 : s_index;
    s_index = s_index > lastSectIndex ? lastSectIndex : s_index;
    currentScrollIndex = s_index;
    scrollSect[currentScrollIndex].scrollIntoView({
        block: "start", inline: "start", behavior: "smooth"
    })
}
scrollSect.forEach((item, index)=>{
    item.addEventListener('mousewheel',function(event){
        event.preventDefault();
        let delta = 0;
        if(!event) event = window.event;
        if(event.wheelDelta){
            delta = event.wheelDelta / 120
            if(window.opera) delta = -delta;
        }else if(event.detail){
            delta = -event.detail / 3;
        }
        let moveTop = window.scrollY;
        let sectSelector = scrollSect[index];
        // 휠을 아래로
        if(delta < 0){
            if($(window).width()>=1025){
                if(index===1){
                    if(currentHS !== horizSect.length - 1){                  
                        moveHS(currentHS+1);
                        currentHS += 1;
                    }else{
                        try{
                            moveTop = window.pageYOffset + sectSelector.nextElementSibling.getBoundingClientRect().top
                        }catch(e){}
                    }
                }
                else if(sectSelector !== lastSectIndex){
                    if(index<1){
                        currentHS = 0;
                        moveHS(currentHS);
                    }
                    try{
                        moveTop = window.pageYOffset + sectSelector.nextElementSibling.getBoundingClientRect().top
                    }catch(e){}
                }else return null;
            }
            else {
                try{moveTop = window.pageYOffset + sectSelector.nextElementSibling.getBoundingClientRect().top}catch(e){}
            }
        }
        // 휠을 위로
        else{
            if($(window).width()>=1025){
                if(index===1){
                    if(currentHS !== 0){
                        moveHS(currentHS-1)
                        currentHS -= 1;
                    }else{
                        try{
                            moveTop = window.pageYOffset + sectSelector.previousElementSibling.getBoundingClientRect().top
                        }catch(e){}
                    }
                }
                else if(sectSelector !== 0){
                    if(index>1){
                        currentHS = 10;
                        moveHS(currentHS);
                    }
                    try{
                        moveTop = window.pageYOffset + sectSelector.previousElementSibling.getBoundingClientRect().top
                    }catch(e){}
                }
            }
            else {
                try{moveTop = window.pageYOffset + sectSelector.previousElementSibling.getBoundingClientRect().top}catch(e){}
            }
        }
        window.scrollTo({top:moveTop, left:0, behavior:'smooth'})
    })
})

// EPIK HIGH IS HERE 섹션 버튼 이벤트
let prev = document.querySelector('.prevBtn');
let next = document.querySelector('.nextBtn');
let songInfoGroup = document.querySelector('.songInfoGroup');

prev.addEventListener('click',()=>{
    if(playDataNo>0){
        playDataNo = playDataNo - 1;
        songInfoGroup.style.left = (-100 * playDataNo) + '%';
    }
})
next.addEventListener('click',()=>{
    if(playDataNo<10){
        playDataNo = playDataNo + 1;
        songInfoGroup.style.left = (-100 * playDataNo) + '%';
    }
    else return null;
})

// 스크롤 이벤트시 헤더 숨김
let didScroll;
let lastScrollTop = 0;
let delta = 5;
let navbarHeight = $('header').outerHeight();

$(window).scroll(function(event){
    didScroll = true;
});

setInterval(function(){
    if(didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 250);
function hasScrolled(){
    let st = $(this).scrollTop();

    if(Math.abs(lastScrollTop - st) <= delta)
    return;

    if(st > lastScrollTop && st > navbarHeight){
        $('header').addClass('off');
    } else {
        if($(window).width()<=480){
            if(currentHS===0){
                $('header').removeClass('off');
            }
        }else{
            if(st + $(window).height() < $(document).height()){
                $('header').removeClass('off');
            }
        }
    }
    lastScrollTop = st;
}

document.querySelector('#toTheTop').addEventListener('click',function(){
    currentHS = 0;
})

// 상단에 마우스오버시 헤더 출력
let openNav = document.querySelector('#openNav');
openNav.addEventListener('mouseover',()=>{
    if($('header').hasClass('off')){
        $('header').removeClass('off');
        $('header').mouseleave(()=>$('header').addClass('off'))
    }else return null;
})

let toggle = document.querySelector('.toggle')
let navArea = document.querySelector('.navArea')
toggle.addEventListener('click', function(){
    toggle.classList.toggle('on')
    navArea.classList.toggle('on')
})