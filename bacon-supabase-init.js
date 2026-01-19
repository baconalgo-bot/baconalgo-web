// 🥓 BACON SUPABASE - COMPLETE VERSION
(function() {
  if (typeof window.supabase === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.onload = function() {
      window.supabase = window.supabase.createClient(
        'https://vnscwjgaboiefxjlosbp.supabase.co',
        'sb_publishable_0w0MQ6806XKHviOHgVKmfA_eE98keEZ'
      );
      console.log('✅ SUPABASE READY!');
      window.supabaseReady = true;
      document.dispatchEvent(new CustomEvent('supabaseReady'));
    };
    document.head.appendChild(script);
  } else {
    console.log('⚠️ Supabase already loaded globally');
    window.supabaseReady = true;
  }
})();
