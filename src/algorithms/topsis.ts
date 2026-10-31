// ============================================================
// TIRTA — TOPSIS Engine (Dual-Mode: Kemarau & Hujan)
// ============================================================
import type { Desa, TopsisBobot, TopsisResult, MusimType } from '../types';
export type { TopsisResult };

export const CRITERIA_KEMARAU: {
  field: keyof Desa;
  name: string;
  type: 'benefit' | 'cost';
  weight: (b: TopsisBobot) => number;
}[] = [
  { field: 'jumlahWarga',      name: 'Jumlah Warga',          type: 'benefit', weight: b => b.c1 },
  { field: 'defisitAir',       name: 'Defisit Air Harian',    type: 'benefit', weight: b => b.c2 },
  { field: 'durasiKekeringan', name: 'Durasi Kekeringan',     type: 'benefit', weight: b => b.c3 },
  { field: 'rasioRentan',      name: 'Rasio Rentan & Fasum',  type: 'benefit', weight: b => b.c4 },
  { field: 'jarakSumber',      name: 'Jarak Sumber Air',      type: 'cost',    weight: b => b.c5 },
  { field: 'indeksHambatan',   name: 'Hambatan Medan Jalan',  type: 'cost',    weight: b => b.c6 },
];

export const CRITERIA_HUJAN: {
  field: keyof Desa;
  name: string;
  type: 'benefit' | 'cost';
  weight: (b: TopsisBobot) => number;
}[] = [
  { field: 'curahHujan',       name: 'Curah Hujan (24J)',      type: 'benefit', weight: b => b.c1 },
  { field: 'kemiringanLereng', name: 'Kemiringan Lereng (%)',  type: 'benefit', weight: b => b.c2 },
  { field: 'indeksLongsor',    name: 'Indeks Longsor PVMBG',   type: 'benefit', weight: b => b.c3 },
  { field: 'wargaTerancam',    name: 'Warga Terancam (Jiwa)',  type: 'benefit', weight: b => b.c4 },
  { field: 'jarakSungai',      name: 'Jarak ke DAS Utama',     type: 'cost',    weight: b => b.c5 },
  { field: 'indeksDrainase',   name: 'Hambatan Drainase/Jenuh',type: 'benefit', weight: b => b.c6 },
];

