/**
 * Dynamic Resume Renderer for Shivam Dubey's Portfolio
 * Automatically hydrates resume sections from data/resume-data.json
 */
(function () {
  'use strict';

  async function loadResumeData() {
    try {
      const res = await fetch('data/resume-data.json?t=' + Date.now());
      if (!res.ok) return;
      const data = await res.json();
      renderAllSections(data);
    } catch (err) {
      console.log('Using static resume markup fallback:', err);
    }
  }

  function renderAllSections(data) {
    if (data.education) renderEducation(data.education);
    if (data.skills) renderSkills(data.skills);
    if (data.projects) renderProjects(data.projects);
    if (data.experience || data.responsibility) renderExperience(data.experience, data.responsibility);
    if (data.achievements) renderAchievements(data.achievements);
  }

  // 1. Education
  function renderEducation(eduList) {
    const container = document.getElementById('education-grid');
    if (!container || !eduList.length) return;

    container.innerHTML = eduList.map(item => `
      <div class="education-entry-card">
        <div class="edu-date-stamp">${escapeHtml(item.period)}</div>
        <h3 class="edu-institution-title">${escapeHtml(item.institution)}</h3>
        <div class="edu-degree-subtitle">${escapeHtml(item.degree)}</div>
        <div class="edu-score-pill">${escapeHtml(item.score)}</div>
      </div>
    `).join('');
  }

  // 2. Skills & Software Tiles
  function renderSkills(skills) {
    const tilesContainer = document.getElementById('software-tiles-container');
    if (tilesContainer && skills.softwareTiles) {
      tilesContainer.innerHTML = skills.softwareTiles.map(tile => `
        <div class="software-tile-item">
          <div class="app-tile-box ${escapeHtml(tile.class)}">
            ${tile.icon ? `<i class="${escapeHtml(tile.icon)}"></i>` : `<span>${escapeHtml(tile.code)}</span>`}
          </div>
          <span class="app-tile-name">${escapeHtml(tile.name)}</span>
        </div>
      `).join('');
    }

    const catsContainer = document.getElementById('skills-categories-container');
    if (catsContainer && skills.categories) {
      catsContainer.innerHTML = skills.categories.map(cat => `
        <div class="skill-category-card">
          <div class="skill-cat-header">
            <span class="skill-cat-icon" style="color: ${escapeHtml(cat.iconColor || '#f97316')}">
              <i class="${escapeHtml(cat.icon || 'fa-solid fa-layer-group')}"></i>
            </span>
            <h4 class="skill-cat-title">${escapeHtml(cat.title)}</h4>
          </div>
          <div class="skill-tags-wrap">
            ${cat.tags.map(t => `<span class="inline-skill-tag">${escapeHtml(t)}</span>`).join('')}
          </div>
        </div>
      `).join('');
    }
  }

  // 3. Projects
  function renderProjects(projects) {
    const container = document.getElementById('projects-list');
    if (!container || !projects.length) return;

    container.innerHTML = projects.map((proj, idx) => {
      const isOrange = idx % 2 !== 0;
      const badgeClass = isOrange ? 'badge-circle-orange' : 'badge-circle-blue';
      const icon = isOrange ? 'fa-solid fa-eye' : 'fa-solid fa-bolt';

      return `
        <div class="project-entry-card">
          <div class="project-header-row">
            <div class="project-badge-circle ${badgeClass}">
              <i class="${icon}"></i>
            </div>
            <div>
              <span class="project-tech-tags">${escapeHtml(proj.tags)}</span>
              <h3 class="project-name-title">${escapeHtml(proj.title)}</h3>
            </div>
          </div>
          ${proj.bullets.map(b => `<p class="project-desc-body">${escapeHtml(b)}</p>`).join('')}
          
          ${proj.flowchart ? `
            <div class="flowchart-box-card">
              <div class="flowchart-label">
                <i class="fa-solid fa-diagram-project"></i> ${escapeHtml(proj.flowchart.label)}
              </div>
              <div class="flowchart-nodes-row">
                ${proj.flowchart.nodes.map((node, nIdx) => `
                  <span class="flow-pill">${escapeHtml(node)}</span>
                  ${nIdx < proj.flowchart.nodes.length - 1 ? '<span class="flow-arrow">&rarr;</span>' : ''}
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${proj.hasSonarSimulator ? `
            <!-- Embedded Sonar Mini-Widget Simulator -->
            <div class="sonar-mini-widget-box">
              <div class="sonar-widget-header">
                <span class="sonar-live-pill"><i class="fa-solid fa-satellite-dish"></i> LIVE HARDWARE SIMULATOR</span>
                <span class="sonar-widget-subtitle">Interactive Ultrasonic Proximity &amp; PWM Haptic Feedback Sweep</span>
              </div>

              <div class="sonar-widget-inner-grid">
                <!-- Radar Display Screen -->
                <div class="sonar-radar-screen-wrap">
                  <canvas id="sonarRadarCanvas" width="340" height="210"></canvas>
                  <div class="radar-telemetry-strip">
                    <span>TX: 40 kHz</span>
                    <span>SPEED: 343 m/s</span>
                    <span id="sonarTelemetryLatency">ECHO: 2915 µs</span>
                  </div>
                </div>

                <!-- Controls & Dynamic Alert -->
                <div class="sonar-widget-controls">
                  <div>
                    <div class="control-label-row">
                      <span class="control-title">Obstacle Distance</span>
                      <span class="distance-readout-badge" id="sonarDistReadout">50 cm</span>
                    </div>
                    <input type="range" min="5" max="200" value="50" class="slider-range-input" id="sonarDistanceSlider" style="margin-top: 10px;">
                  </div>

                  <!-- Dynamic Proximity Alert -->
                  <div class="hardware-alert-box alert-state-warning" id="sonarAlertBox">
                    <div class="alert-icon-circle" id="sonarAlertIcon">
                      <i class="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <div>
                      <div class="alert-text-title" id="sonarAlertTitle">CAUTION: Proximity Alert</div>
                      <div class="alert-text-sub" id="sonarAlertDesc">Obstacle within 50 cm. Medium-frequency haptic pulse active.</div>
                    </div>
                  </div>

                  <!-- Pinout Status -->
                  <div class="pinout-live-strip">
                    <div class="pin-status-pill">
                      <div class="pin-name">PIN D9 (TRIG)</div>
                      <div class="pin-val">HIGH (10µs)</div>
                    </div>
                    <div class="pin-status-pill">
                      <div class="pin-name">PIN D10 (ECHO)</div>
                      <div class="pin-val" id="sonarEchoPinVal">2915 µs</div>
                    </div>
                    <div class="pin-status-pill">
                      <div class="pin-name">PIN D3 (HAPTIC)</div>
                      <div class="pin-val" id="sonarHapticPinVal">PWM 60%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    if (window.initSonarRadarSimulator) {
      window.initSonarRadarSimulator();
    }
  }

  // 4. Experience & Responsibility
  function renderExperience(expList, respList) {
    const gridContainer = document.getElementById('experience-split-grid');
    if (!gridContainer) return;

    let expHtml = '';
    if (expList && expList.length) {
      expHtml = expList.map(exp => `
        <div class="exp-col-item">
          <div class="exp-header-row">
            <div class="exp-circle-badge ${escapeHtml(exp.badgeClass || 'exp-badge-navy')}">
              <i class="${escapeHtml(exp.icon || 'fa-solid fa-code')}"></i>
            </div>
            <div class="exp-header-text">
              <div class="exp-date-label">${escapeHtml(exp.period)}</div>
              <h3 class="exp-company-name">${escapeHtml(exp.company)}</h3>
              <div class="exp-role-title">${escapeHtml(exp.role)} ${exp.type ? `(${escapeHtml(exp.type)})` : ''}</div>
            </div>
          </div>
          <div class="exp-body-content">
            <ul class="exp-bullets-list">
              ${exp.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('')}
            </ul>
          </div>
        </div>
      `).join('');
    }

    let respHtml = '';
    if (respList && respList.length) {
      respHtml = respList.map(resp => `
        <div class="exp-col-item">
          <div class="exp-header-row">
            <div class="exp-circle-badge ${escapeHtml(resp.badgeClass || 'exp-badge-gold')}">
              <i class="${escapeHtml(resp.icon || 'fa-solid fa-network-wired')}"></i>
            </div>
            <div class="exp-header-text">
              <div class="exp-date-label">${escapeHtml(resp.period)}</div>
              <h3 class="exp-company-name">${escapeHtml(resp.organization)}</h3>
              <div class="exp-role-title">${escapeHtml(resp.role)}</div>
            </div>
          </div>
          <div class="exp-body-content">
            <ul class="exp-bullets-list">
              ${resp.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('')}
            </ul>
          </div>
        </div>
      `).join('');
    }

    gridContainer.innerHTML = expHtml + respHtml;
  }

  // 5. Achievements
  function renderAchievements(achievements) {
    const container = document.getElementById('achievements-grid');
    if (!container || !achievements.items) return;

    container.innerHTML = achievements.items.map(item => `
      <div class="achievement-card-box">
        <div class="trophy-badge-icon">🏆</div>
        <div>
          <span class="achievement-rank-pill">${escapeHtml(item.rank)}</span>
          <h4 class="achievement-title">${escapeHtml(item.event)}</h4>
          <p class="achievement-desc">${escapeHtml(item.description)}</p>
        </div>
      </div>
    `).join('');
  }

  function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadResumeData);
  } else {
    loadResumeData();
  }
})();
