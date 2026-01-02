/* ================================
   CODE GREEN SHIELD - INSTRUCTOR DASHBOARD
   Interactive JavaScript v2.0
   ================================ */

// ================================
// GLOBAL STATE
// ================================
let soundEnabled = true;
let terminalPaused = false;

// ================================
// PARTICLE BACKGROUND
// ================================
function initParticleBackground() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    const particleCount = 80;

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 255, 136, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 255, 136, ${0.1 * (1 - distance / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        connectParticles();
        requestAnimationFrame(animate);
    }

    animate();
}

// ================================
// MATRIX RAIN EFFECT
// ================================
function initMatrixRain() {
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const chars = 'CODE GRی یN SHIELD 01010101 AQUA TERRA VOLT ATMOS ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوہیے ⟨⟩◊◆▲▼';
    const charArray = chars.split('');

    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = new Array(columns).fill(1);

    function draw() {
        ctx.fillStyle = 'rgba(10, 15, 13, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00ff88';
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const char = charArray[Math.floor(Math.random() * charArray.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;

            // Vary the green shade
            const shade = Math.random() > 0.5 ? '#00ff88' : '#00cc6a';
            ctx.fillStyle = shade;
            ctx.fillText(char, x, y);

            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(draw, 50);
}

// ================================
// LIVE CLOCK
// ================================
function initLiveClock() {
    function updateClock() {
        const now = new Date();

        const timeStr = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        const dateStr = now.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        document.getElementById('live-time').textContent = timeStr;
        document.getElementById('live-date').textContent = dateStr;
    }

    updateClock();
    setInterval(updateClock, 1000);
}

// ================================
// TERMINAL EFFECTS
// ================================
function initTerminalEffects() {
    const terminal = document.getElementById('terminal-output');
    const messages = [
        { text: '> Scanning network perimeter...', type: 'normal' },
        { text: '> Agent activity: 24 ONLINE', type: 'success' },
        { text: '> New threat detected: SHADOW_PROTOCOL_7', type: 'warning' },
        { text: '> Defensive countermeasures: ACTIVE', type: 'success' },
        { text: '> Incoming transmission from Division AQUA...', type: 'normal' },
        { text: '> Data encryption: AES-256 ENABLED', type: 'success' },
        { text: '> Firewall status: OPTIMAL', type: 'success' },
        { text: '> Mission briefing uploaded to all terminals...', type: 'normal' },
        { text: '> Suspicious activity in Sector 7-G...', type: 'warning' },
        { text: '> All instructors standing by...', type: 'success' },
        { text: '> Environmental sensors: CALIBRATED', type: 'normal' },
        { text: '> Shadow Syndicate movement detected in TERRA zone', type: 'warning' },
        { text: '> CODE GRی یN Protocol: ENGAGED', type: 'success' },
    ];

    let messageIndex = 0;

    function getTimestamp() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { hour12: false });
    }

    function addTerminalMessage() {
        if (terminalPaused) return;

        const cursor = terminal.querySelector('.cursor');
        const message = document.createElement('p');
        const msgData = messages[messageIndex];

        let formattedText = msgData.text;
        if (msgData.type === 'success') {
            formattedText = formattedText.replace(/(ONLINE|ACTIVE|ENABLED|OPTIMAL|CALIBRATED|ENGAGED|VERIFIED)/gi, '<span class="success">$1</span>');
        } else if (msgData.type === 'warning') {
            formattedText = formattedText.replace(/(SHADOW|THREAT|DETECTED|Suspicious|WARNING)/gi, '<span class="warning">$1</span>');
        }

        message.innerHTML = `<span class="terminal-time">[${getTimestamp()}]</span> ${formattedText}`;
        terminal.insertBefore(message, cursor);
        terminal.scrollTop = terminal.scrollHeight;

        // Keep terminal from getting too long
        const messages_in_terminal = terminal.querySelectorAll('p:not(.cursor)');
        if (messages_in_terminal.length > 15) {
            messages_in_terminal[0].remove();
        }

        messageIndex = (messageIndex + 1) % messages.length;
    }

    setInterval(addTerminalMessage, 3500);

    // Terminal controls
    document.getElementById('clear-terminal').addEventListener('click', () => {
        const cursor = terminal.querySelector('.cursor');
        terminal.innerHTML = '';
        terminal.appendChild(cursor);
        playSound('click');
    });

    document.getElementById('pause-terminal').addEventListener('click', (e) => {
        terminalPaused = !terminalPaused;
        e.target.textContent = terminalPaused ? '▶' : '❚❚';
        e.target.style.color = terminalPaused ? '#feca57' : '';
        playSound('click');
    });
}

// ================================
// WORLD MAP ATTACKS
// ================================
function initWorldMap() {
    const attackLinesContainer = document.getElementById('attack-lines');
    const attackPointsContainer = document.getElementById('attack-points');

    const attackOrigins = [
        { x: 180, y: 150, label: 'NYC' },
        { x: 480, y: 130, label: 'London' },
        { x: 750, y: 100, label: 'Moscow' },
        { x: 830, y: 280, label: 'Sydney' },
        { x: 280, y: 310, label: 'São Paulo' },
    ];

    const hqPosition = { x: 620, y: 180 };

    function createAttack() {
        const origin = attackOrigins[Math.floor(Math.random() * attackOrigins.length)];

        // Create attack line
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', origin.x);
        line.setAttribute('y1', origin.y);
        line.setAttribute('x2', hqPosition.x);
        line.setAttribute('y2', hqPosition.y);
        line.setAttribute('class', 'attack-line');
        attackLinesContainer.appendChild(line);

        // Create attack point at origin
        const point = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        point.setAttribute('cx', origin.x);
        point.setAttribute('cy', origin.y);
        point.setAttribute('r', '5');
        point.setAttribute('class', 'attack-point');
        attackPointsContainer.appendChild(point);

        // Remove after animation
        setTimeout(() => {
            line.remove();
            point.remove();
        }, 4000);
    }

    // Random attacks
    setInterval(() => {
        if (Math.random() > 0.5) {
            createAttack();
        }
    }, 2000);

    // Initial attack
    setTimeout(createAttack, 1000);
}

// ================================
// DAILY LOG SYSTEM
// ================================
const LogManager = {
    STORAGE_KEY: 'codegreen_daily_logs',

    getLogs() {
        const logs = localStorage.getItem(this.STORAGE_KEY);
        return logs ? JSON.parse(logs) : [];
    },

    saveLogs(logs) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(logs));
    },

    addLog(log) {
        const logs = this.getLogs();
        log.id = Date.now();
        log.timestamp = new Date().toISOString();
        logs.unshift(log);
        this.saveLogs(logs);
        this.updateStats();
        this.updateGlobalStats();
        return log;
    },

    deleteLog(id) {
        let logs = this.getLogs();
        logs = logs.filter(log => log.id !== id);
        this.saveLogs(logs);
        this.updateStats();
        this.updateGlobalStats();
    },

    getLogsByInstructor(instructor) {
        if (instructor === 'all') return this.getLogs();
        return this.getLogs().filter(log => log.instructor === instructor);
    },

    updateStats() {
        const logs = this.getLogs();
        const faisalLogs = logs.filter(l => l.instructor === 'faisal').length;
        const shariqueLogs = logs.filter(l => l.instructor === 'sharique').length;
        const mairaLogs = logs.filter(l => l.instructor === 'maira').length;

        document.getElementById('faisal-logs').textContent = faisalLogs;
        document.getElementById('sharique-logs').textContent = shariqueLogs;
        document.getElementById('maira-logs').textContent = mairaLogs;
    },

    updateGlobalStats() {
        const logs = this.getLogs();
        document.getElementById('total-missions').textContent = logs.length;

        // Calculate unique days
        const uniqueDays = new Set(logs.map(l => l.date)).size;
        document.getElementById('days-active').textContent = uniqueDays || 1;
    },

    getInstructorStats(instructor) {
        const allLogs = this.getLogsByInstructor(instructor);
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const thisWeek = allLogs.filter(log => new Date(log.timestamp) > weekAgo).length;

        // Calculate streak (consecutive days)
        let streak = 0;
        const dates = [...new Set(allLogs.map(l => l.date))].sort().reverse();
        if (dates.length > 0) {
            streak = 1;
            for (let i = 1; i < dates.length; i++) {
                const curr = new Date(dates[i - 1]);
                const prev = new Date(dates[i]);
                const diff = (curr - prev) / (1000 * 60 * 60 * 24);
                if (diff === 1) {
                    streak++;
                } else {
                    break;
                }
            }
        }

        return {
            total: allLogs.length,
            thisWeek,
            streak,
            recentLogs: allLogs.slice(0, 3)
        };
    },

    // Initialize sample Day 1 logs if no logs exist
    initSampleLogs() {
        const existingLogs = this.getLogs();
        if (existingLogs.length === 0) {
            const missionLogs = [
                // ==================== DAY 1 LOGS ====================
                {
                    id: 1735689600001,
                    timestamp: '2026-01-01T09:00:00.000Z',
                    date: '2026-01-01',
                    instructor: 'faisal',
                    title: 'Day 1: Operation INITIATE - Mission Briefing & First Contact',
                    content: `MISSION DEBRIEF: Day 1 of CODE GREEN Winter School commenced at 0900 hours with 9 agents reporting for duty.

🎯 MORNING SESSION:
• Initiated agents into AI Prompt Engineering fundamentals - teaching them how to effectively communicate with AI systems for intelligence gathering
• Deployed PicoCTF Login Challenge: Agents successfully infiltrated a simulated target by inspecting HTML source code and decrypting JavaScript content
• All 9 agents demonstrated proficiency in basic reconnaissance techniques

⚠️ CRITICAL EVENT:
Shadow Syndicate launched a surprise attack on our campus perimeter - 5 encrypted codes were scattered across the facility. Our agents mobilized and successfully decoded all threat markers.

💡 OUTCOME: All agents showed exceptional situational awareness and code-breaking capabilities under pressure.`,
                    tags: 'day1, initiation, picoctf, reconnaissance, shadow-syndicate'
                },
                {
                    id: 1735689600002,
                    timestamp: '2026-01-01T11:00:00.000Z',
                    date: '2026-01-01',
                    instructor: 'sharique',
                    title: 'Day 1: Technical Warfare - Hardware & Web Exploitation',
                    content: `TECHNICAL OPERATIONS LOG:

🔧 HARDWARE DEMONSTRATION:
Conducted live demonstrations of Flipper Zero capabilities - agents observed real-world applications of signal analysis and hardware hacking techniques. Multiple wireless protocols were analyzed for security vulnerabilities.

🌐 WEB EXPLOITATION TRAINING:
• Trained agents on Inspect Element techniques - demonstrating how web content can be manipulated client-side
• Agents practiced modifying live page elements to understand the importance of server-side validation
• Each agent successfully completed hands-on exercises

🔍 OSINT OPERATIONS:
Introduced Shodan search engine for exposed infrastructure reconnaissance. Agents witnessed LIVE exposed camera feeds demonstrating the critical importance of proper device security. This demonstration drove home the real-world consequences of poor cyber hygiene.

📊 STATUS: All 9 agents now equipped with foundational technical exploitation skills.`,
                    tags: 'day1, flipper-zero, inspect-element, shodan, osint, hardware'
                },
                {
                    id: 1735689600003,
                    timestamp: '2026-01-01T14:00:00.000Z',
                    date: '2026-01-01',
                    instructor: 'maira',
                    title: 'Day 1: Enemy Intelligence - Shadow Syndicate Dossier',
                    content: `INTELLIGENCE BRIEFING:

🎭 ENEMY PROFILE REVEALED:
Agents were formally introduced to our primary adversary - THE SHADOW SYNDICATE. Comprehensive threat briefing conducted covering:
• Known Syndicate operations and tactics
• Previous attack patterns and targets
• Threat level assessment: ELEVATED

🧠 COGNITIVE OPERATIONS:
Reinforced the critical importance of effective AI prompting as a force multiplier in cyber operations. Agents learned that precision in communication with AI systems directly impacts mission success rates.

📋 AGENT STATUS REPORT:
All 9 agents have been successfully inducted into CODE GREEN. They demonstrated:
✅ Quick thinking during the campus code hunt
✅ Technical aptitude in web exploitation
✅ Situational awareness under simulated attack

🛡️ DAY 1 VERDICT: Mission INITIATE - COMPLETE. Agents are ready for advanced training.`,
                    tags: 'day1, shadow-syndicate, intelligence, prompting, assessment'
                },

                // ==================== DAY 2 LOGS ====================
                {
                    id: 1735776000001,
                    timestamp: '2026-01-02T09:00:00.000Z',
                    date: '2026-01-02',
                    instructor: 'faisal',
                    title: 'Day 2: Operation IDENTITY - Agent Induction & Digital Presence',
                    content: `MISSION DEBRIEF: Day 2 commenced with formal agent induction ceremonies.

🪪 AGENT IDENTITY CREATION:
All 9 agents have been formally inducted into CODE GREEN with official credentials:
• Each agent designed and created their personal AGENT ID CARDS with unique codenames
• Custom identification documents featuring agent photos, clearance levels, and division assignments
• Official CODE GREEN branding applied to all credentials

🌐 DIGITAL FOOTPRINT ESTABLISHMENT:
Agents constructed their personal WEBPAGES as digital command centers:
• Individual agent profiles created with mission-ready designs
• Custom HTML/CSS implementations demonstrating web development proficiency
• Each agent now has an operational digital presence

📊 STATUS: All 9 agents now carry official CODE GREEN credentials and maintain active digital profiles.`,
                    tags: 'day2, induction, id-cards, webpages, identity, credentials'
                },
                {
                    id: 1735776000002,
                    timestamp: '2026-01-02T11:00:00.000Z',
                    date: '2026-01-02',
                    instructor: 'sharique',
                    title: 'Day 2: AI Warfare - Jailbreaking & Prompt Exploitation',
                    content: `TECHNICAL OPERATIONS LOG:

🤖 AI JAILBREAKING TRAINING:
Agents engaged in advanced AI manipulation exercises using the GANDALF CHALLENGE (gandalf.lakera.ai):
• Mission Objective: Trick the AI guardian "Gandalf" into revealing secret passwords
• This tests prompt injection, social engineering, and creative thinking skills
• Challenge consists of 8 increasingly difficult levels

🏆 AGENT PERFORMANCE:
Outstanding results from our operatives:
• Multiple agents reached LEVEL 7 - demonstrating exceptional jailbreaking capabilities
• Techniques employed: indirect questioning, roleplay scenarios, encoding tricks, context manipulation
• Agents learned to bypass AI safety measures through creative prompt engineering

🔐 ENCRYPTION DEEP DIVE:
• Advanced encryption concepts introduced
• Practical encoding/decoding exercises completed
• Understanding of how AI systems can be manipulated through carefully crafted inputs

💡 KEY INSIGHT: The Gandalf challenge teaches agents that even sophisticated AI systems have vulnerabilities that can be exploited through clever prompt manipulation.`,
                    tags: 'day2, ai-jailbreaking, gandalf, prompt-injection, encryption, lakera'
                },
                {
                    id: 1735776000003,
                    timestamp: '2026-01-02T14:00:00.000Z',
                    date: '2026-01-02',
                    instructor: 'maira',
                    title: 'Day 2: Digital Forensics - Metadata & Cookie Analysis',
                    content: `INTELLIGENCE BRIEFING:

🔍 CTF OPERATIONS - METADATA ANALYSIS:
Agents completed Capture The Flag challenges focused on hidden information extraction:
• Discovered that files contain more than meets the eye - METADATA reveals critical intelligence
• Learned to extract EXIF data from images (GPS coordinates, device info, timestamps)
• Document metadata analysis (author names, edit history, software versions)
• Agents successfully recovered hidden flags embedded in file properties

🍪 COOKIE EXPLOITATION CTF:
Advanced web security challenges completed:
• Understanding HTTP cookies and session management
• Cookie manipulation techniques for authentication bypass
• Analyzing cookie structures to find vulnerabilities
• Several agents successfully exploited cookie-based authentication flaws

📋 SKILLS ACQUIRED:
✅ Metadata extraction and analysis
✅ Understanding data hidden in plain sight
✅ Cookie structure and exploitation
✅ Digital forensics fundamentals

🛡️ DAY 2 VERDICT: Mission IDENTITY - COMPLETE. Agents now possess advanced reconnaissance and AI exploitation capabilities.`,
                    tags: 'day2, ctf, metadata, cookies, forensics, exif, web-security'
                }
            ];

            this.saveLogs(missionLogs);
        }
    }
};

