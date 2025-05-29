

$(function () {

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // locomotive-scroll 초기화
    const scrollContainer = document.querySelector("[data-scroll-container]");
    const scroll = new LocomotiveScroll({
        el: scrollContainer,
        smooth: true,
    });
    //연결
    scroll.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(scrollContainer, {
        scrollTop(value) {
            return arguments.length
                ? scroll.scrollTo(value, 0, 0)
                : scroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight,
            };
        },
        pinType: scrollContainer.style.transform ? "transform" : "fixed",
    });
    //snap 설정
    ScrollTrigger.defaults({
        scroller: scrollContainer,
    });

    gsap.utils.toArray("section").forEach((panel, i) => {
        ScrollTrigger.create({
            trigger: panel,
            start: "top top",
            end: "bottom top",
            snap: 1,
        });
    });

    ScrollTrigger.addEventListener("refresh", () => scroll.update());
    ScrollTrigger.refresh();

    // GNB 클릭 → locomotive-scroll로 부드럽게 스크롤 이동
    document.querySelectorAll('header a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                scroll.scrollTo(targetElement);
            }
        });
    });

    //커스텀 커서
    const cursor = document.querySelector('.custom_cursor');
    const cursor2 = document.querySelector('.custom_cursor2');
    cursor2.style.display = 'none';

    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
        cursor2.style.left = `${mouseX}px`;
        cursor2.style.top = `${mouseY}px`;

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    document.querySelectorAll('a, button, .hover-target').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    //마우스 커서 효과
    const cursorText = cursor.querySelector('span');
    let isHoveringLink = false;
    // hover 이벤트 처리
    document.querySelectorAll('.workSwiper .swiper-slide a').forEach(link => {
        link.addEventListener('mouseenter', () => {
            const text = link.dataset.cursor;
            if (text) {
                isHoveringLink = true; // hover 상태 true
                cursor.classList.remove('hover');
                cursor.classList.add('drag');
                cursorText.textContent = text;
            }
        });

        link.addEventListener('mouseleave', () => {
            isHoveringLink = false; // hover 상태 false
            cursor.classList.remove('drag');
            cursorText.textContent = '';
        });
    });

    document.addEventListener('mousemove', (e) => {
        const offsetX = isHoveringLink ? 0 : 0;
        const offsetY = isHoveringLink ? 0 : 0;

        cursor.style.left = `${e.clientX + offsetX}px`;
        cursor.style.top = `${e.clientY + offsetY}px`;
    });


    const aboutBg = document.querySelector('#about .bg');

    aboutBg.addEventListener('mouseenter', () => {
        cursor.style.display = 'none';
        cursor2.style.display = 'block';
        cursor2.style.transform = 'translate(-50%, -50%) scale(1.5)';
    });

    aboutBg.addEventListener('mouseleave', () => {
        cursor.style.display = 'block';
        cursor2.style.display = 'none';
        cursor2.style.transform = 'translate(-50%, -50%) scale(1)'; // 원래 크기로
    });

    // CLICK 텍스트 애니메이션
    gsap.fromTo('#about .bg span', {
        opacity: 0,
        scale: 0.8
    }, {
        scrollTrigger: {
            trigger: '#about',
            start: 'top center+=50',
            scroller: '[data-scroll-container]',
        },
        opacity: 1,
        scale: 1,
        ease: 'back.out(1.7)',
        duration: 1
    });

    // STAR 흔들림 + 트레일
    let star = document.querySelector('.star');
    const aboutSection = document.querySelector('#about');

    aboutSection.addEventListener('mousemove', function (e) {
        let x = (e.clientX - window.innerWidth / 2) / 30;
        let y = (e.clientY - window.innerHeight / 2) / 30;

        gsap.to(star, {
            x: x,
            y: y,
            rotation: x / 5,
            duration: 0.8,
            ease: 'sine.out'
        });
    });

    // 트레일 생성
    for (let i = 0; i < 5; i++) {
        let trail = star.cloneNode(true);
        trail.classList.add('star-trail');
        document.querySelector('#about .bg a').appendChild(trail);
    }

    const trails = document.querySelectorAll('.star-trail');

    aboutSection.addEventListener('mousemove', (e) => {
        const baseX = (e.clientX - window.innerWidth / 2) / 30;
        const baseY = (e.clientY - window.innerHeight / 2) / 30;

        trails.forEach((el, i) => {
            const delay = (i + 1) * 0.05;

            gsap.to(el, {
                x: baseX,
                y: baseY,
                rotation: baseX / 5,
                opacity: 0.2,
                duration: 0.5 + delay,
                ease: 'sine.out'
            });
        });
    });

    //클릭 이벤트
    const aboutLink = document.querySelector('#about .bg a');
    const ufo = document.querySelector('.bg .ufo');
    const overlay = document.querySelector('.transition_overlay');
    const ufobig = document.querySelector('.ufobig');

    aboutLink.addEventListener('click', (e) => {
        e.preventDefault(); // 기본 링크 이동 막기

        // UFO 애니메이션
        gsap.to(ufo, {
            scale: 3,
            top: '50%',
            right: '50%',
            x: '50%', // 중심 정렬
            y: '-50%',
            duration: 1.2,
            ease: 'power3.out',

        });
        gsap.to(overlay, {
            opacity: 1,
            duration: 1,
            ease: 'power2.out'
        });
        // UFOBIG 위에서 아래로 내려오기
        gsap.set(ufobig, {
            scale: 1.5,
            opacity: 1,
            top: '-100%',
            x: '-50%',
            rotation: 0
        });
        gsap.to(ufobig, {
            top: '120%', // 화면 아래쪽까지 이동
            duration: 3.5,
            ease: 'power2.inOut',
            onComplete: () => {
                window.location.href = aboutLink.getAttribute('href');
            },
            onStart: () => {
                // 좌우 흔들림 애니메이션
                gsap.to(ufobig, {
                    x: '-40',
                    rotation: -10,
                    duration: 0.5,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                });
            }
        });
    });


   
});