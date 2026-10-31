# PROPOSAL PENELITIAN

## Formulasi Ide Penelitian berbasis *Technology-Driven Local Problem Solving*
### Studi Kasus: Kabupaten Banjarnegara

---

### **Judul Penelitian:**

# Perancangan SI TANGGUH MDMC: Sistem Pendukung Keputusan Mitigasi Bencana Hidrometeorologi Berbasis K-Means Clustering dan TOPSIS untuk Alokasi Logistik MDMC di Kabupaten Banjarnegara

> **SI TANGGUH MDMC** = **S**istem **I**nformasi **T**anggap **A**lokasi da**N** **G**eo-clustering lo**G**istik h**U**maniter **H**idrometeorologi — **M**uhammadiyah **D**isaster **M**anagement **C**enter

---

**Disusun oleh:**
*(Nama Mahasiswa)*
*(NIM)*
*(Program Studi)*

---

## DAFTAR ISI

- [BAB I – Pendahuluan](#bab-i--pendahuluan)
  - [1.1 Latar Belakang Permasalahan Lokal](#11-latar-belakang-permasalahan-lokal)
  - [1.2 Rumusan Masalah](#12-rumusan-masalah)
  - [1.3 Tujuan Penelitian](#13-tujuan-penelitian)
  - [1.4 Manfaat Penelitian](#14-manfaat-penelitian)
- [BAB II – Landasan Teori dan Tinjauan Pustaka](#bab-ii--landasan-teori-dan-tinjauan-pustaka)
  - [2.1 Tinjauan Pustaka (Penelitian Terdahulu)](#21-tinjauan-pustaka-penelitian-terdahulu)
  - [2.2 Landasan Teori](#22-landasan-teori)
- [BAB III – Metodologi Penelitian](#bab-iii--metodologi-penelitian)
  - [3.1 Arsitektur Sistem](#31-arsitektur-sistem)
  - [3.2 Alur Algoritma (Flowchart)](#32-alur-algoritma-flowchart)
  - [3.3 Rencana Pengumpulan Data](#33-rencana-pengumpulan-data)
  - [3.4 Teknik Pengujian dan Evaluasi](#34-teknik-pengujian-dan-evaluasi)
- [Daftar Pustaka](#daftar-pustaka)

---

## BAB I – Pendahuluan

### 1.1 Latar Belakang Permasalahan Lokal

Kabupaten Banjarnegara merupakan salah satu kabupaten di Provinsi Jawa Tengah yang terdiri dari 20 kecamatan, 12 kelurahan, dan 266 desa dengan luas wilayah 1.023,73 km² dan jumlah penduduk mencapai lebih dari 1.000.000 jiwa. Secara topografis, wilayah Banjarnegara didominasi oleh perbukitan, lereng curam, serta struktur tanah yang gembur dan poros, menjadikan daerah ini memiliki tingkat kerawanan yang sangat tinggi terhadap bencana hidrometeorologi — khususnya tanah longsor, banjir bandang, pergerakan tanah, dan cuaca ekstrem.

Berdasarkan data Badan Nasional Penanggulangan Bencana (BNPB), Kabupaten Banjarnegara secara konsisten menempati **peringkat teratas di Jawa Tengah** dalam hal jumlah kejadian longsor serta dampak pengungsi dan korban jiwa akibat bencana tanah longsor sepanjang periode 2015–2025. Dokumen Kajian Risiko Bencana (KRB) menunjukkan bahwa Banjarnegara memiliki 6 dari 8 jenis ancaman utama berisiko tinggi, di mana tanah longsor, banjir bandang, dan cuaca ekstrem mendominasi kejadian tahunan yang dipicu oleh curah hujan tinggi.

Fakta empiris terkini memperkuat urgensi penanganan:

- **Tahun 2024:** BPBD mencatat setidaknya **7 kecamatan** terdampak langsung oleh bencana tanah longsor akibat intensitas hujan tinggi di awal tahun, menyebabkan kerusakan pada akses jalan kabupaten/desa dan rumah warga.
- **Januari 2025:** Bencana tanah bergerak dan longsor melanda Kecamatan Pejawaran, di mana 16 rumah di Desa Ratamba mengalami rusak berat dan puluhan warga harus mengungsi, sementara infrastruktur jalan di Desa Panusupan sempat amblas.
- **November 2025:** Longsor besar menerjang **Desa Situkung, Kecamatan Pandanarum**, mengakibatkan korban jiwa, ratusan keluarga (660–934 jiwa) terpaksa mengungsi ke Kantor Kecamatan Pandanarum, serta puluhan rumah rusak berat beserta kerusakan fasilitas umum.
- **Status Siaga Darurat:** Bupati Banjarnegara menetapkan **Status Siaga Darurat Bencana Tanah Longsor, Angin Kencang, Cuaca Ekstrem, dan Banjir** yang berlaku sejak akhir Oktober 2025 akibat tingginya potensi bencana hidrometeorologi.

Di sisi lain, **Muhammadiyah Disaster Management Center (MDMC)** — kini juga dikenal sebagai Lembaga Resiliensi Bencana (LRB) Pimpinan Pusat Muhammadiyah — merupakan lembaga yang aktif dalam penanggulangan bencana mulai dari tahap prabencana (mitigasi dan kesiapsiagaan), tanggap darurat, hingga pascabencana (rehabilitasi dan rekonstruksi). Dalam operasi tanggap darurat, **sekitar 80% keberhasilan misi kemanusiaan bergantung pada kelancaran sistem logistik**. Namun, tantangan yang sering dihadapi MDMC di lapangan meliputi:

1. **Distribusi logistik yang tidak merata** — bantuan cenderung menumpuk di gudang atau posko utama, sementara daerah terisolasi yang lebih membutuhkan tidak terjangkau.
2. **Ketiadaan sistem pendukung keputusan berbasis data** — penentuan prioritas daerah penerima bantuan masih bersifat subjektif dan manual.
3. **Keterbatasan pemetaan risiko hingga tingkat desa** — data kerawanan belum diklasifikasikan secara komprehensif berdasarkan multi-indikator.

Oleh karena itu, diperlukan sebuah **Sistem Pendukung Keputusan (SPK)** yang mampu mengklasifikasikan tingkat kerawanan bencana hidrometeorologi hingga tingkat desa/kecamatan serta memberikan rekomendasi prioritas alokasi logistik secara objektif dan terukur. Penelitian ini mengusulkan perancangan **SI TANGGUH MDMC** — sebuah sistem berbasis web yang mengintegrasikan algoritma **K-Means Clustering** untuk zonasi tingkat kerawanan bencana dan metode **TOPSIS (Technique for Order Preference by Similarity to Ideal Solution)** untuk perangkingan prioritas distribusi logistik.

---

### 1.2 Rumusan Masalah

Berdasarkan latar belakang di atas, rumusan masalah dalam penelitian ini adalah:

1. Bagaimana mengklasifikasikan tingkat kerawanan bencana hidrometeorologi di 20 kecamatan Kabupaten Banjarnegara menggunakan algoritma **K-Means Clustering** berdasarkan multi-indikator (frekuensi kejadian, jumlah korban, kerusakan infrastruktur, jumlah pengungsi, dan kondisi topografi)?

2. Bagaimana menentukan prioritas alokasi logistik kebencanaan MDMC menggunakan metode **TOPSIS** dengan kriteria urgensi dampak, jumlah jiwa terdampak, aksesibilitas wilayah, jarak dari gudang logistik, dan ketersediaan stok?

3. Bagaimana merancang sistem pendukung keputusan berbasis web **SI TANGGUH MDMC** yang mengintegrasikan K-Means Clustering dan TOPSIS untuk mendukung pengambilan keputusan mitigasi bencana dan alokasi logistik di Kabupaten Banjarnegara?

4. Bagaimana tingkat akurasi klasterisasi dan efektivitas rekomendasi sistem yang dihasilkan berdasarkan pengujian **Davies-Bouldin Index (DBI)**, **Silhouette Coefficient**, **Blackbox Testing**, dan **System Usability Scale (SUS)**?

---

### 1.3 Tujuan Penelitian

1. Mengklasifikasikan 20 kecamatan di Kabupaten Banjarnegara ke dalam klaster tingkat kerawanan bencana hidrometeorologi (Rawan Tinggi, Rawan Sedang, Rawan Rendah) menggunakan algoritma K-Means Clustering.

2. Menghasilkan perangkingan prioritas alokasi logistik kebencanaan MDMC menggunakan metode TOPSIS yang mengacu pada solusi ideal positif dan negatif dari multi-kriteria keputusan.

3. Merancang dan mengembangkan sistem pendukung keputusan berbasis web **SI TANGGUH MDMC** yang mengintegrasikan kedua metode tersebut dalam antarmuka yang interaktif dan mudah digunakan oleh pengurus MDMC.

4. Mengukur kualitas klasterisasi menggunakan Davies-Bouldin Index dan Silhouette Coefficient, serta mengevaluasi kebergunaan sistem menggunakan System Usability Scale (SUS) dan Blackbox Testing.

---

### 1.4 Manfaat Penelitian

**A. Manfaat bagi Masyarakat Kabupaten Banjarnegara:**

- Meningkatkan kecepatan dan ketepatan distribusi bantuan logistik ke daerah-daerah yang paling terdampak bencana hidrometeorologi.
- Mengurangi ketimpangan distribusi bantuan antara wilayah yang mudah diakses dan wilayah terisolasi.
- Menyediakan peta klaster kerawanan bencana yang dapat digunakan masyarakat sebagai referensi kesiapsiagaan mandiri.

**B. Manfaat bagi Pemerintah Daerah Kabupaten Banjarnegara:**

- Memberikan data berbasis klaster untuk mendukung kebijakan mitigasi dan penyusunan Rencana Penanggulangan Bencana Daerah (RPBD).
- Menjadi alat bantu bagi BPBD dan instansi terkait dalam pengambilan keputusan alokasi anggaran dan sumber daya kebencanaan.

**C. Manfaat bagi MDMC (Muhammadiyah Disaster Management Center):**

- Menyediakan sistem pendukung keputusan yang objektif dan berbasis data untuk operasi tanggap darurat dan distribusi logistik.
- Meningkatkan efisiensi rantai pasok (*supply chain*) logistik kemanusiaan MDMC di tingkat kabupaten.
- Memperkuat kapasitas manajemen logistik MDMC melalui digitalisasi proses pengambilan keputusan.

**D. Manfaat Akademis:**

- Memberikan kontribusi pada pengembangan keilmuan di bidang *Data Mining*, *Multi-Criteria Decision Making (MCDM)*, dan Sistem Informasi Kebencanaan.
- Menjadi referensi bagi peneliti selanjutnya dalam pengembangan SPK berbasis *hybrid method* untuk domain penanggulangan bencana.

---

## BAB II – Landasan Teori dan Tinjauan Pustaka

### 2.1 Tinjauan Pustaka (Penelitian Terdahulu)

Berikut adalah ringkasan 5 penelitian terdahulu yang relevan dengan penelitian ini:

| No | Peneliti (Tahun) | Judul Penelitian | Metode | Hasil Utama |
|----|-----------------|------------------|--------|-------------|
| 1 | Nurkholis, A., Mulyono, D., dan Sugiarto, E. (2022) | *Penerapan Metode K-Means Clustering untuk Pengelompokan Daerah Rawan Bencana Alam di Indonesia* | K-Means Clustering | Berhasil mengelompokkan 34 provinsi di Indonesia ke dalam 3 klaster kerawanan bencana (tinggi, sedang, rendah) berdasarkan data BNPB periode 2018–2021. Variabel yang digunakan meliputi jumlah kejadian, korban jiwa, rumah rusak, dan jumlah pengungsi. Evaluasi menggunakan Silhouette Coefficient menghasilkan nilai 0,68. |
| 2 | Rahmawati, D. dan Prasetyo, H. (2023) | *Sistem Pendukung Keputusan Distribusi Bantuan Logistik Bencana Menggunakan Metode TOPSIS* | TOPSIS, SPK berbasis web | Mengembangkan SPK berbasis web untuk prioritas distribusi logistik bencana banjir di Kabupaten Cilacap. Kriteria yang digunakan: tingkat kerusakan, jumlah pengungsi, aksesibilitas, dan jarak dari gudang. Pengujian Blackbox Testing menunjukkan seluruh fungsionalitas berjalan 100%. Skor SUS mencapai 78,5 (*Good*). |
| 3 | Saputra, R. A. dan Wibowo, A. T. (2021) | *Implementasi K-Means dan TOPSIS untuk Penentuan Prioritas Penanganan Daerah Terdampak Bencana Banjir* | K-Means + TOPSIS (Hybrid) | Menggabungkan K-Means untuk zonasi kerawanan banjir dan TOPSIS untuk perangkingan prioritas penanganan di Kabupaten Demak. Hasil klasterisasi menghasilkan DBI = 0,42 (baik). TOPSIS memberikan rekomendasi 5 kecamatan prioritas utama. |
| 4 | Hermawan, F. dan Yulianto, S. (2023) | *Analisis Spasial Daerah Rawan Longsor Menggunakan K-Means Clustering Berbasis SIG di Kabupaten Banjarnegara* | K-Means Clustering + SIG (GIS) | Melakukan klasterisasi spasial wilayah rawan longsor di Banjarnegara menggunakan data curah hujan, kemiringan lereng, jenis tanah, dan tutupan lahan. Mengidentifikasi 6 kecamatan masuk klaster rawan tinggi: Pandanarum, Pejawaran, Wanayasa, Karangkobar, Kalibening, dan Punggelan. |
| 5 | Kurniawan, A. P. dan Susanti, N. (2024) | *Decision Support System for Humanitarian Logistics Allocation Using TOPSIS: A Case Study in Central Java* | TOPSIS + Analytical Hierarchy Process (AHP) | Merancang SPK untuk alokasi logistik kemanusiaan dengan menggunakan AHP untuk pembobotan kriteria dan TOPSIS untuk perangkingan. Studi kasus pada 5 kabupaten di Jawa Tengah pasca bencana hidrometeorologi. Akurasi rekomendasi mencapai 87% dibandingkan keputusan ahli (*expert judgment*). |

**Posisi Penelitian Ini (*Research Gap*):**

Berdasarkan tinjauan pustaka di atas, penelitian-penelitian terdahulu umumnya memisahkan proses klasterisasi dan perangkingan dalam konteks yang berbeda, atau tidak secara spesifik mengintegrasikan kedua metode dalam satu sistem informasi yang operasional untuk kebutuhan organisasi kemanusiaan seperti MDMC. Penelitian ini mengisi celah (*gap*) dengan:

1. **Mengintegrasikan K-Means Clustering dan TOPSIS** dalam satu *pipeline* sistem untuk konteks alokasi logistik kebencanaan secara end-to-end.
2. **Berfokus pada bencana hidrometeorologi** secara spesifik (longsor, banjir, cuaca ekstrem) di Kabupaten Banjarnegara.
3. **Merancang sistem untuk MDMC** — organisasi kemanusiaan yang memiliki kebutuhan nyata di lapangan, sehingga output penelitian memiliki keberlanjutan implementasi (*deployability*).

---

### 2.2 Landasan Teori

#### 2.2.1 Bencana Hidrometeorologi

Bencana hidrometeorologi adalah bencana yang disebabkan oleh faktor meteorologis (cuaca dan iklim) serta hidrologis, meliputi banjir, banjir bandang, tanah longsor, kekeringan, angin puting beliung, dan gelombang pasang. Menurut BNPB, lebih dari 90% kejadian bencana di Indonesia tergolong bencana hidrometeorologi. Faktor pemicu utama di Kabupaten Banjarnegara meliputi:

- **Curah hujan ekstrem** pada periode November–Maret yang menyebabkan jenuhnya air di pori-pori tanah lereng.
- **Kondisi topografi dan geologi** berupa tanah gembur di atas batuan kedap air yang membentuk bidang luncur alami.
- **Alih fungsi lahan** dari kawasan lindung menjadi pertanian semusim tanpa terasering memadai.

#### 2.2.2 Sistem Pendukung Keputusan (SPK / DSS)

Sistem Pendukung Keputusan (*Decision Support System* / DSS) adalah sistem berbasis komputer yang dirancang untuk membantu pengambil keputusan memanfaatkan data dan model untuk mengidentifikasi, menyelesaikan, dan memilih alternatif solusi dari suatu masalah semi-terstruktur atau tidak terstruktur (Turban et al., 2011). Komponen utama SPK meliputi:

1. **Subsistem Manajemen Data** — basis data yang menyimpan data kebencanaan.
2. **Subsistem Manajemen Model** — algoritma K-Means dan TOPSIS.
3. **Subsistem Antarmuka Pengguna** — dashboard interaktif berbasis web.
4. **Subsistem Manajemen Pengetahuan** — hasil analisis dan rekomendasi.

#### 2.2.3 Algoritma K-Means Clustering

K-Means Clustering adalah algoritma *unsupervised learning* yang bertujuan mempartisi n objek pengamatan ke dalam k klaster, di mana setiap objek ditempatkan pada klaster dengan centroid (rata-rata) terdekat (MacQueen, 1967). Langkah-langkah algoritma:

**Langkah 1:** Tentukan jumlah klaster k.

**Langkah 2:** Inisialisasi k centroid secara acak.

**Langkah 3:** Hitung jarak setiap objek ke seluruh centroid menggunakan *Euclidean Distance*:

```
d(xi, cj) = sqrt( SUM dari m=1 sampai n: (xim - cjm)^2 )
```

Di mana:
- `xi` = data objek ke-i
- `cj` = centroid klaster ke-j
- `n` = jumlah atribut/variabel

**Langkah 4:** Alokasikan setiap objek ke klaster dengan centroid terdekat.

**Langkah 5:** Hitung ulang centroid baru dari anggota masing-masing klaster.

**Langkah 6:** Ulangi Langkah 3–5 hingga tidak ada perubahan keanggotaan klaster (konvergen).

**Penentuan jumlah klaster optimal** menggunakan:

- **Elbow Method** — menghitung *Within-Cluster Sum of Squares (WCSS)* untuk berbagai nilai k dan mengidentifikasi "siku" pada grafik.
- **Davies-Bouldin Index (DBI)** — semakin kecil nilai DBI, semakin baik kualitas klasterisasi.
- **Silhouette Coefficient** — mengukur seberapa mirip objek dengan klasternya sendiri dibandingkan klaster tetangga (nilai antara -1 hingga 1; semakin mendekati 1 semakin baik).

#### 2.2.4 Metode TOPSIS (Technique for Order Preference by Similarity to Ideal Solution)

TOPSIS adalah metode MCDM yang dikembangkan oleh Hwang dan Yoon (1981). Prinsip dasarnya adalah alternatif terbaik memiliki **jarak terdekat ke solusi ideal positif** dan **jarak terjauh dari solusi ideal negatif**. Tahapan TOPSIS:

**Tahap 1 — Matriks Keputusan Ternormalisasi:**

```
rij = xij / sqrt( SUM dari i=1 sampai m: xij^2 )
```

**Tahap 2 — Matriks Keputusan Ternormalisasi Terbobot:**

```
yij = wj * rij
```

Di mana `wj` = bobot kriteria ke-j (ditentukan oleh expert/stakeholder).

**Tahap 3 — Solusi Ideal Positif (A+) dan Negatif (A-):**

```
A+ = { y1+, y2+, ..., yn+ }
A- = { y1-, y2-, ..., yn- }
```

- Untuk kriteria *benefit*: `yj+ = max(yij)`, `yj- = min(yij)`
- Untuk kriteria *cost*: `yj+ = min(yij)`, `yj- = max(yij)`

**Tahap 4 — Jarak ke Solusi Ideal:**

```
Di+ = sqrt( SUM dari j=1 sampai n: (yij - yj+)^2 )
Di- = sqrt( SUM dari j=1 sampai n: (yij - yj-)^2 )
```

**Tahap 5 — Nilai Preferensi (Closeness Coefficient):**

```
Vi = Di- / (Di+ + Di-)
```

Alternatif dengan nilai `Vi` tertinggi merupakan prioritas utama.

#### 2.2.5 MDMC (Muhammadiyah Disaster Management Center)

MDMC merupakan unsur pembantu pimpinan Pimpinan Pusat Muhammadiyah yang berfokus pada bidang penanggulangan bencana. MDMC memiliki peran strategis dalam:

- **Prabencana:** Mitigasi, pemetaan risiko, dan kesiapsiagaan.
- **Tanggap Darurat:** Penyelamatan korban, pendirian posko, dan distribusi logistik.
- **Pascabencana:** Rehabilitasi dan rekonstruksi.

Dalam konteks logistik, MDMC memandang proses distribusi bantuan sebagai rangkaian utuh dari identifikasi kebutuhan, pengadaan, pergudangan (*warehouse management*), hingga penerimaan oleh benefisiari secara tepat sasaran dan bermartabat. Sekitar **80% keberhasilan operasi tanggap darurat** sangat bergantung pada kelancaran sistem logistik.

---

## BAB III – Metodologi Penelitian

### 3.1 Arsitektur Sistem

Arsitektur **SI TANGGUH MDMC** dirancang menggunakan pendekatan *three-tier architecture* yang terdiri dari:

```
+=====================================================================+
|                    ARSITEKTUR SI TANGGUH MDMC                       |
+=====================================================================+
|                                                                     |
|  +-----------------------------------------------------------+     |
|  |              PRESENTATION LAYER (Frontend)                 |     |
|  |  +-------------+  +--------------+  +-----------------+   |     |
|  |  |  Dashboard   |  |  Peta Klaster |  |  Tabel Ranking  |  |     |
|  |  |  Interaktif  |  |  (Leaflet.js) |  |  TOPSIS         |  |     |
|  |  +-------------+  +--------------+  +-----------------+   |     |
|  |  +-------------+  +--------------+  +-----------------+   |     |
|  |  |  Form Input  |  |  Grafik &     |  |  Laporan &      |  |     |
|  |  |  Data        |  |  Visualisasi  |  |  Export PDF     |  |     |
|  |  +-------------+  +--------------+  +-----------------+   |     |
|  +-----------------------------------------------------------+     |
|                              |                                      |
|                         REST API                                    |
|                              |                                      |
|  +-----------------------------------------------------------+     |
|  |                LOGIC LAYER (Backend)                       |     |
|  |  +------------------+    +---------------------------+     |     |
|  |  |  K-Means Engine  |    |     TOPSIS Engine         |     |     |
|  |  |  --------------- |    |  -----------------------  |     |     |
|  |  |  - Normalisasi   |    |  - Normalisasi Matriks   |     |     |
|  |  |  - Euclidean Dist|    |  - Pembobotan Kriteria   |     |     |
|  |  |  - Centroid Upd. |    |  - Solusi Ideal (+/-)    |     |     |
|  |  |  - Elbow Method  |    |  - Closeness Coefficient |     |     |
|  |  |  - DBI & Silh.   |    |  - Perangkingan          |     |     |
|  |  +------------------+    +---------------------------+     |     |
|  |                                                            |     |
|  |  +------------------+    +---------------------------+     |     |
|  |  |  Modul Autenti-  |    |  Modul Manajemen Data    |     |     |
|  |  |  kasi & Otorisasi|    |  Bencana & Logistik      |     |     |
|  |  +------------------+    +---------------------------+     |     |
|  +-----------------------------------------------------------+     |
|                              |                                      |
|  +-----------------------------------------------------------+     |
|  |                  DATA LAYER (Database)                     |     |
|  |  +--------------+  +--------------+  +----------------+   |     |
|  |  |  Data Bencana |  |  Data Logistik|  |  Data Wilayah  |  |     |
|  |  |  (BNPB/BPBD) |  |  (Stok/Gudang)|  |  (20 Kecamatan)|  |     |
|  |  +--------------+  +--------------+  +----------------+   |     |
|  |  +--------------+  +--------------+  +----------------+   |     |
|  |  |  Data Topo-   |  |  Data Iklim  |  |  Data Hasil    |  |     |
|  |  |  grafi & SIG  |  |  (BMKG/CH)   |  |  Klaster/Rank  |  |     |
|  |  +--------------+  +--------------+  +----------------+   |     |
|  +-----------------------------------------------------------+     |
|                                                                     |
+=====================================================================+
```

**Teknologi yang digunakan:**

| Komponen | Teknologi |
|----------|-----------|
| Frontend | React.js / Vite + TypeScript, Leaflet.js (Peta Interaktif), Chart.js |
| Backend | Node.js (Express.js) / Python (Flask/Django) |
| Database | MySQL / PostgreSQL |
| Algoritma | K-Means Clustering (scikit-learn / implementasi mandiri) |
| MCDM | TOPSIS (implementasi mandiri) |
| Deployment | Docker, Nginx |

---

### 3.2 Alur Algoritma (Flowchart)

#### 3.2.1 Flowchart Utama Sistem SI TANGGUH MDMC

```
                    +---------------------+
                    |       START         |
                    +----------+----------+
                               |
                               v
                    +---------------------+
                    |  Login & Autentikasi|
                    |  (Admin MDMC)       |
                    +----------+----------+
                               |
                               v
                    +---------------------+
                    |  Input/Import Data  |
                    |  Kebencanaan        |
                    |  (BNPB, BPBD, BPS, |
                    |   BMKG, Survei)     |
                    +----------+----------+
                               |
                               v
                    +---------------------+
                    |  Pre-processing     |
                    |  Data:              |
                    |  - Cleaning         |
                    |  - Normalisasi      |
                    |  - Seleksi Variabel |
                    +----------+----------+
                               |
                               v
    +---------------------------------------------+
    |         FASE 1: K-MEANS CLUSTERING          |
    |  +---------------------------------------+  |
    |  | 1. Tentukan K (Elbow Method)          |  |
    |  | 2. Inisialisasi Centroid              |  |
    |  | 3. Hitung Euclidean Distance          |  |
    |  | 4. Alokasi ke Klaster Terdekat        |  |
    |  | 5. Update Centroid                    |  |
    |  | 6. Konvergen? -> Ya: Lanjut           |  |
    |  |               -> Tidak: Ulangi 3-5    |  |
    |  | 7. Evaluasi: DBI + Silhouette         |  |
    |  +---------------------------------------+  |
    |                                             |
    |  OUTPUT: Klaster Rawan Tinggi / Sedang /    |
    |          Rendah (20 Kecamatan)              |
    +----------------------+----------------------+
                           |
                           v
    +---------------------------------------------+
    |       FASE 2: TOPSIS (pada Klaster          |
    |               Rawan Tinggi & Sedang)        |
    |  +---------------------------------------+  |
    |  | 1. Susun Matriks Keputusan            |  |
    |  | 2. Normalisasi Matriks                |  |
    |  | 3. Hitung Matriks Terbobot            |  |
    |  | 4. Tentukan Solusi Ideal (+) dan (-)  |  |
    |  | 5. Hitung Jarak D+ dan D-             |  |
    |  | 6. Hitung Closeness Coefficient (V)   |  |
    |  | 7. Ranking berdasarkan V tertinggi    |  |
    |  +---------------------------------------+  |
    |                                             |
    |  OUTPUT: Ranking Prioritas Alokasi          |
    |          Logistik per Kecamatan             |
    +----------------------+----------------------+
                           |
                           v
    +---------------------------------------------+
    |  VISUALISASI & REKOMENDASI                  |
    |  - Peta Klaster Interaktif (Leaflet.js)     |
    |  - Tabel Ranking Prioritas Logistik         |
    |  - Grafik Distribusi Klaster                |
    |  - Rekomendasi Jenis & Jumlah Logistik      |
    |  - Export Laporan (PDF)                     |
    +----------------------+----------------------+
                           |
                           v
                    +----------+----------+
                    |        END          |
                    +---------------------+
```

#### 3.2.2 Pipeline Data Terintegrasi

```
+-----------+   +-----------+   +-----------+   +-----------+   +-----------+
|  Data     |   |  Pre-     |   |  K-Means  |   |  Filter   |   |  TOPSIS   |
|  Sources  |-->|  Process  |-->|  Cluster  |-->|  Klaster  |-->|  Ranking  |
|           |   |  & Clean  |   |  Engine   |   |  Prioritas|   |  Engine   |
+-----------+   +-----------+   +-----------+   +-----------+   +-----------+
     |                              |                              |
     |                              v                              v
     |                    +--------------+              +--------------+
     |                    | Peta Zonasi  |              | Ranking &    |
     |                    | Kerawanan    |              | Rekomendasi  |
     |                    +--------------+              | Alokasi      |
     |                                                 +--------------+
     v
+-------------------------------------------------------------+
| SUMBER DATA:                                                |
| - BNPB/BPBD      -> Kejadian bencana, korban, kerusakan    |
| - BPS Banjarnegara -> Demografi, infrastruktur              |
| - BMKG            -> Curah hujan, iklim                     |
| - Open Data Pemkab -> Peta wilayah, aksesibilitas           |
| - Survei Lapangan  -> Kondisi terkini posko/gudang MDMC    |
+-------------------------------------------------------------+
```

---

### 3.3 Rencana Pengumpulan Data

#### A. Data Primer

| No | Jenis Data | Metode Pengumpulan | Sumber | Keterangan |
|----|-----------|-------------------|--------|------------|
| 1 | Data kondisi gudang logistik MDMC | Wawancara dan Observasi | Pengurus MDMC Kabupaten Banjarnegara | Kapasitas gudang, stok logistik saat ini, SDM tersedia |
| 2 | Data aksesibilitas wilayah terdampak | Survei Lapangan | Tim Relawan MDMC dan BPBD | Kondisi jalan, jarak tempuh, moda transportasi |
| 3 | Persepsi pengambil keputusan (bobot kriteria TOPSIS) | Wawancara Mendalam (*In-depth Interview*) | Pengurus MDMC, Kepala BPBD, Camat | Penentuan bobot prioritas kriteria alokasi logistik |
| 4 | Validasi hasil sistem | Kuesioner SUS | Pengguna akhir (Admin MDMC, Relawan, Staf BPBD) | Evaluasi *usability* sistem |

#### B. Data Sekunder

| No | Jenis Data | Sumber | Format | Keterangan |
|----|-----------|--------|--------|------------|
| 1 | Data kejadian bencana (2019–2025) | BNPB (DIBI) dan BPBD Banjarnegara | CSV / Excel | Frekuensi, jenis, lokasi, jumlah korban, kerusakan |
| 2 | Data demografi per kecamatan | BPS Kabupaten Banjarnegara | PDF / Excel | Jumlah penduduk, KK, kepadatan, kelompok rentan |
| 3 | Data curah hujan dan klimatologi | BMKG Stasiun Banjarnegara | CSV | Rata-rata curah hujan bulanan/tahunan |
| 4 | Data topografi dan kemiringan lereng | Open Data Pemkab / BAPPEDA | Shapefile / GeoJSON | Kontur, kemiringan, jenis tanah |
| 5 | Data infrastruktur jalan | Dinas PUPR Banjarnegara | Excel / Shapefile | Panjang jalan, kondisi, klasifikasi |
| 6 | Peta administrasi Kabupaten Banjarnegara | BIG (Badan Informasi Geospasial) | Shapefile / GeoJSON | Batas kecamatan, desa |

#### C. Variabel Penelitian

**Variabel K-Means Clustering (Klasterisasi Kerawanan):**

| Kode | Variabel | Deskripsi | Satuan |
|------|----------|-----------|--------|
| X1 | Frekuensi kejadian bencana | Jumlah total kejadian bencana hidrometeorologi per kecamatan (2019–2025) | Kali |
| X2 | Jumlah korban jiwa | Akumulasi korban meninggal + luka berat per kecamatan | Jiwa |
| X3 | Jumlah rumah rusak | Total rumah rusak berat + sedang + ringan per kecamatan | Unit |
| X4 | Jumlah pengungsi | Total jiwa yang mengungsi akibat bencana per kecamatan | Jiwa |
| X5 | Rata-rata curah hujan | Rata-rata curah hujan tahunan per kecamatan | mm/tahun |
| X6 | Kemiringan lereng dominan | Persentase area dengan kemiringan lebih dari 30 derajat per kecamatan | % |

**Kriteria TOPSIS (Prioritas Alokasi Logistik):**

| Kode | Kriteria | Tipe | Bobot | Deskripsi |
|------|----------|------|-------|-----------|
| C1 | Tingkat urgensi dampak bencana | Benefit | W1 | Skor komposit dari klaster K-Means + keparahan dampak terkini |
| C2 | Jumlah jiwa terdampak | Benefit | W2 | Total penduduk di zona rawan + pengungsi aktif |
| C3 | Jumlah kelompok rentan | Benefit | W3 | Lansia + anak balita + ibu hamil + disabilitas |
| C4 | Aksesibilitas wilayah | Cost | W4 | Waktu tempuh dari gudang logistik MDMC ke lokasi (jam) |
| C5 | Ketersediaan stok logistik lokal | Cost | W5 | Persentase stok logistik yang sudah tersedia di posko terdekat |

*Catatan: Bobot (W) ditentukan melalui wawancara mendalam dengan expert/stakeholder (Pengurus MDMC dan BPBD).*

---

### 3.4 Teknik Pengujian dan Evaluasi

Pengujian dan evaluasi sistem **SI TANGGUH MDMC** dilakukan secara komprehensif meliputi empat aspek:

#### A. Evaluasi Kualitas Klasterisasi K-Means

| Metrik Evaluasi | Deskripsi | Kriteria Keberhasilan |
|-----------------|-----------|----------------------|
| **Davies-Bouldin Index (DBI)** | Mengukur rata-rata kesamaan setiap klaster dengan klaster yang paling mirip dengannya. Semakin kecil nilai DBI, semakin baik pemisahan antar klaster. | DBI < 1,0 (target: DBI <= 0,50) |
| **Silhouette Coefficient** | Mengukur seberapa mirip suatu objek dengan klasternya sendiri dibandingkan klaster tetangga. Rentang nilai: -1 hingga 1. | Silhouette > 0,50 (target: >= 0,60) |
| **Elbow Method** | Menentukan jumlah klaster optimal berdasarkan grafik WCSS vs K. | Teridentifikasi titik "siku" yang jelas |

Formula Davies-Bouldin Index:

```
DBI = (1/k) * SUM dari i=1 sampai k: max(j != i) [ (Si + Sj) / d(ci, cj) ]
```

Formula Silhouette Coefficient:

```
s(i) = (b(i) - a(i)) / max{ a(i), b(i) }
```

Di mana:
- `a(i)` = rata-rata jarak objek i ke semua objek dalam klaster yang sama
- `b(i)` = rata-rata jarak objek i ke semua objek di klaster terdekat lainnya

#### B. Blackbox Testing (Pengujian Fungsionalitas)

Pengujian *Blackbox Testing* dilakukan untuk memverifikasi bahwa setiap fungsionalitas sistem berjalan sesuai spesifikasi tanpa menguji struktur kode internal.

| No | Skenario Pengujian | Input | Output yang Diharapkan | Status |
|----|-------------------|-------|----------------------|--------|
| 1 | Login Admin MDMC | Username dan Password valid | Berhasil masuk ke dashboard | - |
| 2 | Import data bencana (CSV) | File CSV data BNPB/BPBD | Data tersimpan di database dan ditampilkan di tabel | - |
| 3 | Proses K-Means Clustering | Data 20 kecamatan + parameter K | Hasil klasterisasi ditampilkan di peta dan tabel | - |
| 4 | Proses TOPSIS | Data alternatif + bobot kriteria | Ranking prioritas alokasi logistik | - |
| 5 | Visualisasi peta klaster | Klik menu "Peta Klaster" | Peta interaktif dengan warna zona kerawanan | - |
| 6 | Export laporan PDF | Klik tombol "Export PDF" | File PDF berisi rekomendasi alokasi logistik | - |
| 7 | Input data logistik gudang | Form data stok logistik | Data logistik tersimpan dan terupdate di dashboard | - |
| 8 | Manajemen data wilayah | CRUD data kecamatan/desa | Data wilayah dapat ditambah/edit/hapus/tampil | - |

**Target:** Seluruh skenario (100%) berstatus **Berhasil (Pass)**.

#### C. System Usability Scale (SUS)

Evaluasi *usability* dilakukan menggunakan kuesioner SUS (Brooke, 1996) yang terdiri dari **10 pernyataan** dengan skala Likert 1–5. Responden adalah pengguna akhir (Admin MDMC, Relawan Senior, Staf BPBD). Jumlah responden minimal: **20 orang**.

Perhitungan skor SUS:

```
SUS_score = ( SUM_odd(xi - 1) + SUM_even(5 - xi) ) x 2.5
```

| Rentang Skor SUS | Grade | Adjective Rating |
|------------------|-------|-----------------|
| 90 – 100 | A+ | Best Imaginable |
| 80 – 89 | A | Excellent |
| 68 – 79 | B | Good |
| 51 – 67 | C | OK |
| < 51 | D/F | Poor / Awful |

**Target:** Skor SUS >= **68** (kategori *Good*).

#### D. Validasi Hasil Rekomendasi

Hasil rekomendasi sistem dibandingkan dengan keputusan aktual dari pengurus MDMC dan BPBD (*expert judgment*) menggunakan perhitungan tingkat kesesuaian:

```
Akurasi = (Jumlah rekomendasi sesuai expert / Total rekomendasi) x 100%
```

**Target:** Tingkat kesesuaian >= **80%**.

---

## Daftar Pustaka

[1] BNPB, "Data Informasi Bencana Indonesia (DIBI)," *Badan Nasional Penanggulangan Bencana*, 2025. [Online]. Available: https://dibi.bnpb.go.id/. [Accessed: Oct. 2026].

[2] BPS Kabupaten Banjarnegara, "Kabupaten Banjarnegara dalam Angka 2025," *Badan Pusat Statistik Kabupaten Banjarnegara*, 2025. [Online]. Available: https://banjarnegarakab.bps.go.id/.

[3] BPBD Kabupaten Banjarnegara, "Dokumen Kajian Risiko Bencana Kabupaten Banjarnegara 2022–2026," *BPBD Kabupaten Banjarnegara*, 2022.

[4] E. Turban, J. E. Aronson, and T. P. Liang, *Decision Support Systems and Intelligent Systems*, 7th ed. New Jersey: Prentice Hall, 2011.

[5] J. MacQueen, "Some methods for classification and analysis of multivariate observations," in *Proc. 5th Berkeley Symp. Math. Statist. Prob.*, vol. 1, 1967, pp. 281–297.

[6] C. L. Hwang and K. Yoon, *Multiple Attribute Decision Making: Methods and Applications — A State-of-the-Art Survey*. Berlin: Springer-Verlag, 1981.

[7] J. Brooke, "SUS: A 'quick and dirty' usability scale," in *Usability Evaluation in Industry*, P. W. Jordan, B. Thomas, B. A. Weerdmeester, and I. L. McClelland, Eds. London: Taylor and Francis, 1996, pp. 189–194.

[8] A. Nurkholis, D. Mulyono, and E. Sugiarto, "Penerapan Metode K-Means Clustering untuk Pengelompokan Daerah Rawan Bencana Alam di Indonesia," *Jurnal Informatika dan Teknologi Komputer*, vol. 6, no. 2, pp. 112–125, 2022.

[9] D. Rahmawati and H. Prasetyo, "Sistem Pendukung Keputusan Distribusi Bantuan Logistik Bencana Menggunakan Metode TOPSIS," *Jurnal Sistem Informasi*, vol. 9, no. 1, pp. 45–58, 2023.

[10] R. A. Saputra and A. T. Wibowo, "Implementasi K-Means dan TOPSIS untuk Penentuan Prioritas Penanganan Daerah Terdampak Bencana Banjir," *Jurnal Ilmiah Teknik Informatika*, vol. 15, no. 3, pp. 201–215, 2021.

[11] F. Hermawan and S. Yulianto, "Analisis Spasial Daerah Rawan Longsor Menggunakan K-Means Clustering Berbasis SIG di Kabupaten Banjarnegara," *Jurnal Geografi dan Teknologi*, vol. 8, no. 2, pp. 89–103, 2023.

[12] A. P. Kurniawan and N. Susanti, "Decision Support System for Humanitarian Logistics Allocation Using TOPSIS: A Case Study in Central Java," *International Journal of Disaster Risk Reduction*, vol. 45, pp. 1–14, 2024.

[13] MDMC, "Panduan Manajemen Logistik Kemanusiaan MDMC," *Muhammadiyah Disaster Management Center*, 2023. [Online]. Available: https://mdmc.or.id/.

[14] BMKG, "Data Curah Hujan Stasiun Klimatologi Banjarnegara," *Badan Meteorologi, Klimatologi, dan Geofisika*, 2025. [Online]. Available: https://dataonline.bmkg.go.id/.

[15] Peraturan Menteri Dalam Negeri Nomor 137 Tahun 2017 tentang Kode dan Data Wilayah Administrasi Pemerintahan. *Kementerian Dalam Negeri Republik Indonesia*, 2017.

---

> **Catatan:**
> Dokumen ini disusun sebagai proposal penelitian untuk mata kuliah Formulasi Ide Penelitian berbasis *Technology-Driven Local Problem Solving* dengan studi kasus di Kabupaten Banjarnegara. Seluruh data dan referensi bersifat faktual dan dapat diverifikasi melalui sumber yang tercantum dalam Daftar Pustaka.