// ================================
// UI FUNCTIONS
// ================================

function renderLogs(filter = 'all') {
    const container = document.getElementById('log-entries');
    const logs = LogManager.getLogsByInstructor(filter);

    document.getElementById('visible-count').textContent = logs.length;

    if (logs.length === 0) {
        container.innerHTML = `
            <div class="no-logs">
                <div class="no-logs-icon">📭</div>
                <p>No mission logs recorded yet.</p>
                <p>Start by adding your first log entry above!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = logs.map(log => `
        <div class="log-entry" data-id="${log.id}">
            <div class="log-entry-header">
                <div class="log-entry-meta">
                    <span class="log-entry-date">📅 ${formatDate(log.date)}</span>
                    <span class="log-entry-instructor ${log.instructor}">${getInstructorName(log.instructor)}</span>
                </div>
            </div>
            <h4 class="log-entry-title">📡 ${escapeHtml(log.title)}</h4>
            <p class="log-entry-content">${escapeHtml(log.content)}</p>
            ${log.tags ? `<div class="log-entry-tags">${log.tags.split(',').map(tag => `<span class="log-tag">${escapeHtml(tag.trim())}</span>`).join('')}</div>` : ''}
        </div>
    `).join('');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function getInstructorName(instructor) {
    const names = {
        faisal: '🎖️ Commander Faisal',
        sharique: '💻 Tech Lead Sharique',
        maira: '🎯 Operations Maira'
    };
    return names[instructor] || instructor;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Global variable to store pending delete ID
let pendingDeleteId = null;

function deleteLog(id) {
    pendingDeleteId = id;
    const modal = document.getElementById('delete-confirm-modal');
    modal.classList.add('active');
    playSound('click');
}

function confirmDelete() {
    if (pendingDeleteId !== null) {
        LogManager.deleteLog(pendingDeleteId);
        renderLogs(getCurrentFilter());
        showNotification('Mission log deleted!', 'warning');
        playSound('click');
        pendingDeleteId = null;
    }
    closeDeleteModal();
}

function closeDeleteModal() {
    const modal = document.getElementById('delete-confirm-modal');
    modal.classList.remove('active');
    pendingDeleteId = null;
}

function getCurrentFilter() {
    const activeBtn = document.querySelector('.filter-btn.active');
    return activeBtn ? activeBtn.dataset.filter : 'all';
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const icons = { success: '✅', warning: '⚠️', error: '❌' };
    const colors = {
        success: 'rgba(0, 255, 136, 0.95)',
        warning: 'rgba(254, 202, 87, 0.95)',
        error: 'rgba(255, 107, 107, 0.95)'
    };

    notification.innerHTML = `
        <span style="font-size: 1.2rem;">${icons[type]}</span>
        <span>${message}</span>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 28px;
        background: ${colors[type]};
        color: #0a0f0d;
        border-radius: 10px;
        font-family: 'JetBrains Mono', monospace;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 1001;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        animation: notifyIn 0.4s ease, notifyOut 0.4s ease 2.6s;
    `;

    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
}

// ================================
// ENHANCED SOUND EFFECTS SYSTEM
// ================================
const SoundManager = {
    audioContext: null,

    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    },

    // Play different sound types
    play(type) {
        if (!soundEnabled || !this.audioContext) return;

        // Resume context if suspended (browser autoplay policy)
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        switch (type) {
            case 'click':
                this.playTone(800, 0.05, 0.1, 'sine');
                break;
            case 'hover':
                this.playTone(600, 0.03, 0.05, 'sine');
                break;
            case 'success':
                this.playChord([523, 659, 784], 0.15, 0.1); // C-E-G chord
                break;
            case 'error':
                this.playTone(200, 0.2, 0.15, 'sawtooth');
                break;
            case 'alert':
                this.playAlertSound();
                break;
            case 'typing':
                this.playTone(300 + Math.random() * 200, 0.02, 0.03, 'square');
                break;
            case 'whoosh':
                this.playWhoosh();
                break;
            case 'notification':
                this.playNotificationSound();
                break;
            case 'submit':
                this.playSubmitSound();
                break;
            case 'delete':
                this.playDeleteSound();
                break;
            case 'modal':
                this.playModalSound();
                break;
        }
    },

    // Basic tone
    playTone(frequency, duration, volume = 0.1, waveType = 'sine') {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = waveType;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    },

    // Chord (multiple tones)
    playChord(frequencies, duration, volume) {
        frequencies.forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq, duration, volume, 'sine');
            }, i * 50);
        });
    },

    // Alert sound (ascending tones)
    playAlertSound() {
        [400, 500, 600].forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq, 0.1, 0.08, 'square');
            }, i * 100);
        });
    },

    // Whoosh effect
    playWhoosh() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = 'sawtooth';
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(100, this.audioContext.currentTime);
        filter.frequency.exponentialRampToValueAtTime(2000, this.audioContext.currentTime + 0.1);
        filter.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.2);

        oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.2);
    },

    // Notification sound (pleasant ding)
    playNotificationSound() {
        [880, 1100].forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq, 0.15, 0.08, 'sine');
            }, i * 80);
        });
    },

    // Submit sound (success sweep)
    playSubmitSound() {
        [400, 500, 600, 800].forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq, 0.1, 0.06, 'sine');
            }, i * 50);
        });
    },

    // Delete sound (descending)
    playDeleteSound() {
        [600, 400, 300].forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq, 0.08, 0.08, 'triangle');
            }, i * 60);
        });
    },

    // Modal open sound
    playModalSound() {
        this.playTone(400, 0.05, 0.05, 'sine');
        setTimeout(() => {
            this.playTone(600, 0.1, 0.08, 'sine');
        }, 50);
    }
};

// Legacy wrapper function
function playSound(type) {
    SoundManager.play(type);
}

// ================================
// INSTRUCTOR MODAL
// ================================
function openInstructorModal(instructor) {
    const modal = document.getElementById('instructor-modal');
    const stats = LogManager.getInstructorStats(instructor);

    const instructorData = {
        faisal: {
            name: 'FAISAL',
            role: 'Commander',
            division: 'ALPHA DIVISION',
            emoji: '🎖️',
            color: '#00ff88'
        },
        sharique: {
            name: 'SHARIQUE',
            role: 'Tech Lead',
            division: 'BETA DIVISION',
            emoji: '💻',
            color: '#6c5ce7'
        },
        maira: {
            name: 'MAIRA',
            role: 'Operations',
            division: 'GAMMA DIVISION',
            emoji: '🎯',
            color: '#fd79a8'
        }
    };

    const data = instructorData[instructor];

    document.getElementById('modal-avatar').textContent = data.emoji;
    document.getElementById('modal-avatar').style.borderColor = data.color;
    document.getElementById('modal-name').textContent = data.name;
    document.getElementById('modal-name').style.color = data.color;
    document.getElementById('modal-role').textContent = data.role;
    document.getElementById('modal-role').style.color = data.color;
    document.getElementById('modal-division').textContent = data.division;

    document.getElementById('modal-total-logs').textContent = stats.total;
    document.getElementById('modal-total-logs').style.color = data.color;
    document.getElementById('modal-this-week').textContent = stats.thisWeek;
    document.getElementById('modal-this-week').style.color = data.color;
    document.getElementById('modal-streak').textContent = stats.streak;
    document.getElementById('modal-streak').style.color = data.color;

    const recentContainer = document.getElementById('modal-recent-logs');
    if (stats.recentLogs.length === 0) {
        recentContainer.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.85rem;">No logs yet</p>';
    } else {
        recentContainer.innerHTML = stats.recentLogs.map(log => `
            <div class="modal-log-item">
                <p class="modal-log-date">📅 ${formatDate(log.date)}</p>
                <p class="modal-log-title">${escapeHtml(log.title)}</p>
            </div>
        `).join('');
    }

    modal.classList.add('active');
    playSound('click');
}

function closeInstructorModal() {
    document.getElementById('instructor-modal').classList.remove('active');
    playSound('click');
}

// ================================
// EVENT LISTENERS
// ================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all effects
    initParticleBackground();
    initMatrixRain();
    initLiveClock();
    initTerminalEffects();
    initWorldMap();
    SoundManager.init();

    // Load mission logs (hardcoded - managed by Command Center)
    LogManager.initSampleLogs();
    LogManager.updateStats();
    LogManager.updateGlobalStats();
    renderLogs();

    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderLogs(btn.dataset.filter);
            playSound('click');
        });
    });

    // Sound toggle
    document.getElementById('sound-toggle').addEventListener('click', (e) => {
        soundEnabled = !soundEnabled;
        e.currentTarget.classList.toggle('muted', !soundEnabled);
        e.currentTarget.querySelector('.btn-icon').textContent = soundEnabled ? '🔊' : '🔇';
        if (soundEnabled) playSound('click');
    });

    // Fullscreen toggle
    document.getElementById('fullscreen-toggle').addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
        playSound('click');
    });

    // Modal close on outside click
    document.getElementById('instructor-modal').addEventListener('click', (e) => {
        if (e.target.id === 'instructor-modal') {
            closeInstructorModal();
        }
    });

    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeInstructorModal();
            closeDeleteModal();
        }
        // Ctrl + Enter to submit form
        if (e.ctrlKey && e.key === 'Enter') {
            const form = document.getElementById('log-form');
            if (form.checkValidity()) {
                form.dispatchEvent(new Event('submit'));
            }
        }
        // Keyboard shortcut: F to toggle fullscreen
        if (e.key === 'f' && !e.ctrlKey && !e.altKey && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            document.getElementById('fullscreen-toggle').click();
        }
        // Keyboard shortcut: M to toggle sound
        if (e.key === 'm' && !e.ctrlKey && !e.altKey && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            document.getElementById('sound-toggle').click();
        }
        // Keyboard shortcut: ? to show shortcuts
        if (e.key === '?' || (e.shiftKey && e.key === '/')) {
            toggleKeyboardShortcuts();
        }
    });

    // Add hover sounds to instructor cards
    document.querySelectorAll('.instructor-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            playSound('hover');
        });
    });

    // Add hover sounds to filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            playSound('hover');
        });
    });

    // Add hover sounds to stat cards
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            playSound('hover');
        });
    });

    // Random threat counter updates
    setInterval(() => {
        const threatCount = document.getElementById('threat-count');
        if (threatCount) {
            const newCount = 5 + Math.floor(Math.random() * 8);
            if (parseInt(threatCount.textContent) !== newCount) {
                threatCount.textContent = newCount;
                if (newCount > 10) {
                    playSound('alert');
                }
            }
        }
    }, 10000);

    // Create keyboard shortcuts panel
    createKeyboardShortcutsPanel();
});

// ================================
// KEYBOARD SHORTCUTS PANEL
// ================================
function createKeyboardShortcutsPanel() {
    const panel = document.createElement('div');
    panel.id = 'keyboard-shortcuts-panel';
    panel.className = 'shortcuts-panel';
    panel.innerHTML = `
        <div class="shortcuts-content">
            <div class="shortcuts-header">
                <h3>⌨️ KEYBOARD SHORTCUTS</h3>
                <button class="shortcuts-close" onclick="toggleKeyboardShortcuts()">×</button>
            </div>
            <div class="shortcuts-list">
                <div class="shortcut-item">
                    <kbd>F</kbd>
                    <span>Toggle Fullscreen</span>
                </div>
                <div class="shortcut-item">
                    <kbd>M</kbd>
                    <span>Toggle Sound</span>
                </div>
                <div class="shortcut-item">
                    <kbd>Esc</kbd>
                    <span>Close Modals</span>
                </div>
                <div class="shortcut-item">
                    <kbd>Ctrl</kbd> + <kbd>Enter</kbd>
                    <span>Submit Log</span>
                </div>
                <div class="shortcut-item">
                    <kbd>?</kbd>
                    <span>Show/Hide This Panel</span>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(panel);
}

function toggleKeyboardShortcuts() {
    const panel = document.getElementById('keyboard-shortcuts-panel');
    if (panel) {
        panel.classList.toggle('active');
        playSound('whoosh');
    }
}

// Add notification and shortcuts panel animations to document
const notifyStyles = document.createElement('style');
notifyStyles.textContent = `
    @keyframes notifyIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes notifyOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    /* Keyboard Shortcuts Panel */
    .shortcuts-panel {
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(17, 25, 22, 0.95);
        border: 1px solid #00ff88;
        border-radius: 12px;
        padding: 0;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px);
        transition: all 0.3s ease;
        box-shadow: 0 10px 40px rgba(0, 255, 136, 0.2);
        backdrop-filter: blur(10px);
    }
    
    .shortcuts-panel.active {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }
    
    .shortcuts-content {
        min-width: 280px;
    }
    
    .shortcuts-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        border-bottom: 1px solid rgba(0, 255, 136, 0.2);
    }
    
    .shortcuts-header h3 {
        font-family: 'Orbitron', sans-serif;
        font-size: 0.85rem;
        color: #00ff88;
        margin: 0;
        letter-spacing: 1px;
    }
    
    .shortcuts-close {
        background: transparent;
        border: none;
        color: #a0a0a0;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
        transition: color 0.2s ease;
    }
    
    .shortcuts-close:hover {
        color: #ff6b6b;
    }
    
    .shortcuts-list {
        padding: 15px 20px;
    }
    
    .shortcut-item {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 12px;
        font-size: 0.85rem;
        color: #e0e0e0;
    }
    
    .shortcut-item:last-child {
        margin-bottom: 0;
    }
    
    kbd {
        background: linear-gradient(135deg, #2d3436 0%, #1a1f1c 100%);
        border: 1px solid #00ff88;
        border-radius: 4px;
        padding: 4px 8px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.75rem;
        color: #00ff88;
        box-shadow: 0 2px 0 #00cc6a;
    }
    
    .shortcut-item span {
        color: #a0a0a0;
    }
`;
document.head.appendChild(notifyStyles);

