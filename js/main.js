/**
 * =========================================================================
 * Shivam Dubey Portfolio - Main Interactive Logic
 * - Dark / Light theme toggle with local storage persistence
 * - Client-side transparent portrait cutout processing (feathered alpha)
 * - 3D Card mouse parallax tilt on portrait stage
 * - Header scroll shadow & mobile navigation
 * - Replay 3D Intro support
 * =========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- 1. THEME SWITCHER (DARK / LIGHT MODE) ---
  const themeToggleBtn = document.getElementById('btn-theme-toggle');
  const body = document.body;

  // Check saved preference or system preference
  const savedTheme = localStorage.getItem('shivam_portfolio_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    body.classList.remove('light-theme');
    body.classList.add('dark-theme');
  } else {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        localStorage.setItem('shivam_portfolio_theme', 'light');
      } else {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        localStorage.setItem('shivam_portfolio_theme', 'dark');
      }
    });
  }

  // --- 2. CLIENT-SIDE PORTRAIT CUTOUT & BOUNDING-BOX CROP PROCESSOR ---
  // Removes white background and auto-crops empty margin so Shivam fills the blob exactly like reference
  const portraitImg = document.getElementById('portrait-img');
  if (portraitImg) {
    function processCutout() {
      try {
        const tempImg = new Image();
        tempImg.crossOrigin = 'Anonymous';
        tempImg.src = 'assets/images/shivam_enhanced.jpg';

        tempImg.onload = function () {
          const w = tempImg.naturalWidth || tempImg.width;
          const h = tempImg.naturalHeight || tempImg.height;

          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = w;
          canvas.height = h;

          ctx.drawImage(tempImg, 0, 0);
          const imgData = ctx.getImageData(0, 0, w, h);
          const d = imgData.data;

          let minX = w, minY = h, maxX = 0, maxY = 0;

          // Process pixels: pure white/near white becomes transparent
          for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
              const idx = (y * w + x) * 4;
              const r = d[idx];
              const g = d[idx + 1];
              const b = d[idx + 2];

              // High threshold for white/light gray background
              if (r > 240 && g > 240 && b > 240) {
                d[idx + 3] = 0; // 100% transparent
              } else if (r > 210 && g > 210 && b > 210) {
                const avg = (r + g + b) / 3;
                const alpha = Math.max(0, Math.min(255, (240 - avg) * 8.5));
                d[idx + 3] = Math.min(d[idx + 3], alpha);
              }

              // Track subject bounding box
              if (d[idx + 3] > 30) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
              }
            }
          }

          ctx.putImageData(imgData, 0, 0);

          // Crop tightly around the person's head & shoulders
          if (maxX > minX && maxY > minY) {
            const cropCanvas = document.createElement('canvas');
            const cropCtx = cropCanvas.getContext('2d');

            const padTop = Math.max(0, Math.floor((maxY - minY) * 0.02)); // tiny top margin above hair
            const cropW = (maxX - minX);
            const cropH = (maxY - minY) + padTop;
            const startY = Math.max(0, minY - padTop);

            cropCanvas.width = cropW;
            cropCanvas.height = cropH;

            cropCtx.drawImage(
              canvas,
              minX, startY, cropW, cropH,
              0, 0, cropW, cropH
            );

            const finalDataUrl = cropCanvas.toDataURL('image/png');
            if (portraitImg) portraitImg.src = finalDataUrl;
            const svgImg = document.getElementById('portrait-svg-image');
            if (svgImg) svgImg.setAttribute('href', finalDataUrl);
          } else {
            const finalDataUrl = canvas.toDataURL('image/png');
            if (portraitImg) portraitImg.src = finalDataUrl;
            const svgImg = document.getElementById('portrait-svg-image');
            if (svgImg) svgImg.setAttribute('href', finalDataUrl);
          }
        };
      } catch (err) {
        console.warn('Canvas image processing fallback', err);
      }
    }

    if (portraitImg && portraitImg.complete) {
      processCutout();
    } else if (portraitImg) {
      portraitImg.addEventListener('load', processCutout, { once: true });
    } else {
      processCutout();
    }
  }

  // --- 3. 3D GYROSCOPIC MOUSE TILT ON PORTRAIT CARD ---
  const stageWrapper = document.getElementById('portrait-stage');
  const floatingBadge = document.getElementById('floating-badge');
  const blobCard = document.querySelector('.portrait-blob-card');

  if (stageWrapper && window.innerWidth > 868) {
    stageWrapper.addEventListener('mousemove', (e) => {
      const rect = stageWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const tiltX = (y / (rect.height / 2)) * -6;
      const tiltY = (x / (rect.width / 2)) * 8;

      if (blobCard) {
        blobCard.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.015)`;
      }

      if (floatingBadge) {
        floatingBadge.style.transform = `translateY(-50%) translate(${x * 0.05}px, ${y * 0.05}px)`;
      }
    });

    stageWrapper.addEventListener('mouseleave', () => {
      if (blobCard) {
        blobCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      }
      if (floatingBadge) {
        floatingBadge.style.transform = 'translateY(-50%) translate(0px, 0px)';
      }
    });
  }

  // --- 4. HEADER SCROLL & ACTIVE LINK SPY ---
  const header = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links .nav-item');

  function onScrollSpy() {
    const scrollY = window.scrollY;

    if (scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // ScrollSpy active link highlight
    let currentSectionId = 'hero';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navItems.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScrollSpy, { passive: true });

  // --- 5. MOBILE MENU TOGGLE ---
  const mobileToggle = document.getElementById('btn-mobile-menu');
  const navLinks = document.getElementById('nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });

    // Close when clicking nav items
    navItems.forEach((item) => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
      });
    });
  }

  // --- 6. INTERACTIVE WEB3FORMS CONTACT SUBMISSION ---
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const sendBtn = document.getElementById('btn-send-msg');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !message) return;

      // Loading state
      if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending Message...</span>';
      }
      if (formStatus) {
        formStatus.style.display = 'none';
      }

      const formData = new FormData(contactForm);
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: json
        });

        const result = await response.json();

        if (response.status === 200 && result.success) {
          if (formStatus) {
            formStatus.style.display = 'block';
            formStatus.className = 'form-status-msg form-status-success';
            formStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you ' + name + '! Your message has been sent successfully. I will get back to you soon.';
          }
          if (sendBtn) {
            sendBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Message Sent!</span>';
          }
          contactForm.reset();
        } else {
          throw new Error(result.message || 'Submission failed');
        }
      } catch (error) {
        console.error('Web3Forms Error:', error);
        if (formStatus) {
          formStatus.style.display = 'block';
          formStatus.className = 'form-status-msg form-status-error';
          formStatus.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Could not send message. Please try again or email directly to <a href="mailto:shivamkumardubey71@gmail.com" style="text-decoration: underline; color: inherit;">shivamkumardubey71@gmail.com</a>';
        }
        if (sendBtn) {
          sendBtn.innerHTML = '<i class="fa-regular fa-paper-plane"></i> <span>Send Message</span>';
        }
      } finally {
        if (sendBtn) {
          sendBtn.disabled = false;
          setTimeout(() => {
            sendBtn.innerHTML = '<i class="fa-regular fa-paper-plane"></i> <span>Send Message</span>';
          }, 4000);
        }
      }
    });
  }

  // --- 7. IEEE GEC STYLE FLOATING TECH ELEMENTS GENERATOR ---
  const floatingContainer = document.getElementById('floating-bg-layer');
  if (floatingContainer) {
    const icons = [
      'fa-solid fa-microchip',
      'fa-solid fa-bolt',
      'fa-solid fa-code',
      'fa-solid fa-network-wired',
      'fa-solid fa-brain',
      'fa-solid fa-layer-group',
      'fa-solid fa-infinity',
      'fa-brands fa-python',
      'fa-solid fa-satellite-dish',
      'fa-solid fa-plug',
      'fa-solid fa-atom',
      'fa-solid fa-wifi'
    ];

    const cols = 4;
    const rows = 4;
    const cellW = 100 / cols;
    const cellH = 100 / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const top = (r * cellH) + (Math.random() * (cellH - 8)) + 4;
        const left = (c * cellW) + (Math.random() * (cellW - 8)) + 4;
        
        // Skip center to keep portrait & text uncluttered
        if (top > 25 && top < 75 && left > 35 && left < 65) continue;

        const iconClass = icons[(r * cols + c) % icons.length];
        const delay = (Math.random() * 3).toFixed(2);
        const duration = (4 + Math.random() * 4).toFixed(2);
        const size = (16 + Math.random() * 14).toFixed(0);

        const el = document.createElement('div');
        el.className = 'float-item';
        el.style.top = top + 'vh';
        el.style.left = left + 'vw';
        el.style.animationDelay = delay + 's';
        el.style.animationDuration = duration + 's';
        el.style.fontSize = size + 'px';
        el.innerHTML = `<i class="${iconClass}"></i>`;

        floatingContainer.appendChild(el);
      }
    }
  }

  // --- 8. INTERACTIVE RESUME PDF VIEWER MODAL ---
  const viewResumeBtn = document.getElementById('btn-view-resume');
  const resumeModal = document.getElementById('resume-modal');
  const closeResumeBtn = document.getElementById('btn-close-resume-modal');

  function openResumeModal() {
    if (!resumeModal) return;
    resumeModal.classList.add('modal-open');
    resumeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeResumeModal() {
    if (!resumeModal) return;
    resumeModal.classList.remove('modal-open');
    resumeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (viewResumeBtn) {
    viewResumeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openResumeModal();
    });
  }

  if (closeResumeBtn) {
    closeResumeBtn.addEventListener('click', closeResumeModal);
  }

  if (resumeModal) {
    // Close when clicking backdrop
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        closeResumeModal();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && resumeModal.classList.contains('modal-open')) {
        closeResumeModal();
      }
    });
  }

  // --- 9. EMBEDDED SONAR RADAR SIMULATOR (THIRD EYE PROJECT) ---
  let sonarAnimId = null;

  window.initSonarRadarSimulator = function() {
    const canvas = document.getElementById('sonarRadarCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const slider = document.getElementById('sonarDistanceSlider');
    const distReadout = document.getElementById('sonarDistReadout');
    const telemetryLatency = document.getElementById('sonarTelemetryLatency');
    const echoPinVal = document.getElementById('sonarEchoPinVal');
    const hapticPinVal = document.getElementById('sonarHapticPinVal');
    const alertBox = document.getElementById('sonarAlertBox');
    const alertIcon = document.getElementById('sonarAlertIcon');
    const alertTitle = document.getElementById('sonarAlertTitle');
    const alertDesc = document.getElementById('sonarAlertDesc');

    let sweepAngle = 0;
    let targetDist = slider ? parseInt(slider.value, 10) : 50;

    function updateSonarState(dist) {
      targetDist = dist;
      if (distReadout) distReadout.textContent = dist + ' cm';
      
      const latencyMicroSec = Math.round((dist * 2 / 0.0343));
      if (telemetryLatency) telemetryLatency.textContent = 'ECHO: ' + latencyMicroSec + ' µs';
      if (echoPinVal) echoPinVal.textContent = latencyMicroSec + ' µs';

      if (alertBox && alertIcon && alertTitle && alertDesc && hapticPinVal) {
        alertBox.className = 'hardware-alert-box';

        if (dist < 25) {
          alertBox.classList.add('alert-state-critical');
          alertIcon.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
          alertTitle.textContent = 'CRITICAL: Obstacle Very Close!';
          alertDesc.textContent = 'Proximity < 25 cm. Maximum haptic vibration + continuous buzzer alarm!';
          hapticPinVal.textContent = 'PWM 100%';
        } else if (dist <= 75) {
          alertBox.classList.add('alert-state-warning');
          alertIcon.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
          alertTitle.textContent = 'CAUTION: Obstacle Detected';
          alertDesc.textContent = 'Proximity at ' + dist + ' cm. Pulsed haptic feedback active.';
          hapticPinVal.textContent = 'PWM 60%';
        } else {
          alertBox.classList.add('alert-state-safe');
          alertIcon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
          alertTitle.textContent = 'SAFE: Clear Path Ahead';
          alertDesc.textContent = 'Proximity > 75 cm. Haptic & buzzer idle (power-saving mode).';
          hapticPinVal.textContent = 'OFF (0%)';
        }
      }
    }

    if (slider) {
      slider.oninput = (e) => {
        updateSonarState(parseInt(e.target.value, 10));
      };
    }

    if (sonarAnimId) {
      cancelAnimationFrame(sonarAnimId);
    }

    function drawSonarRadar() {
      if (!document.body.contains(canvas)) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height - 15;
      const maxR = canvas.height - 30;

      // Draw Grid Arcs
      ctx.lineWidth = 1;
      for (let r = 1; r <= 4; r++) {
        const radius = (maxR / 4) * r;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, Math.PI, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
        ctx.stroke();
      }

      // Angle lines
      for (let a = Math.PI; a <= 2 * Math.PI; a += Math.PI / 4) {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * maxR, cy + Math.sin(a) * maxR);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
        ctx.stroke();
      }

      // Draw Sweeping Beam
      sweepAngle += 0.035;
      const sweepRad = Math.PI + (Math.sin(sweepAngle) * 0.5 + 0.5) * Math.PI;

      const beamX = cx + Math.cos(sweepRad) * maxR;
      const beamY = cy + Math.sin(sweepRad) * maxR;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(beamX, beamY);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw Detected Obstacle Blip
      const normalizedDist = targetDist / 200;
      const blipR = maxR * normalizedDist;
      const blipX = cx + Math.cos(Math.PI * 1.5) * blipR;
      const blipY = cy + Math.sin(Math.PI * 1.5) * blipR;

      ctx.beginPath();
      ctx.arc(blipX, blipY, 6, 0, 2 * Math.PI);
      ctx.fillStyle = targetDist < 25 ? '#ef4444' : targetDist < 80 ? '#f59e0b' : '#10b981';
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Pulse ring
      ctx.beginPath();
      ctx.arc(blipX, blipY, 12 + (Math.sin(sweepAngle * 3) * 3), 0, 2 * Math.PI);
      ctx.strokeStyle = ctx.fillStyle;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      sonarAnimId = requestAnimationFrame(drawSonarRadar);
    }

    drawSonarRadar();
    updateSonarState(targetDist);
  };

  // Initial call
  window.initSonarRadarSimulator();
});
