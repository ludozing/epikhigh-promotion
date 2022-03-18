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
                        <iframe width="720" height="405" src="https://www.youtube.com/embed/${data.url.split('=')[1]}" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    </div>
                    <div class="lyricArea">
                        <p>
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
// window.addEventListener('load',function(){
// })
let headerNav = document.querySelector('.headerNav');
let scrollSect = document.querySelectorAll('.section');
let lyricArea = document.querySelectorAll('.lyricArea')
const lastSectIndex = scrollSect.length - 1;
let currentScrollIndex = 0;
Array.from(headerNav.children, (navLi, index)=>{
    navLi.addEventListener('click',()=>doScroll(index) )
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
        if(delta < 0){
            if(sectSelector !== lastSectIndex){
                try{
                    moveTop = window.pageYOffset + sectSelector.nextElementSibling.getBoundingClientRect().top
                }catch(e){}
            }
        }else{
            if(sectSelector !== 0){
                try{
                    moveTop = window.pageYOffset + sectSelector.previousElementSibling.getBoundingClientRect().top
                }catch(e){}
            }
        }
        window.scrollTo({top:moveTop, left:0, behavior:'smooth'})
    })
})
lyricArea.forEach(element => {
    element.addEventListener('mouseover',function(event){
        $('#songs').unbind()
    })
});

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
        if(st + $(window).height() < $(document).height()){
            $('header').removeClass('off');
        }
    }
    lastScrollTop = st;
}

// 상단에 마우스오버시 헤더 출력
let openNav = document.querySelector('#openNav');
openNav.addEventListener('mouseover',()=>{
    if($('header').hasClass('off')){
        $('header').removeClass('off');
        $('header').mouseleave(()=>$('header').addClass('off'))
    }else return null;
})

// 디스코그래피 섹션
let discography = document.querySelector('#discography');
let albumLi = document.querySelectorAll('#chronology>li');
let discBgs = document.querySelectorAll('.discBg');
let chronoArea = document.querySelector('.chronoArea');
albumLi.forEach((element, index, array) => {
    element.addEventListener('click',()=>{
        array.forEach(li => li.classList.remove('on'))
        element.classList.add('on')
        discBgs.forEach(bg => {
            bg.style.transform = `translate(${index * -100}%,0%)`
        })
    })
});

let sect_h = $(window).outerHeight();
let sect_w = $(window).outerWidth();
let bgArea = document.querySelector('#discBgs');
// if(sect_sct == 0) {
//     albumLi[0].classList.add('on')
// }
document.addEventListener('scroll',function(){
    let sct = document.documentElement.scrollTop
    let sect_sct = sct - sect_h;
    console.log(sect_sct, sect_w*10)
    if(sect_sct>=0 && sect_sct<sect_w*10){
        bgArea.classList.remove('upper');
        bgArea.classList.remove('lower');
        bgArea.classList.add('while');
        chronoArea.classList.remove('upper');
        chronoArea.classList.remove('lower');
        chronoArea.classList.add('while');
        discBgs.forEach((element, index)=>{
            let xNum = -index;
            let newX = xNum + sect_sct;
            element.style.transform = `translateX(-${newX}px)`
        })
        albumLi.forEach((element, index)=>{
            if(sect_sct>=index*sect_w && sect_sct<(index+1)*sect_w){
                albumLi.forEach(eachofLis=>{
                    eachofLis.classList.remove('on')
                })
                element.classList.add('on')
            }    
        })
    }
    else if (sect_sct < 0) {
        bgArea.classList.remove('while');
        bgArea.classList.add('upper');
        chronoArea.classList.remove('while');
        chronoArea.classList.add('upper');
    }
    else if (sect_sct >= sect_w*10) {
        bgArea.classList.remove('while');
        bgArea.classList.add('lower');
        chronoArea.classList.remove('while');
        chronoArea.classList.add('lower');
    };
})