export function runTopsis(
  desaList: Desa[],
  bobot: TopsisBobot,
  musim: MusimType = 'kemarau'
): TopsisResult[] {
  const kritis = desaList.filter(d => d.cluster === 'kritis');
  if (kritis.length === 0) return [];

  const criteriaList = musim === 'hujan' ? CRITERIA_HUJAN : CRITERIA_KEMARAU;
  const n = criteriaList.length;

  // Step 1: Build decision matrix
  const matrix: number[][] = kritis.map(d =>
    criteriaList.map(c => Number(d[c.field] ?? 0))
  );

  // Step 2: Normalize (vector normalization)
  const colNorms = Array.from({ length: n }, (_, j) =>
    Math.sqrt(matrix.reduce((sum, row) => sum + row[j] ** 2, 0))
  );
  const normalized: number[][] = matrix.map(row =>
    row.map((val, j) => (colNorms[j] === 0 ? 0 : val / colNorms[j]))
  );

  // Step 3: Weighted normalized matrix
  const weights = criteriaList.map(c => c.weight(bobot));
  const weighted: number[][] = normalized.map(row =>
    row.map((val, j) => val * weights[j])
  );

  // Step 4: Ideal solutions (A+ and A-)
  const idealPos = Array.from({ length: n }, (_, j) => {
    const col = weighted.map(row => row[j]);
    return criteriaList[j].type === 'benefit' ? Math.max(...col) : Math.min(...col);
  });
  const idealNeg = Array.from({ length: n }, (_, j) => {
    const col = weighted.map(row => row[j]);
    return criteriaList[j].type === 'benefit' ? Math.min(...col) : Math.max(...col);
  });

  // Step 5: Distance to ideal solutions
  const dPlus  = weighted.map(row => Math.sqrt(row.reduce((s, v, j) => s + (v - idealPos[j]) ** 2, 0)));
  const dMinus = weighted.map(row => Math.sqrt(row.reduce((s, v, j) => s + (v - idealNeg[j]) ** 2, 0)));

  // Step 6: Closeness coefficient
  const scores = dPlus.map((dp, i) => {
    const dm = dMinus[i];
    return dp + dm === 0 ? 0 : dm / (dp + dm);
  });

  // Step 7: Rank and generate action recommendations
  const ranked: TopsisResult[] = kritis
    .map((d, i) => {
      const tangkiReq = Math.max(1, Math.ceil(d.defisitAir / 5000));
      const isGerakanTanah = d.jenisBencanaDominan === 'gerakan_tanah';
      const isBanjir = d.jenisBencanaDominan === 'banjir_luapan';
      const isLongsor = d.jenisBencanaDominan === 'tanah_longsor' || ((d.kemiringanLereng || 0) > 28 && !isGerakanTanah);

      const timSarReq = d.rekomendasiTimSar ?? (isLongsor ? 8 : (isBanjir ? 6 : (isGerakanTanah ? 3 : 0)));
      const logistikHujan = d.kebutuhanLogistikHujan || (
        isGerakanTanah
          ? 'Terpal Penutup Retakan Kebun (30 Lembar), Patok Pantau Tanah, Posko Ranting'
          : isLongsor
          ? 'Tenda Pengungsi Darurat (2 Unit), EWS Sirine Longsor, 50 Lembar Terpal Retakan, Dapur Umum'
          : isBanjir
          ? 'Perahu Karet Evakuasi, Pelampung (25 Buah), Tenda Barak, Tanggul Pasir'
          : 'Pemantauan Wilayah Rutin MDMC'
      );

      return {
        desa: d,
        rawCriteria: matrix[i],
        normalMatrix: normalized[i],
        weightedMatrix: weighted[i],
        idealPos,
        idealNeg,
        dPlus: dPlus[i],
        dMinus: dMinus[i],
        score: scores[i],
        rank: 0,
        rekomendasiTangki: tangkiReq,
        rekomendasiTimSar: timSarReq,
        kebutuhanLogistikHujan: logistikHujan,
        jenisBencanaDominan: d.jenisBencanaDominan || (isLongsor ? 'tanah_longsor' : (isGerakanTanah ? 'gerakan_tanah' : (isBanjir ? 'banjir_luapan' : 'aman_stabil'))),
        rekomendasiAksi: '',
        rekomendasiUrgensi: (musim === 'hujan' ? 'Siaga Standby (24 Jam)' : 'Terjadwal (2-3 Hari)') as any,
      };
    })
    .sort((a, b) => b.score - a.score);

  ranked.forEach((r, i) => {
    r.rank = i + 1;
    if (musim === 'hujan') {
      if (r.rank <= 3) {
        r.rekomendasiUrgensi = 'Siaga Evakuasi (<6 Jam)';
        r.rekomendasiAksi = `Terjunkan segera ${r.rekomendasiTimSar} personil Tim SAR MDMC & ${r.kebutuhanLogistikHujan} ke Desa ${r.desa.namaDesa} (Prioritas Utama Evakuasi Lereng/DAS)`;
      } else if (r.rank <= 6) {
        r.rekomendasiUrgensi = 'Patroli Siaga (<12 Jam)';
        r.rekomendasiAksi = `Mobilisasi ${r.rekomendasiTimSar} personil relawan & siapkan tenda darurat di titik kumpul aman Desa ${r.desa.namaDesa}`;
      } else {
        r.rekomendasiUrgensi = 'Siaga Standby (24 Jam)';
        r.rekomendasiAksi = `Monitoring pergerakan tanah/debit sungai dan aktivasi posko siaga desa bersama BPBD & FPRB`;
      }
    } else {
      if (r.rank <= 3) {
        r.rekomendasiUrgensi = 'Darurat (<12 Jam)';
        r.rekomendasiAksi = `Kirim segera ${r.rekomendasiTangki} tangki air ke titik kumpul desa ${r.desa.namaDesa} (Prioritas Utama MDMC)`;
      } else if (r.rank <= 6) {
        r.rekomendasiUrgensi = 'Prioritas Tinggi (<24 Jam)';
        r.rekomendasiAksi = `Jadwalkan ${r.rekomendasiTangki} tangki air & pasang tandon komunal darurat`;
      } else {
        r.rekomendasiUrgensi = 'Terjadwal (2-3 Hari)';
        r.rekomendasiAksi = `Dropping berkala ${r.rekomendasiTangki} tangki dan koordinasi dengan sumber air terdekat (${r.desa.jarakSumber} km)`;
      }
    }
  });

  return ranked;
}

export function getTopsisDivisors(desaList: Desa[], musim: MusimType = 'kemarau'): number[] {
  const kritis = desaList.filter(d => d.cluster === 'kritis');
  const criteriaList = musim === 'hujan' ? CRITERIA_HUJAN : CRITERIA_KEMARAU;
  if (kritis.length === 0) return Array(criteriaList.length).fill(1);
  const matrix: number[][] = kritis.map(d =>
    criteriaList.map(c => Number(d[c.field] ?? 0))
  );
  return Array.from({ length: criteriaList.length }, (_, j) =>
    Math.sqrt(matrix.reduce((sum, row) => sum + row[j] ** 2, 0))
  );
}

export function applyTopsisRankToDesa(
  desaList: Desa[],
  results: TopsisResult[]
): Desa[] {
  const rankMap = new Map(results.map(r => [r.desa.id, {
    rank: r.rank,
    score: r.score,
    rekomendasiTimSar: r.rekomendasiTimSar,
    kebutuhanLogistikHujan: r.kebutuhanLogistikHujan,
  }]));

  return desaList.map(d => {
    const r = rankMap.get(d.id);
    return r ? {
      ...d,
      rank: r.rank,
      topsisScore: r.score,
      rekomendasiTimSar: r.rekomendasiTimSar,
      kebutuhanLogistikHujan: r.kebutuhanLogistikHujan,
    } : d;
  });
}
