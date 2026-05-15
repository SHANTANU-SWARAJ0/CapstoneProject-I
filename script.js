// ─── 1. MOBILE NAV ───────────────────────────────
    document.getElementById('menuBtn').addEventListener('click', function() {
      document.getElementById('navLinks').classList.toggle('open');
    });
    document.querySelectorAll('.nav-links a').forEach(function(a) {
      a.addEventListener('click', function() {
        document.getElementById('navLinks').classList.remove('open');
      });
    });

    // ─── 2. AUTO-SHOW LOGO IF SRC IS SET ─────────────
    var li = document.getElementById('logoImg');
    if (li && li.getAttribute('src')) {
      li.style.display = 'block';
      document.getElementById('logoFallback').style.display = 'none';
    }

    // ─── 3. AUTO-SHOW MEMBER PHOTOS IF SRC IS SET ────
    document.querySelectorAll('.m-img').forEach(function(img) {
      if (img.getAttribute('src')) {
        img.style.display = 'block';
        img.parentElement.querySelector('.photo-ph').style.display = 'none';
      }
    });

    // ─── 4. SCROLL REVEAL ────────────────────────────
    new IntersectionObserver(function(entries) {
      entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12 }).observe
    // observe all .reveal elements
    ;(function() {
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('visible'); });
      }, { threshold: 0.12 });
      document.querySelectorAll('.reveal').forEach(function(el) { obs.observe(el); });
    })();

    // ─── 5. PASSWORD SHOW/HIDE ────────────────────────
    var pwInput = document.getElementById('pwInput');
    document.getElementById('pwToggle').addEventListener('click', function() {
      var shown = pwInput.type === 'text';
      pwInput.type = shown ? 'password' : 'text';
      document.getElementById('eyeIcon').className = shown ? 'fas fa-eye' : 'fas fa-eye-slash';
    });
    pwInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') checkPassword(); });
    pwInput.addEventListener('input',   function()  { if (pwInput.value) checkPassword(); });

    // ─── 6. PASSWORD STRENGTH ENGINE ─────────────────
    // (JavaScript port of the Python logic above)
    function checkPassword() {
      var pw = pwInput.value;
      if (!pw) return;

      var rules = [
        { label:'Length (12+ chars)',      detail:pw.length + ' characters',           pass: pw.length >= 12 },
        { label:'Uppercase Letters',       detail:'A–Z present',                        pass: /[A-Z]/.test(pw) },
        { label:'Lowercase Letters',       detail:'a–z present',                        pass: /[a-z]/.test(pw) },
        { label:'Numbers',                 detail:'0–9 present',                        pass: /[0-9]/.test(pw) },
        { label:'Special Characters',      detail:'!@#$%... present',                   pass: /[^a-zA-Z0-9]/.test(pw) },
        { label:'No Common Patterns',      detail:'password, 123456, qwerty…',          pass: !/(123456|password|qwerty|abc123|letmein|admin)/i.test(pw) },
        { label:'No Repeating Characters', detail:'e.g. aaa, 111',                      pass: !/(.)(\1{2,})/.test(pw) },
        { label:'No Keyboard Walks',       detail:'asdf, zxcv, qwer…',                 pass: !/(asdf|zxcv|qwer|uiop)/i.test(pw) }
      ];

      var score = 0;
      rules.forEach(function(r) { if (r.pass) score += 12.5; });
      if (pw.length >= 16) score = Math.min(100, score + 5);
      if (pw.length >= 20) score = Math.min(100, score + 5);
      score = Math.round(score);

      var level, color;
      if      (score >= 90) { level = 'VERY STRONG'; color = 'var(--green)';  }
      else if (score >= 70) { level = 'STRONG';       color = '#7dd3a8';       }
      else if (score >= 50) { level = 'MEDIUM';        color = 'var(--yellow)';}
      else if (score >= 30) { level = 'WEAK';          color = 'var(--orange)';}
      else                  { level = 'VERY WEAK';     color = 'var(--red)';   }

      var lbl = document.getElementById('strengthLabel');
      lbl.textContent = level;
      lbl.style.color = color;

      var barColors = ['var(--red)','var(--orange)','var(--yellow)','#7dd3a8','var(--green)'];
      var activeBars = Math.ceil(score / 20);
      for (var i = 1; i <= 5; i++) {
        var bar = document.getElementById('b' + i);
        if (i <= activeBars) {
          bar.style.background  = barColors[activeBars - 1];
          bar.style.boxShadow   = '0 0 8px ' + barColors[activeBars - 1];
        } else {
          bar.style.background = 'rgba(255,255,255,0.06)';
          bar.style.boxShadow  = 'none';
        }
      }

      var grid = document.getElementById('resultsGrid');
      grid.style.display = 'grid';
      grid.innerHTML = '';
      rules.forEach(function(r) {
        var c = document.createElement('div');
        c.className = 'result-card ' + (r.pass ? 'pass' : 'fail');
        c.innerHTML =
          '<div class="result-icon ' + (r.pass?'pass':'fail') + '"><i class="fas ' + (r.pass?'fa-check':'fa-xmark') + '"></i></div>' +
          '<div class="result-text"><strong>' + r.label + '</strong><small>' + r.detail + '</small></div>';
        grid.appendChild(c);
      });

      var tips = [];
      if (pw.length < 12)                tips.push('Make it at least 12 characters long');
      if (!/[A-Z]/.test(pw))             tips.push('Add at least one uppercase letter (A–Z)');
      if (!/[0-9]/.test(pw))             tips.push('Include at least one number (0–9)');
      if (!/[^a-zA-Z0-9]/.test(pw))      tips.push('Add special characters like !@#$%^&*');
      if (/(123456|password|qwerty)/i.test(pw)) tips.push('Avoid common words or keyboard patterns');
      if (pw.length < 16)                tips.push('Going beyond 16 characters increases security significantly');
      tips.push('Consider a passphrase: 4 random words joined together');

      var tipsBox  = document.getElementById('tipsBox');
      var tipsList = document.getElementById('tipsList');
      tipsBox.style.display = 'block';
      tipsList.innerHTML = tips.map(function(t) {
        return '<li><i class="fas fa-arrow-right"></i> ' + t + '</li>';
      }).join('');
    }

    // ─── 7. COPY PYTHON CODE ──────────────────────────
    function copyCode() {
      navigator.clipboard.writeText(document.getElementById('codeBlock').innerText).then(function() {
        var btn = document.querySelector('.copy-btn');
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        btn.style.color = 'var(--green)';
        setTimeout(function() { btn.innerHTML = '<i class="fas fa-copy"></i> Copy'; btn.style.color = ''; }, 2000);
      });
    }
