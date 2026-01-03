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
// INTERACTIVE CIRCUIT BOARD
// ================================
function initCircuitBoard() {
    const canvas = document.getElementById('circuit-canvas');
    if (!canvas) return;

    const header = canvas.parentElement;
    const ctx = canvas.getContext('2d');

    let nodes = [];
    let mouseX = -100, mouseY = -100;
    const nodeCount = 40;
    const connectionDistance = 80;
    const mouseRadius = 150;

    function resizeCanvas() {
        canvas.width = header.offsetWidth;
        canvas.height = header.offsetHeight;
        initNodes();
    }

    function initNodes() {
        nodes = [];
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                baseX: 0,
                baseY: 0,
                size: Math.random() * 3 + 1,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3
            });
            nodes[i].baseX = nodes[i].x;
            nodes[i].baseY = nodes[i].y;
        }
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse on header
    header.addEventListener('mousemove', (e) => {
        const rect = header.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    header.addEventListener('mouseleave', () => {
        mouseX = -100;
        mouseY = -100;
    });

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw nodes
        nodes.forEach((node, i) => {
            // Calculate distance to mouse
            const dx = mouseX - node.x;
            const dy = mouseY - node.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Move away from mouse when close
            if (dist < mouseRadius) {
                const force = (mouseRadius - dist) / mouseRadius;
                node.x -= dx * force * 0.05;
                node.y -= dy * force * 0.05;
            } else {
                // Slowly return to base position
                node.x += (node.baseX - node.x) * 0.02;
                node.y += (node.baseY - node.y) * 0.02;
            }

            // Add slight drift
            node.baseX += node.vx;
            node.baseY += node.vy;

            // Bounce off edges
            if (node.baseX < 0 || node.baseX > canvas.width) node.vx *= -1;
            if (node.baseY < 0 || node.baseY > canvas.height) node.vy *= -1;

            node.baseX = Math.max(0, Math.min(canvas.width, node.baseX));
            node.baseY = Math.max(0, Math.min(canvas.height, node.baseY));

            // Draw connections
            nodes.slice(i + 1).forEach(other => {
                const cdx = other.x - node.x;
                const cdy = other.y - node.y;
                const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

                if (cdist < connectionDistance) {
                    const opacity = (1 - cdist / connectionDistance) * 0.5;
                    const nodeMouseDist = Math.min(dist, Math.sqrt((mouseX - other.x) ** 2 + (mouseY - other.y) ** 2));
                    const glow = nodeMouseDist < mouseRadius ? 0.8 : 0.3;

                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.strokeStyle = `rgba(0, 255, 136, ${opacity * glow})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });

            // Draw node
            const nodeGlow = dist < mouseRadius ? 1 : 0.4;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 255, 136, ${nodeGlow})`;
            ctx.fill();

            // Add glow effect when near mouse
            if (dist < mouseRadius) {
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.size + 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 255, 136, ${(1 - dist / mouseRadius) * 0.3})`;
                ctx.fill();
            }
        });

        requestAnimationFrame(animate);
    }

    animate();
}

// ================================
// PARALLAX SCROLLING
// ================================
function initParallaxScrolling() {
    const layer1 = document.querySelector('.layer-1');
    const layer2 = document.querySelector('.layer-2');
    const layer3 = document.querySelector('.layer-3');

    if (!layer1 || !layer2 || !layer3) return;

    function updateParallax() {
        const scrollY = window.scrollY;

        // Different speeds for each layer (slower = further away)
        layer1.style.transform = `translateY(${scrollY * 0.1}px)`;
        layer2.style.transform = `translateY(${scrollY * 0.25}px)`;
        layer3.style.transform = `translateY(${scrollY * 0.4}px)`;
    }

    // Use requestAnimationFrame for smooth performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial position
    updateParallax();
}

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
// WORLD MAP ATTACKS - ENHANCED
// ================================
function initWorldMap() {
    const attackLinesContainer = document.getElementById('attack-lines');
    const attackPointsContainer = document.getElementById('attack-points');
    const mapSvg = document.querySelector('.map-svg');

    if (!mapSvg) return;

    // Threat locations with Shadow Syndicate bases
    const threatLocations = [
        { x: 180, y: 150, label: 'NYC', type: 'threat' },
        { x: 480, y: 130, label: 'London', type: 'threat' },
        { x: 750, y: 100, label: 'Moscow', type: 'syndicate' },
        { x: 830, y: 280, label: 'Sydney', type: 'threat' },
        { x: 280, y: 310, label: 'São Paulo', type: 'threat' },
        { x: 700, y: 140, label: 'Beijing', type: 'syndicate' },
        { x: 550, y: 120, label: 'Berlin', type: 'threat' },
        { x: 460, y: 240, label: 'Lagos', type: 'threat' },
        { x: 150, y: 200, label: 'Mexico City', type: 'threat' },
        { x: 770, y: 220, label: 'Jakarta', type: 'syndicate' },
    ];

    const hqPosition = { x: 620, y: 180 };
    let attacksBlocked = 0;
    let attacksDetected = 0;

    // Create radar scanner effect
    const radarGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    radarGroup.innerHTML = `
        <circle cx="${hqPosition.x}" cy="${hqPosition.y}" r="100" fill="none" stroke="rgba(0,255,136,0.1)" stroke-width="1" class="radar-ring-1"/>
        <circle cx="${hqPosition.x}" cy="${hqPosition.y}" r="150" fill="none" stroke="rgba(0,255,136,0.05)" stroke-width="1" class="radar-ring-2"/>
        <circle cx="${hqPosition.x}" cy="${hqPosition.y}" r="200" fill="none" stroke="rgba(0,255,136,0.03)" stroke-width="1" class="radar-ring-3"/>
        <line x1="${hqPosition.x}" y1="${hqPosition.y}" x2="${hqPosition.x + 150}" y2="${hqPosition.y}" stroke="rgba(0,255,136,0.4)" stroke-width="2" class="radar-sweep">
            <animateTransform attributeName="transform" type="rotate" from="0 ${hqPosition.x} ${hqPosition.y}" to="360 ${hqPosition.x} ${hqPosition.y}" dur="4s" repeatCount="indefinite"/>
        </line>
    `;
    mapSvg.insertBefore(radarGroup, attackLinesContainer);

    // Note: City markers removed to prevent cursor glitches
    // Attacks still animate from threat locations

    function createAttack() {
        const origin = threatLocations[Math.floor(Math.random() * threatLocations.length)];
        attacksDetected++;

        // Update threat counter
        const threatCount = document.getElementById('threat-count');
        if (threatCount) {
            threatCount.textContent = Math.min(15, 5 + Math.floor(attacksDetected / 3));
        }

        // Create attack line with gradient
        const lineId = 'attack-line-' + Date.now();
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.innerHTML = `
            <linearGradient id="${lineId}-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:${origin.type === 'syndicate' ? '#ff6b6b' : '#feca57'};stop-opacity:1" />
                <stop offset="100%" style="stop-color:#00ff88;stop-opacity:1" />
            </linearGradient>
        `;
        mapSvg.appendChild(defs);

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', origin.x);
        line.setAttribute('y1', origin.y);
        line.setAttribute('x2', hqPosition.x);
        line.setAttribute('y2', hqPosition.y);
        line.setAttribute('stroke', `url(#${lineId}-grad)`);
        line.setAttribute('stroke-width', '2');
        line.setAttribute('class', 'attack-line');
        line.setAttribute('stroke-dasharray', '5,5');
        attackLinesContainer.appendChild(line);

        // Create attack point at origin with pulse
        const point = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        point.setAttribute('cx', origin.x);
        point.setAttribute('cy', origin.y);
        point.setAttribute('r', '6');
        point.setAttribute('fill', origin.type === 'syndicate' ? '#ff6b6b' : '#feca57');
        point.setAttribute('class', 'attack-point-active');
        attackPointsContainer.appendChild(point);

        // Create pulse effect at origin
        const pulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        pulse.setAttribute('cx', origin.x);
        pulse.setAttribute('cy', origin.y);
        pulse.setAttribute('r', '6');
        pulse.setAttribute('fill', 'none');
        pulse.setAttribute('stroke', origin.type === 'syndicate' ? '#ff6b6b' : '#feca57');
        pulse.setAttribute('stroke-width', '2');
        pulse.setAttribute('class', 'attack-pulse');
        attackPointsContainer.appendChild(pulse);

        // After 1.5 seconds, show defense shield at HQ
        setTimeout(() => {
            attacksBlocked++;

            // Defense shield effect
            const shield = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            shield.setAttribute('cx', hqPosition.x);
            shield.setAttribute('cy', hqPosition.y);
            shield.setAttribute('r', '20');
            shield.setAttribute('fill', 'none');
            shield.setAttribute('stroke', '#00ff88');
            shield.setAttribute('stroke-width', '3');
            shield.setAttribute('class', 'defense-shield');
            attackPointsContainer.appendChild(shield);

            // Show blocked text
            const blockedText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            blockedText.setAttribute('x', hqPosition.x);
            blockedText.setAttribute('y', hqPosition.y + 35);
            blockedText.setAttribute('fill', '#00ff88');
            blockedText.setAttribute('font-size', '10');
            blockedText.setAttribute('text-anchor', 'middle');
            blockedText.setAttribute('class', 'blocked-text');
            blockedText.textContent = 'BLOCKED';
            attackPointsContainer.appendChild(blockedText);

            if (origin.type === 'syndicate') {
                playSound('alert');
            }

            setTimeout(() => {
                shield.remove();
                blockedText.remove();
            }, 1500);
        }, 1500);

        // Remove attack elements after animation
        setTimeout(() => {
            line.remove();
            point.remove();
            pulse.remove();
            defs.remove();
        }, 3000);
    }

    // Random attacks with varying frequency
    setInterval(() => {
        if (Math.random() > 0.4) {
            createAttack();
        }
    }, 3000);

    // Initial attacks
    setTimeout(createAttack, 500);
    setTimeout(createAttack, 1500);
}

// ================================
// DAILY LOG SYSTEM
// ================================
const LogManager = {
    STORAGE_KEY: 'codegreen_daily_logs_v3',

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
                },
                // ==================== DAY 3 LOGS ====================
                {
                    id: 1735862400001,
                    timestamp: '2026-01-03T09:00:00.000Z',
                    date: '2026-01-03',
                    instructor: 'faisal',
                    title: 'Day 3: Command & Coordination - Philosophy & Defense',
                    content: `🛡️ COMMAND OPERATIONS:

🎨 AGENT SHOWCASE:
Agents presented their custom-built Division HQ websites. A deep discussion on the "Hacker Philosophy" followed—teaching agents that hacking is a vast, creative discipline. Core takeaway: A hacker is a problem solver.

🔐 NATIONAL DEFENSE BRIEFING:
Strategic session with Pakistan NCERT on protecting national infrastructure and the reality of modern cyber threats.

🎭 TEAM IDENTITY:
Teams selected a core cybersecurity concept to visually represent their division and began sketching their Team Identity Charts.`,
                    tags: 'day3, ncert, philosophy, design, team-identity'
                },
                {
                    id: 1735862400002,
                    timestamp: '2026-01-03T11:00:00.000Z',
                    date: '2026-01-03',
                    instructor: 'sharique',
                    title: 'Day 3: The Technical Arsenal - Web Exploitation',
                    content: `TECHNICAL OPERATIONS LOG:

🧪 PASSWORD VITALITY:
Live demo using the Password Analyzer tool. Agents witnessed how fast weak passwords crumble under brute-force attacks.

🛠️ BURP SUITE & JUICE SHOP:
Deployed OWASP Juice Shop as a live sandbox. Agents learned to use Burp Suite as an intercepting proxy.

💉 XSS & SQLi LABS:
Agents executed Cross-Site Scripting and SQL Injection attacks, learning to "poison the stream" and bypass authentication using ' OR 1=1; --

🚀 ACTIVE ASSIGNMENT:
SQLi mastery, Advanced Juice Shop Labs, Log Analysis, and Chart Completion.`,
                    tags: 'day3, password, burp-suite, juice-shop, xss, sqli'
                },
                {
                    id: 1735862400003,
                    timestamp: '2026-01-03T14:00:00.000Z',
                    date: '2026-01-03',
                    instructor: 'maira',
                    title: 'Day 3: Social Engineering & Energy Protocols',
                    content: `INTELLIGENCE & VITALITY LOG:

🎣 PHISHING MASTERCLASS:
Training on "Hook, Line, and Sinker" mechanics. Agents learned how the Shadow Syndicate uses social engineering to exploit human psychology.

🔋 ENERGY REBOOT PROTOCOLS:
• Tower Protocol: Sticky note structure building competition (Teamwork/Balance)
• Adrenaline Burst: 30-second rapid-response jumping drill to reset agent focus

🛡️ DAY 3 VERDICT: Mission SHIELD - COMPLETE. Agents are now fully operational.`,
                    tags: 'day3, phishing, social-engineering, teamwork, energy'
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
    initCircuitBoard();
    initParallaxScrolling();
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

    // Tab Navigation
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;

            // Update buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update panels
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === `tab-${targetTab}`) {
                    panel.classList.add('active');
                }
            });

            playSound('whoosh');
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

// ================================
// 3D TILT EFFECT ON CARDS
// ================================
function init3DTilt() {
    const cards = document.querySelectorAll('.instructor-card, .stat-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

// ================================
// MOUSE TRAIL EFFECT - GLOWING COMET
// ================================
function initMouseTrail() {
    const canvas = document.createElement('canvas');
    canvas.id = 'mouse-trail-canvas';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 9998;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0, mouseY = 0;
    let isMoving = false;
    let moveTimeout;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMoving = true;

        // Create fewer, smaller particles
        particles.push({
            x: mouseX,
            y: mouseY,
            size: Math.random() * 2 + 2,  // Smaller: 2-4px
            speedX: (Math.random() - 0.5) * 1,
            speedY: (Math.random() - 0.5) * 1,
            life: 1,
            decay: Math.random() * 0.04 + 0.04,  // Faster decay
            hue: 140 + Math.random() * 20
        });

        clearTimeout(moveTimeout);
        moveTimeout = setTimeout(() => {
            isMoving = false;
        }, 100);
    });

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Smaller glow at cursor position
        if (isMoving) {
            const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 15);
            gradient.addColorStop(0, 'rgba(0, 255, 136, 0.3)');
            gradient.addColorStop(0.5, 'rgba(0, 255, 136, 0.1)');
            gradient.addColorStop(1, 'rgba(0, 255, 136, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(mouseX, mouseY, 15, 0, Math.PI * 2);
            ctx.fill();
        }

        // Update and draw particles
        particles = particles.filter(p => p.life > 0);

        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            p.life -= p.decay;
            p.size *= 0.98;

            // Draw particle with glow
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
            gradient.addColorStop(0, `hsla(${p.hue}, 100%, 60%, ${p.life})`);
            gradient.addColorStop(0.5, `hsla(${p.hue}, 100%, 50%, ${p.life * 0.5})`);
            gradient.addColorStop(1, `hsla(${p.hue}, 100%, 40%, 0)`);

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
            ctx.fill();

            // Core particle
            ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.life})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
        });

        // Limit particles for performance
        if (particles.length > 150) {
            particles = particles.slice(-150);
        }

        requestAnimationFrame(animate);
    }
    animate();
}

