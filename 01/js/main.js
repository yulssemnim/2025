$(function () {
  AOS.init({
  })



  $('.p_gallery li').hover(function () {
    $('.all_works').addClass('on');
    $('.p_gallery li img').hide();
    $(this).find('img').show();
  }, function () {
    $('.all_works').removeClass('on');
    $('.p_gallery li img').show();
  })



$('header').hover(function(){
  $('.custom-cursor').addClass('active');
},function(){
  $('.custom-cursor').removeClass('active');
});



  let Article = gsap.utils.toArray('.intro .q_text');
  Article.forEach((qText, index) => {
    if (qText) {
      ScrollTrigger.create({
        trigger: qText, // 각 qText 요소가 스크롤 트리거의 기준이 됩니다.
        start: index === 0 ? 'center center' : `top+=${30 * index}px center`, // 첫 번째는 중앙, 그다음부터는 200px씩 추가
        toggleClass: {
          targets: qText, // qText 자체에 on 클래스 추가
          className: "on" // 추가할 클래스 이름
        },
        /*     markers: true */
      });
    }
  });


  // main_visual imjia text effect //
  // 모든 path 요소에 대해 이벤트 리스너 추가
  document.querySelectorAll('.hover-path').forEach(path => {
    path.addEventListener('mouseenter', (e) => {
      path.setAttribute('stroke', 'transparent'); // 마우스가 진입하면 색상 변경
      let filldata = path.getAttribute('filldata')
      console.log(filldata);
      path.setAttribute('fill', filldata);
    });

    /*   path.addEventListener('mouseleave', () => {
        if (path.classList.contains("path-stroke")) {
          console.log('aa')
          path.setAttribute('stroke', 'black'); 
         path.setAttribute('fill', '#ffffff');
        } else {
          path.setAttribute('fill', '#000000');
        }
      }); */
  });

  // 모든 path 요소에 대해 GSAP 애니메이션 추가
  const paths = document.querySelectorAll('.hover-path');

  // 각 path가 순차적으로 떨어지도록 설정
  paths.forEach((path, index) => {
    gsap.from(path, {
      y: -100, // 요소가 시작 시 위에 있는 상태
      opacity: 0, // 시작할 때 투명
      duration: 1, // 각 애니메이션의 지속 시간
      delay: index * 0.1, // 각 요소가 순차적으로 나타나도록 지연 시간 추가
      ease: "bounce.out" // 부드러운 내려오는 애니메이션
    });
  });





  // work hover
  $('.works .works_bottom .wlist ul li').hover(function () {
    let i = $(this).index();
    $('.works .works_bottom .work_img>ul>li').eq(i).addClass('on').siblings().removeClass('on')
    $(this).addClass('on').siblings().removeClass('on')
  }, function () {
    $('.works .works_bottom .wlist ul li,.works .works_bottom .work_img>ul>li').removeClass('on');
  })
















})