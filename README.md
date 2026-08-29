# 🚀 Shivam Dubey — Developer & VLSI Engineer Portfolio

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white)

A high-performance, modern, and responsive developer portfolio engineered with interactive WebGL experiences, live hardware circuit simulators, automated real-time resume synchronization, and seamless Dark/Light theming.

[🌐 View Live Website](http://localhost:3000) • [📄 View Resume (PDF)](assets/resume/Shivam_Dubey_Resume.pdf) • [✉️ Get in Touch](mailto:shivamkumardubey71@gmail.com)

</div>

---

## 🌟 Key Features

### 1. 💫 3D Typewriter Intro & Autonomous Floating Particles
- **WebGL Particle Canvas**: Particle constellation backdrop powered by Three.js & GSAP.
- **Autonomous Ambient Floating Elements**: Tech icons and soft shifting radial glow gradients that breathe continuously across the viewport.

### 2. 📑 7 Comprehensive Resume Sections
- **About Me**: Narrative personal bio with direct contact badge pills.
- **Education**: 3 academic milestones (B.E. VLSI 8.9 CGPA, Class XII 74%, Class X 94%) with bottom-aligned score tags.
- **Software & Skills**: 
  - 9 Adobe-style gradient software application tiles (`Cadence Virtuoso`, `Verilog`, `Python`, `C++`, `Arduino`, `8051`, `KiCad`, `VS Code`, `Git`).
  - Organized **3-Card Competency Grid** (*VLSI & IC Design*, *Electronics & Embedded*, *Languages & Core Tools*).
- **Projects**:
  - *Footstep Energy Generation Using Piezoelectric Sensors* (with hardware system flow diagram).
  - *Third Eye Smart Navigation System* (with real-time interactive Sonar Radar hardware simulator).
- **Experience & Responsibility**: 2-Column split layout featuring *Lenovo AI Internship* and *IEEE Student Branch GCE Executive Webmaster*.
- **Achievements**: 4 Trophy showcase cards highlighting 1st Place & Hackathon victories.
- **Contact & Direct Messaging**: Functional direct contact form connected to Gmail via Web3Forms AJAX.

### 3. 📡 Interactive Ultrasonic Sonar Radar Simulator
- **Live Canvas Radar Screen**: Real-time sweeping beam and obstacle tracking.
- **Dynamic Distance Slider (`5cm - 200cm`)**: Real-time ultrasonic echo pulse latency computation ($\mu\text{s}$).
- **Proximity Alert Logic**: Multi-threshold haptic PWM vibration & buzzer warning states.
- **Microcontroller Pinout Readout**: Live simulated telemetry for `PIN D9 (TRIG)`, `PIN D10 (ECHO)`, and `PIN D3 (HAPTIC)`.

### 4. 📄 In-Browser Resume PDF Viewer Modal
- Instant full-screen PDF preview with embedded toolbar, download option, and external tab link without forcing an immediate download.

### 5. ⚡ Automated Real-Time Resume Sync Pipeline
- Watches source `resume.pdf` in real time.
- Automated 1-command sync: `npm run sync-resume` to update assets and dynamic client-side hydration via `data/resume-data.json`.

### 6. 🌓 High-Contrast Dark & Light Modes
- Instant theme switcher with smooth color transitions, custom CSS variables, and high-contrast typography in dark mode.

---

## 💻 Tech Stack & Languages Used

| Category | Technologies & Tools |
| :--- | :--- |
| **Core Languages** | **HTML5**, **CSS3 (Custom Properties, Grid, Flexbox)**, **JavaScript (ES6+)** |
| **Graphics & Animations** | **Three.js**, **GSAP (GreenSock)**, **HTML5 Canvas 2D API** |
| **Backend & Tooling** | **Node.js (HTTP / File Streaming / Watcher)**, **npm** |
| **Email Delivery** | **Web3Forms AJAX API** |
| **Design System** | **Outfit & Plus Jakarta Sans Google Fonts**, **Font Awesome 6 Pro Icons** |

---

## 📁 Project Structure

```bash
shivam-portfolio/
├── assets/
│   ├── images/              # Profile portraits & media assets
│   └── resume/              # Compiled resume PDF (Shivam_Dubey_Resume.pdf)
├── css/
│   └── style.css            # Modular stylesheet with Dark/Light theme tokens
├── data/
│   └── resume-data.json     # Centralized resume data store (Single Source of Truth)
├── js/
│   ├── intro-typewriter.js  # WebGL particle intro animation
│   ├── main.js              # Theme switcher, Sonar radar simulator, Web3Forms handler
│   └── resume-renderer.js   # Dynamic client-side resume hydration engine
├── index.html               # Main portfolio landing page
├── mobile-preview.html      # Multi-device mobile preview simulator
├── package.json             # NPM package scripts & metadata
├── server.js                # Node.js local development server with auto-sync watcher
├── sync-resume.js           # Automated resume synchronization script
└── README.md                # Project documentation
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)

### Installation & Run
1. Clone the repository:
   ```bash
   git clone https://github.com/shivamdubey733/My-Portfolio-.git
   cd My-Portfolio-
   ```

2. Start the local development server:
   ```bash
   npm run dev
   ```

3. Open your browser:
   ```
   http://localhost:3000
   ```

### Automated Resume Sync
Whenever you update your resume in LaTeX or export a new PDF:
```bash
npm run sync-resume
```

---

## 👤 Author

**Shivam Dubey**
- **Domain**: VLSI & IC Design, Embedded Systems, Artificial Intelligence
- **Institution**: Goa College of Engineering (B.E. Electronics & Communication - VLSI Design)
- **Email**: [shivamkumardubey71@gmail.com](mailto:shivamkumardubey71@gmail.com)
- **LinkedIn**: [linkedin.com/in/shivam-dubey-733sd](https://www.linkedin.com/in/shivam-dubey-733sd/)
- **GitHub**: [github.com/shivamdubey733](https://github.com/shivamdubey733)
- **Location**: Goa, India

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