// ================================
// KONAMI CODE EASTER EGG
// ================================
function initKonamiCode() {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateSecretMode();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
}

function activateSecretMode() {
    playSound('success');
    showNotification('🎮 CHEAT CODE ACTIVATED: Agent Mode Unlocked!', 'success');

    // Rainbow mode!
    document.body.style.animation = 'rainbowBg 3s ease';

    // Confetti explosion
    createConfetti();

    // Add secret agent badge
    const badge = document.createElement('div');
    badge.innerHTML = '🏆 ELITE AGENT';
    badge.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #ffd700, #ff6b6b);
        color: #000;
        padding: 10px 20px;
        border-radius: 20px;
        font-family: 'Orbitron', sans-serif;
        font-weight: bold;
        font-size: 0.8rem;
        z-index: 1000;
        animation: badgePulse 1s ease infinite;
    `;
    document.body.appendChild(badge);

    setTimeout(() => {
        document.body.style.animation = '';
    }, 3000);
}

function createConfetti() {
    const colors = ['#00ff88', '#ff6b6b', '#feca57', '#6c5ce7', '#fd79a8', '#00cec9'];

    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}vw;
            top: -20px;
            z-index: 10000;
            pointer-events: none;
            animation: confettiFall ${2 + Math.random() * 2}s ease forwards;
            animation-delay: ${Math.random() * 0.5}s;
        `;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 4000);
    }
}

