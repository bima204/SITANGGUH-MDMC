// ============================================================
// TIRTA — Types & Interfaces
// SPK Logistik Kekeringan MDMC Banjarnegara
// ============================================================

export type MusimType = 'kemarau' | 'hujan';

export interface PosDugaAir {
  id: string;
  nama: string;
  sungai?: string;
  wilayahSungai: string;
  lat: number;
  lng: number;
  debitAir: number;        // m³/detik
  tma: number;             // Tinggi Muka Air (meter)
  tmaNormal: number;       // Batas Aman (meter)
  tmaWaspada: number;      // Batas Waspada (meter)
  tmaSiaga: number;        // Batas Siaga/Bahaya (meter)
  status: 'normal' | 'waspada' | 'siaga';
  curahHujan24j: number;   // Curah Hujan 24 Jam (mm/hari)
  tren: 'naik' | 'stabil' | 'turun';
  kapasitasWadukPersen?: number;
  elevasiWadukMdpl?: number;
  keterangan: string;
}

export type JenisBencanaHujan = 
  | 'tanah_longsor'      // Tanah Longsor Tebing (lereng curam Dieng/Utara)
  | 'gerakan_tanah'      // Gerakan Tanah / Retakan (perbukitan lempung Punggelan/Karangkobar)
  | 'banjir_luapan'      // Luapan Aliran Sungai (bantaran DAS Serayu & Merawu)
  | 'aman_stabil';       // Relatif Aman / Morfologi Stabil

export type StatusKerawananHujan = 'rawan_tinggi' | 'waspada' | 'aman';

export interface Desa {
  id: string;
  namaDesa: string;
  namaKecamatan: string;
  lat: number;
  lng: number;
  // Kriteria SPK Kemarau
  jumlahWarga: number;       // C1: Jumlah warga terdampak (jiwa)
  defisitAir: number;        // C2: Defisit air bersih harian (liter/hari)
  durasiKekeringan: number;  // C3: Durasi kekeringan (hari)
  rasioRentan: number;       // C4: Rasio kelompok rentan & fasum (%)
  jarakSumber: number;       // C5: Jarak dari sumber air (km)
  indeksHambatan: number;    // C6: Indeks hambatan medan jalan (1–5)
  // Demografi Total Desa & Rasio Terdampak
  totalWargaDesa?: number;   // Total populasi desa keseluruhan (jiwa)
  totalKK?: number;          // Total Kepala Keluarga (KK) desa
  kkTerdampak?: number;      // Jumlah KK terdampak kekeringan
  persenTerdampak?: number;  // Persentase warga terdampak terhadap total desa (%)
  // Kriteria SPK Musim Hujan (Deteksi Kerawanan Bencana Longsor, Debit & Banjir)
  curahHujan?: number;          // H1: Curah hujan harian (mm/24j)
  kemiringanLereng?: number;    // H2: Kemiringan lereng topografi (%)
  indeksLongsor?: number;       // H3: Indeks kerentanan gerakan tanah PVMBG (1–5)
  wargaTerancam?: number;       // H4: Populasi terancam zona bahaya lereng/bantaran (jiwa)
  jarakSungai?: number;         // H5: Jarak ke sempadan aliran sungai utama / DAS (km)
  indeksDrainase?: number;      // H6: Hambatan drainase & kebasahan tanah (1–5)
  namaBukitFormasi?: string;    // Formasi bukit / tebing terdekat
  elevasiMdpl?: number;         // Ketinggian wilayah (mdpl)
  namaSungaiTerdekat?: string;  // Sungai / Sub-DAS terdekat
  ambangBatasHujan?: string;    // Ambang batas prediksi pemicu longsor/banjir
  statusKerawananHujan?: StatusKerawananHujan; // Rawan Tinggi, Waspada, Aman
  jenisBencanaDominan?: JenisBencanaHujan;
  detailPotensiBencana?: string; // Penjelasan spesifik potensi bencana
  rekomendasiTimSar?: number;   // Personil Tim SAR & Relawan MDMC
  kebutuhanLogistikHujan?: string; // Tenda, Bronjong, EWS, Perahu Karet, Terpal
  // Hasil kalkulasi
  cluster?: 'kritis' | 'waspada' | 'siaga';
  topsisScore?: number;
  rank?: number;
  // Stok & distribusi
  stokAirTersedia?: number;  // liter
}

