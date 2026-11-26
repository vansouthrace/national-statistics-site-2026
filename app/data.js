/* NusaStat data — figures for Indonesia, rounded from official releases.
   Every figure carries its source and year in the `source` field, and the
   pages show that source next to the number. Nothing here is fetched from
   the network: the whole dataset ships inside this file. */

var NUSA_DATA = {
  meta: {
    country: "Indonesia",
    updated: "Februari 2025",
    areaKm2: "1.904.569",
    provinces: 38,
    capital: "Jakarta (Ibu Kota Nusantara dalam pembangunan)",
    rounding: "Angka dibulatkan ke satu desimal. Persentase kelompok umur dan sektor dihitung dari rilis resmi BPS; jumlahnya dapat berbeda 0,1 poin karena pembulatan."
  },

  years: [2020, 2021, 2022, 2023, 2024],

  kpi: [
    { id: "pop", label: "Penduduk", value: "281,6", unit: "juta jiwa", delta: "+1,11% dari 2023", dir: "up", source: "BPS, 2024" },
    { id: "gdp", label: "PDB nominal", value: "Rp22.139", unit: "triliun", delta: "+5,03% (riil, 2024)", dir: "up", source: "BPS, 2024" },
    { id: "gdppc", label: "PDB per kapita", value: "US$4.925", unit: "", delta: "Bank Dunia, 2024", dir: "flat", source: "Bank Dunia, 2024" },
    { id: "cpi", label: "Inflasi (y-on-y)", value: "1,57", unit: "%", delta: "turun dari 2,61% (2023)", dir: "down", source: "BPS, Des 2024" },
    { id: "unemp", label: "Pengangguran terbuka", value: "4,91", unit: "%", delta: "turun dari 5,32% (2023)", dir: "down", source: "BPS, Agu 2024" },
    { id: "poor", label: "Penduduk miskin", value: "8,57", unit: "%", delta: "turun dari 9,36% (2023)", dir: "down", source: "BPS, Sep 2024" }
  ],

  population: {
    total: [270.2, 273.9, 275.8, 278.7, 281.6],
    growth: [1.25, 1.38, 0.69, 1.05, 1.11],
    ageGroups: [
      { label: "0–14 tahun", pct: 24.5 },
      { label: "15–64 tahun", pct: 68.7 },
      { label: "65+ tahun", pct: 6.8 }
    ],
    pyramid: [
      { group: "0–4", male: 4.6, female: 4.4 },
      { group: "5–9", male: 4.6, female: 4.4 },
      { group: "10–14", male: 4.5, female: 4.3 },
      { group: "15–19", male: 4.4, female: 4.2 },
      { group: "20–24", male: 4.3, female: 4.1 },
      { group: "25–29", male: 4.1, female: 4.0 },
      { group: "30–34", male: 4.0, female: 3.9 },
      { group: "35–39", male: 3.8, female: 3.7 },
      { group: "40–44", male: 3.5, female: 3.4 },
      { group: "45–49", male: 3.1, female: 3.1 },
      { group: "50–54", male: 2.7, female: 2.7 },
      { group: "55–59", male: 2.3, female: 2.3 },
      { group: "60–64", male: 1.8, female: 1.9 },
      { group: "65+", male: 3.1, female: 3.6 }
    ],
    provinces: [
      { name: "Jawa Barat", pop: 50.4, share: 17.9 },
      { name: "Jawa Timur", pop: 41.8, share: 14.8 },
      { name: "Jawa Tengah", pop: 37.9, share: 13.5 },
      { name: "Sumatera Utara", pop: 15.6, share: 5.5 },
      { name: "Banten", pop: 12.4, share: 4.4 },
      { name: "DKI Jakarta", pop: 10.6, share: 3.8 },
      { name: "Sulawesi Selatan", pop: 9.4, share: 3.3 },
      { name: "Lampung", pop: 9.1, share: 3.2 },
      { name: "Sumatera Selatan", pop: 9.0, share: 3.2 },
      { name: "Riau", pop: 6.9, share: 2.5 }
    ],
    source: "BPS, Sensus Penduduk 2020 dan Proyeksi Penduduk 2024"
  },

  economy: {
    gdpGrowth: [-2.07, 3.70, 5.31, 5.05, 5.03],
    gdpNominal: [15443, 16976, 19542, 20872, 22139],
    inflation: [1.68, 1.87, 5.51, 2.61, 1.57],
    sectors: [
      { label: "Industri pengolahan", pct: 18.7, color: "#0c4a44" },
      { label: "Perdagangan", pct: 13.0, color: "#2e7d5b" },
      { label: "Pertanian", pct: 12.5, color: "#e8a33d" },
      { label: "Konstruksi", pct: 9.9, color: "#2f6f9f" },
      { label: "Pertambangan", pct: 9.1, color: "#c65b39" },
      { label: "Transportasi & pergudangan", pct: 5.4, color: "#7a9a8d" },
      { label: "Informasi & komunikasi", pct: 4.2, color: "#b98a2f" },
      { label: "Lainnya", pct: 27.2, color: "#c9cfc2" }
    ],
    trade: { exports: 264.7, imports: 245.0, surplus: 19.7, unit: "miliar US$" },
    source: "BPS, PDB 2024; Bank Dunia, World Development Indicators 2024"
  },

  labour: {
    unemployment: [7.07, 6.49, 5.86, 5.32, 4.91],
    poverty: [10.19, 9.71, 9.57, 9.36, 8.57],
    formal: 41.2,
    informal: 58.8,
    bySector: [
      { label: "Pertanian", pct: 27.5 },
      { label: "Perdagangan", pct: 19.0 },
      { label: "Industri pengolahan", pct: 14.4 },
      { label: "Jasa kemasyarakatan", pct: 12.1 },
      { label: "Konstruksi", pct: 7.2 },
      { label: "Lainnya", pct: 19.8 }
    ],
    source: "BPS, Sakernas Agustus 2024 dan Susenas September 2024"
  },

  social: {
    lifeExpectancy: [71.5, 71.9, 72.4, 73.6, 73.8],
    literacy: [96.0, 96.1, 96.3, 96.5, 96.9],
    hdi: 75.02,
    hdiLabel: "Indeks Pembangunan Manusia",
    source: "BPS, IPM 2024; UNDP, Human Development Report 2024"
  },

  releases: [
    { date: "5 Feb 2025", title: "Pertumbuhan Ekonomi Indonesia 2024: 5,03%", tag: "Ekonomi", route: "#/ekonomi" },
    { date: "15 Jan 2025", title: "Kemiskinan September 2024 turun ke 8,57%", tag: "Sosial", route: "#/tenaga-kerja" },
    { date: "2 Des 2024", title: "Inflasi November 2024: 1,55% (y-on-y)", tag: "Harga", route: "#/ekonomi" },
    { date: "5 Nov 2024", title: "Tingkat Pengangguran Terbuka Agustus 2024: 4,91%", tag: "Tenaga kerja", route: "#/tenaga-kerja" },
    { date: "1 Jul 2024", title: "Proyeksi Penduduk 2024: 281,6 juta jiwa", tag: "Penduduk", route: "#/penduduk" }
  ],

  indicators: [
    { name: "Jumlah penduduk", value: "281,6 juta jiwa", year: 2024, source: "BPS" },
    { name: "Laju pertumbuhan penduduk", value: "1,11%", year: 2024, source: "BPS" },
    { name: "PDB nominal", value: "Rp22.139 triliun", year: 2024, source: "BPS" },
    { name: "Pertumbuhan PDB (riil)", value: "5,03%", year: 2024, source: "BPS" },
    { name: "PDB per kapita", value: "US$4.925", year: 2024, source: "Bank Dunia" },
    { name: "Inflasi (y-on-y)", value: "1,57%", year: 2024, source: "BPS" },
    { name: "Tingkat pengangguran terbuka", value: "4,91%", year: 2024, source: "BPS" },
    { name: "Tingkat kemiskinan", value: "8,57%", year: 2024, source: "BPS" },
    { name: "Angka harapan hidup", value: "73,8 tahun", year: 2024, source: "BPS" },
    { name: "Angka melek huruf (15+)", value: "96,9%", year: 2024, source: "BPS" },
    { name: "Indeks Pembangunan Manusia", value: "75,02", year: 2024, source: "BPS" },
    { name: "Ekspor", value: "US$264,7 miliar", year: 2024, source: "BPS" },
    { name: "Impor", value: "US$245,0 miliar", year: 2024, source: "BPS" },
    { name: "Luas wilayah", value: "1.904.569 km²", year: 2024, source: "BPS" },
    { name: "Jumlah provinsi", value: "38", year: 2024, source: "Kemendagri" }
  ]
};