// ================================
// RANDOM INCOMING TRANSMISSIONS
// ================================
function initRandomTransmissions() {
    const transmissions = [
        '📡 Intercepted Shadow Syndicate communication...',
        '🛡️ Firewall integrity: 100%',
        '🌐 New agent connected from AQUA division',
        '⚡ Power surge detected in VOLT sector',
        '🌍 TERRA zone sensors: All clear',
        '☁️ ATMOS satellite uplink stable',
        '🔐 Encryption protocols updated',
        '👁️ Surveillance systems operational',
        '🚀 Mission data synced successfully',
        '⚠️ Anomaly detected... Investigating...'
    ];

    setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance every interval
            const msg = transmissions[Math.floor(Math.random() * transmissions.length)];
            showIncomingTransmission(msg);
        }
    }, 15000);
}

function showIncomingTransmission(message) {
    playSound('notification');

    const transmission = document.createElement('div');
    transmission.className = 'incoming-transmission';
    transmission.innerHTML = `
        <div class="transmission-header">
            <span class="transmission-icon">📨</span>
            <span class="transmission-title">INCOMING TRANSMISSION</span>
        </div>
        <div class="transmission-body">${message}</div>
    `;
    transmission.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(17, 25, 22, 0.95);
        border: 1px solid #00ff88;
        border-left: 4px solid #00ff88;
        border-radius: 8px;
        padding: 15px 20px;
        max-width: 350px;
        z-index: 1000;
        animation: slideInLeft 0.5s ease, fadeOut 0.5s ease 4.5s forwards;
        box-shadow: 0 10px 40px rgba(0, 255, 136, 0.2);
    `;

    document.body.appendChild(transmission);
    setTimeout(() => transmission.remove(), 5000);
}

// ================================
// GLITCH TEXT EFFECT
// ================================
function initGlitchEffect() {
    const logo = document.querySelector('.logo');
    if (!logo) return;

    setInterval(() => {
        if (Math.random() > 0.95) {
            logo.classList.add('glitch-active');
            setTimeout(() => logo.classList.remove('glitch-active'), 200);
        }
    }, 2000);
}

// ================================
// COUNTDOWN TIMER TO NEXT DAY
// ================================
function initCountdownTimer() {
    const countdownContainer = document.createElement('div');
    countdownContainer.id = 'mission-countdown';
    countdownContainer.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(17, 25, 22, 0.9);
        border: 1px solid rgba(0, 255, 136, 0.3);
        border-radius: 10px;
        padding: 15px 20px;
        font-family: 'Orbitron', sans-serif;
        z-index: 100;
        backdrop-filter: blur(10px);
    `;

    function updateCountdown() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0); // Next day 9 AM

        const diff = tomorrow - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        countdownContainer.innerHTML = `
            <div style="font-size: 0.7rem; color: #a0a0a0; margin-bottom: 5px;">NEXT MISSION IN</div>
            <div style="font-size: 1.2rem; color: #00ff88; letter-spacing: 2px;">
                ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}
            </div>
        `;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
    document.body.appendChild(countdownContainer);
}

