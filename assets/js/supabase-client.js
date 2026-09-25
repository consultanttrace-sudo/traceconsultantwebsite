// TRACE Consultant — Supabase client
// Reads connection details from window.TRACE_CONFIG (see assets/js/config.js).
// Loaded after the Supabase CDN script and before main.js / blog scripts.
(function () {
  const cfg = window.TRACE_CONFIG || {};
  if (!cfg.supabaseUrl || !cfg.supabaseAnonKey || cfg.supabaseUrl.includes('YOUR-PROJECT')) {
    console.warn('[TRACE] Supabase belum dikonfigurasi — isi assets/js/config.js dengan URL & anon key project kamu.');
    window.traceSupabase = null;
    return;
  }
  const { createClient } = supabase; // global `supabase` comes from the CDN script
  window.traceSupabase = createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
})();

// ---- Blog helpers, shared by blog.html and blog-post.html ----
window.traceBlog = {
  async listPosts() {
    if (!window.traceSupabase) return { data: [], error: new Error('Supabase not configured') };
    return window.traceSupabase
      .from('posts')
      .select('slug,title,excerpt,cover_image_url,published_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false });
  },
  async getPost(slug) {
    if (!window.traceSupabase) return { data: null, error: new Error('Supabase not configured') };
    return window.traceSupabase
      .from('posts')
      .select('slug,title,excerpt,cover_image_url,published_at,body_html')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();
  },
};
