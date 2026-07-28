/* ==========================================================================
   PORTFOLIO WEBSITE - 3D PHOTO ANIMATION & SCROLL ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lenis Smooth Scroll Engine
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smoothTouch: true,
      touchMultiplier: 1.8,
      wheelMultiplier: 1.1,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // 2. Background Canvas Particle Atmosphere
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = -Math.random() * 0.5 - 0.1;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.hue = Math.random() > 0.6 ? 345 : 355;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.y < 0 || this.x < 0 || this.x > width) {
        this.reset();
        this.y = height + 10;
      }
    }
    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 85%, 60%, ${this.opacity})`;
      ctx.shadowBlur = 12;
      ctx.shadowColor = `hsl(${this.hue}, 90%, 50%)`;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 45; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // 3. Register GSAP & ScrollTrigger Plugins
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

    // --- STAGE 1 ANIMATION: 3D Tilt & Hero Fade ---
    const stage1Frame = document.querySelector('.stage1-frame');
    const stage1Img = document.querySelector('.stage1-img');
    const heroContent = document.querySelector('.hero-content');

    gsap.timeline({
      scrollTrigger: {
        trigger: '.stage-1',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    })
    .to(stage1Frame, {
      rotateX: 25,
      rotateY: -8,
      scale: 0.85,
      borderRadius: '36px',
      boxShadow: '0 50px 100px rgba(0,0,0,0.95), 0 0 70px rgba(255, 30, 70, 0.4)',
      ease: 'power2.inOut'
    })
    .to(stage1Img, {
      scale: 1.15,
      filter: 'brightness(1.1) contrast(1.05)',
      ease: 'none'
    }, 0)
    .to(heroContent, {
      opacity: 0.2,
      y: -30,
      ease: 'none'
    }, 0);

    // --- STAGE 2 ANIMATION: Kinetic Pan & About Text Reveal ---
    const stage2Img = document.querySelector('.stage2-img');
    const redFlare = document.querySelector('.red-rim-flare');
    const aboutCard = document.querySelector('.about-card');

    gsap.timeline({
      scrollTrigger: {
        trigger: '.stage-2',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.8
      }
    })
    .fromTo(stage2Img, 
      { transform: 'translate(-20%, -20%) scale(1.4)' },
      { transform: 'translate(0%, 0%) scale(1)', ease: 'power1.inOut' }
    )
    .fromTo(redFlare,
      { opacity: 0.2, scale: 0.8 },
      { opacity: 1, scale: 1.4, ease: 'power2.out' }, 0
    )
    .fromTo(aboutCard,
      { y: 60, opacity: 0.3 },
      { y: 0, opacity: 1, ease: 'power2.out' }, 0
    );

    // --- STAGE 4 ANIMATION: 3D Holographic Orbit ---
    const orbitCard = document.querySelector('.orbit-card');
    const skillsOverlay = document.querySelector('.skills-overlay');

    gsap.timeline({
      scrollTrigger: {
        trigger: '.stage-4',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      }
    })
    .to(orbitCard, {
      rotateY: 360,
      rotateX: 20,
      scale: 1.1,
      ease: 'power2.inOut'
    })
    .fromTo(skillsOverlay,
      { y: 40, opacity: 0.3 },
      { y: 0, opacity: 1, ease: 'power2.out' }, 0
    );

    // --- STAGE 5 ANIMATION: 3D Infinity Tunnel Stream ---
    const slices = document.querySelectorAll('.tunnel-slice');
    const timelineOverlay = document.querySelector('.timeline-overlay');

    slices.forEach((slice, idx) => {
      const zOffset = (idx + 1) * -200;
      const zEnd = (idx + 1) * 350;

      gsap.fromTo(slice,
        { transform: `translateZ(${zOffset}px) translateY(${idx * 40}px)`, opacity: 0.3 },
        {
          transform: `translateZ(${zEnd}px) translateY(${idx * -30}px)`,
          opacity: idx === 0 ? 1 : 0.7 - idx * 0.1,
          ease: 'power1.inOut',
          scrollTrigger: {
            trigger: '.stage-5',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8 + idx * 0.2
          }
        }
      );
    });

    gsap.fromTo(timelineOverlay,
      { y: 50, opacity: 0.3 },
      {
        y: 0,
        opacity: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.stage-5',
          start: 'top center',
          end: 'bottom top',
          scrub: 1
        }
      }
    );

    // --- STAGE 6 ANIMATION: Outro Reveal ---
    const outroFrame = document.querySelector('.outro-frame');
    const outroImg = document.querySelector('.stage6-img');
    const contactCard = document.querySelector('.contact-card');

    gsap.timeline({
      scrollTrigger: {
        trigger: '.stage-6',
        start: 'top bottom',
        end: 'center center',
        scrub: 1
      }
    })
    .fromTo(outroFrame,
      { scale: 0.6, rotateX: 30, opacity: 0.5, borderRadius: '60px' },
      { scale: 1, rotateX: 0, opacity: 1, borderRadius: '28px', ease: 'power3.out' }
    )
    .fromTo(outroImg,
      { filter: 'blur(20px) brightness(1.5)' },
      { filter: 'blur(0px) brightness(1)', ease: 'power2.out' }, 0
    )
    .fromTo(contactCard,
      { y: 60, opacity: 0.3 },
      { y: 0, opacity: 1, ease: 'power3.out' }, 0
    );
  }

  // 4. Interactive Cursor 3D Parallax Tilt Effect
  document.addEventListener('mousemove', (e) => {
    const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

    const ambientGlow = document.querySelector('.ambient-glow');
    if (ambientGlow) {
      ambientGlow.style.transform = `translate(calc(-50% + ${mouseX * 30}px), calc(-50% + ${mouseY * 30}px))`;
    }

    const stage1Frame = document.querySelector('.stage1-frame');
    if (stage1Frame) {
      stage1Frame.style.transform = `rotateY(${mouseX * 12}deg) rotateX(${-mouseY * 12}deg)`;
    }
  });

  // 5. Scroll Progress Metric Update
  const progressFill = document.getElementById('progressFill');
  const scrollPercent = document.getElementById('scrollPercent');

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const currentScroll = window.scrollY;
    const percent = Math.min(100, Math.max(0, Math.round((currentScroll / totalHeight) * 100)));

    if (progressFill) {
      progressFill.style.height = `${percent}%`;
    }
    if (scrollPercent) {
      scrollPercent.textContent = percent.toString().padStart(3, '0');
    }
  });
});
