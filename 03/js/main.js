$(function () {
  let headerScrolled = false;

  // scroll에 따른 상단 gnb 모션 시작
  $('section').on('wheel', function (e) {
    if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
      $('header').removeClass('on');
    } else {
      $('header').addClass('on')
    }
  });

  //main cat 모션 재실행 시작
  $('.main_gnb li').eq(0).click(function (e) {
    e.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, 'slow', function () {
      location.reload(); // 애니메이션 완료 후 새로고침
    });
  });


  // gnb를 클릭했을때 해당 섹션으로 넘어갈때 모션
  document.querySelectorAll('nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault(); // 기본 동작 방지
      const targetId = this.getAttribute('href'); // 클릭한 앵커의 href 값
      const targetSection = document.querySelector(targetId); // 대상 섹션 선택

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth', // 스무스 스크롤 효과
          block: 'start'      // 섹션 시작 부분으로 이동
        });
      }
    });
  });
  // scroll에 따른 상단 gnb 모션 끝


  //skill_text 떨어짐 시작

  const WALL_THICKNESS = 80;
  const MATTER_CONTAINER = document.querySelector("#skill_all");
  const MATTER_HELPER = document.querySelector("#helper");

  let Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    World = Matter.World,
    Composite = Matter.Composite;

  let engine = Engine.create();
  let render = Render.create({
    element: MATTER_HELPER,
    engine: engine,
    background: "black",
    options: {
      width: MATTER_CONTAINER.offsetWidth,
      height: MATTER_CONTAINER.offsetHeight,
    },
  });

  let domBodies = document.querySelectorAll(".menu_item");
  let matterBodies = {};
  let runner;
  let leftWall, rightWall, ground;

  // 해당 섹션 도달 시 모션 초기화 여부를 확인하는 플래그 변수
  let isInitialized = false;
  let animationFrameId = null; // 애니메이션 프레임 ID 저장

  // Intersection Observer로 특정 섹션 감지
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isInitialized) {
          // isInitialized = true;
          resetMatterWorld(); // 기존 요소 초기화 및 삭제
          init(); // 뷰포트에 노출된 상태 확인 및 애니메이션 실행
        }
      });
    },
    { threshold: 0.5 } // 섹션이 뷰포트에 얼마나 보여야 실행할지 설정
  );

  // #skill_all 섹션 감시 시작
  observer.observe(MATTER_CONTAINER);

  function resetMatterWorld() {
    stopAnimation(); // 기존 애니메이션 중지

    // DOM 요소 초기화
    domBodies.forEach((domBody) => {
      domBody.style.transform = ""; // transform 초기화
    });

    // Matter.js 월드 및 객체 초기화
    Matter.World.clear(engine.world, true); // 월드 클리어
    Matter.Engine.clear(engine); // 엔진 클리어
    matterBodies = {}; // 객체 맵 초기화

    if (runner) {
      Runner.stop(runner); // 기존 Runner 중지
      runner = null; // Runner 참조 초기화
    }

    if (render) {
      Render.stop(render); // 기존 Render 중지
      render.canvas.remove(); // 렌더링 캔버스 삭제
      render = null; // Render 참조 초기화
    }
  }

  function init() {
    if (runner) Runner.stop(runner); // 기존 Runner 중지
    if (render) Render.stop(render); // 기존 Render 중지

    createBounds(); // 경계 생성

    render = Render.create({
      element: MATTER_HELPER,
      engine: engine,
      background: "black",
      options: {
        width: MATTER_CONTAINER.offsetWidth,
        height: MATTER_CONTAINER.offsetHeight,
      },
    });

    Composite.add(engine.world, [leftWall, rightWall, ground]);

    Render.run(render); // 새 Render 실행

    runner = Runner.create(); // 새 Runner 생성
    Runner.run(runner, engine);

    createMatterBodies(); // Matter 객체 생성
    World.add(engine.world, Object.values(matterBodies));

    window.requestAnimationFrame(updateElementPositions); // 애니메이션 프레임 요청
    window.addEventListener("resize", () => handleResize());
  }


  function createBounds() {
    ground = Bodies.rectangle(
      MATTER_CONTAINER.offsetWidth / 2,
      MATTER_CONTAINER.offsetHeight + WALL_THICKNESS / 2,
      6000,
      WALL_THICKNESS,
      { isStatic: true }
    );

    leftWall = Bodies.rectangle(
      0 - WALL_THICKNESS / 2,
      MATTER_CONTAINER.offsetHeight / 2,
      WALL_THICKNESS,
      MATTER_CONTAINER.offsetHeight * 5,
      { isStatic: true }
    );

    rightWall = Bodies.rectangle(
      MATTER_CONTAINER.offsetWidth + WALL_THICKNESS / 2,
      MATTER_CONTAINER.offsetHeight / 2,
      WALL_THICKNESS,
      MATTER_CONTAINER.offsetHeight * 5,
      { isStatic: true }
    );
  }

  function createMatterBodies() {
    domBodies.forEach(function (domBody) {
      let matterBody = Bodies.rectangle(
        MATTER_CONTAINER.offsetWidth / 2,
        -MATTER_CONTAINER.offsetHeight,
        domBody.offsetWidth,
        domBody.offsetHeight,
        {
          chamfer: {
            radius: domBody.offsetHeight / 2,
          },

          restitution: 0.925,  // 탄성 설정
          angle: Math.random() * 10,
          density: Math.random() * 15, // 밀도 설정
          friction: Math.random() * 50,// 표면 마찰 설정
          frictionAir: Math.random() / 150,// 공기 저항 설정
        }
      );

      // 위치와 속도를 초기화
      Matter.Body.setPosition(matterBody, {
        x: MATTER_CONTAINER.offsetWidth / 2,
        y: -MATTER_CONTAINER.offsetHeight,
      });

      Matter.Body.setVelocity(matterBody, { x: 0, y: 0 }); // 속도 초기화
      Matter.Body.setAngularVelocity(matterBody, 0); // 회전 속도 초기화

      domBody.id = matterBody.id;
      matterBodies[matterBody.id] = matterBody;
    });
  }


  function updateElementPositions() {
    domBodies.forEach((domBody) => {
      let matterBody = matterBodies[domBody.id];

      if (matterBody) {
        domBody.style.transform =
          `translate(${matterBody.position.x - domBody.offsetWidth / 2}px, ` +
          `${matterBody.position.y - domBody.offsetHeight / 2}px) ` +
          `rotate(${matterBody.angle}rad)`;
      }
    });
    // 다음 애니메이션 프레임 요청
    animationFrameId = window.requestAnimationFrame(updateElementPositions);
  }
  // 애니메이션 종료 함수
  function stopAnimation() {
    if (animationFrameId) {
      window.cancelAnimationFrame(animationFrameId); // 중복 호출 중지
      animationFrameId = null;
    }
  }
  function handleResize() {
    render.canvas.width = MATTER_CONTAINER.offsetWidth;
    render.canvas.height = MATTER_CONTAINER.offsetHeight;

    Matter.Render.setPixelRatio(render, window.devicePixelRatio);

    Matter.Body.setPosition(
      ground,
      Matter.Vector.create(
        MATTER_CONTAINER.offsetWidth / 2,
        MATTER_CONTAINER.offsetHeight + WALL_THICKNESS / 2
      )
    );

    Matter.Body.setPosition(
      leftWall,
      Matter.Vector.create(0 - WALL_THICKNESS / 2, MATTER_CONTAINER.offsetHeight / 2)
    );

    Matter.Body.setPosition(
      rightWall,
      Matter.Vector.create(
        MATTER_CONTAINER.offsetWidth + WALL_THICKNESS / 2,
        MATTER_CONTAINER.offsetHeight / 2
      )
    );
  }

  //skill_text 떨어짐 끝


  //skill 스크롤 트리거 시작
  gsap.registerPlugin(ScrollTrigger);

  // #helper에 대한 애니메이션 정의
  const helperAnimation = gsap.to("#helper", {
    // 애니메이션 속성 정의
    // 예: opacity를 0에서 1로 변화
    opacity: 1,
    duration: 2,
  });

  // ScrollTrigger 설정
  ScrollTrigger.create({
    trigger: ".skills", // 스크롤 트리거 요소
    start: "top top", // 애니메이션 시작 지점
    end: "+=100%", // 애니메이션 종료 지점
    pin: true, // 스크롤 고정 여부
    animation: helperAnimation, // 적용할 애니메이션
    scrub: true, // 스크롤과 애니메이션 진행을 연결
    onEnter: () => {
      // 섹션에 진입할 때 실행할 코드
    },
    onLeave: () => {
      // 섹션을 벗어날 때 실행할 코드
    },
  });
  //skill 스크롤 트리거 끝


  //performance 서브텍스트 모션 시작
  $('.sticky_title .list').simplyScroll({
    speed: 4,
    direction: 'forwards',
    pauseOnHover: true,
    pauseOnTouch: true,
  });
  //performance 서브텍스트 모션 끝



  //performance 모션 시작
  class CardFlipOnScroll {
    constructor(wrapper, sticky) {
      this.wrapper = wrapper
      this.sticky = sticky
      this.cards = sticky.querySelectorAll('.card')
      this.length = this.cards.length

      this.start = 0
      this.end = 0
      this.step = 0
    }

    init() {
      this.start = this.wrapper.offsetTop - 100
      this.end = this.wrapper.offsetTop + this.wrapper.offsetHeight - innerHeight * 1.2
      this.step = (this.end - this.start) / (this.length * 2)
    }

    animate() {
      this.cards.forEach((card, i) => {
        const s = this.start + this.step * i
        const e = s + this.step * (this.length + 1)

        if (scrollY <= s) {
          card.style.transform = `
      perspective(100vw)
      translateX(100vw) 
      rotateY(180deg)
    `
        } else if (scrollY > s && scrollY <= e - this.step) {
          card.style.transform = `
      perspective(100vw)
      translateX(${100 + (scrollY - s) / (e - s) * -100}vw)
      rotateY(180deg)
    `
        } else if (scrollY > e - this.step && scrollY <= e) {
          card.style.transform = `
      perspective(100vw)
      translateX(${100 + (scrollY - s) / (e - s) * -100}vw)
      rotateY(${180 + -(scrollY - (e - this.step)) / this.step * 180}deg)
    `
        } else if (scrollY > e) {
          card.style.transform = `
      perspective(100vw)
      translateX(0vw) 
      rotateY(0deg)
    `
        }
      })
    }
  }

  const mainContent1 = document.querySelector('.performance')
  const sticky = document.querySelector('.sticky')
  const cardFlipOnScroll = new CardFlipOnScroll(mainContent1, sticky)
  cardFlipOnScroll.init()

  window.addEventListener('scroll', () => {
    cardFlipOnScroll.animate()
  })

  window.addEventListener('resize', () => {
    cardFlipOnScroll.init()
  })
  //performance 모션 끝


  //closing_txt 모션 시작
  gsap.registerPlugin(ScrollTrigger);

  const textElements = gsap.utils.toArray('.scroll_text');

  textElements.forEach(text => {
    gsap.to(text, {
      backgroundSize: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: text,
        start: 'top 80%',
        end: 'center 20%',
        scrub: true,
      },
    });
  });
  //closing_txt 모션 끝


  //thanks 서브 텍스트 모션 시작
  $('.thanks .thanks_txt').simplyScroll({
    speed: 4,
    direction: 'forwards',
    pauseOnHover: true,
    pauseOnTouch: true,
  });
  //thanks 서브 텍스트 모션 시작


  //scroll_down 모션 시작
  window.addEventListener('scroll', () => {
    const scrollDown = document.querySelector('.scroll_down');
    const worksSection = document.querySelector('.works');
    const worksSectionTop = worksSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
  
    if (worksSectionTop <= windowHeight / 2) {
      // works 섹션의 상단이 화면의 중간 지점보다 위에 있을 때
      scrollDown.classList.add('visible');
    } else {
      // 필요에 따라 works 섹션 위로 올라가면 scroll_down 요소 숨김
      // scrollDown.classList.remove('visible');
    }
  });
  //scroll_down 모션 끝


  AOS.init();

});