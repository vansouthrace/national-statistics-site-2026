/* NusaStat pages — a tiny hash router and one renderer per page.
   Every page is built from NUSA_DATA (data.js) and drawn with NusaCharts
   (charts.js). All controls on the pages work: the year buttons, the
   chart-type switch, the table sorting and the search filters. */

(function () {
  var D = NUSA_DATA, C = NusaCharts;
  var view = document.getElementById("view");
  var YEARS = D.years;

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function srcLine(s) { return '<p class="src">Sumber: ' + esc(s) + ".</p>"; }
  function kpiCard(k) {
    return '<article class="kpi"><p class="label">' + esc(k.label) + "</p>" +
      '<p class="value">' + esc(k.value) + (k.unit ? " <small>" + esc(k.unit) + "</small>" : "") + "</p>" +
      '<p class="delta ' + k.dir + '">' + esc(k.delta) + "</p>" +
      '<p class="src">' + esc(k.source) + "</p></article>";
  }
  function head(kicker, title, lede) {
    return '<div class="page-head"><p class="kicker">' + esc(kicker) + "</p><h1>" + esc(title) + "</h1>" +
      (lede ? '<p class="lede">' + esc(lede) + "</p>" : "") + "</div>";
  }
  function setActive(route) {
    document.querySelectorAll(".site-nav a").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-route") === route);
    });
  }

  /* ---------------- Beranda ---------------- */
  function home() {
    var cards = D.kpi.map(kpiCard).join("");
    var releases = D.releases.map(function (r) {
      return '<li><span class="date">' + esc(r.date) + " · " + esc(r.tag) + "</span><br>" +
        '<a href="' + esc(r.route) + '">' + esc(r.title) + "</a></li>";
    }).join("");
    view.innerHTML =
      '<section class="hero"><h1>Angka resmi Indonesia, dalam satu tempat.</h1>' +
      '<p class="lede">Penduduk 281,6 juta jiwa, PDB Rp22.139 triliun, inflasi 1,57% — ' +
      "semua angka terbaru dari BPS dan Bank Dunia, lengkap dengan grafik, tabel, dan sumbernya.</p>" +
      '<p class="meta">Pembaruan terakhir: ' + esc(D.meta.updated) + " · Luas wilayah " + esc(D.meta.areaKm2) + " km² · " + D.meta.provinces + " provinsi</p></section>" +
      '<div class="kpi-grid">' + cards + "</div>" +
      '<section class="card"><h2>Pertumbuhan penduduk, 2020–2024</h2>' +
      C.line({ values: D.population.total, labels: YEARS, aria: "Jumlah penduduk Indonesia 2020 sampai 2024, naik dari 270,2 juta menjadi 281,6 juta jiwa", decimals: 1, suffix: " jt" }) +
      '<p class="chart-note">Jumlah penduduk naik rata-rata 1,0% per tahun. Tahun 2020 adalah hasil Sensus Penduduk; tahun sesudahnya proyeksi BPS.</p>' +
      srcLine(D.population.source) + "</section>" +
      '<div class="grid-2"><section class="card"><h2>Rilis terbaru</h2><ul class="release-list">' + releases + "</ul></section>" +
      '<section class="card"><h2>Jelajahi berdasarkan topik</h2><div class="quick-links">' +
      '<a href="#/penduduk">Penduduk<span>281,6 juta jiwa · piramida umur · provinsi</span></a>' +
      '<a href="#/ekonomi">Ekonomi<span>PDB, inflasi, sektor, perdagangan</span></a>' +
      '<a href="#/tenaga-kerja">Tenaga Kerja<span>Pengangguran 4,91% · kemiskinan 8,57%</span></a>' +
      '<a href="#/sosial">Sosial<span>Harapan hidup 73,8 tahun · IPM 75,02</span></a>' +
      "</div>" + '<p class="chart-note">Setiap halaman menampilkan angka, grafik, dan sumbernya. Semua kontrol di situs ini berfungsi: coba tombol tahun, pengalih grafik, dan penyortiran tabel.</p></section></div>';
  }

  /* ---------------- Penduduk ---------------- */
  function penduduk() {
    var max = Math.max.apply(null, D.population.provinces.map(function (p) { return p.pop; }));
    var rows = D.population.provinces.map(function (p, i) {
      return '<li data-name="' + esc(p.name.toLowerCase()) + '"><span class="pos">' + (i + 1) + "</span>" +
        '<span>' + esc(p.name) + '<span class="bar"><i style="width:' + (p.pop / max * 100).toFixed(1) + '%"></i></span></span>' +
        '<span class="val">' + p.pop.toLocaleString("id-ID") + " jt</span></li>";
    }).join("");
    view.innerHTML = head("Penduduk", "Penduduk Indonesia", "281,6 juta jiwa pada 2024, tersebar di 38 provinsi. Mayoritas tinggal di Jawa — tiga provinsi teratas menampung hampir setengah penduduk.") +
      '<section class="card"><h2>Penduduk menurut tahun</h2>' +
      '<div class="btn-row" id="yearBtns">' + YEARS.map(function (y, i) {
        return '<button class="btn' + (i === YEARS.length - 1 ? " active" : "") + '" data-year="' + y + '">' + y + "</button>";
      }).join("") + "</div>" +
      '<p id="yearFact" style="font-size:1.25rem"></p>' +
      '<p class="chart-note">Pilih tahun untuk melihat jumlah penduduk dan laju pertumbuhannya.</p>' +
      srcLine(D.population.source) + "</section>" +
      '<section class="card"><h2>Piramida penduduk, 2024</h2>' +
      C.pyramid({ rows: D.population.pyramid, aria: "Piramida penduduk 2024: kelompok umur terbesar 0 sampai 9 tahun, mengecil ke atas" }) +
      '<p class="chart-note">Piramida masih lebar di bawah: 24,5% penduduk berusia di bawah 15 tahun, 68,7% berusia produktif (15–64 tahun).</p>' +
      srcLine(D.population.source) + "</section>" +
      '<section class="card"><h2>10 provinsi terpadat, 2024</h2>' +
      '<input class="search" id="provSearch" type="search" placeholder="Cari provinsi…" aria-label="Cari provinsi">' +
      '<ul class="rank-list" id="provList">' + rows + "</ul>" +
      '<p class="chart-note">Angka dalam juta jiwa. Jawa Barat, Jawa Timur, dan Jawa Tengah bersama menampung 46,2% penduduk Indonesia.</p>' +
      srcLine(D.population.source) + "</section>";

    var fact = document.getElementById("yearFact");
    function showYear(y) {
      var i = YEARS.indexOf(y);
      fact.innerHTML = "<strong>" + y + ":</strong> " + D.population.total[i].toLocaleString("id-ID") +
        " juta jiwa · tumbuh " + D.population.growth[i].toLocaleString("id-ID") + "% per tahun";
      document.querySelectorAll("#yearBtns .btn").forEach(function (b) {
        b.classList.toggle("active", Number(b.getAttribute("data-year")) === y);
      });
    }
    document.getElementById("yearBtns").addEventListener("click", function (e) {
      var b = e.target.closest("button[data-year]");
      if (b) showYear(Number(b.getAttribute("data-year")));
    });
    showYear(2024);
    document.getElementById("provSearch").addEventListener("input", function (e) {
      var q = e.target.value.trim().toLowerCase();
      document.querySelectorAll("#provList li").forEach(function (li) {
        li.style.display = !q || li.getAttribute("data-name").indexOf(q) !== -1 ? "" : "none";
      });
    });
  }

  /* ---------------- Ekonomi ---------------- */
  function ekonomi() {
    var legend = D.economy.sectors.map(function (s) {
      return '<li><span class="swatch" style="background:' + s.color + '"></span>' + esc(s.label) + " — <strong>" + s.pct.toLocaleString("id-ID") + "%</strong></li>";
    }).join("");
    view.innerHTML = head("Ekonomi", "Ekonomi Indonesia", "PDB tumbuh 5,03% pada 2024 menjadi Rp22.139 triliun. Inflasi terjaga di 1,57%, dan neraca perdagangan surplus US$19,7 miliar.") +
      '<section class="card"><h2>Pertumbuhan PDB, 2020–2024</h2>' +
      '<div class="btn-row"><button class="btn active" id="gdpBars">Batang</button><button class="btn" id="gdpLine">Garis</button></div>' +
      '<div id="gdpChart"></div>' +
      '<p class="chart-note">Kontraksi 2020 adalah dampak pandemi COVID-19; ekonomi pulih di atas 5% sejak 2022.</p>' +
      srcLine(D.economy.source) + "</section>" +
      '<div class="grid-2"><section class="card"><h2>PDB menurut lapangan usaha, 2024</h2>' +
      C.donut({ parts: D.economy.sectors, center: "100%", centerLabel: "pangsa PDB", aria: "Kontribusi sektor terhadap PDB 2024, terbesar industri pengolahan 18,7 persen" }) +
      '<ul class="legend">' + legend + "</ul>" + srcLine(D.economy.source) + "</section>" +
      '<section class="card"><h2>Inflasi tahunan, 2020–2024</h2>' +
      C.line({ values: D.economy.inflation, labels: YEARS, color: "#c65b39", aria: "Inflasi 2020 sampai 2024: tertinggi 5,51 persen pada 2022, terendah 1,57 persen pada 2024", decimals: 2, suffix: "%" }) +
      '<p class="chart-note">Lonjakan 2022 mengikuti penyesuaian harga BBM bersubsidi; inflasi kembali ke sasaran 1,5–3,5% pada 2023–2024.</p>' +
      srcLine("BPS, Indeks Harga Konsumen 2024") + "</section></div>" +
      '<section class="card"><h2>Perdagangan luar negeri, 2024</h2>' +
      '<div class="kpi-grid">' +
      '<article class="kpi"><p class="label">Ekspor</p><p class="value">US$264,7 <small>miliar</small></p><p class="src">BPS, 2024</p></article>' +
      '<article class="kpi"><p class="label">Impor</p><p class="value">US$245,0 <small>miliar</small></p><p class="src">BPS, 2024</p></article>' +
      '<article class="kpi"><p class="label">Surplus neraca dagang</p><p class="value">US$19,7 <small>miliar</small></p><p class="src">BPS, 2024</p></article>' +
      "</div>" + '<p class="chart-note">Surplus ditopang ekspor batu bara, minyak kelapa sawit, dan besi baja.</p></section>';

    var box = document.getElementById("gdpChart");
    var barsBtn = document.getElementById("gdpBars"), lineBtn = document.getElementById("gdpLine");
    function draw(kind) {
      var opts = { values: D.economy.gdpGrowth, labels: YEARS, aria: "Pertumbuhan PDB 2020 sampai 2024: minus 2,07 persen pada 2020, lalu 3,70, 5,31, 5,05 dan 5,03 persen", decimals: 2, suffix: "%" };
      box.innerHTML = kind === "bars" ? C.bars(opts) : C.line(opts);
      barsBtn.classList.toggle("active", kind === "bars");
      lineBtn.classList.toggle("active", kind === "line");
    }
    barsBtn.addEventListener("click", function () { draw("bars"); });
    lineBtn.addEventListener("click", function () { draw("line"); });
    draw("bars");
  }

  /* ---------------- Tenaga kerja ---------------- */
  function tenagaKerja() {
    var sectorRows = D.labour.bySector.map(function (s) {
      return "<tr><td>" + esc(s.label) + '</td><td class="num">' + s.pct.toLocaleString("id-ID") + "%</td></tr>";
    }).join("");
    view.innerHTML = head("Tenaga Kerja", "Tenaga kerja & kemiskinan", "Pengangguran terbuka turun ke 4,91% pada Agustus 2024 — terendah sejak sebelum pandemi — dan kemiskinan turun ke 8,57%.") +
      '<div class="grid-2"><section class="card"><h2>Pengangguran terbuka, 2020–2024</h2>' +
      C.line({ values: D.labour.unemployment, labels: YEARS, color: "#2f6f9f", aria: "Pengangguran 2020 sampai 2024: 7,07, 6,49, 5,86, 5,32 dan 4,91 persen", decimals: 2, suffix: "%" }) +
      '<p class="chart-note">Puncak 7,07% pada Agustus 2020 adalah dampak pandemi; sejak itu turun setiap tahun.</p>' + srcLine(D.labour.source) + "</section>" +
      '<section class="card"><h2>Kemiskinan, 2020–2024</h2>' +
      C.line({ values: D.labour.poverty, labels: YEARS, color: "#2e7d5b", aria: "Kemiskinan September 2020 sampai 2024: 10,19, 9,71, 9,57, 9,36 dan 8,57 persen", decimals: 2, suffix: "%" }) +
      '<p class="chart-note">Tingkat kemiskinan September 2024 (8,57%) adalah yang terendah sepanjang sejarah pencatatan BPS.</p>' + srcLine(D.labour.source) + "</section></div>" +
      '<div class="grid-2"><section class="card"><h2>Formal vs informal, 2024</h2>' +
      '<p style="font-size:1.1rem"><strong>Formal 41,2%</strong> · <strong>Informal 58,8%</strong> dari 144,6 juta penduduk bekerja.</p>' +
      '<p class="chart-note">Pekerja informal terbanyak di pertanian dan perdagangan eceran. Formalisasi lapangan kerja adalah agenda utama kebijakan ketenagakerjaan.</p>' +
      srcLine(D.labour.source) + "</section>" +
      '<section class="card"><h2>Pekerja menurut lapangan usaha, 2024</h2><table class="data-table"><thead><tr><th>Lapangan usaha</th><th class="num">Pangsa</th></tr></thead><tbody>' +
      sectorRows + "</tbody></table>" + srcLine(D.labour.source) + "</section></div>";
  }

  /* ---------------- Sosial ---------------- */
  function sosial() {
    view.innerHTML = head("Sosial", "Kesehatan & pendidikan", "Angka harapan hidup 73,8 tahun dan IPM 75,02 pada 2024 — keduanya tertinggi yang pernah dicatat — dengan melek huruf mencapai 96,9%.") +
      '<div class="grid-2"><section class="card"><h2>Angka harapan hidup, 2020–2024</h2>' +
      C.line({ values: D.social.lifeExpectancy, labels: YEARS, color: "#2e7d5b", aria: "Angka harapan hidup 2020 sampai 2024: 71,5, 71,9, 72,4, 73,6 dan 73,8 tahun", decimals: 1, suffix: " th" }) +
      '<p class="chart-note">Kenaikan 2023–2024 mengikuti pemulihan layanan kesehatan pascapandemi.</p>' + srcLine(D.social.source) + "</section>" +
      '<section class="card"><h2>Melek huruf usia 15+, 2020–2024</h2>' +
      C.line({ values: D.social.literacy, labels: YEARS, color: "#2f6f9f", aria: "Melek huruf 2020 sampai 2024: 96,0, 96,1, 96,3, 96,5 dan 96,9 persen", decimals: 1, suffix: "%" }) +
      '<p class="chart-note">Melek huruf perempuan muda (15–24 tahun) sudah di atas 99%.</p>' + srcLine(D.social.source) + "</section></div>" +
      '<section class="card"><h2>Indeks Pembangunan Manusia, 2024</h2>' +
      '<p style="font-size:1.1rem"><strong>' + D.social.hdi.toLocaleString("id-ID") + '</strong> — kategori "tinggi" menurut skala BPS, naik dari 74,39 pada 2023.</p>' +
      '<p>IPM merangkum tiga dimensi: umur panjang dan hidup sehat (harapan hidup 73,8 tahun), pengetahuan (harapan lama sekolah 13,2 tahun), dan standar hidup layak (pengeluaran riil per kapita Rp12,3 juta per tahun).</p>' +
      '<p class="note"><strong>Catatan:</strong> komponen IPM 2024 — harapan lama sekolah dan pengeluaran riil — mengikuti rilis BPS; angka dirangkum dan dibulatkan untuk halaman ini.</p>' +
      srcLine(D.social.source) + "</section>";
  }

  /* ---------------- Data & metodologi ---------------- */
  function dataPage() {
    var rows = D.indicators.map(function (r) {
      return "<tr><td>" + esc(r.name) + '</td><td class="num">' + esc(r.value) + '</td><td class="num">' + r.year + "</td><td>" + esc(r.source) + "</td></tr>";
    }).join("");
    view.innerHTML = head("Data & Metodologi", "Data & metodologi", "Semua indikator utama di satu tabel. Klik judul kolom untuk mengurutkan, atau ketik di kotak pencari untuk menyaring.") +
      '<section class="card"><h2>Indikator utama Indonesia</h2>' +
      '<input class="search" id="indSearch" type="search" placeholder="Cari indikator…" aria-label="Cari indikator">' +
      '<table class="data-table" id="indTable"><thead><tr>' +
      '<th><button data-key="0">Indikator</button></th>' +
      '<th class="num"><button data-key="1">Nilai</button></th>' +
      '<th class="num"><button data-key="2">Tahun</button></th>' +
      '<th><button data-key="3">Sumber</button></th>' +
      "</tr></thead><tbody>" + rows + "</tbody></table>" +
      '<p class="chart-note">15 indikator. Klik judul kolom sekali untuk mengurutkan naik, sekali lagi untuk mengurutkan turun.</p></section>' +
      '<section class="card"><h2>Metodologi &amp; sumber</h2>' +
      "<p><strong>BPS (Badan Pusat Statistik)</strong> adalah sumber utama: Sensus Penduduk 2020, proyeksi penduduk, PDB, Indeks Harga Konsumen, Sakernas, dan Susenas. <strong>Bank Dunia</strong> dipakai untuk PDB per kapita dalam dolar AS (World Development Indicators). <strong>UNDP</strong> dipakai sebagai pembanding IPM.</p>" +
      "<p>" + esc(D.meta.rounding) + "</p>" +
      '<p>Angka tahun 2020 untuk penduduk berasal dari Sensus Penduduk; tahun 2021–2024 adalah proyeksi BPS. Tingkat pengangguran dan kemiskinan mengikuti rilis Agustus dan September masing-masing tahun.</p>' +
      '<p class="note"><strong>Tentang NusaStat:</strong> portal ini independen dan tidak terafiliasi dengan BPS, Bank Dunia, atau UNDP. Nama, desain, dan tulisan di situs ini asli; angka-angka adalah fakta resmi yang dikutip dengan sumbernya.</p></section>';

    var table = document.getElementById("indTable");
    var tbody = table.querySelector("tbody");
    var dir = {};
    table.querySelectorAll("th button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var key = Number(btn.getAttribute("data-key"));
        dir[key] = dir[key] === 1 ? -1 : 1;
        var rowsArr = Array.prototype.slice.call(tbody.querySelectorAll("tr"));
        rowsArr.sort(function (a, b) {
          var ta = a.children[key].textContent.trim(), tb = b.children[key].textContent.trim();
          var na = parseFloat(ta.replace(/[^\d.,-]/g, "").replace(",", ".")), nb = parseFloat(tb.replace(/[^\d.,-]/g, "").replace(",", "."));
          var cmp = (!isNaN(na) && !isNaN(nb)) ? (na - nb) : (ta < tb ? -1 : ta > tb ? 1 : 0);
          return cmp * dir[key];
        });
        rowsArr.forEach(function (r) { tbody.appendChild(r); });
      });
    });
    document.getElementById("indSearch").addEventListener("input", function (e) {
      var q = e.target.value.trim().toLowerCase();
      tbody.querySelectorAll("tr").forEach(function (tr) {
        tr.style.display = !q || tr.textContent.toLowerCase().indexOf(q) !== -1 ? "" : "none";
      });
    });
  }

  /* ---------------- Router ---------------- */
  var routes = { "": home, "penduduk": penduduk, "ekonomi": ekonomi, "tenaga-kerja": tenagaKerja, "sosial": sosial, "data": dataPage };
  function render() {
    var hash = location.hash.replace(/^#\/?/, "").split("?")[0];
    var fn = routes[hash] || home;
    setActive(routes[hash] ? hash : "");
    fn();
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", render);
  render();
})();
