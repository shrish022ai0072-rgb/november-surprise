// =====================================================
// 1. TARGET MILESTONE DATES (November 2 & November 5)
// =====================================================
function getTargetDates() {
  const now = new Date();
  let year = now.getFullYear();
  // Nov is month index 10 in JS Date (0 = Jan, 10 = Nov)
  let nov2 = new Date(year, 10, 2, 19, 45, 0); // Nov 2, 7:45 PM
  let nov5 = new Date(year, 10, 5, 0, 0, 0);   // Nov 5, 12:00 AM
  return { nov2, nov5 };
}

let previewOverride = 'auto'; // 'auto' | 'locked' | 'nov2' | 'nov5'

// =====================================================
// 2. THEME SWITCHER
// =====================================================
document.querySelectorAll('.theme-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.documentElement.setAttribute('data-theme', btn.dataset.setTheme);
  });
});

// =====================================================
// 3. CREATOR TEST MODE & VIEW NAVIGATION
// =====================================================
const previewToggleBtn = document.getElementById('previewToggleBtn');
const creatorBar = document.getElementById('creatorBar');

previewToggleBtn.addEventListener('click', () => {
  creatorBar.classList.toggle('hidden');
});

document.querySelectorAll('.stage-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.stage-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    previewOverride = btn.dataset.stage;
    updateCountdownAndStage();
  });
});

function switchView(viewId) {
  document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');

  document.querySelectorAll('.tab-btn').forEach(t => {
    t.classList.toggle('active', t.dataset.view === viewId);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => switchView(btn.dataset.view));
});

document.getElementById('openNov2Btn').addEventListener('click', () => switchView('nov2View'));
document.getElementById('openNov5Btn').addEventListener('click', () => switchView('nov5View'));
document.getElementById('backToTimerFromNov2').addEventListener('click', () => switchView('timerView'));

// =====================================================
// 4. DUAL COUNTDOWN TIMER (Days, Hours, Mins, Secs + Total Hours)
// =====================================================
function updateCountdownAndStage() {
  const { nov2, nov5 } = getTargetDates();
  const now = new Date();

  let isNov2Unlocked = now >= nov2;
  let isNov5Unlocked = now >= nov5;

  if (previewOverride === 'locked') {
    isNov2Unlocked = false;
    isNov5Unlocked = false;
  } else if (previewOverride === 'nov2') {
    isNov2Unlocked = true;
    isNov5Unlocked = false;
  } else if (previewOverride === 'nov5') {
    isNov2Unlocked = true;
    isNov5Unlocked = true;
  }

  // Determine current active target for the countdown display
  const activeTarget = !isNov2Unlocked ? nov2 : nov5;
  let diff = Math.max(0, activeTarget - now);

  // If in preview mode, show simulated remaining time so you can see how it looks
  if (previewOverride === 'nov2' && now < nov2) {
    diff = nov5 - nov2;
  } else if (previewOverride === 'nov5') {
    diff = 0;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  const totalHours = Math.floor(diff / (1000 * 60 * 60));

  document.getElementById('cdDays').textContent = String(days).padStart(2, '0');
  document.getElementById('cdHours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cdMins').textContent = String(mins).padStart(2, '0');
  document.getElementById('cdSecs').textContent = String(secs).padStart(2, '0');

  document.getElementById('totalHoursText').textContent =
    `${days} Days, ${hours} Hours, ${mins} Mins, ${secs} Secs`;
  document.getElementById('rawTotalHours').textContent = totalHours;

  // Update Progress Badges & Buttons without spoiling locked chapters
  const stepNov2 = document.getElementById('stepNov2');
  const stepNov5 = document.getElementById('stepNov5');
  const iconNov2 = document.getElementById('iconNov2');
  const iconNov5 = document.getElementById('iconNov5');
  const chapterTabs = document.getElementById('chapterTabs');
  const tabNov2 = document.getElementById('tabNov2');
  const tabNov5 = document.getElementById('tabNov5');
  const unlockActions = document.getElementById('unlockActions');
  const openNov2Btn = document.getElementById('openNov2Btn');
  const openNov5Btn = document.getElementById('openNov5Btn');

  stepNov2.classList.toggle('unlocked', isNov2Unlocked);
  stepNov5.classList.toggle('unlocked', isNov5Unlocked);
  iconNov2.textContent = isNov2Unlocked ? '✨' : '🔒';
  iconNov5.textContent = isNov5Unlocked ? '🎂' : '🔒';

  if (isNov2Unlocked || isNov5Unlocked) {
    chapterTabs.classList.remove('hidden');
    unlockActions.classList.remove('hidden');
  } else {
    chapterTabs.classList.add('hidden');
    unlockActions.classList.add('hidden');
  }

  tabNov2.classList.toggle('hidden', !isNov2Unlocked);
  openNov2Btn.classList.toggle('hidden', !isNov2Unlocked);
  tabNov5.classList.toggle('hidden', !isNov5Unlocked);
  openNov5Btn.classList.toggle('hidden', !isNov5Unlocked);

  const headline = document.getElementById('timerHeadline');
  const badge = document.getElementById('ActivePhaseBadge');
  if (!isNov2Unlocked) {
    badge.textContent = '🔒 NEXT UNLOCK: NOV 2 • 7:45 PM';
    headline.textContent = 'Counting Down to Surprise #1...';
  } else if (!isNov5Unlocked) {
    badge.textContent = '✨ CHAPTER 1 UNLOCKED! NEXT: NOV 5 • 12:00 AM';
    headline.textContent = 'Surprise #1 is Open! Counting Down to Nov 5...';
  } else {
    badge.textContent = '🎉 ALL SURPRISES UNLOCKED!';
    headline.textContent = 'Happy 3 Years & Happy 17th Birthday! 💖';
  }
}

setInterval(updateCountdownAndStage, 1000);
updateCountdownAndStage();

// =====================================================
// 5. MINI-GAME TABS SWITCHER
// =====================================================
document.querySelectorAll('.game-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.game-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.game-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.game).classList.add('active');
  });
});