export interface KMeansConfig {
  k: number;
  maxIter: number;
}

export interface TopsisBobot {
  c1: number; // Kemarau: Warga | Hujan: Curah Hujan
  c2: number; // Kemarau: Defisit | Hujan: Kemiringan Lereng
  c3: number; // Kemarau: Durasi | Hujan: Indeks Longsor PVMBG
  c4: number; // Kemarau: Rentan | Hujan: Warga Terancam
  c5: number; // Kemarau: Jarak Sumber | Hujan: Jarak Sungai (Cost)
  c6: number; // Kemarau: Hambatan | Hujan: Indeks Drainase
}

export interface TopsisCalculationDetails {
  divisors: number[];
  weights: number[];
  idealPos: number[];
  idealNeg: number[];
}

export interface TopsisResult {
  desa: Desa;
  rawCriteria: number[];
  normalMatrix: number[];
  weightedMatrix: number[];
  idealPos: number[];
  idealNeg: number[];
  dPlus: number;
  dMinus: number;
  score: number;
  rank: number;
  rekomendasiTangki: number;
  rekomendasiAksi: string;
  rekomendasiUrgensi: 'Darurat (<12 Jam)' | 'Prioritas Tinggi (<24 Jam)' | 'Terjadwal (2-3 Hari)' | 'Monitoring Berkala' | 'Siaga Evakuasi (<6 Jam)' | 'Patroli Siaga (<12 Jam)' | 'Siaga Standby (24 Jam)';
  rekomendasiTimSar?: number;
  kebutuhanLogistikHujan?: string;
  jenisBencanaDominan?: JenisBencanaHujan;
}

export interface Armada {
  id: string;
  nomorPolisi: string;
  kapasitas: number;     // liter
  kondisi: 'baik' | 'sedang' | 'rusak';
  supir: string;
  nomorHp: string;
  statusToday: 'tersedia' | 'bertugas' | 'istirahat';
  desaTujuan?: string;
}

export interface SumberAir {
  id: string;
  nama: string;
  jenis: 'sumur_bor' | 'mata_air' | 'irigasi' | 'pdam';
  lat: number;
  lng: number;
  kapasitas: number;    // liter/hari
  stokSaat: number;     // liter saat ini
  kondisi: 'aktif' | 'tidak_aktif';
}

export interface RumahSakit {
  id: string;
  nama: string;
  tipe: 'RSUD' | 'RS Swasta' | 'RS PKU' | 'RS Pratama' | 'Puskesmas DTP';
  kelas: string;             // 'Kelas B' | 'Kelas C' | 'Kelas D' | 'Rawat Inap 24J'
  lat: number;
  lng: number;
  alamat: string;
  telepon: string;
  kapasitasTT: number;       // Kapasitas Tempat Tidur
  layananUGD: string;        // Fasilitas IGD/Trauma Center
  ambulansSiaga: number;     // Armada Ambulans Siaga
}

export interface JadwalDistribusi {
  id: string;
  tanggal: string;
  desaId: string;
  desaNama: string;
  armadaId: string;
  armadaPolisi: string;
  jumlahAir: number;   // liter
  sumberAirId: string;
  sumberAirNama: string;
  status: 'terjadwal' | 'dalam_perjalanan' | 'selesai' | 'batal';
  catatan?: string;
}

export interface LaporanHarian {
  id: string;
  tanggal: string;
  totalDesaDilayani: number;
  totalAirDidistribusi: number;
  totalWargaTerlayani: number;
  armadaAktif: number;
  jadwalList: JadwalDistribusi[];
}

export interface CriteriaWeight {
  id: string;
  name: string;
  description: string;
  type: 'benefit' | 'cost';
  weight: number;
  field: keyof Desa;
}

export type PageType =
  | 'dashboard'
  | 'peta'
  | 'data-desa'
  | 'kmeans'
  | 'topsis'
  | 'distribusi'
  | 'armada'
  | 'sumber-air'
  | 'laporan';

export interface NavItem {
  id: PageType;
  label: string;
  icon: string;
  section: string;
  badge?: number;
}