// ================================
// INITIALIZE ALL INTERACTIVE FEATURES
// ================================
document.addEventListener('DOMContentLoaded', () => {
    // Delay to ensure main content loads first
    setTimeout(() => {
        init3DTilt();
        initMouseTrail();
        initKonamiCode();
        initRandomTransmissions();
        initGlitchEffect();
        initCountdownTimer();
    }, 1000);
});

// Add animation styles
const interactiveStyles = document.createElement('style');
interactiveStyles.textContent = `
    @keyframes confettiFall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }
    
    @keyframes slideInLeft {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes badgePulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    @keyframes rainbowBg {
        0% { filter: hue-rotate(0deg); }
        50% { filter: hue-rotate(180deg); }
        100% { filter: hue-rotate(360deg); }
    }
    
    .glitch-active {
        animation: glitchText 0.2s ease !important;
    }
    
    @keyframes glitchText {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); filter: hue-rotate(90deg); }
        40% { transform: translate(2px, -2px); filter: hue-rotate(180deg); }
        60% { transform: translate(-2px, -2px); filter: hue-rotate(270deg); }
        80% { transform: translate(2px, 2px); filter: hue-rotate(360deg); }
        100% { transform: translate(0); filter: none; }
    }
    
    .transmission-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
    }
    
    .transmission-icon {
        animation: pulse 1s ease infinite;
    }
    
    .transmission-title {
        font-family: 'Orbitron', sans-serif;
        font-size: 0.7rem;
        color: #00ff88;
        letter-spacing: 1px;
    }
    
    .transmission-body {
        font-size: 0.85rem;
        color: #e0e0e0;
    }
    
    .instructor-card, .stat-card {
        transition: transform 0.1s ease, box-shadow 0.3s ease, border-color 0.3s ease;
    }
`;
document.head.appendChild(interactiveStyles);