// =====================================================
// GAME 1: CATCH THE FALLING HEARTS
// =====================================================
const g1Canvas = document.getElementById('heartCatcherCanvas');
const g1Ctx = g1Canvas.getContext('2d');
let g1Running = false;
let g1Score = 0;
let basketX = 140;
let fallingHearts = [];

function moveBasket(clientX) {
  const rect = g1Canvas.getBoundingClientRect();
  const scaleX = g1Canvas.width / rect.width;
  basketX = (clientX - rect.left) * scaleX - 35;
  basketX = Math.max(0, Math.min(g1Canvas.width - 70, basketX));
}

g1Canvas.addEventListener('mousemove', e => moveBasket(e.clientX));
g1Canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  moveBasket(e.touches[0].clientX);
}, { passive: false });

document.getElementById('g1StartBtn').addEventListener('click', () => {
  g1Score = 0;
  fallingHearts = [];
  g1Running = true;
  document.getElementById('g1Score').textContent = '0';
  document.getElementById('g1Msg').textContent = 'Catch the falling hearts! 💖';
});

function g1Loop() {
  g1Ctx.clearRect(0, 0, g1Canvas.width, g1Canvas.height);

  // Draw catcher basket
  g1Ctx.fillStyle = '#ff4d8d';
  g1Ctx.beginPath();
  g1Ctx.roundRect(basketX, g1Canvas.height - 28, 70, 16, 8);
  g1Ctx.fill();

  if (g1Running) {
    if (Math.random() < 0.045) {
      fallingHearts.push({
        x: Math.random() * (g1Canvas.width - 24) + 12,
        y: -10,
        speed: 1.8 + Math.random() * 1.5,
        emoji: Math.random() > 0.25 ? '💖' : '✨'
      });
    }

    for (let i = fallingHearts.length - 1; i >= 0; i--) {
      const h = fallingHearts[i];
      h.y += h.speed;
      g1Ctx.font = '20px sans-serif';
      g1Ctx.fillText(h.emoji, h.x, h.y);

      // Check catch collision
      if (h.y >= g1Canvas.height - 34 && h.y <= g1Canvas.height - 10 &&
          h.x >= basketX - 10 && h.x <= basketX + 70) {
        g1Score++;
        document.getElementById('g1Score').textContent = g1Score;
        fallingHearts.splice(i, 1);
        if (g1Score === 15) {
          document.getElementById('g1Msg').textContent = '🌟 Secret Clue: Nov 2 at 7:45 PM & Nov 5 hold magical memories!';
        }
      } else if (h.y > g1Canvas.height + 10) {
        fallingHearts.splice(i, 1);
      }
    }
  } else {
    g1Ctx.fillStyle = 'rgba(255,255,255,0.7)';
    g1Ctx.font = '14px Plus Jakarta Sans';
    g1Ctx.textAlign = 'center';
    g1Ctx.fillText('Tap "Start Game" below to play!', g1Canvas.width / 2, g1Canvas.height / 2);
    g1Ctx.textAlign = 'start';
  }
  requestAnimationFrame(g1Loop);
}
g1Loop();

// =====================================================
// GAME 2: MEMORY MATCH
// =====================================================
const memIcons = ['💖', '🌸', '✨', '🎂', '🦋', '💌', '👑', '🌙'];
let memCards = [];
let flippedCards = [];
let g2Moves = 0;

