// ===== 1. Data kata =====
// Setiap kata punya kategori sebagai petunjuk
var daftarKata = [
  { kata: "KUCING", kategori: "Hewan" },
  { kata: "HARIMAU", kategori: "Hewan" },
  { kata: "JERAPAH", kategori: "Hewan" },
  { kata: "MANGGA", kategori: "Buah" },
  { kata: "SEMANGKA", kategori: "Buah" },
  { kata: "JERUK", kategori: "Buah" },
  { kata: "JAKARTA", kategori: "Kota" },
  { kata: "SURABAYA", kategori: "Kota" },
  { kata: "BANDUNG", kategori: "Kota" },
  { kata: "KOMPUTER", kategori: "Benda" },
  { kata: "SEPEDA", kategori: "Benda" },
  { kata: "PAYUNG", kategori: "Benda" },
  { kata: "JAVASCRIPT", kategori: "Pemrograman" },
  { kata: "VARIABEL", kategori: "Pemrograman" },
  { kata: "FUNGSI", kategori: "Pemrograman" }
];

var NYAWA_AWAL = 6;

// ===== 2. Ambil elemen dari HTML =====
var elKata = document.getElementById("kata");
var elKategori = document.getElementById("kategori");
var elPesan = document.getElementById("pesan");
var elSkor = document.getElementById("skor");
var elNyawa = document.getElementById("nyawa");
var elPapan = document.getElementById("papan-huruf");
var tombolBaru = document.getElementById("btn-baru");
var tombolPetunjuk = document.getElementById("btn-petunjuk");

// ===== 3. Variabel status permainan =====
var kataRahasia = "";
var tebakanBenar = [];   // huruf yang sudah benar
var nyawa = NYAWA_AWAL;
var skor = 0;
var selesai = false;

// ===== 4. Fungsi-fungsi =====

// Membuat tombol A sampai Z
function buatPapanHuruf() {
  elPapan.innerHTML = "";
  var huruf = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (var i = 0; i < huruf.length; i++) {
    var tombol = document.createElement("button");
    tombol.textContent = huruf[i];
    tombol.addEventListener("click", klikHuruf);
    elPapan.appendChild(tombol);
  }
}

// Menampilkan kotak-kotak kata (huruf yang belum ditebak jadi kosong)
function tampilkanKata() {
  elKata.innerHTML = "";

  for (var i = 0; i < kataRahasia.length; i++) {
    var kotak = document.createElement("span");
    kotak.className = "kotak";

    var h = kataRahasia[i];
    if (tebakanBenar.indexOf(h) !== -1 || selesai) {
      kotak.textContent = h;
    }
    elKata.appendChild(kotak);
  }
}

// Menampilkan nyawa sebagai hati
function tampilkanNyawa() {
  var hati = "";
  for (var i = 0; i < nyawa; i++) {
    hati = hati + "❤";
  }
  elNyawa.textContent = hati === "" ? "habis" : hati;
}

// Mengecek apakah semua huruf sudah tertebak
function sudahMenang() {
  for (var i = 0; i < kataRahasia.length; i++) {
    if (tebakanBenar.indexOf(kataRahasia[i]) === -1) {
      return false;
    }
  }
  return true;
}

// Membuka satu huruf secara otomatis (tanpa mengurangi nyawa)
function bukaHuruf(huruf) {
  var semua = elPapan.querySelectorAll("button");
  var tombol = semua[huruf.charCodeAt(0) - 65];
  if (tebakanBenar.indexOf(huruf) === -1) {
    tebakanBenar.push(huruf);
  }
  tombol.disabled = true;
  tombol.classList.add("benar");
}

// Tombol petunjuk: membuka 1 huruf acak, harganya 1 nyawa
function pakaiPetunjuk() {
  if (selesai) return;

  if (nyawa <= 1) {
    elPesan.textContent = "Nyawa tinggal 1, petunjuk tidak bisa dipakai.";
    return;
  }

  // Kumpulkan huruf yang belum ditebak
  var belum = [];
  for (var i = 0; i < kataRahasia.length; i++) {
    var h = kataRahasia[i];
    if (tebakanBenar.indexOf(h) === -1 && belum.indexOf(h) === -1) {
      belum.push(h);
    }
  }
  if (belum.length === 0) return;

  var acak = Math.floor(Math.random() * belum.length);
  bukaHuruf(belum[acak]);
  nyawa = nyawa - 1;
  tampilkanNyawa();
  cekHasil();
}

// Dipanggil saat tombol huruf diklik
function klikHuruf(event) {
  if (selesai) return;

  var tombol = event.target;
  var huruf = tombol.textContent;
  tombol.disabled = true;

  if (kataRahasia.indexOf(huruf) !== -1) {
    // Tebakan benar
    tebakanBenar.push(huruf);
    tombol.classList.add("benar");
  } else {
    // Tebakan salah
    nyawa = nyawa - 1;
    tombol.classList.add("salah");
    tampilkanNyawa();
  }

  cekHasil();
}

// Mengecek menang atau kalah
function cekHasil() {
  if (sudahMenang()) {
    selesai = true;
    skor = skor + 10 + nyawa;   // sisa nyawa jadi bonus
    elSkor.textContent = skor;
    elPesan.textContent = "Benar! Kata-nya " + kataRahasia + ". Skor bertambah.";
    elPesan.className = "pesan menang";
  } else if (nyawa === 0) {
    selesai = true;
    elPesan.textContent = "Nyawa habis. Jawabannya: " + kataRahasia;
    elPesan.className = "pesan kalah";
  } else {
    elPesan.textContent = "Terus tebak!";
    elPesan.className = "pesan";
  }

  if (selesai) {
    // Matikan semua tombol huruf
    var semua = elPapan.querySelectorAll("button");
    for (var i = 0; i < semua.length; i++) {
      semua[i].disabled = true;
    }
  }
  tampilkanKata();
}

// Memulai ronde baru dengan kata acak
function mulaiBaru() {
  var acak = Math.floor(Math.random() * daftarKata.length);
  var pilihan = daftarKata[acak];

  kataRahasia = pilihan.kata;
  elKategori.textContent = pilihan.kategori;
  tebakanBenar = [];
  nyawa = NYAWA_AWAL;
  selesai = false;

  elPesan.textContent = "Huruf pertama sudah dibuka. Pilih huruf untuk menebak.";
  elPesan.className = "pesan";

  buatPapanHuruf();
  bukaHuruf(kataRahasia[0]);   // petunjuk: huruf depan dibuka otomatis
  tampilkanKata();
  tampilkanNyawa();
}

// ===== 5. Event dan mulai =====
tombolBaru.addEventListener("click", mulaiBaru);
tombolPetunjuk.addEventListener("click", pakaiPetunjuk);

// Bisa juga main pakai keyboard
document.addEventListener("keydown", function (e) {
  var huruf = e.key.toUpperCase();
  if (huruf.length !== 1 || huruf < "A" || huruf > "Z") return;

  var tombol = elPapan.querySelectorAll("button")[huruf.charCodeAt(0) - 65];
  if (tombol && !tombol.disabled) tombol.click();
});

mulaiBaru();
