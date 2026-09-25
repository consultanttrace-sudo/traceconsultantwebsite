// Fill these in from your Supabase project settings (Project Settings -> API).
// This is the *anon* public key — safe to expose in client-side code as long as
// Row Level Security policies are set up correctly (see /supabase/schema.sql).
window.TRACE_CONFIG = {
  supabaseUrl: "https://YOUR-PROJECT.supabase.co",
  supabaseAnonKey: "YOUR-ANON-KEY",
  // v7: nomor WhatsApp (format 62…) untuk cadangan form kontak saat Supabase belum diisi atau gagal.
  whatsapp: "62895428298682",
};

// v6: satu sumber data matriks layanan x paket. Geser layanan antarpaket cukup ubah nilai di sini.
// nilai: "penuh" | "dasar" | "" (tidak termasuk). p = [Paket 1, Paket 2, Paket 3]
window.TRACE_PAKET = {
  perluKonfirmasi: true, // v7: catatan "masih usulan" hanya tampil di pratinjau (tambah ?draf=1 di URL), tidak ke pengunjung. Set false setelah susunan Paket 1 kamu konfirmasi.
  layanan: [
    { n: "Lama pendampingan", t: ["3 bulan", "6 bulan", "12 bulan"] },
    { n: "Kunjungan 2× seminggu", p: ["penuh", "penuh", "penuh"] },
    { n: "Diagnosis & Keuangan", p: ["penuh", "penuh", "penuh"] },
    { n: "Konten pattern", p: ["dasar", "penuh", "penuh"] },
    { n: "Rebranding media sosial", p: ["dasar", "penuh", "penuh"] },
    { n: "FYP konten", p: ["", "penuh", "penuh"] },
    { n: "Rebranding tempat", p: ["", "penuh", "penuh"] },
    { n: "KOL", p: ["", "penuh", "penuh"] },
    { n: "Supplier", p: ["", "penuh", "penuh"] },
    { n: "Cari tempat", p: ["", "penuh", "penuh"] },
  ],
  lensa: {
    T: ["Tactical Execution", "Kunjungan 2× seminggu, action plan", "Apa yang harus dikerjakan minggu ini?"],
    R: ["Risk Assessment", "Diagnosis & Keuangan, supplier", "Di mana uang berisiko bocor?"],
    A: ["Analytics", "Diagnosis & HPP, FYP konten", "Angka mana yang benar-benar bicara?"],
    C: ["Concept Refinement", "Rebranding tempat & media sosial, konten pattern", "Apakah konsepnya masih cocok dengan pasarnya?"],
    E: ["Efficiency Control", "Supplier, cari tempat, KOL", "Biaya mana yang bisa dipangkas tanpa turun mutu?"],
  },
};
