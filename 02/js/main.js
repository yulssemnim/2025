$(function () {
    AOS.init();

    /* 마우스커서 시작 */
    const cursor = document.querySelector('.cursor');
    const cursorgrow = document.querySelector('.cursor-grow');
    const cursortext = document.querySelector('.cursortext-active');
    const cursortextBig = document.querySelector('.cursortextBig-active');
    const cursortextGreen = document.querySelector('.cursortextGreen-active');
    const navE = document.querySelectorAll('ul.gnb li, .talk_modal_btn, .modal_body, .top_btn, .btnoff, .contact_btn');
    // const cursornone = document.querySelectorAll('.text_wrap .left .btnoff, .contact_btn');
    // const modalE = document.querySelector('.modal_body')
    const textElements = document.querySelectorAll('.title5, .title6, .body1kr, .body1, .body2kr, .body2, .body3kr, .body3, .body4kr, .body4, .body5kr, .body5, .body6kr, .body6, .copylight, .big_number'); // 텍스트 영역을 선택
    const textElementsBig = document.querySelectorAll('.large_title, .title1, .title2, .title3, .title4, .big_number'); // 텍스트 영역을 선택
    const textElementsGreen = document.querySelectorAll('.contxt, .mail_txt');
    const imgElements = document.querySelectorAll('.growimg');
    console.log(imgElements);
    let mouseX = 0, mouseY = 0;
    let isMoving = false;

    // 이벤트 핸들러에서 좌표만 업데이트
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMoving = true;
    });

    // 실제 DOM 업데이트는 requestAnimationFrame에서 수행
    function updateCursor() {
        if (isMoving) {
            cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
            isMoving = false;
        }
        requestAnimationFrame(updateCursor);
    }

    // 초기화
    updateCursor();

    // 텍스트 영역에 마우스가 들어갔을 때 커서 모양을 변경
    textElements.forEach((element) => {
        element.addEventListener('mouseover', () => {
            cursor.classList.add('cursortext-active');
        });


        element.addEventListener('mouseout', () => {
            cursor.classList.remove('cursortext-active');
        });
    });

    textElementsBig.forEach((element) => {
        element.addEventListener('mouseover', () => {
            cursor.classList.add('cursortextBig-active');
        });

        element.addEventListener('mouseout', () => {
            cursor.classList.remove('cursortextBig-active');
        });
    });
    textElementsGreen.forEach((element) => {
        element.addEventListener('mouseover', () => {
            cursor.classList.add('cursortextGreen-active');
        });

        element.addEventListener('mouseout', () => {
            cursor.classList.remove('cursortextGreen-active');
        });
    });

    // modalE.forEach((element) => {
    //     element.addEventListener('mouseover', () => {
    //         cursor.classList.add('cursor-modal');
    //     });

    //     element.addEventListener('mouseout', () => {
    //         cursor.classList.remove('cursor-modal');
    //     });
    // });

    imgElements.forEach((element) => {
        element.addEventListener('mouseover', () => {
            cursor.classList.add('cursor-grow');
        });

        element.addEventListener('mouseout', () => {
            cursor.classList.remove('cursor-grow');
        });
    });

    navE.forEach((element) => {
        element.addEventListener('mouseover', () => {
            cursor.classList.add('none');
        });

        element.addEventListener('mouseout', () => {
            cursor.classList.remove('none');
        });
    });
    // cursornone.forEach((element) => {
    //     element.addEventListener('mouseover', () => {
    //         cursor.classList.add('none');
    //     });

    //     element.addEventListener('mouseout', () => {
    //         cursor.classList.remove('none');
    //     });
    // });
    /* 마우스커서 끝 */


    /* 헤더 모달창 시작*/
    $('.talk_modal_btn').click(function () {
        console.log('아무거나')
        $('.talk_modal').fadeIn().addClass('on');

    })
    $('.close_btn').click(function () {
        $('.talk_modal').fadeOut();
    })
    /* 헤더 모달창 끝*/


    let chk = 0;
    $('.about .about_container>.right .experience ul.work_list li').click(function () {
        $(this).find('.txt').slideToggle();
        $(this).toggleClass('on');
    })

    // work_list
    $('.slider').simplyScroll({
        speed: 2,
        direction: 'forwards',
        pauseOnHover: true,
        pauseOnTouch: false,
        clone: true,
    });
    $('.slider ul.work_list>li').hover(function () {
        $(this).css({
            // "background-color" : "rgba(0,0,0,0.3)"
        })
    });



    // GSAP ScrollTrigger 애니메이션 설정
    const horizontal = document.querySelector('.s_wrap');
    const sections = gsap.utils.toArray('.s_wrap > section');
    //매서드 선택을 해놔야 나중에 gsap 같은데 쓸 수 있음 */

    gsap.to(sections, {
        xPercent: -100 * (sections.length - 1), // 섹션 이동 거리
        ease: 'none', //가속도 설정
        scrollTrigger: {
            y: '45vh',
            trigger: '.more', // 트리거는 스크롤 영역
            start: 'top top', //시작 지점
            end: () => '+=' + (horizontal.offsetWidth - innerWidth), //끝 지점
            pin: true, //스크롤이 시작되면 요소 고정
            scrub: 1, //스크롤과 애니메이션을 동기화
            invalidateOnRefresh: true, //리사이즈 시 다시 계산
        },
    });

    // $('.contact_btn').hover(function(){
    //     $('.footer .bottom .contact').addClass('on');
    // });
    $('.contact_btn').click(function () {
        $('footer .bottom .contact').toggleClass('on');
    });


    let about = $("#about").offset().top;
    let more = $('.more').offset().top;
    console.log(about)
    /* 스크롤 영역 도달시 등장 */
    $(window).scroll(function () {
        var st = $(window).scrollTop();
        console.log(st);
        if ( st>= about && st<more) {
            $('.about .about_container>.right').addClass('on');
        }else{
            $('.about .about_container>.right').removeClass('on');
        }
    })

    $('ul.work_list>li').click(function(){
        let i = $(this).index()+1;
        $('.modal-01').fadeIn();
   /*      $('.modal-01').fadeIn().find('.img_box').attr('src',`img/suunto${i}.jpg`);
        console.log(`img/suunto${i}.jpg`); */
    });
    $('.modal-close').click(function(){
        $('.modal-01').fadeOut().find('.img_box').attr('src','');
    });
});