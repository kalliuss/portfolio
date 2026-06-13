

// charset bloğu
const CHARSET = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digits:    '0123456789',
  symbols:   '!@#$%^&*()-_=+[]{}|;:,.<>?',
};


function buildPool(options) {
  return Object.entries(CHARSET)
    .filter(([key]) => options[key])
    .map(([, val]) => val)
    .join('');
}


// math.random() tahmin edilebilir ondan kaynaklı crypto.getRandomValues() kullanarak daha güvenli bir rastgele sayı üretimi yapacağız


function randomInt(max) {
  const arr = new Uint32Array(1);  // 1 elemanlı 32-bit integer dizisi
  crypto.getRandomValues(arr); // OS'tan gerçek rastgele byte doldurur
  return arr[0] % max; // [0, max) aralığına çeker
}


function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = randomInt(i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}


function generate(options, length) {
    const pool = buildPool(options);

    if (!pool) return '';

    const required = [];


    for (const [key, chars] of Object.entries(CHARSET)) {
        if (options[key]) {
            required.push(chars[randomInt(chars.length)]);
        }
    }


    const rest = Array.from({ length: length - required.length }, () => pool[randomInt(pool.length)]);

    return shuffle([...required, ...rest]).join('');
}


const ui = {
  lowercase: document.getElementById('lowercase'),
  uppercase: document.getElementById('uppercase'),
  digits:    document.getElementById('digits'),
  symbols:   document.getElementById('symbols'),
  length:    document.getElementById('length'),
  output:    document.getElementById('output'),
  generateBtn: document.getElementById('generate-btn'),
  copyBtn:     document.getElementById('copy-btn'),
  countdown: document.getElementById('countdown'),
};


// checkboxların anlık durumunu oku
function getOptions() {
    return {
        lowercase: ui.lowercase.checked,
        uppercase: ui.uppercase.checked,
        digits:    ui.digits.checked,
        symbols:   ui.symbols.checked,
    };
}
    
// options + length al genereate çağır sonra output dön şifre boşssa copy butonu gizle
function handleGenerate() { 
    const options = getOptions();
    const length = parseInt(ui.length.value, 10);
    const password = generate(options, length);
    ui.output.value = password;
    ui.copyBtn.style.display = password ? 'inline-block' : 'none';

    if (password) startCountdown(); // ← bu satır
}

 
// handle clipboard API, async. Butonu geçici copied  yapar
async function handleCopy() {
  if (!ui.output.value) return;
  await navigator.clipboard.writeText(ui.output.value);
  ui.copyBtn.textContent = 'Copied!';
  setTimeout(() => ui.copyBtn.textContent = 'Copy', 1500);
}

ui.generateBtn.addEventListener('click', handleGenerate);
ui.copyBtn.addEventListener('click', handleCopy);



let countdownTimer = null;

function startCountdown() {
  clearInterval(countdownTimer);

  let remaining = 15;
  ui.countdown.textContent = remaining + 's';
  ui.countdown.style.display = 'inline';

  countdownTimer = setInterval(() => {
    remaining--;
    ui.countdown.textContent = remaining + 's';

    if (remaining <= 0) {
      clearInterval(countdownTimer);
      ui.output.value = '';
      ui.copyBtn.style.display = 'none';
      ui.countdown.style.display = 'none';
    }
  }, 1000);
}