function initMemoryGame() {
  const grid = document.getElementById('memoryGrid');
  grid.innerHTML = '';
  memCards = [...memIcons, ...memIcons].sort(() => Math.random() - 0.5);
  flippedCards = [];
  g2Moves = 0;
  document.getElementById('g2Moves').textContent = '0';
  document.getElementById('g2Msg').textContent = 'Find all 8 matching pairs!';

  memCards.forEach((icon) => {
    const card = document.createElement('div');
    card.className = 'mem-card';
    card.dataset.icon = icon;
    card.textContent = '❔';
    card.addEventListener('click', () => flipCard(card));
    grid.appendChild(card);
  });
}

function flipCard(card) {
  if (flippedCards.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) return;
  card.classList.add('flipped');
  card.textContent = card.dataset.icon;
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    g2Moves++;
    document.getElementById('g2Moves').textContent = g2Moves;
    const [c1, c2] = flippedCards;
    if (c1.dataset.icon === c2.dataset.icon) {
      c1.classList.add('matched');
      c2.classList.add('matched');
      flippedCards = [];
      if (document.querySelectorAll('.mem-card.matched').length === 16) {
        document.getElementById('g2Msg').textContent = `🎉 You matched them all in ${g2Moves} moves!`;
      }
    } else {
      setTimeout(() => {
        c1.classList.remove('flipped');
        c2.classList.remove('flipped');
        c1.textContent = '❔';
        c2.textContent = '❔';
        flippedCards = [];
      }, 650);
    }
  }
}
document.getElementById('g2ResetBtn').addEventListener('click', initMemoryGame);
initMemoryGame();

// =====================================================
// GAME 3: POP COMPLIMENT BUBBLES
// =====================================================
const compliments = [
  "You have the prettiest smile ever! 💖",
  "Best friend + Favorite person in one! ✨",
  "Nov 2 at 7:45 PM changed everything 🌟",
  "You make every single day brighter 🌸",
  "So lucky to have you in my life! 🤍",
  "Chapter 17 is going to look amazing on you 👑"
];
let g3Popped = 0;
const bubbleArena = document.getElementById('bubbleArena');
const bubbleNote = document.getElementById('bubbleFloatingNote');

function spawnBubble() {
  const b = document.createElement('div');
  b.className = 'pop-bubble';
  b.style.left = `${Math.random() * 82 + 4}%`;
  b.textContent = ['🫧', '💖', '✨', '🌸'][Math.floor(Math.random() * 4)];

  b.addEventListener('click', () => {
    g3Popped++;
    document.getElementById('g3Score').textContent = g3Popped;
    bubbleNote.textContent = compliments[g3Popped % compliments.length];
    b.remove();
  });

  setTimeout(() => b.remove(), 4500);
  bubbleArena.appendChild(b);
}

setInterval(() => {
  if (document.getElementById('game3').classList.contains('active')) {
    spawnBubble();
  }
}, 900);

document.getElementById('g3SpawnBtn').addEventListener('click', () => {
  for (let i = 0; i < 5; i++) setTimeout(spawnBubble, i * 180);
});

// =====================================================
// GAME 4: STARLIGHT CONSTELLATION HEART
// =====================================================
const starCanvas = document.getElementById('starCanvas');
const sCtx = starCanvas.getContext('2d');
const heartStarPoints = [
  { x: 180, y: 85 },  { x: 135, y: 50 },  { x: 80, y: 70 },
  { x: 65, y: 125 },  { x: 110, y: 185 }, { x: 180, y: 235 },
  { x: 250, y: 185 }, { x: 295, y: 125 }, { x: 280, y: 70 },
  { x: 225, y: 50 }
];
let currentStarIndex = 0;

function drawConstellation() {
  sCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);

  // Draw connected lines
  if (currentStarIndex > 1) {
    sCtx.strokeStyle = '#ff4d8d';
    sCtx.lineWidth = 2.5;
    sCtx.beginPath();
    sCtx.moveTo(heartStarPoints[0].x, heartStarPoints[0].y);
    for (let i = 1; i < currentStarIndex; i++) {
      sCtx.lineTo(heartStarPoints[i].x, heartStarPoints[i].y);
    }
    if (currentStarIndex === heartStarPoints.length) {
      sCtx.lineTo(heartStarPoints[0].x, heartStarPoints[0].y);
    }
    sCtx.stroke();
  }

  // Draw star nodes
  heartStarPoints.forEach((pt, idx) => {
    const connected = idx < currentStarIndex;
    sCtx.beginPath();
    sCtx.arc(pt.x, pt.y, connected ? 12 : 10, 0, Math.PI * 2);
    sCtx.fillStyle = connected ? '#ff4d8d' : 'rgba(255,255,255,0.22)';
    sCtx.fill();

    sCtx.fillStyle = '#fff';
    sCtx.font = 'bold 11px sans-serif';
    sCtx.textAlign = 'center';
    sCtx.textBaseline = 'middle';
    sCtx.fillText(idx + 1, pt.x, pt.y);
  });
}

