
//custom cursor 시작
const cursor = document.querySelector('.custom_cursor');
const works = document.querySelector('.works');
const clips = document.querySelectorAll('.clip');
works.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
    cursor.style.display = 'flex';
})

// works 영역에서 커서 숨기기
works.addEventListener('mouseleave', () => {
    cursor.style.display = 'none';

});

// clip 요소에 마우스 오버 및 아웃 이벤트 추가
clips.forEach(clip => {
    clip.addEventListener('mouseenter', () => {
        cursor.classList.add('on');
    });
    clip.addEventListener('mouseleave', () => {
        cursor.classList.remove('on');
    });
});
//custom cursor 끝


//works 배경 전환되면서 갤러리 모션 까지 시작
// englare circle
gsap.to(".circle", {
    width: "600vmax",
    height: "600vmax",
    ease: Power1.easeInOut,

    scrollTrigger: {
        // pin: true,
        trigger: ".works",
        start: "top 150%",
        end: "bottom top",
        scrub: 0.5,
        // markers: true
    }
});

// text animation

const textLines = document.querySelectorAll(".text_line");

const textLineAnim = gsap.timeline({

    defaults: {
        duration: 0.2,
        ease: 'none'
    },
    scrollTrigger: {
        start: 0,
        end: 'max',
        scrub: 0.5
    }

})

textLineAnim
    .fromTo(textLines, {
        x: (index) => index % 2 ? window.innerWidth : -window.innerWidth
    }, {
        x: 0
    }, 0)
    .fromTo(textLines, {
        x: 0
    }, {
        x: (index) => index % 2 ? -window.innerWidth : window.innerWidth,
        immediateRender: false
    }, 2.5)


// text reveal up
gsap.utils.toArray(".up").forEach(element => {

    gsap.fromTo(element,
        {
            yPercent: 50,
            opacity: .2,
        },
        {
            duration: 0.8,
            delay: 1,
            opacity: 1,
            yPercent: -50,
            ease: "power",
            stagger: 0.02,

            scrollTrigger: {
                trigger: element,
                start: "top 100%",
                end: "bottom top",
                scrub: 0.5,
                // markers: true
            }
        });
});



// Parallax mask
const photos = gsap.utils.toArray('.clip img');

photos.forEach(photo => {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: photo,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.75,
            toggleActions: 'play none none none',
        },
    });

    tl.fromTo(
        photo,
        { y: '-20%' },
        { y: '0%' }
    );
});

//works 배경 전환되면서 갤러리 모션 까지 끝


//bg text 모션 시작
let to = document.querySelector('.row_3').offsetTop - 200;
let etc_wrapto = document.querySelector('.etc_wrap').offsetTop;
let ht = $(window).height();


document.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const bgText = document.querySelector('.bg_txt');
    if (scrollY >= to && scrollY < etc_wrapto) { bgText.style.opacity = '1' } else {
        bgText.style.opacity = '0'
    }
    // 스크롤 값에 따라 Y축 변화를 적용
    bgText.style.top = `${scrollY * 0.5}px)`;
    //console.log(!document.body.classList.contains('fix'));


    if (!document.body.classList.contains('fix')) {
        if (scrollY > 0 && scrollY <= 200) {
            $('html, body').animate({ scrollTop: 0 }, 'slow', function () {
                location.reload();
            });
        }
    }
    if (scrollY >= works.offsetTop) {
        document.querySelector('header').classList.add('active');
    } else {
        document.querySelector('header').classList.remove('active');
    }

    /*  bgText.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.5}px))`; */
});
//bg text 모션 끝


//etc works scroll 이벤트 시작
gsap.registerPlugin("ScrollTrigger");

let wheel = document.querySelector(".wheel");
let images = gsap.utils.toArray(".wheel_card");

function setup() {
    let radius = wheel.offsetWidth / 2;
    let center = wheel.offsetWidth / 2;
    let total = images.length;
    let slice = (2 * Math.PI) / total;

    images.forEach((item, i) => {
        let angle = i * slice;

        let x = center + radius * Math.sin(angle);
        let y = center + radius * Math.cos(angle);

        gsap.set(item, {
            duration: 1,
            rotation: -angle + "-rad",
            //rotation: (i) => i * (360 / items.length),
            xPercent: -50,
            yPercent: -50,
            x: x,
            y: y,
        });
    });
}

// GSAP 및 ScrollTrigger를 사용한 애니메이션
gsap.to(".wheel", {
    rotate: () => 180,
    ease: "none",
    duration: images.length, // 애니메이션 지속 시간 (images 배열 길이에 따라 결정)
    scrollTrigger: {
        trigger: ".etc_wrap", // 트리거 요소 설정
        start: "top top", // 트리거가 화면 상단에 닿으면 시작
        end: "+=1000", // 애니메이션 지속 범위
        scrub: true, // 스크롤과 애니메이션 동기화
        pin: true, // 트리거를 화면에 고정
        invalidateOnRefresh: true, // 리프레시 시 새로 계산
        onUpdate: () => {
            // 스크롤이 움직일 때마다 모달 닫기
            document.querySelector('.modal').classList.remove('active');
        },
        onLeave: () => {
            // 사용자가 etc_wrap 섹션을 완전히 벗어났을 때 모달 닫기
            document.querySelector('.modal').classList.remove('active');
        },
        onEnterBack: () => {
            // 뒤로 스크롤 시에도 모달 닫기
            document.querySelector('.modal').classList.remove('active');
        }
    }
});


setup();
window.addEventListener("resize", setup);

// $('.wheel_card').hover(function () {
//     let src = $(this).find('img').attr('src');
//     src = src.replace('./img/eunwoo', './img/eunwoo_on');
//     $('.modal').addClass('on').find('img').attr('src', src);
// }, function () {
//     $('.modal').removeClass('on')
// })
//etc works scroll 이벤트 끝



// card 클릭했을때 modal 생성 시작
// 모든 wheel_card 요소를 선택
const wheelCards = document.querySelectorAll('.wheel_card');

// modal 요소 선택
const modal = document.querySelector('.modal');

// modal 내부의 이미지 요소 선택
const modalImage = modal.querySelector('img');



// wheel_card 클릭 이벤트 등록
let chk = 0;
$('.wheel_card').click(function (e) {
    e.preventDefault();
    let currentModalImageSrc = $(this).find('img').attr('src');
    currentModalImageSrc = currentModalImageSrc.replace('eunwoo', 'eunwoo_on');
    $('.modal').addClass('active');
    $('.modal img').attr('src', currentModalImageSrc);
})
$('.modal').click(function () {
    $(this).removeClass('active');
});
/* wheelCards.forEach(card => {
    card.addEventListener('click', (event) => {

        const imgSrc = card.querySelector('img').getAttribute('src');
        imgSrc = currentModalImageSrc.replace('eunwoo', 'eunwoo_on');
        console.log(imgSrc);
        if (modal.classList.contains('active') && currentModalImageSrc === imgSrc) {

            modal.classList.remove('active');
            currentModalImageSrc = '';
        } else {

            modalImage.setAttribute('src', imgSrc);
            modal.classList.add('active');
            currentModalImageSrc = imgSrc;
        }
    });
});
 */
// modal 클릭 이벤트 등록 (배경 클릭 시 모달 닫힘)
/* modal.addEventListener('click', () => {
    modal.classList.remove('active');
    currentModalImageSrc = '';
}); */

// modal 이미지 클릭 시 이벤트 전파 막기 (모달이 닫히지 않도록)
/* modalImage.addEventListener('click', (event) => {
    event.stopPropagation();
}); */

// card 클릭했을때 modal 생성 끝


