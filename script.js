// SPA router
const PGS = ['home','vehicles','hs','member'];

function go(page, sub) {
  PGS.forEach(p => $('#pg-'+p).removeClass('on'));
  $('#pg-'+page).addClass('on');
  window.scrollTo(0,0);
  $('#bb,#vtabs,#htabs').removeClass('on');
  if (page==='vehicles') { $('#bb,#vtabs').addClass('on'); sv(sub||'v0'); }
  else if (page==='hs')  { $('#bb,#htabs').addClass('on'); sh(sub||'hs0'); }
  // Close Bootstrap Offcanvas mobile menu via Bootstrap JS API
  var mmEl = document.getElementById('mm');
  var mmInstance = bootstrap.Offcanvas.getInstance(mmEl);
  if (mmInstance) mmInstance.hide();
}

// Vehicle sub-page switcher
function sv(w) {
  ['v0','v1','v2','v3'].forEach(v => {
    $('#'+v).toggle(v===w);
    $('#t-'+v).toggleClass('on', v===w);
  });
}

// Human spaceflight sub-page switcher
function sh(w) {
  ['hs0','hs1'].forEach(s => {
    $('#'+s).toggle(s===w);
    $('#t-'+s).toggleClass('on', s===w);
  });
}

// simple email regex check
function validEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

// navbar scroll tint
$(window).on('scroll', function() {
  $('#nb').toggleClass('dark', $(window).scrollTop() > 50);
});