starCanvas.addEventListener('click', (e) => {
  if (currentStarIndex >= heartStarPoints.length) return;
  const rect = starCanvas.getBoundingClientRect();
  const scaleX = starCanvas.width / rect.width;
  const scaleY = starCanvas.height / rect.height;
  const clickX = (e.clientX - rect.left) * scaleX;
  const clickY = (e.clientY - rect.top) * scaleY;

  const target = heartStarPoints[currentStarIndex];
  const dist = Math.hypot(clickX - target.x, clickY - target.y);
  if (dist < 28) {
    currentStarIndex++;
    document.getElementById('g4Progress').textContent = `${currentStarIndex}/10`;
    drawConstellation();
    if (currentStarIndex === 10) {
      document.getElementById('g4Msg').textContent = '💖 You completed the Starlight Heart Constellation!';
    }
  }
});

document.getElementById('g4ResetBtn').addEventListener('click', () => {
  currentStarIndex = 0;
  document.getElementById('g4Progress').textContent = '0/10';
  document.getElementById('g4Msg').textContent = 'Tap Star #1 to start!';
  drawConstellation();
});
drawConstellation();

// =====================================================
// 6. NOV 2 ENVELOPE INTERACTION & NOV 5 CAKE + 17 REASONS
// =====================================================
document.querySelectorAll('.envelope-card').forEach(card => {
  card.addEventListener('click', () => {
    card.querySelector('.env-title').textContent = card.dataset.note;
    card.querySelector('.env-tap').textContent = 'Opened with love 💖';
  });
});

// Birthday Cake Candles
function blowOutCandles() {
  document.getElementById('flame1').classList.add('out');
  document.getElementById('flame7').classList.add('out');
  document.getElementById('wishUnlockedMsg').classList.remove('hidden');
}

document.getElementById('candle1').addEventListener('click', blowOutCandles);
document.getElementById('candle7').addEventListener('click', blowOutCandles);
document.getElementById('blowCandlesBtn').addEventListener('click', blowOutCandles);

// 17 Reasons List for Her 17th Birthday
const reasons17 = [
  "The way your smile immediately makes my entire day 100x brighter.",
  "That unforgettable evening on Nov 2 at 7:45 PM when our first interaction started it all.",
  "How you have been my truest best friend for 3 whole years.",
  "The way you listen and understand even the things I don't say out loud.",
  "Your adorable laugh that I never get tired of hearing.",
  "How kind, pure, and caring your heart is toward everyone.",
  "Every single late-night conversation and silly joke we share.",
  "How safe and peaceful I feel whenever I'm talking to you.",
  "The way you motivate me to become a better version of myself.",
  "How even the simplest moments feel magical when you're part of them.",
  "Your cute expressions when you're excited about something.",
  "How strong and graceful you are as you step into your 17th year.",
  "Because you turn ordinary days into my favorite memories.",
  "How our bond grew stronger through 3 beautiful years of friendship and love.",
  "Because you are my favorite notification every single day.",
  "Your warmth that makes everyone around you feel special.",
  "Because at 17, you are more wonderful than ever—and I'm endlessly proud of you! 💖"
];

let rIdx = 0;
function updateReasonDisplay() {
  document.getElementById('reasonNumber').textContent = `Reason #${rIdx + 1} of 17`;
  document.getElementById('reasonText').textContent = `"${reasons17[rIdx]}"`;
}
document.getElementById('prevReasonBtn').addEventListener('click', () => {
  rIdx = (rIdx - 1 + reasons17.length) % reasons17.length;
  updateReasonDisplay();
});
document.getElementById('nextReasonBtn').addEventListener('click', () => {
  rIdx = (rIdx + 1) % reasons17.length;
  updateReasonDisplay();
});

// =====================================================
// 7. AMBIENT BACKGROUND PARTICLES
// =====================================================
const bgCanvas = document.getElementById('bgCanvas');
const bgCtx = bgCanvas.getContext('2d');
let particles = [];

function resizeBg() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeBg);
resizeBg();

for (let i = 0; i < 35; i++) {
  particles.push({
    x: Math.random() * bgCanvas.width,
    y: Math.random() * bgCanvas.height,
    r: Math.random() * 2.2 + 0.8,
    vy: -0.3 - Math.random() * 0.5
  });
}

function animateBg() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  bgCtx.fillStyle = 'rgba(255, 182, 210, 0.35)';
  particles.forEach(p => {
    p.y += p.vy;
    if (p.y < 0) p.y = bgCanvas.height;
    bgCtx.beginPath();
    bgCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    bgCtx.fill();
  });
  requestAnimationFrame(animateBg);
}
animateBg();