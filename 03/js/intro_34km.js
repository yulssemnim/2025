$(function () {
  // Intro 애니메이션 생성
  document.querySelectorAll('.number_animate').forEach((el) => {
    const endValue = el.getAttribute('data_end_value');
    const incrementValue = el.getAttribute('data_increment');
    const durationValue = el.getAttribute('data_duration');

    if (endValue) numberAnimation(el, endValue, incrementValue, durationValue);
  });

  // Number 애니메이션 함수
  function numberAnimation(el, endValue, incrementor, duration) {
    anime({
      targets: el,
      textContent: endValue,
      round: incrementor ? 1 / incrementor : 1 / 5,
      easing: 'easeInOutQuad',
      duration: duration ? duration : 3000,
    });

    // 애니메이션이 끝난 후 Main 페이지 전환
    setTimeout(() => {
      transitionToMain();
    }, duration || 3000); // 설정된 duration 이후 실행
  }

  // 페이지 전환 함수
  function transitionToMain() {
    $('body').addClass('fade-out'); // 페이드아웃 클래스 추가
    setTimeout(() => {
      // 원하는 페이지로 이동
      window.location.href = 'main.html'; // 이동할 메인 페이지 경로
    }, 500); // 페이드아웃 효과 후 페이지 이동
  }
});