// main jQuery ready
$(function() {

  // contact panel
  var cpOpen = false;
  function openCP()  { $('#cp').addClass('on');    cpOpen = true;  }
  function closeCP() { $('#cp').removeClass('on'); cpOpen = false; }

  $('#cp-x').on('click', closeCP);
  $(document).on('click', function(e) {
    if (cpOpen && !$(e.target).closest('#cp,#pb').length) closeCP();
  });

  // Plane fly animation — jQuery .animate() + .offset() + .fadeOut()
  $('#pb').on('click', function() {
    if (cpOpen) { closeCP(); return; }
    var $b = $('#pb'), $p = $('#fp');
    var o  = $b.offset();
    var sx = o.left + $b.outerWidth()/2  - 15;
    var sy = o.top  + $b.outerHeight()/2 - 15;
    var ex = $(window).width()  - 55;
    var ey = $(window).height() / 2 - 15;
    var mx = (sx + ex) / 2;
    var my = Math.min(sy, ey) - 115;

    $p.css({ left: sx, top: sy, display: 'block' });
    $p.find('svg').css('transform', 'rotate(-40deg)');

    $p.animate({ left: mx, top: my }, {
      duration: 400, easing: 'swing',
      complete: function() {
        $p.find('svg').css('transform', 'rotate(0deg)');
        $p.animate({ left: ex, top: ey }, {
          duration: 400, easing: 'swing',
          complete: function() { $p.fadeOut(180); openCP(); }
        });
      }
    });
  });

  // Contact form — real-time error clearing
  $('#cf-n').on('input', function() { if ($(this).val().trim())      $('#e-n').removeClass('on'); });
  $('#cf-e').on('input', function() { if (validEmail($(this).val())) $('#e-e').removeClass('on'); });
  $('#cf-m').on('input', function() { if ($(this).val().trim())      $('#e-m').removeClass('on'); });

  // Contact form — submit with validation + SweetAlert2
  $('#cf').on('submit', function(e) {
    e.preventDefault();
    var n  = $('#cf-n').val().trim();
    var em = $('#cf-e').val().trim();
    var s  = $('#cf-s').val();
    var m  = $('#cf-m').val().trim();
    var ok = true;

    if (!n)              { $('#e-n').addClass('on'); ok = false; } else $('#e-n').removeClass('on');
    if (!validEmail(em)) { $('#e-e').addClass('on'); ok = false; } else $('#e-e').removeClass('on');
    if (!s)              { $('#e-s').addClass('on'); ok = false; } else $('#e-s').removeClass('on');
    if (!m)              { $('#e-m').addClass('on'); ok = false; } else $('#e-m').removeClass('on');
    if (!ok) return;

    $('#cf')[0].reset();
    $('#cs-d').text('Select a topic').removeClass('sel');
    $('#cs .cs-opt').removeClass('on');
    $('#cf-s').val('');
    closeCP();

    Swal.fire({
      title: 'Transmission Sent!',
      text:  'The SpaceX team will be in touch shortly.',
      icon:  'success',
      confirmButtonText: 'THANK YOU',
      background: 'rgba(0,0,0,0.15)',
      color: '#ffffff',
      confirmButtonColor: 'transparent',
      customClass: { confirmButton: 'sw-btn', popup: 'sw-pop' }
    });
  });

  // Contact dropdown — scoped to #cs
  $('#cs').on('click', function(e) {
    e.stopPropagation();
    $(this).toggleClass('open');
  });
  $('#cs .cs-opt').on('click', function(e) {
    e.stopPropagation();
    $('#cf-s').val($(this).data('value'));
    $('#cs-d').text($(this).text()).addClass('sel');
    $('#cs .cs-opt').removeClass('on');
    $(this).addClass('on');
    $('#cs').removeClass('open');
    $('#e-s').removeClass('on');
  });

    // membership side panel (opened from the ufo icon)
  var mpOpen = false;
  function openMP()  { $('#mp').addClass('on');    mpOpen = true;  }
  function closeMP() { $('#mp').removeClass('on'); mpOpen = false; }

  window.resetMP = function() {
    $('#mp-step2').hide();
    $('#mp-step1').show();
    $('#mf')[0].reset();
    $('#mcs-d').text('Select your domain').removeClass('sel');
    $('#mcs .cs-opt').removeClass('on');
    $('#mf-d').val('');
  };

  $('#mp-x').on('click', closeMP);
  $(document).on('click', function(e) {
if (mpOpen && !$(e.target).closest('#mp,#ufo-nav-btn').length) closeMP();  });

  // Membership panel dropdown — scoped to #mcs
  $('#mcs').on('click', function(e) {
    e.stopPropagation();
    $(this).toggleClass('open');
  });
  $('#mcs .cs-opt').on('click', function(e) {
    e.stopPropagation();
    $('#mf-d').val($(this).data('value'));
    $('#mcs-d').text($(this).text()).addClass('sel');
    $('#mcs .cs-opt').removeClass('on');
    $(this).addClass('on');
    $('#mcs').removeClass('open');
    $('#me-d').removeClass('on');
  });

  // Membership panel — real-time clearing
  $('#mf-n').on('input', function() { if ($(this).val().trim())      $('#me-n').removeClass('on'); });
  $('#mf-e').on('input', function() { if (validEmail($(this).val())) $('#me-e').removeClass('on'); });
  $('#mf-m').on('input', function() { if ($(this).val().trim())      $('#me-m').removeClass('on'); });
  $('#mf-l').on('input', function() { if ($(this).val().trim())      $('#me-l').removeClass('on'); });

  // Membership panel — form submit with fadeOut/fadeIn transition
  $('#mf').on('submit', function(e) {
    e.preventDefault();
    var n  = $('#mf-n').val().trim();
    var em = $('#mf-e').val().trim();
    var d  = $('#mf-d').val();
    var m  = $('#mf-m').val().trim();
    var l  = $('#mf-l').val().trim();
    var ok = true;

    if (!n)              { $('#me-n').addClass('on'); ok = false; } else $('#me-n').removeClass('on');
    if (!validEmail(em)) { $('#me-e').addClass('on'); ok = false; } else $('#me-e').removeClass('on');
    if (!d)              { $('#me-d').addClass('on'); ok = false; } else $('#me-d').removeClass('on');
    if (!m)              { $('#me-m').addClass('on'); ok = false; } else $('#me-m').removeClass('on');
    if (!l)              { $('#me-l').addClass('on'); ok = false; } else $('#me-l').removeClass('on');
    if (!ok) return;

    $('#mp-step1').fadeOut(300, function() {
      $('#mp-step2').fadeIn(400);
    });
  });

  // Close all dropdowns on outside click
  $(document).on('click', function() {
    $('#cs,#mcs,#mem-cs,#mem-domain-cs,#wf-domain-cs').removeClass('open');
  });

    // membership page forms (signup + signin)

  // Toggle signup ↔ signin using jQuery fadeOut/fadeIn
  $('#mem-signin-toggle').on('click', function() {
    $('#mem-card-signup').fadeOut(200, function() {
      $('#mem-card-signin').fadeIn(250);
    });
  });
  $('#mem-back-toggle').on('click', function() {
    $('#mem-card-signin').fadeOut(200, function() {
      $('#mem-card-signup').fadeIn(250);
    });
  });

  // Country dropdown on membership page
  $('#mem-cs').on('click', function(e) {
    e.stopPropagation();
    $(this).toggleClass('open');
  });
  $('#mem-cs .cs-opt').on('click', function(e) {
    e.stopPropagation();
    $('#mem-c').val($(this).data('value'));
    $('#mem-cs-d').text($(this).text()).addClass('sel');
    $('#mem-cs .cs-opt').removeClass('on');
    $(this).addClass('on');
    $('#mem-cs').removeClass('open');
    $('#mem-ec').removeClass('on');
  });

  // Step 1 → Step 2 transition
$('#mem-next-btn').on('click', function() {
  var n  = $('#mem-n').val().trim();
  var em = $('#mem-e').val().trim();
  var p  = $('#mem-p').val();
  var c  = $('#mem-c').val();
  var ok = true;

  if (!n)              { $('#mem-en').addClass('on'); ok=false; } else $('#mem-en').removeClass('on');
  if (!validEmail(em)) { $('#mem-ee').addClass('on'); ok=false; } else $('#mem-ee').removeClass('on');
  if (p.length < 6)    { $('#mem-ep').addClass('on'); ok=false; } else $('#mem-ep').removeClass('on');
  if (!c)              { $('#mem-ec').addClass('on'); ok=false; } else $('#mem-ec').removeClass('on');
  if (!ok) return;

  $('#mem-step1').fadeOut(250, function() {
    $('#mem-step2').fadeIn(300);
  });
});

// Back button Step 2 → Step 1
$('#mem-back-btn').on('click', function() {
  $('#mem-step2').fadeOut(200, function() {
    $('#mem-step1').fadeIn(250);
  });
});

// Domain dropdown on step 2
$('#mem-domain-cs').on('click', function(e) {
  e.stopPropagation();
  $(this).toggleClass('open');
});
$('#mem-domain-cs .cs-opt').on('click', function(e) {
  e.stopPropagation();
  $('#mem-domain').val($(this).data('value'));
  $('#mem-domain-d').text($(this).text()).addClass('sel');
  $('#mem-domain-cs .cs-opt').removeClass('on');
  $(this).addClass('on');
  $('#mem-domain-cs').removeClass('open');
  $('#mem-edomain').removeClass('on');
});

// Real-time clearing step 1
$('#mem-n').on('input', function() { if($(this).val().trim())      $('#mem-en').removeClass('on'); });
$('#mem-e').on('input', function() { if(validEmail($(this).val())) $('#mem-ee').removeClass('on'); });
$('#mem-p').on('input', function() { if($(this).val().length >= 6) $('#mem-ep').removeClass('on'); });

// Real-time clearing step 2
$('#mem-contrib').on('input', function() { if($(this).val().trim().length >= 30) $('#mem-econtrib').removeClass('on'); });
$('#mem-url').on('input',     function() { if($(this).val().trim())              $('#mem-eurl').removeClass('on'); });

// Final submit — step 2 validation → pending verification state
$('#memf').on('submit', function(e) {
  e.preventDefault();
  var domain  = $('#mem-domain').val();
  var contrib = $('#mem-contrib').val().trim();
  var url     = $('#mem-url').val().trim();
  var ok = true;

  if (!domain)           { $('#mem-edomain').addClass('on');  ok=false; } else $('#mem-edomain').removeClass('on');
  if (contrib.length<30) { $('#mem-econtrib').addClass('on'); ok=false; } else $('#mem-econtrib').removeClass('on');
  if (!url)              { $('#mem-eurl').addClass('on');      ok=false; } else $('#mem-eurl').removeClass('on');
  if (!ok) return;

  $('#mem-card-signup').fadeOut(300, function() {
    $('#mem-success').fadeIn(400);
  });
});

  // Membership page signin — real-time clearing
  $('#sin-e').on('input', function() { if (validEmail($(this).val())) $('#sin-ee').removeClass('on'); });

  // Membership page signin submit
  $('#sinf').on('submit', function(e) {
    e.preventDefault();
    var em = $('#sin-e').val().trim();
    var p  = $('#sin-p').val();
    var ok = true;

    if (!validEmail(em)) { $('#sin-ee').addClass('on'); ok = false; } else $('#sin-ee').removeClass('on');
    if (!p)              { $('#sin-ep').addClass('on'); ok = false; } else $('#sin-ep').removeClass('on');
    if (!ok) return;

    $('#mem-card-signin').fadeOut(300, function() {
      $('#mem-welcome').fadeIn(400);
    });
  });

  // Welcome card — domain dropdown
  $('#wf-domain-cs').on('click', function(e) {
    e.stopPropagation();
    $(this).toggleClass('open');
  });
  $('#wf-domain-cs .cs-opt').on('click', function(e) {
    e.stopPropagation();
    $('#wf-domain').val($(this).data('value'));
    $('#wf-domain-d').text($(this).text()).addClass('sel');
    $('#wf-domain-cs .cs-opt').removeClass('on');
    $(this).addClass('on');
    $('#wf-domain-cs').removeClass('open');
    $('#wf-edomain').removeClass('on');
  });

  // Welcome card — real-time clearing
  $('#wf-contrib').on('input', function() { if ($(this).val().trim().length >= 30) $('#wf-econtrib').removeClass('on'); });

  // Welcome card — contribute form submit
  $('#wf').on('submit', function(e) {
    e.preventDefault();
    var domain  = $('#wf-domain').val();
    var contrib = $('#wf-contrib').val().trim();
    var ok = true;

    if (!domain)           { $('#wf-edomain').addClass('on');  ok = false; } else $('#wf-edomain').removeClass('on');
    if (contrib.length<30) { $('#wf-econtrib').addClass('on'); ok = false; } else $('#wf-econtrib').removeClass('on');
    if (!ok) return;

    $('#wf')[0].reset();
    $('#wf-domain-d').text('Field of Expertise').removeClass('sel');
    $('#wf-domain-cs .cs-opt').removeClass('on');

    Swal.fire({
      title: 'Contribution Received',
      text:  'Thank you, Citizen. The SpaceX team will review your submission.',
      icon:  'success',
      confirmButtonText: 'GOT IT',
      background: 'rgba(0,0,0,0.15)',
      color: '#ffffff',
      confirmButtonColor: 'transparent',
      customClass: { confirmButton: 'sw-btn', popup: 'sw-pop' }
    });
  });
// Mobile UFO click — navigate to member page (offcanvas auto-closes via go())
$('.ufo-nav-mobile').on('click', function() {
  go('member');
});
}); // end $(function)

// resetMP is called from an inline onclick so it has to sit outside $(function)