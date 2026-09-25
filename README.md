# TRACE Consultant — Website

Static site (HTML/CSS/JS, no build step) + Supabase for the blog and contact form.
Motion language reconstructed from the MachinaFusion reference video; brand
colors/type/logo pulled from the existing TRACE OS design tokens.

## 1. Deploy to Netlify

**Fastest way (no GitHub needed):** go to https://app.netlify.com/drop and drag
the whole `trace-site` folder in. Done — you get a live URL immediately.

**With GitHub (recommended once you're iterating often):**
```
cd trace-site
git init
git add .
git commit -m "TRACE Consultant website"
git remote add origin <your-empty-github-repo-url>
git push -u origin main
```
Then in Netlify: **Add new site → Import an existing project → GitHub** → pick
the repo. Build command: leave empty. Publish directory: `.` (already set in
`netlify.toml`).

## 2. Set up Supabase (blog + contact form)

1. Create a project at https://supabase.com (or reuse one, like your Budsky/Cryptobot project, if you'd rather keep everything in one place).
2. Open **SQL Editor → New query**, paste the contents of `supabase/schema.sql`, run it.
   This creates two tables: `posts` (blog) and `leads` (contact form), with
   Row Level Security already locked down (public can read published posts and
   submit leads, but can't read other people's leads).
3. Go to **Project Settings → API**, copy the **Project URL** and **anon public key**.
4. Paste them into `assets/js/config.js`:
   ```js
   window.TRACE_CONFIG = {
     supabaseUrl: "https://xxxxx.supabase.co",
     supabaseAnonKey: "eyJ...",
   };
   ```
5. Redeploy (or just refresh if you're testing locally / already deployed with
   auto-deploy from GitHub).

**Writing a blog post:** open Supabase → Table Editor → `posts` → Insert row.
Fill `slug` (used in the URL, e.g. `menu-makin-banyak`), `title`, `excerpt`,
`body_html` (plain HTML — paragraphs, `<h2>`, `<img>` all work), and flip
`is_published` to `true`. It appears on `/blog.html` immediately, no redeploy
needed.

**Reading leads:** Supabase → Table Editor → `leads`. (Not readable from the
public site on purpose — only from the dashboard, or with the service role key
if you build an internal view later.)

## 3. Things left as placeholders — replace before launch

- **Stats numbers** in `index.html` (`40+`, `Rp1,2M+`, `90 hari`) are
  illustrative, not real figures. Search for `stats wrap` in `index.html`.
- **Contact details** — email, WhatsApp number, Instagram handle — are
  placeholders in the closing section of `index.html`.
- **Hero visual** — the reference used real photography (a hand reaching into
  frame). Since there was no TRACE photography to reuse, I substituted an
  abstract "receipt vs. clarity" visual pair that carries the same motion
  (drifts in from both edges, meets near centre, drifts back) rather than
  copying the reference's imagery. Swap in real photos of your team or client
  sites later if you want — the animation keyframes will still work with an
  `<img>` in place of `.receipt-card` / `.badge-orb`.
- **Insight gallery cards** reuse three hooks from your Instagram. Swap in
  whichever are performing best at the time, or wire this section to Supabase
  too later if you want it to rotate automatically.
- The dark "belief" section uses a drawn line-chart illustration instead of a
  product photo, since TRACE doesn't have an equivalent to the reference's
  robotic-arm shot.

## 4. What was and wasn't matched from the reference video

**Reconstructed:** floating rounded card layout, sticky pill nav, 2-tone
serif headline pattern, ambient hero loop (two elements drifting to centre
and back), full-bleed dark section transition, 3-row stats with decorative
slider track, stack→fan card gallery on scroll, continuous marquee headline
with a fixed reveal-mask (grey → ink) as it scrolls through centre screen.

**Not verifiable from a 23-second clip, so approximated:** exact animation
durations/easing (I used consistent values in the 700–1600ms range with a
custom `cubic-bezier(.2,.7,.3,1)` rather than the reference's exact timing),
a real footer (the video ends inside the closing section, no footer was ever
shown), and hover/focus states (none appeared in the recording).

**Deliberately not copied:** the reference's literal imagery (human/robot
hands, robotic arm, tech photography) and its grey/monochrome palette — swapped
for TRACE's own colors, type, and content per the brief.

## 5. Local preview

No build step — just open `index.html` in a browser, or run a tiny local
server so `fetch`/module behavior matches production:
```
npx serve trace-site
```

## 6. v2 changes
Nav sticky fixed, hero recomposed (centered, objects enter from frame edges), full-bleed larger marquee, stats count-up + pill track, Inter display type,
name -> TRACE Business Consultants, real contact/address, stats replaced with facts about the offer, pricing = 3 decided packages (price revealed on click).
Still needs real assets: hero imagery, cinematic dark-section photo, 5 vertical images for the fan. Instagram handle removed until a real one exists.

## 7. v3 changes
Palette -> Teal Ledger + Saffron (tokens.css). Visuals made in code (no photos): torn-receipt + frosted-glass hero objects, generative dark scene, 5 typographic fan cards, T-R-A-C-E lens row, WhatsApp/Instagram/TikTok links (@traceconsultant).
Fan cards 4-5 copy is new: review it. Swap in AI/photo assets later without changing structure (see handoff prompt).

## v4 — 3D hero + kipas scrub + slot foto
- `assets/js/hero3d.js` (module, Three.js r160 di `assets/js/vendor/`): orb kaca iridescent, struk 3D, kartu kaca "Diagnosis", env map procedural, loop 9 detik, paralaks pointer. Berhenti saat tidak terlihat / tab tersembunyi; `prefers-reduced-motion` = 1 frame; layar <760px = orb saja; WebGL gagal = visual CSS v3 tetap tampil.
- Kipas kartu terikat scroll (`--p` diset di `main.js`), kilau mengikuti pointer.
- Section gelap `min-height:100svh`, glow teal + border tipis saat masuk layar.
- **Foto drop-in** di `assets/img/photo/` (otomatis terpakai bila ada, tanpa ubah kode): `hero-left.webp`, `hero-right.webp` (transparan), `dark-scene.webp`, `fan-1.webp` … `fan-5.webp`. Target ukuran: hero <300 KB, lainnya <150 KB.

## v5 — section gelap 3D
- `assets/js/dark3d.js` (Three.js r160, modul terpisah): printer matte + struk melengkung keluar dari slot teal, debu/bokeh, kabut, kamera dolly & panjang struk terikat progres scroll. Berhenti saat tidak terlihat / tab tersembunyi; `prefers-reduced-motion` = 1 frame; WebGL gagal = adegan CSS v3.
- Kalau `assets/img/photo/dark-scene.webp` ada, adegan 3D tidak dijalankan (foto dipakai).
- Section gelap kini `100svh` juga di HP. Prompt gambar untuk semua slot foto: `assets/img/photo/PROMPTS.md`.
- Catatan: 404 di console = slot foto yang belum diisi (normal).

## v5.1 — kipas di HP
- ≤760px: kartu menumpuk lalu membuka seperti kipas mengikuti scroll (`--p` dari `main.js`), kartu tengah di atas dengan teks terbaca; ketuk kartu lain untuk membawanya ke depan. Desktop tidak berubah.

## v6 (tahap 1 dari 2)
- Baru: section Metode (lensa interaktif), Ritme Kerja (2×/minggu), Ekosistem (hub 8 layanan, 3 pilar), Alur Uang (ilustrasi), matriks layanan × paket.
- Matriks dan lensa dibaca dari `window.TRACE_PAKET` di `assets/js/config.js`; geser layanan antarpaket cukup ubah nilainya. Susunan Paket 1 = usulan, perlu konfirmasi.
- `assets/js/v6.js` baru (kecil); CSS v6 di akhir `style.css`. `hero3d.js` dan `dark3d.js` tidak disentuh.
- Tahap 2: Tentang, detail 7 layanan (visual CSS/HTML), Simulasi (3 pola, tanpa angka), FAQ, form "Kebutuhan" (awalan `[Kebutuhan: ...]`, juga via `?kebutuhan=`), tombol WhatsApp per layanan, prompt foto baru.
- Tahap 2 selesai (lihat blok v6 final).

## v6 final
- Ritme selang-seling: terang / tint / gelap (Ritme dan Alur Uang memakai band gelap CSS, tanpa WebGL baru). Body 17px HP / 18px desktop, line-height 1.65, teks maks 66ch, jarak section 96-128px.
- Ritme kerja kini HTML (bukan SVG 700px): ketuk Kunjungan 1/2/laporan untuk isi pengecekan (draf), garis waktu 3/6/12 bulan. Hub 9 layanan (termasuk Rebranding tempat) + pusat "Kunjungan 2x/minggu" + legenda pilar.
- Ikon: sprite SVG inline di awal `index.html` (`#i-...`, stroke 1.75). Diagram baru: lensa 5 titik, loop FYP, alur langkah (supplier/tempat/KOL), slider sebelum/sesudah (input range), strip Hook-Isi-Ajakan, sumbu + gambar-garis di Simulasi, alur uang beranimasi.
- Matriks: baris "Lama pendampingan" dari `config.js` (`t: [...]`); layanan yang tidak termasuk ditulis "tidak". Teaser blog di Insight (tersembunyi bila kosong).
- Font: Newsreader dihapus; Google Fonts dimuat lewat `<link>` (bukan @import). Merah/beige lama diganti amber/abu.
- Draf yang perlu dicek pemilik: teks "apa yang dicek" di Ritme, contoh Hook/Isi/Ajakan, susunan Paket 1.

## v7 (perubahan dari v6)
- Catatan "susunan Paket 1 masih usulan" hanya muncul di pratinjau (`/?draf=1`) selama `perluKonfirmasi: true` di `config.js`. Set `false` setelah Paket 1 kamu konfirmasi.
- Form kontak: bila Supabase belum diisi atau gagal, pesan dibuka di WhatsApp (nomor di `config.js` → `whatsapp`).
- `index.html`: canonical, Open Graph/Twitter, theme-color, JSON-LD LocalBusiness. Ganti `https://traceconsultant.netlify.app` bila memakai domain sendiri. Gambar share: `assets/img/og-image.png` (1200×630).
- Detail layanan jadi accordion (satu terbuka); bagian Tentang/Insight diringkas.
- Polish lomba: hero 3D punya intro (orb membesar, struk dan kartu masuk dari tepi) lalu terikat scroll (kamera mendekat, orb berputar, struk/kartu menyingkir); kartu paket miring 3D CSS mengikuti pointer (mouse saja); skip link. Tidak ada scene WebGL baru; reduced-motion = statis.
- Efek visual lomba (di scene hero yang sama, tanpa canvas baru): struk larut dengan tepi amber menyala mengikuti scroll (shader disolusi); bidang kontur "buku besar" garis teal beriak dan menyorot amber di sekitar pointer. Mengganti model 3D = ubah blok orb/struk/kartu di `hero3d.js`.
- Poles copy (bahasa tetap Indonesia): suara konsisten kamu/kami, hero, Kenapa TRACE, Tentang, lead tiap section, kartu kipas, deskripsi paket, FAQ, penutup, placeholder form, meta description. Klaim "hampir semua resto" dilunakkan jadi "banyak"; tetap tanpa angka klien/testimoni/janji viral.
- Partikel hero: saat scroll, struk larut jadi ~2600 partikel (1400 di HP) yang terbang menyusun grafik batang teal dengan batang terakhir amber (GPU, satu draw call). Canvas bergerak setengah kecepatan scroll agar grafik sempat terbaca. Morph ke logo TC belum ada.
- Tanpa foto: semua slot foto (hero, adegan gelap, kipas, layanan) dihapus; folder `assets/img/photo/` dan prompt fotonya dibuang. Hero dan adegan gelap memakai WebGL, kartu kipas memakai ilustrasi garis SVG (kopi/HPP, tujuh kesalahan, menu, struk kasir, stok). Bagian README lama tentang foto drop-in sudah tidak berlaku.
- Ronde 3: preloader CSS murni (auto-hilang 2,1 dtk, tanpa JS); kursor lensa (mouse saja, kursor asli tetap terlihat); `assets/js/morph.js` = partikel 2D menyusun logo TC di atas form kontak saat masuk layar (menolak pointer, reduced-motion = statis, gagal muat = canvas dibuang). Intro hero 3D ditunda 1,1 dtk agar pas dengan preloader.
- v7.4: diagram Metode punya lensa kaca (gradien, kilau, ring amber) yang meluncur pegas ke titik T/R/A/C/E yang dipilih; titik aktif membesar di bawah kaca; diagram miring 3D mengikuti mouse (desktop, bukan reduced-motion).
- v7.5: band gelap (Ritme, Alur Uang) punya cahaya teal yang mengikuti pointer + lantai grid perspektif (bergerak hanya di desktop); garis progres scroll teal→amber; tombol utama menarik halus ke pointer; warna seleksi amber; modulepreload untuk Three.js.
- v7.6 (exhibition): (1) hero: judul naik per kata dari balik topeng setelah preloader; (2) transisi: band gelap naik seperti lembar (sudut membulat, skala 0,94 -> 1) lewat scroll-driven CSS, hanya di browser yang mendukung; (3) reveal: semua judul section memakai topeng kata; (4) 3D interaktif: hero, lensa kaca Metode, kartu paket; (5) image treatment: grain film halus di hero dan band gelap + glow amber pada ilustrasi kipas; (6) micro-interaction: tombol menekan (scale), tombol magnet, getar 8 ms saat ketuk di Android; (7) performa HP: kelas `lite` otomatis (CPU <=4 inti, RAM <=4 GB, atau hemat data) + governor FPS di hero (turun ke DPR 1 bila rata-rata >26 ms/frame), partikel 900 di mode lite, grain/grid animasi/sheet dimatikan.
- v7.7 (Thread): signature visual baru `assets/js/thread.js` (vanilla, canvas 2D kecil, tanpa dependensi): "benang jejak" di tepi layar = peta seluruh halaman. Benang digambar dari intro (setelah preloader), kepala amber mengikuti scroll, simpul tiap section menyala saat terlewati (label section aktif di desktop), benang menegang/melengkung mengikuti kecepatan scroll (pegas), ditarik pointer (mouse), dan menutup jadi cincin berdenyut di Kontak. Judul section/hero miring halus mengikuti kecepatan scroll (`--sk`). Mati otomatis saat idle; `prefers-reduced-motion` = garis statis tanpa fisika; mode `lite` = titik lebih sedikit, tanpa glow/label. `window.__traceV` = kecepatan scroll (px/ms) untuk dipakai modul 3D berikutnya.

## v7.8–v8 (dicatat belakangan, dibaca dari kode)
- Dua foto kembali dipakai: `assets/img/photo/hero-plate.webp` (hero, larut lewat shader displacement di `transition.js`) dan `dapur-01.webp` (bagian Insight, terbuka lewat clip). Bagian v7 yang bilang "tanpa foto" sudah tidak berlaku.
- `orb-live.js`: orb pendamping (desktop, bukan lite) berubah teal → amber mengikuti scroll. `motion.js`: koreografi scroll (mask, judul bergeser, kursor berhirarki, mouse saja).

## v9 (dari v8-deploy)
- **Kolofon** (`<aside id="kolofon">` sebelum footer + `assets/js/kolofon.js`): palet yang bisa disalin per klik, huruf, dan teknik yang dipakai. Sengaja `<aside>`, bukan `<section>`, agar Thread tidak menambah simpul baru. Tautan "Kolofon" ada di footer.
- **Perbaikan cache**: `netlify.toml` sebelumnya memberi `immutable` setahun ke semua `/assets/*`, padahal nama file tidak di-hash, jadi perubahan `config.js` (kunci Supabase), `style.css`, atau foto tidak akan terlihat oleh pengunjung lama. Kini hanya `vendor/` (Three.js r160) yang immutable, sisanya revalidasi otomatis. Ditambah header keamanan dasar.
- `404.html` ("jejak berhenti di sini"), `robots.txt`, `sitemap.xml` (ganti domain bila tidak memakai traceconsultant.netlify.app).
- Belum diuji di browser: hanya cek sintaks JS dan struktur file.

## v10 (dari v9)
- **Kolofon jadi "color lab"**: klik swatch, kode tersalin dan panel terisi warna itu dari titik klik (`clip-path`, teks otomatis memilih kontras tertinggi). Klik Ink untuk kembali ke gelap. Logika `assets/js/kolofon.js`, gaya di akhir `style.css`.
- **Transisi antar halaman** (`@view-transition` di `tokens.css`): beranda, blog, dan 404 bergeser halus di Chrome/Edge/Safari baru; browser lain pindah halaman biasa. Mati bila `prefers-reduced-motion`.
- **Blog**: pesan kosong tidak lagi menyebut "isi tabel posts di Supabase" (instruksi admin yang tadinya tampil ke pengunjung), kini ajakan ke WhatsApp dan Metode. Judul, ringkasan, dan gambar sampul di-escape. `body_html` tetap HTML mentah (hanya pemilik yang bisa mengisi). `blog-post.html` mengisi meta description dari ringkasan tulisan.
- Tidak diubah: susunan Paket 1 (`perluKonfirmasi: true` di `config.js` tetap, menunggu konfirmasi pemilik) dan semua scene WebGL.
- Belum diuji di browser: hanya cek sintaks JS dan struktur HTML.

## v11 (dari v10) — Struk Uji + aksesibilitas
- **Struk Uji** (`#struk-uji`, band gelap sebelum Insight; `assets/js/strukuji.js`, gaya di akhir `style.css`): kalkulator HPP langsung di peramban. Empat angka (harga jual, bahan, operasional per porsi, porsi per hari) + slider "harga bahan naik" 0-30%. Struk tercetak baris demi baris, bar bahan/operasional/sisa (amber) bergerak, angka bergulir. Angka terisi hanya contoh (bukan data klien); dihitung 30 hari buka. Ringkasan mengambang di atas pada HP. Tombol WhatsApp membawa angka pengguna hanya bila sudah diubah (nomor dari `config.js`). Tanpa server, tanpa dependensi.
- **Aksesibilitas**: landmark `<main id="main">` (skip link kini ke sana), `<noscript>` agar konten tidak tersembunyi tanpa JS, fokus terlihat global (`:where`), `prefers-contrast: more`, `forced-colors`. Struk Uji punya `aria-live` (dijeda 600 ms) dan `output` untuk slider.
- Kolofon: baris "Kalkulator". Menu HP: tautan "Struk Uji".
- Diuji: sintaks JS, struktur HTML, dan logika hitung di DOM tiruan (jsdom). Belum diuji di browser sungguhan.
- Belum ada (celah untuk lomba internasional): versi bahasa Inggris, serta uji Lighthouse/perangkat nyata.

## v12 (dari v11) — muat malas + HP mode desktop
Tanpa perubahan tampilan di laptop: CSS, HTML, dan hero tidak disentuh. Hanya `index.html` (satu baris di skrip `lite`), `hero3d.js`, `orb-live.js`, `transition.js`, `dark3d.js`.
- **Muat malas.** Renderer WebGL tidak lagi dibuat semua saat halaman dibuka. Hero tetap langsung (ia yang pertama dilihat). `transition.js` (renderer + foto 2400×1600 ke GPU) baru dibuat ±1,5 layar sebelum terlihat. `orb-live.js` baru dibuat setelah scroll melewati 35% layar. `dark3d.js` dibuat setelah intro hero (4,5 dtk, saat browser senggang) atau begitu scroll melewati 20% layar, mana yang lebih dulu. Tiap scene memakai kode dan fallback lama; bila WebGL gagal, visual CSS tetap tampil.
- **Tidak berubah:** `prefers-reduced-motion` (dark3d tetap langsung menggambar 1 frame, transisi dan orb tetap mati), mode `lite`, posisi scroll yang dipulihkan saat refresh (scene langsung dibuat).
- **HP dianggap HP walau mode desktop.** `window.__ph` = layar sentuh utama (`pointer:coarse`) dan sisi terpendek layar fisik < 600 px (tablet tidak ikut). Bila true: orb pendamping tidak dibuat, partikel hero 1.400 (bukan 2.600), dan DPR kanvas dibatasi 1,5 hanya saat lebar ≥760 px (mode desktop atau landscape). HP portrait normal (<760 px) tidak berubah sama sekali.
- Diuji: sintaks modul, dan logika pemicu di jsdom dengan Three.js tiruan (desktop, HP, reduced-motion, lite, halaman sudah di-scroll, pemicu timer). Belum diuji di browser dan HP sungguhan; asumsi bahwa `screen.width` tetap lebar fisik saat mode desktop belum terbukti.
- Kandidat berikutnya: SDK Supabase dari CDN dimuat sinkron di akhir `<body>` dan menahan eksekusi modul 3D bila CDN lambat.
