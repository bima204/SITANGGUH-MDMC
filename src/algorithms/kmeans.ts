// ============================================================
// TIRTA — K-Means Clustering Engine (Dual-Mode: Kemarau & Hujan)
// ============================================================
import type { Desa, MusimType } from '../types';

type ClusterLabel = 'kritis' | 'waspada' | 'siaga';

export const KMEANS_FIELDS_KEMARAU: (keyof Desa)[] = [
  'jumlahWarga', 'defisitAir', 'durasiKekeringan',
  'rasioRentan', 'jarakSumber', 'indeksHambatan'
];

export const KMEANS_FIELDS_HUJAN: (keyof Desa)[] = [
  'curahHujan', 'kemiringanLereng', 'indeksLongsor',
  'wargaTerancam', 'jarakSungai', 'indeksDrainase'
];

/** Normalize features to [0, 1] */
function minMaxNormalize(data: Desa[], musim: MusimType): { normalized: number[][]; mins: number[]; maxs: number[] } {
  const fields = musim === 'hujan' ? KMEANS_FIELDS_HUJAN : KMEANS_FIELDS_KEMARAU;
  const mins = fields.map(f => Math.min(...data.map(d => (d[f] as number) ?? 0)));
  const maxs = fields.map(f => Math.max(...data.map(d => (d[f] as number) ?? 0)));

  const normalized = data.map(d =>
    fields.map((f, i) => {
      const val = (d[f] as number) ?? 0;
      const range = maxs[i] - mins[i];
      if (range === 0) return 0;
      const norm = (val - mins[i]) / range;
      // Pada musim hujan, jarak ke sempadan sungai (index 4) adalah cost: makin dekat makin bahaya banjir
      if (musim === 'hujan' && f === 'jarakSungai') {
        return 1 - norm;
      }
      return norm;
    })
  );

  return { normalized, mins, maxs };
}

function euclidean(a: number[], b: number[]): number {
  return Math.sqrt(a.reduce((sum, ai, i) => sum + Math.pow(ai - b[i], 2), 0));
}

function mean(vectors: number[][]): number[] {
  if (vectors.length === 0) return [0, 0, 0, 0, 0, 0];
  return vectors[0].map((_, i) => vectors.reduce((s, v) => s + v[i], 0) / vectors.length);
}

/** Classify cluster by "severity" — highest combined danger/need = kritis */
function assignLabels(
  centers: number[][],
  assignments: number[],
  musim: MusimType
): { labels: ClusterLabel[]; centroidScores: number[] } {
  const centroidScores = centers.map(c => {
    if (musim === 'hujan') {
      // Hujan: Curah Hujan (25%) + Lereng (25%) + Indeks Longsor (20%) + Warga Terancam (15%) + Kedekatan Sungai (10%) + Drainase (5%)
      return c[0] * 0.25 + c[1] * 0.25 + c[2] * 0.20 + c[3] * 0.15 + c[4] * 0.10 + c[5] * 0.05;
    }
    // Kemarau: C1-C4 benefit criteria drive drought severity
    return c[0] * 0.25 + c[1] * 0.25 + c[2] * 0.15 + c[3] * 0.15 + c[4] * 0.10 + c[5] * 0.10;
  });

  const sorted = [...centroidScores]
    .map((s, i) => ({ s, i }))
    .sort((a, b) => b.s - a.s);

  const labelMap = new Map<number, ClusterLabel>();
  const labelNames: ClusterLabel[] = ['kritis', 'waspada', 'siaga'];
  sorted.forEach(({ i }, rank) => {
    labelMap.set(i, labelNames[Math.min(rank, 2)]);
  });

  const labels: ClusterLabel[] = assignments.map(a => labelMap.get(a)!);
  return { labels, centroidScores };
}

export interface KMeansOutput {
  desaWithCluster: Desa[];
  iterations: number;
  centroids: number[][];
  rawCentroids: number[][];
  normalizedData: number[][];
  distancesToCentroids: number[][];
  clusterCounts: { kritis: number; waspada: number; siaga: number };
  musim: MusimType;
}

export function runKMeans(
  desaList: Desa[],
  k = 3,
  maxIter = 100,
  musim: MusimType = 'kemarau'
): KMeansOutput {
  if (desaList.length < k) throw new Error('Data kurang dari k cluster');

  const { normalized, mins, maxs } = minMaxNormalize(desaList, musim);
  const n = normalized.length;

  // Init: k-means++ style (pick spread seeds)
  let centroids: number[][] = [normalized[Math.floor(Math.random() * n)]];
  while (centroids.length < k) {
    const dists = normalized.map(v => Math.min(...centroids.map(c => euclidean(v, c))));
    const total = dists.reduce((s, d) => s + d * d, 0);
    let r = Math.random() * total;
    for (let i = 0; i < n; i++) {
      r -= dists[i] * dists[i];
      if (r <= 0) { centroids.push(normalized[i]); break; }
    }
  }

  let assignments: number[] = new Array(n).fill(0);
  let iter = 0;

  for (; iter < maxIter; iter++) {
    // Assign
    const newAssign = normalized.map(v =>
      centroids.reduce(
        (best, c, ci) => euclidean(v, c) < euclidean(v, centroids[best]) ? ci : best,
        0
      )
    );
    const changed = newAssign.some((a, i) => a !== assignments[i]);
    assignments = newAssign;
    if (!changed) break;

    // Update centroids
    centroids = Array.from({ length: k }, (_, ki) =>
      mean(normalized.filter((_, i) => assignments[i] === ki))
    );
  }

  const { labels } = assignLabels(centroids, assignments, musim);

  // Compute distances of each village to all centroids
  const distancesToCentroids = normalized.map(v =>
    centroids.map(c => euclidean(v, c))
  );

  // Unnormalize centroids for reporting
  const rawCentroids = centroids.map(c =>
    c.map((val, j) => {
      const range = maxs[j] - mins[j];
      if (musim === 'hujan' && j === 4) {
        return mins[j] + (1 - val) * range;
      }
      return mins[j] + val * range;
    })
  );

  const desaWithCluster = desaList.map((d, i) => ({ ...d, cluster: labels[i] }));

  const clusterCounts = { kritis: 0, waspada: 0, siaga: 0 };
  labels.forEach(l => clusterCounts[l]++);

  return {
    desaWithCluster,
    iterations: iter + 1,
    centroids,
    rawCentroids,
    normalizedData: normalized,
    distancesToCentroids,
    clusterCounts,
    musim,
  };
}
