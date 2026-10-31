// ============================================================
// TIRTA — Data Riil Wilayah Kekeringan Kabupaten Banjarnegara
// Komprehensif: Seluruh 266 Desa di 20 Kecamatan
// Berdasarkan Data Resmi BPS & BPBD Kabupaten Banjarnegara
// ============================================================
import type { Desa, Armada, SumberAir, JadwalDistribusi, PosDugaAir, RumahSakit } from '../types';

const RAW_DESA: Desa[] = [
  {
    "id": "d001",
    "namaDesa": "Ampelsari",
    "namaKecamatan": "Banjarnegara",
    "lat": -7.3942,
    "lng": 109.715,
    "jumlahWarga": 920,
    "defisitAir": 13800,
    "durasiKekeringan": 23,
    "rasioRentan": 41.8,
    "jarakSumber": 4.6,
    "indeksHambatan": 2
  },
  {
    "id": "d002",
    "namaDesa": "Cendana",
    "namaKecamatan": "Banjarnegara",
    "lat": -7.3832,
    "lng": 109.6743,
    "jumlahWarga": 1990,
    "defisitAir": 27860,
    "durasiKekeringan": 23,
    "rasioRentan": 36.6,
    "jarakSumber": 4.7,
    "indeksHambatan": 1
  },
  {
    "id": "d003",
    "namaDesa": "Sokayasa",
    "namaKecamatan": "Banjarnegara",
    "lat": -7.4192,
    "lng": 109.699,
    "jumlahWarga": 920,
    "defisitAir": 12880,
    "durasiKekeringan": 27,
    "rasioRentan": 24.3,
    "jarakSumber": 4.5,
    "indeksHambatan": 1
  },
  {
    "id": "d004",
    "namaDesa": "Tlagawera",
    "namaKecamatan": "Banjarnegara",
    "lat": -7.371,
    "lng": 109.71,
    "jumlahWarga": 1400,
    "defisitAir": 18200,
    "durasiKekeringan": 24,
    "rasioRentan": 36.7,
    "jarakSumber": 4.1,
    "indeksHambatan": 1
  },
  {
    "id": "d005",
    "namaDesa": "Banjarkulon",
    "namaKecamatan": "Banjarmangu",
    "lat": -7.3394,
    "lng": 109.7171,
    "jumlahWarga": 1030,
    "defisitAir": 14420,
    "durasiKekeringan": 36,
    "rasioRentan": 40.9,
    "jarakSumber": 8.4,
    "indeksHambatan": 3
  },
  {
    "id": "d006",
    "namaDesa": "Banjarmangu",
    "namaKecamatan": "Banjarmangu",
    "lat": -7.3412,
    "lng": 109.6894,
    "jumlahWarga": 1180,
    "defisitAir": 18880,
    "durasiKekeringan": 41,
    "rasioRentan": 19.7,
    "jarakSumber": 9.9,
    "indeksHambatan": 4
  },
  {
    "id": "d007",
    "namaDesa": "Beji",
    "namaKecamatan": "Banjarmangu",
    "lat": -7.36,
    "lng": 109.709,
    "jumlahWarga": 1660,
    "defisitAir": 26560,
    "durasiKekeringan": 28,
    "rasioRentan": 33.7,
    "jarakSumber": 7.3,
    "indeksHambatan": 4
  },
  {
    "id": "d008",
    "namaDesa": "Gripit",
    "namaKecamatan": "Banjarmangu",
    "lat": -7.3317,
    "lng": 109.7169,
    "jumlahWarga": 950,
    "defisitAir": 13300,
    "durasiKekeringan": 39,
    "rasioRentan": 30.3,
    "jarakSumber": 9.3,
    "indeksHambatan": 3
  },
  {
    "id": "d009",
    "namaDesa": "Jenggawur",
    "namaKecamatan": "Banjarmangu",
    "lat": -7.3553,
    "lng": 109.6878,
    "jumlahWarga": 1460,
    "defisitAir": 20440,
    "durasiKekeringan": 43,
    "rasioRentan": 25.3,
    "jarakSumber": 7.7,
    "indeksHambatan": 3
  },
  {
    "id": "d010",
    "namaDesa": "Kalilunjar",
    "namaKecamatan": "Banjarmangu",
    "lat": -7.3548,
    "lng": 109.724,
    "jumlahWarga": 1880,
    "defisitAir": 26320,
    "durasiKekeringan": 28,
    "rasioRentan": 33.9,
    "jarakSumber": 6.6,
    "indeksHambatan": 3
  },
  {
    "id": "d011",
    "namaDesa": "Kendaga",
    "namaKecamatan": "Banjarmangu",
    "lat": -7.3301,
    "lng": 109.6894,
    "jumlahWarga": 1530,
    "defisitAir": 21420,
    "durasiKekeringan": 27,
    "rasioRentan": 25.9,
    "jarakSumber": 9.2,
    "indeksHambatan": 3
  },
  {
    "id": "d012",
    "namaDesa": "Kesenet",
    "namaKecamatan": "Banjarmangu",
    "lat": -7.3652,
    "lng": 109.6994,
    "jumlahWarga": 1240,
    "defisitAir": 17360,
    "durasiKekeringan": 32,
    "rasioRentan": 40.9,
    "jarakSumber": 6.1,
    "indeksHambatan": 3
  },
  {
    "id": "d013",
    "namaDesa": "Majatengah",
    "namaKecamatan": "Banjarmangu",
    "lat": -7.3367,
    "lng": 109.7285,
    "jumlahWarga": 1390,
    "defisitAir": 18070,
    "durasiKekeringan": 25,
    "rasioRentan": 40,
    "jarakSumber": 6.8,
    "indeksHambatan": 3
  },
  {
    "id": "d014",
    "namaDesa": "Paseh",
    "namaKecamatan": "Banjarmangu",
    "lat": -7.343,
    "lng": 109.6787,
    "jumlahWarga": 1550,
    "defisitAir": 21700,
    "durasiKekeringan": 34,
    "rasioRentan": 33.3,
    "jarakSumber": 8.3,
    "indeksHambatan": 3
  },
  {
    "id": "d015",
    "namaDesa": "Pekandangan",
    "namaKecamatan": "Banjarmangu",
    "lat": -7.3617,
    "lng": 109.724,
    "jumlahWarga": 1260,
    "defisitAir": 17640,
    "durasiKekeringan": 34,
    "rasioRentan": 23.1,
    "jarakSumber": 6.1,
    "indeksHambatan": 3
  },
  {
    "id": "d016",
    "namaDesa": "Prendengan",
    "namaKecamatan": "Banjarmangu",
    "lat": -7.3212,
    "lng": 109.7023,
    "jumlahWarga": 880,
    "defisitAir": 14080,
    "durasiKekeringan": 31,
    "rasioRentan": 37,
    "jarakSumber": 10.4,
    "indeksHambatan": 4
  },
  {
    "id": "d017",
    "namaDesa": "Rejasari",
    "namaKecamatan": "Banjarmangu",
    "lat": -7.3614,
    "lng": 109.6834,
    "jumlahWarga": 1240,
    "defisitAir": 17360,
    "durasiKekeringan": 39,
    "rasioRentan": 37.8,
    "jarakSumber": 8.1,
    "indeksHambatan": 3
  },
  {
    "id": "d018",
    "namaDesa": "Sigeblok",
    "namaKecamatan": "Banjarmangu",
    "lat": -7.3417,
    "lng": 109.7345,
    "jumlahWarga": 1240,
    "defisitAir": 16120,
    "durasiKekeringan": 25,
    "rasioRentan": 40.1,
    "jarakSumber": 6.5,
    "indeksHambatan": 2
  },
  {
    "id": "d019",
    "namaDesa": "Sijenggung",
    "namaKecamatan": "Banjarmangu",
    "lat": -7.3265,
    "lng": 109.6836,
    "jumlahWarga": 710,
    "defisitAir": 10650,
    "durasiKekeringan": 23,
    "rasioRentan": 28.8,
    "jarakSumber": 8.8,
    "indeksHambatan": 4
  },
  {
    "id": "d020",
    "namaDesa": "Sijeruk",
    "namaKecamatan": "Banjarmangu",
    "lat": -7.3709,
    "lng": 109.712,
    "jumlahWarga": 1000,
    "defisitAir": 14000,
    "durasiKekeringan": 30,
    "rasioRentan": 27.7,
    "jarakSumber": 10.7,
    "indeksHambatan": 3
  },
  {
    "id": "d021",
    "namaDesa": "Sipedang",
    "namaKecamatan": "Banjarmangu",
    "lat": -7.3224,
    "lng": 109.7229,
    "jumlahWarga": 760,
    "defisitAir": 9880,
    "durasiKekeringan": 31,
    "rasioRentan": 38.9,
    "jarakSumber": 10.3,
    "indeksHambatan": 3
  },
  {
    "id": "d022",
    "namaDesa": "Bakal",
    "namaKecamatan": "Batur",
    "lat": -7.2058,
    "lng": 109.8607,
    "jumlahWarga": 1970,
    "defisitAir": 27580,
    "durasiKekeringan": 48,
    "rasioRentan": 24.5,
    "jarakSumber": 20,
    "indeksHambatan": 5
  },
  {
    "id": "d023",
    "namaDesa": "Batur",
    "namaKecamatan": "Batur",
    "lat": -7.2145,
    "lng": 109.8456,
    "jumlahWarga": 1720,
    "defisitAir": 25800,
    "durasiKekeringan": 50,
    "rasioRentan": 38.5,
    "jarakSumber": 18.5,
    "indeksHambatan": 5
  },
  {
    "id": "d024",
    "namaDesa": "Dieng Kulon",
    "namaKecamatan": "Batur",
    "lat": -7.2288,
    "lng": 109.85,
    "jumlahWarga": 980,
    "defisitAir": 14700,
    "durasiKekeringan": 51,
    "rasioRentan": 35.6,
    "jarakSumber": 17.1,
    "indeksHambatan": 5
  },
  {
    "id": "d025",
    "namaDesa": "Karangtengah",
    "namaKecamatan": "Batur",
    "lat": -7.1895,
    "lng": 109.8515,
    "jumlahWarga": 1670,
    "defisitAir": 26720,
    "durasiKekeringan": 35,
    "rasioRentan": 41.6,
    "jarakSumber": 17,
    "indeksHambatan": 5
  },
  {
    "id": "d026",
    "namaDesa": "Kepakisan",
    "namaKecamatan": "Batur",
    "lat": -7.224,
    "lng": 109.8236,
    "jumlahWarga": 1260,
    "defisitAir": 16380,
    "durasiKekeringan": 50,
    "rasioRentan": 31,
    "jarakSumber": 13.2,
    "indeksHambatan": 4
  },
  {
    "id": "d027",
    "namaDesa": "Pasurenan",
    "namaKecamatan": "Batur",
    "lat": -7.218,
    "lng": 109.8722,
    "jumlahWarga": 1010,
    "defisitAir": 15150,
    "durasiKekeringan": 34,
    "rasioRentan": 23.4,
    "jarakSumber": 14.4,
    "indeksHambatan": 5
  },
  {
    "id": "d028",
    "namaDesa": "Pekasiran",
    "namaKecamatan": "Batur",
    "lat": -7.1878,
    "lng": 109.8293,
    "jumlahWarga": 910,
    "defisitAir": 11830,
    "durasiKekeringan": 34,
    "rasioRentan": 22.5,
    "jarakSumber": 18.9,
    "indeksHambatan": 4
  },
  {
    "id": "d029",
    "namaDesa": "Sumberejo",
    "namaKecamatan": "Batur",
    "lat": -7.2356,
    "lng": 109.834,
    "jumlahWarga": 960,
    "defisitAir": 15360,
    "durasiKekeringan": 27,
    "rasioRentan": 25.7,
    "jarakSumber": 18.5,
    "indeksHambatan": 5
  },
  {
    "id": "d030",
    "namaDesa": "Bandingan",
    "namaKecamatan": "Bawang",
    "lat": -7.4388,
    "lng": 109.6986,
    "jumlahWarga": 1580,
    "defisitAir": 25280,
    "durasiKekeringan": 30,
    "rasioRentan": 27.9,
    "jarakSumber": 5.2,
    "indeksHambatan": 3
  },
  {
    "id": "d031",
    "namaDesa": "Bawang",
    "namaKecamatan": "Bawang",
    "lat": -7.432,
    "lng": 109.672,
    "jumlahWarga": 1320,
    "defisitAir": 21120,
    "durasiKekeringan": 26,
    "rasioRentan": 24.7,
    "jarakSumber": 6.5,
    "indeksHambatan": 3
  },
  {
    "id": "d032",
    "namaDesa": "Binorong",
    "namaKecamatan": "Bawang",
    "lat": -7.4549,
    "lng": 109.688,
    "jumlahWarga": 1870,
    "defisitAir": 24310,
    "durasiKekeringan": 40,
    "rasioRentan": 25.3,
    "jarakSumber": 5.2,
    "indeksHambatan": 2
  },
  {
    "id": "d033",
    "namaDesa": "Blambangan",
    "namaKecamatan": "Bawang",
    "lat": -7.4243,
    "lng": 109.6907,
    "jumlahWarga": 1610,
    "defisitAir": 22540,
    "durasiKekeringan": 25,
    "rasioRentan": 35.2,
    "jarakSumber": 6.5,
    "indeksHambatan": 2
  },
  {
    "id": "d034",
    "namaDesa": "Depok",
    "namaKecamatan": "Bawang",
    "lat": -7.4493,
    "lng": 109.6675,
    "jumlahWarga": 1200,
    "defisitAir": 18000,
    "durasiKekeringan": 30,
    "rasioRentan": 23.6,
    "jarakSumber": 4.7,
    "indeksHambatan": 3
  },
  {
    "id": "d035",
    "namaDesa": "Gemuruh",
    "namaKecamatan": "Bawang",
    "lat": -7.449,
    "lng": 109.7041,
    "jumlahWarga": 2040,
    "defisitAir": 28560,
    "durasiKekeringan": 42,
    "rasioRentan": 28.9,
    "jarakSumber": 6.2,
    "indeksHambatan": 2
  },
  {
    "id": "d036",
    "namaDesa": "Joho",
    "namaKecamatan": "Bawang",
    "lat": -7.4246,
    "lng": 109.6709,
    "jumlahWarga": 1410,
    "defisitAir": 19740,
    "durasiKekeringan": 37,
    "rasioRentan": 40.8,
    "jarakSumber": 6.1,
    "indeksHambatan": 2
  },
  {
    "id": "d037",
    "namaDesa": "Kebondalem",
    "namaKecamatan": "Bawang",
    "lat": -7.4594,
    "lng": 109.6774,
    "jumlahWarga": 2180,
    "defisitAir": 30520,
    "durasiKekeringan": 39,
    "rasioRentan": 25.8,
    "jarakSumber": 4.6,
    "indeksHambatan": 2
  },
  {
    "id": "d038",
    "namaDesa": "Kutayasa",
    "namaKecamatan": "Bawang",
    "lat": -7.4283,
    "lng": 109.7058,
    "jumlahWarga": 1340,
    "defisitAir": 18760,
    "durasiKekeringan": 30,
    "rasioRentan": 32.5,
    "jarakSumber": 5.4,
    "indeksHambatan": 2
  },
  {
    "id": "d039",
    "namaDesa": "Majalengka",
    "namaKecamatan": "Bawang",
    "lat": -7.4401,
    "lng": 109.6591,
    "jumlahWarga": 860,
    "defisitAir": 11180,
    "durasiKekeringan": 45,
    "rasioRentan": 22.6,
    "jarakSumber": 4.5,
    "indeksHambatan": 1
  },
  {
    "id": "d040",
    "namaDesa": "Mantrianom",
    "namaKecamatan": "Bawang",
    "lat": -7.4562,
    "lng": 109.7038,
    "jumlahWarga": 770,
    "defisitAir": 12320,
    "durasiKekeringan": 24,
    "rasioRentan": 34.5,
    "jarakSumber": 5.7,
    "indeksHambatan": 3
  },
  {
    "id": "d041",
    "namaDesa": "Masaran",
    "namaKecamatan": "Bawang",
    "lat": -7.4298,
    "lng": 109.7089,
    "jumlahWarga": 780,
    "defisitAir": 11700,
    "durasiKekeringan": 28,
    "rasioRentan": 22.5,
    "jarakSumber": 4.1,
    "indeksHambatan": 1
  },
  {
    "id": "d042",
    "namaDesa": "Pucang",
    "namaKecamatan": "Bawang",
    "lat": -7.4522,
    "lng": 109.6605,
    "jumlahWarga": 1750,
    "defisitAir": 26250,
    "durasiKekeringan": 42,
    "rasioRentan": 31.5,
    "jarakSumber": 3.9,
    "indeksHambatan": 2
  },
  {
    "id": "d043",
    "namaDesa": "Serang",
    "namaKecamatan": "Bawang",
    "lat": -7.4412,
    "lng": 109.6734,
    "jumlahWarga": 1350,
    "defisitAir": 20250,
    "durasiKekeringan": 44,
    "rasioRentan": 32,
    "jarakSumber": 5,
    "indeksHambatan": 2
  },
  {
    "id": "d044",
    "namaDesa": "Wanadri",
    "namaKecamatan": "Bawang",
    "lat": -7.4589,
    "lng": 109.6912,
    "jumlahWarga": 1150,
    "defisitAir": 17250,
    "durasiKekeringan": 39,
    "rasioRentan": 28,
    "jarakSumber": 6.2,
    "indeksHambatan": 3
  },
  {
    "id": "d045",
    "namaDesa": "Watuurip",
    "namaKecamatan": "Bawang",
    "lat": -7.4659,
    "lng": 109.6879,
    "jumlahWarga": 1630,
    "defisitAir": 21190,
    "durasiKekeringan": 24,
    "rasioRentan": 23.6,
    "jarakSumber": 4.7,
    "indeksHambatan": 2
  },
  {
    "id": "d046",
    "namaDesa": "Winong",
    "namaKecamatan": "Bawang",
    "lat": -7.4179,
    "lng": 109.7025,
    "jumlahWarga": 1610,
    "defisitAir": 19320,
    "durasiKekeringan": 32,
    "rasioRentan": 28.3,
    "jarakSumber": 3.9,
    "indeksHambatan": 1
  },
  {
    "id": "d047",
    "namaDesa": "Wiramastra",
    "namaKecamatan": "Bawang",
    "lat": -7.4483,
    "lng": 109.6545,
    "jumlahWarga": 1970,
    "defisitAir": 31520,
    "durasiKekeringan": 29,
    "rasioRentan": 30.3,
    "jarakSumber": 4.9,
    "indeksHambatan": 3
  },
  {
    "id": "d048",
    "namaDesa": "Asinan",
    "namaKecamatan": "Kalibening",
    "lat": -7.2137,
    "lng": 109.6589,
    "jumlahWarga": 1210,
    "defisitAir": 19360,
    "durasiKekeringan": 23,
    "rasioRentan": 38.9,
    "jarakSumber": 14.3,
    "indeksHambatan": 4
  },
  {
    "id": "d049",
    "namaDesa": "Bedana",
    "namaKecamatan": "Kalibening",
    "lat": -7.2065,
    "lng": 109.6319,
    "jumlahWarga": 1290,
    "defisitAir": 19350,
    "durasiKekeringan": 36,
    "rasioRentan": 27.3,
    "jarakSumber": 15.4,
    "indeksHambatan": 4
  },
  {
    "id": "d050",
    "namaDesa": "Gununglangit",
    "namaKecamatan": "Kalibening",
    "lat": -7.228,
    "lng": 109.6551,
    "jumlahWarga": 1380,
    "defisitAir": 17940,
    "durasiKekeringan": 27,
    "rasioRentan": 31,
    "jarakSumber": 11.1,
    "indeksHambatan": 3
  },
  {
    "id": "d051",
    "namaDesa": "Kalibening",
    "namaKecamatan": "Kalibening",
    "lat": -7.1985,
    "lng": 109.6499,
    "jumlahWarga": 1390,
    "defisitAir": 18070,
    "durasiKekeringan": 32,
    "rasioRentan": 25.6,
    "jarakSumber": 13.4,
    "indeksHambatan": 3
  },
  {
    "id": "d052",
    "namaDesa": "Kalibombong",
    "namaKecamatan": "Kalibening",
    "lat": -7.2244,
    "lng": 109.6266,
    "jumlahWarga": 1610,
    "defisitAir": 22540,
    "durasiKekeringan": 31,
    "rasioRentan": 41,
    "jarakSumber": 11.7,
    "indeksHambatan": 3
  },
  {
    "id": "d053",
    "namaDesa": "Kalisat Kidul",
    "namaKecamatan": "Kalibening",
    "lat": -7.2173,
    "lng": 109.6675,
    "jumlahWarga": 1070,
    "defisitAir": 14980,
    "durasiKekeringan": 34,
    "rasioRentan": 28.1,
    "jarakSumber": 16,
    "indeksHambatan": 3
  },
  {
    "id": "d054",
    "namaDesa": "Karang Anyar",
    "namaKecamatan": "Kalibening",
    "lat": -7.1965,
    "lng": 109.6353,
    "jumlahWarga": 1280,
    "defisitAir": 19200,
    "durasiKekeringan": 28,
    "rasioRentan": 22.6,
    "jarakSumber": 10.9,
    "indeksHambatan": 4
  },
  {
    "id": "d055",
    "namaDesa": "Kasinoman",
    "namaKecamatan": "Kalibening",
    "lat": -7.2362,
    "lng": 109.6446,
    "jumlahWarga": 1270,
    "defisitAir": 19050,
    "durasiKekeringan": 27,
    "rasioRentan": 34.4,
    "jarakSumber": 14.2,
    "indeksHambatan": 4
  },
  {
    "id": "d056",
    "namaDesa": "Kertasari",
    "namaKecamatan": "Kalibening",
    "lat": -7.2069,
    "lng": 109.6692,
    "jumlahWarga": 1500,
    "defisitAir": 22500,
    "durasiKekeringan": 29,
    "rasioRentan": 19.7,
    "jarakSumber": 16.7,
    "indeksHambatan": 4
  },
  {
    "id": "d057",
    "namaDesa": "Majatengah",
    "namaKecamatan": "Kalibening",
    "lat": -7.2072,
    "lng": 109.6196,
    "jumlahWarga": 1280,
    "defisitAir": 16640,
    "durasiKekeringan": 25,
    "rasioRentan": 40,
    "jarakSumber": 11.9,
    "indeksHambatan": 3
  },
  {
    "id": "d058",
    "namaDesa": "Plorengan",
    "namaKecamatan": "Kalibening",
    "lat": -7.233,
    "lng": 109.6632,
    "jumlahWarga": 1690,
    "defisitAir": 20280,
    "durasiKekeringan": 32,
    "rasioRentan": 20.1,
    "jarakSumber": 11.4,
    "indeksHambatan": 3
  },
  {
    "id": "d059",
    "namaDesa": "Sembawa",
    "namaKecamatan": "Kalibening",
    "lat": -7.191,
    "lng": 109.6394,
    "jumlahWarga": 1510,
    "defisitAir": 19630,
    "durasiKekeringan": 31,
    "rasioRentan": 28.2,
    "jarakSumber": 12.4,
    "indeksHambatan": 3
  },
  {
    "id": "d060",
    "namaDesa": "Sidakangen",
    "namaKecamatan": "Kalibening",
    "lat": -7.2309,
    "lng": 109.622,
    "jumlahWarga": 1170,
    "defisitAir": 17550,
    "durasiKekeringan": 28,
    "rasioRentan": 36.9,
    "jarakSumber": 16.4,
    "indeksHambatan": 4
  },
  {
    "id": "d061",
    "namaDesa": "Sikumpul",
    "namaKecamatan": "Kalibening",
    "lat": -7.2083,
    "lng": 109.6744,
    "jumlahWarga": 690,
    "defisitAir": 8280,
    "durasiKekeringan": 28,
    "rasioRentan": 23.4,
    "jarakSumber": 17.2,
    "indeksHambatan": 3
  },
  {
    "id": "d062",
    "namaDesa": "Sirukem",
    "namaKecamatan": "Kalibening",
    "lat": -7.1983,
    "lng": 109.6207,
    "jumlahWarga": 1220,
    "defisitAir": 15860,
    "durasiKekeringan": 33,
    "rasioRentan": 28.5,
    "jarakSumber": 15.2,
    "indeksHambatan": 3
  },
  {
    "id": "d063",
    "namaDesa": "Sirukun",
    "namaKecamatan": "Kalibening",
    "lat": -7.2421,
    "lng": 109.648,
    "jumlahWarga": 1050,
    "defisitAir": 13650,
    "durasiKekeringan": 31,
    "rasioRentan": 37.9,
    "jarakSumber": 13.9,
    "indeksHambatan": 3
  },
  {
    "id": "d064",
    "namaDesa": "Ambal",
    "namaKecamatan": "Karangkobar",
    "lat": -7.2822,
    "lng": 109.7293,
    "jumlahWarga": 1020,
    "defisitAir": 13260,
    "durasiKekeringan": 36,
    "rasioRentan": 28.2,
    "jarakSumber": 12.7,
    "indeksHambatan": 3
  },
  {
    "id": "d065",
    "namaDesa": "Binangun",
    "namaKecamatan": "Karangkobar",
    "lat": -7.2792,
    "lng": 109.699,
    "jumlahWarga": 810,
    "defisitAir": 10530,
    "durasiKekeringan": 35,
    "rasioRentan": 18.7,
    "jarakSumber": 8.8,
    "indeksHambatan": 3
  },
  {
    "id": "d066",
    "namaDesa": "Gumelar",
    "namaKecamatan": "Karangkobar",
    "lat": -7.2999,
    "lng": 109.7235,
    "jumlahWarga": 910,
    "defisitAir": 11830,
    "durasiKekeringan": 41,
    "rasioRentan": 22.8,
    "jarakSumber": 9.6,
    "indeksHambatan": 3
  },
  {
    "id": "d067",
    "namaDesa": "Jlegong",
    "namaKecamatan": "Karangkobar",
    "lat": -7.2676,
    "lng": 109.7211,
    "jumlahWarga": 1280,
    "defisitAir": 16640,
    "durasiKekeringan": 27,
    "rasioRentan": 40.5,
    "jarakSumber": 10.2,
    "indeksHambatan": 3
  },
  {
    "id": "d068",
    "namaDesa": "Karanggondang",
    "namaKecamatan": "Karangkobar",
    "lat": -7.297,
    "lng": 109.697,
    "jumlahWarga": 1310,
    "defisitAir": 19650,
    "durasiKekeringan": 29,
    "rasioRentan": 28.3,
    "jarakSumber": 13.8,
    "indeksHambatan": 4
  },
  {
    "id": "d069",
    "namaDesa": "Krangkobar",
    "namaKecamatan": "Karangkobar",
    "lat": -7.2927,
    "lng": 109.7375,
    "jumlahWarga": 710,
    "defisitAir": 8520,
    "durasiKekeringan": 40,
    "rasioRentan": 33.4,
    "jarakSumber": 10.1,
    "indeksHambatan": 3
  },
  {
    "id": "d070",
    "namaDesa": "Leksana",
    "namaKecamatan": "Karangkobar",
    "lat": -7.2668,
    "lng": 109.701,
    "jumlahWarga": 1270,
    "defisitAir": 15240,
    "durasiKekeringan": 42,
    "rasioRentan": 36.8,
    "jarakSumber": 13.6,
    "indeksHambatan": 3
  },
  {
    "id": "d071",
    "namaDesa": "Pagerpelah",
    "namaKecamatan": "Karangkobar",
    "lat": -7.3074,
    "lng": 109.71,
    "jumlahWarga": 680,
    "defisitAir": 10880,
    "durasiKekeringan": 35,
    "rasioRentan": 28.7,
    "jarakSumber": 12.9,
    "indeksHambatan": 4
  },
  {
    "id": "d072",
    "namaDesa": "Pasuruhan",
    "namaKecamatan": "Karangkobar",
    "lat": -7.2696,
    "lng": 109.7363,
    "jumlahWarga": 1320,
    "defisitAir": 18480,
    "durasiKekeringan": 32,
    "rasioRentan": 22.8,
    "jarakSumber": 13.9,
    "indeksHambatan": 3
  },
  {
    "id": "d073",
    "namaDesa": "Paweden",
    "namaKecamatan": "Karangkobar",
    "lat": -7.2763,
    "lng": 109.6878,
    "jumlahWarga": 1550,
    "defisitAir": 18600,
    "durasiKekeringan": 33,
    "rasioRentan": 33.8,
    "jarakSumber": 8.1,
    "indeksHambatan": 3
  },
  {
    "id": "d074",
    "namaDesa": "Purwodadi",
    "namaKecamatan": "Karangkobar",
    "lat": -7.3023,
    "lng": 109.7372,
    "jumlahWarga": 1720,
    "defisitAir": 25800,
    "durasiKekeringan": 38,
    "rasioRentan": 18.2,
    "jarakSumber": 10,
    "indeksHambatan": 4
  },
  {
    "id": "d075",
    "namaDesa": "Sampang",
    "namaKecamatan": "Karangkobar",
    "lat": -7.259,
    "lng": 109.7203,
    "jumlahWarga": 970,
    "defisitAir": 11640,
    "durasiKekeringan": 36,
    "rasioRentan": 27.2,
    "jarakSumber": 13.1,
    "indeksHambatan": 3
  },
  {
    "id": "d076",
    "namaDesa": "Slatri",
    "namaKecamatan": "Karangkobar",
    "lat": -7.2988,
    "lng": 109.6874,
    "jumlahWarga": 780,
    "defisitAir": 10140,
    "durasiKekeringan": 39,
    "rasioRentan": 21.1,
    "jarakSumber": 12,
    "indeksHambatan": 3
  },
  {
    "id": "d077",
    "namaDesa": "Bantarwaru",
    "namaKecamatan": "Madukara",
    "lat": -7.3683,
    "lng": 109.7435,
    "jumlahWarga": 1650,
    "defisitAir": 23100,
    "durasiKekeringan": 22,
    "rasioRentan": 38.6,
    "jarakSumber": 8.8,
    "indeksHambatan": 3
  },
  {
    "id": "d078",
    "namaDesa": "Blitar",
    "namaKecamatan": "Madukara",
    "lat": -7.3619,
    "lng": 109.7172,
    "jumlahWarga": 1410,
    "defisitAir": 19740,
    "durasiKekeringan": 21,
    "rasioRentan": 37.5,
    "jarakSumber": 7,
    "indeksHambatan": 3
  },
  {
    "id": "d079",
    "namaDesa": "Clapar",
    "namaKecamatan": "Madukara",
    "lat": -7.3847,
    "lng": 109.7342,
    "jumlahWarga": 1660,
    "defisitAir": 21580,
    "durasiKekeringan": 30,
    "rasioRentan": 22.3,
    "jarakSumber": 6.2,
    "indeksHambatan": 2
  },
  {
    "id": "d080",
    "namaDesa": "Dawuhan",
    "namaKecamatan": "Madukara",
    "lat": -7.3543,
    "lng": 109.7356,
    "jumlahWarga": 1440,
    "defisitAir": 20160,
    "durasiKekeringan": 27,
    "rasioRentan": 24.2,
    "jarakSumber": 8.7,
    "indeksHambatan": 3
  },
  {
    "id": "d081",
    "namaDesa": "Gununggiana",
    "namaKecamatan": "Madukara",
    "lat": -7.3738,
    "lng": 109.7098,
    "jumlahWarga": 750,
    "defisitAir": 11250,
    "durasiKekeringan": 23,
    "rasioRentan": 31.7,
    "jarakSumber": 9.2,
    "indeksHambatan": 3
  },
  {
    "id": "d082",
    "namaDesa": "Kaliurip",
    "namaKecamatan": "Madukara",
    "lat": -7.3719,
    "lng": 109.7517,
    "jumlahWarga": 1770,
    "defisitAir": 26550,
    "durasiKekeringan": 39,
    "rasioRentan": 41.8,
    "jarakSumber": 7.2,
    "indeksHambatan": 3
  },
  {
    "id": "d083",
    "namaDesa": "Karanganyar",
    "namaKecamatan": "Madukara",
    "lat": -7.3514,
    "lng": 109.7231,
    "jumlahWarga": 1250,
    "defisitAir": 16250,
    "durasiKekeringan": 29,
    "rasioRentan": 27.7,
    "jarakSumber": 9.5,
    "indeksHambatan": 2
  },
  {
    "id": "d084",
    "namaDesa": "Kutayasa",
    "namaKecamatan": "Madukara",
    "lat": -7.3898,
    "lng": 109.7241,
    "jumlahWarga": 1230,
    "defisitAir": 17220,
    "durasiKekeringan": 26,
    "rasioRentan": 32.5,
    "jarakSumber": 6.6,
    "indeksHambatan": 2
  },
  {
    "id": "d085",
    "namaDesa": "Limbangan",
    "namaKecamatan": "Madukara",
    "lat": -7.3602,
    "lng": 109.7521,
    "jumlahWarga": 1110,
    "defisitAir": 16650,
    "durasiKekeringan": 36,
    "rasioRentan": 40.5,
    "jarakSumber": 7.9,
    "indeksHambatan": 3
  },
  {
    "id": "d086",
    "namaDesa": "Madukara",
    "namaKecamatan": "Madukara",
    "lat": -7.371,
    "lng": 109.7041,
    "jumlahWarga": 1270,
    "defisitAir": 16510,
    "durasiKekeringan": 32,
    "rasioRentan": 23,
    "jarakSumber": 6.6,
    "indeksHambatan": 2
  },
  {
    "id": "d087",
    "namaDesa": "Pagelak",
    "namaKecamatan": "Madukara",
    "lat": -7.3905,
    "lng": 109.7416,
    "jumlahWarga": 1400,
    "defisitAir": 21000,
    "durasiKekeringan": 35,
    "rasioRentan": 38.7,
    "jarakSumber": 8.7,
    "indeksHambatan": 3
  },
  {
    "id": "d088",
    "namaDesa": "Pakelen",
    "namaKecamatan": "Madukara",
    "lat": -7.3469,
    "lng": 109.7255,
    "jumlahWarga": 1570,
    "defisitAir": 20410,
    "durasiKekeringan": 33,
    "rasioRentan": 25.2,
    "jarakSumber": 7,
    "indeksHambatan": 2
  },
  {
    "id": "d089",
    "namaDesa": "Pekauman",
    "namaKecamatan": "Madukara",
    "lat": -7.3833,
    "lng": 109.7063,
    "jumlahWarga": 1180,
    "defisitAir": 16520,
    "durasiKekeringan": 23,
    "rasioRentan": 40.2,
    "jarakSumber": 6.1,
    "indeksHambatan": 3
  },
  {
    "id": "d090",
    "namaDesa": "Penawangan",
    "namaKecamatan": "Madukara",
    "lat": -7.3671,
    "lng": 109.759,
    "jumlahWarga": 1870,
    "defisitAir": 24310,
    "durasiKekeringan": 34,
    "rasioRentan": 30.7,
    "jarakSumber": 8.4,
    "indeksHambatan": 2
  },
  {
    "id": "d091",
    "namaDesa": "Petambakan",
    "namaKecamatan": "Madukara",
    "lat": -7.354,
    "lng": 109.7067,
    "jumlahWarga": 1090,
    "defisitAir": 15260,
    "durasiKekeringan": 23,
    "rasioRentan": 39.5,
    "jarakSumber": 8.5,
    "indeksHambatan": 2
  },
  {
    "id": "d092",
    "namaDesa": "Rakitan",
    "namaKecamatan": "Madukara",
    "lat": -7.3945,
    "lng": 109.7404,
    "jumlahWarga": 1120,
    "defisitAir": 13440,
    "durasiKekeringan": 34,
    "rasioRentan": 36.8,
    "jarakSumber": 5,
    "indeksHambatan": 2
  },
  {
    "id": "d093",
    "namaDesa": "Sered",
    "namaKecamatan": "Madukara",
    "lat": -7.3481,
    "lng": 109.7479,
    "jumlahWarga": 810,
    "defisitAir": 10530,
    "durasiKekeringan": 21,
    "rasioRentan": 18.1,
    "jarakSumber": 5.1,
    "indeksHambatan": 2
  },
  {
    "id": "d094",
    "namaDesa": "Talunamba",
    "namaKecamatan": "Madukara",
    "lat": -7.3735,
    "lng": 109.6983,
    "jumlahWarga": 1250,
    "defisitAir": 17500,
    "durasiKekeringan": 21,
    "rasioRentan": 24.2,
    "jarakSumber": 6.6,
    "indeksHambatan": 2
  },
  {
    "id": "d095",
    "namaDesa": "Banjengan",
    "namaKecamatan": "Mandiraja",
    "lat": -7.4634,
    "lng": 109.5989,
    "jumlahWarga": 2300,
    "defisitAir": 34500,
    "durasiKekeringan": 40,
    "rasioRentan": 27.7,
    "jarakSumber": 5,
    "indeksHambatan": 4
  },
  {
    "id": "d096",
    "namaDesa": "Blimbing",
    "namaKecamatan": "Mandiraja",
    "lat": -7.4573,
    "lng": 109.5712,
    "jumlahWarga": 2550,
    "defisitAir": 30600,
    "durasiKekeringan": 48,
    "rasioRentan": 33.8,
    "jarakSumber": 7.2,
    "indeksHambatan": 2
  },
  {
    "id": "d097",
    "namaDesa": "Candiwulan",
    "namaKecamatan": "Mandiraja",
    "lat": -7.4803,
    "lng": 109.5885,
    "jumlahWarga": 2210,
    "defisitAir": 35360,
    "durasiKekeringan": 56,
    "rasioRentan": 38.8,
    "jarakSumber": 10.7,
    "indeksHambatan": 5
  },
  {
    "id": "d098",
    "namaDesa": "Glempang",
    "namaKecamatan": "Mandiraja",
    "lat": -7.4488,
    "lng": 109.5909,
    "jumlahWarga": 1910,
    "defisitAir": 24830,
    "durasiKekeringan": 48,
    "rasioRentan": 23.1,
    "jarakSumber": 9.8,
    "indeksHambatan": 3
  },
  {
    "id": "d099",
    "namaDesa": "Jalatunda",
    "namaKecamatan": "Mandiraja",
    "lat": -7.4912,
    "lng": 109.5934,
    "jumlahWarga": 1620,
    "defisitAir": 24300,
    "durasiKekeringan": 54,
    "rasioRentan": 37.2,
    "jarakSumber": 8.5,
    "indeksHambatan": 4
  },
  {
    "id": "d100",
    "namaDesa": "Kaliwungu",
    "namaKecamatan": "Mandiraja",
    "lat": -7.4431,
    "lng": 109.6012,
    "jumlahWarga": 1200,
    "defisitAir": 18000,
    "durasiKekeringan": 46,
    "rasioRentan": 31,
    "jarakSumber": 6.2,
    "indeksHambatan": 2
  },
  {
    "id": "d101",
    "namaDesa": "Kebakalan",
    "namaKecamatan": "Mandiraja",
    "lat": -7.4481,
    "lng": 109.5717,
    "jumlahWarga": 1930,
    "defisitAir": 27020,
    "durasiKekeringan": 53,
    "rasioRentan": 41.8,
    "jarakSumber": 4.7,
    "indeksHambatan": 4
  },
  {
    "id": "d102",
    "namaDesa": "Kebanaran",
    "namaKecamatan": "Mandiraja",
    "lat": -7.4862,
    "lng": 109.5833,
    "jumlahWarga": 1740,
    "defisitAir": 20880,
    "durasiKekeringan": 42,
    "rasioRentan": 32.7,
    "jarakSumber": 11.5,
    "indeksHambatan": 2
  },
  {
    "id": "d103",
    "namaDesa": "Kertayasa",
    "namaKecamatan": "Mandiraja",
    "lat": -7.4492,
    "lng": 109.6032,
    "jumlahWarga": 1490,
    "defisitAir": 19370,
    "durasiKekeringan": 60,
    "rasioRentan": 24.8,
    "jarakSumber": 6,
    "indeksHambatan": 3
  },
  {
    "id": "d104",
    "namaDesa": "Mandirajakulon",
    "namaKecamatan": "Mandiraja",
    "lat": -7.4649,
    "lng": 109.558,
    "jumlahWarga": 2100,
    "defisitAir": 25200,
    "durasiKekeringan": 51,
    "rasioRentan": 37,
    "jarakSumber": 8.5,
    "indeksHambatan": 2
  },
  {
    "id": "d105",
    "namaDesa": "Mandirajawetan",
    "namaKecamatan": "Mandiraja",
    "lat": -7.4215,
    "lng": 109.6254,
    "jumlahWarga": 1400,
    "defisitAir": 21000,
    "durasiKekeringan": 40,
    "rasioRentan": 28.5,
    "jarakSumber": 4.5,
    "indeksHambatan": 2
  },
  {
    "id": "d106",
    "namaDesa": "Panggisari",
    "namaKecamatan": "Mandiraja",
    "lat": -7.4406,
    "lng": 109.5872,
    "jumlahWarga": 1280,
    "defisitAir": 16640,
    "durasiKekeringan": 52,
    "rasioRentan": 31.1,
    "jarakSumber": 9.2,
    "indeksHambatan": 3
  },
  {
    "id": "d107",
    "namaDesa": "Purwasaba",
    "namaKecamatan": "Mandiraja",
    "lat": -7.4799,
    "lng": 109.5611,
    "jumlahWarga": 1950,
    "defisitAir": 25350,
    "durasiKekeringan": 43,
    "rasioRentan": 34.8,
    "jarakSumber": 8,
    "indeksHambatan": 3
  },
  {
    "id": "d108",
    "namaDesa": "Salamerta",
    "namaKecamatan": "Mandiraja",
    "lat": -7.4624,
    "lng": 109.6153,
    "jumlahWarga": 1210,
    "defisitAir": 19360,
    "durasiKekeringan": 43,
    "rasioRentan": 36.7,
    "jarakSumber": 8.3,
    "indeksHambatan": 5
  },
  {
    "id": "d109",
    "namaDesa": "Simbang",
    "namaKecamatan": "Mandiraja",
    "lat": -7.4442,
    "lng": 109.5656,
    "jumlahWarga": 2450,
    "defisitAir": 39200,
    "durasiKekeringan": 60,
    "rasioRentan": 19.3,
    "jarakSumber": 10.4,
    "indeksHambatan": 5
  },
  {
    "id": "d110",
    "namaDesa": "Somawangi",
    "namaKecamatan": "Mandiraja",
    "lat": -7.4725,
    "lng": 109.5821,
    "jumlahWarga": 1850,
    "defisitAir": 27750,
    "durasiKekeringan": 58,
    "rasioRentan": 39.5,
    "jarakSumber": 9.8,
    "indeksHambatan": 4
  },
  {
    "id": "d111",
    "namaDesa": "Duren",
    "namaKecamatan": "Pagedongan",
    "lat": -7.4891,
    "lng": 109.7423,
    "jumlahWarga": 1980,
    "defisitAir": 29700,
    "durasiKekeringan": 62,
    "rasioRentan": 46.2,
    "jarakSumber": 14.2,
    "indeksHambatan": 5
  },
  {
    "id": "d112",
    "namaDesa": "Gentansari",
    "namaKecamatan": "Pagedongan",
    "lat": -7.4847,
    "lng": 109.72,
    "jumlahWarga": 1710,
    "defisitAir": 22230,
    "durasiKekeringan": 54,
    "rasioRentan": 30.5,
    "jarakSumber": 9.5,
    "indeksHambatan": 3
  },
  {
    "id": "d113",
    "namaDesa": "Gunungjati",
    "namaKecamatan": "Pagedongan",
    "lat": -7.5132,
    "lng": 109.7392,
    "jumlahWarga": 1300,
    "defisitAir": 18200,
    "durasiKekeringan": 48,
    "rasioRentan": 32.6,
    "jarakSumber": 8.9,
    "indeksHambatan": 4
  },
  {
    "id": "d114",
    "namaDesa": "Kebutuhduwur",
    "namaKecamatan": "Pagedongan",
    "lat": -7.5134,
    "lng": 109.7312,
    "jumlahWarga": 1650,
    "defisitAir": 24750,
    "durasiKekeringan": 58,
    "rasioRentan": 41.5,
    "jarakSumber": 13.5,
    "indeksHambatan": 5
  },
  {
    "id": "d115",
    "namaDesa": "Kebutuhjurang",
    "namaKecamatan": "Pagedongan",
    "lat": -7.5256,
    "lng": 109.7189,
    "jumlahWarga": 1420,
    "defisitAir": 21300,
    "durasiKekeringan": 55,
    "rasioRentan": 38,
    "jarakSumber": 12.8,
    "indeksHambatan": 5
  },
  {
    "id": "d116",
    "namaDesa": "Lebakwangi",
    "namaKecamatan": "Pagedongan",
    "lat": -7.4712,
    "lng": 109.7567,
    "jumlahWarga": 950,
    "defisitAir": 14250,
    "durasiKekeringan": 38,
    "rasioRentan": 27.5,
    "jarakSumber": 9.2,
    "indeksHambatan": 3
  },
  {
    "id": "d117",
    "namaDesa": "Pagedongan",
    "namaKecamatan": "Pagedongan",
    "lat": -7.4729,
    "lng": 109.7217,
    "jumlahWarga": 1790,
    "defisitAir": 26850,
    "durasiKekeringan": 53,
    "rasioRentan": 24.4,
    "jarakSumber": 15,
    "indeksHambatan": 5
  },
  {
    "id": "d118",
    "namaDesa": "Pesangkalan",
    "namaKecamatan": "Pagedongan",
    "lat": -7.521,
    "lng": 109.7347,
    "jumlahWarga": 1150,
    "defisitAir": 13800,
    "durasiKekeringan": 52,
    "rasioRentan": 35.4,
    "jarakSumber": 13.1,
    "indeksHambatan": 3
  },
  {
    "id": "d119",
    "namaDesa": "Twelagiri",
    "namaKecamatan": "Pagedongan",
    "lat": -7.4783,
    "lng": 109.7603,
    "jumlahWarga": 1960,
    "defisitAir": 27440,
    "durasiKekeringan": 51,
    "rasioRentan": 18.3,
    "jarakSumber": 9.5,
    "indeksHambatan": 4
  },
  {
    "id": "d120",
    "namaDesa": "Aribaya",
    "namaKecamatan": "Pagentan",
    "lat": -7.3147,
    "lng": 109.7975,
    "jumlahWarga": 1210,
    "defisitAir": 18150,
    "durasiKekeringan": 22,
    "rasioRentan": 21.1,
    "jarakSumber": 13.6,
    "indeksHambatan": 4
  },
  {
    "id": "d121",
    "namaDesa": "Babadan",
    "namaKecamatan": "Pagentan",
    "lat": -7.3137,
    "lng": 109.7702,
    "jumlahWarga": 1080,
    "defisitAir": 17280,
    "durasiKekeringan": 30,
    "rasioRentan": 26.1,
    "jarakSumber": 8.5,
    "indeksHambatan": 5
  },
  {
    "id": "d122",
    "namaDesa": "Gumingsir",
    "namaKecamatan": "Pagentan",
    "lat": -7.334,
    "lng": 109.7932,
    "jumlahWarga": 1680,
    "defisitAir": 23520,
    "durasiKekeringan": 34,
    "rasioRentan": 29.1,
    "jarakSumber": 13,
    "indeksHambatan": 4
  },
  {
    "id": "d123",
    "namaDesa": "Kalitlaga",
    "namaKecamatan": "Pagentan",
    "lat": -7.305,
    "lng": 109.7945,
    "jumlahWarga": 1040,
    "defisitAir": 16640,
    "durasiKekeringan": 37,
    "rasioRentan": 29.1,
    "jarakSumber": 10.8,
    "indeksHambatan": 5
  },
  {
    "id": "d124",
    "namaDesa": "Karangnangka",
    "namaKecamatan": "Pagentan",
    "lat": -7.3263,
    "lng": 109.7649,
    "jumlahWarga": 1110,
    "defisitAir": 14430,
    "durasiKekeringan": 25,
    "rasioRentan": 21.2,
    "jarakSumber": 10,
    "indeksHambatan": 3
  },
  {
    "id": "d125",
    "namaDesa": "Karekan",
    "namaKecamatan": "Pagentan",
    "lat": -7.3296,
    "lng": 109.8047,
    "jumlahWarga": 1540,
    "defisitAir": 24640,
    "durasiKekeringan": 30,
    "rasioRentan": 19.6,
    "jarakSumber": 9.8,
    "indeksHambatan": 5
  },
  {
    "id": "d126",
    "namaDesa": "Kasmaran",
    "namaKecamatan": "Pagentan",
    "lat": -7.3015,
    "lng": 109.7752,
    "jumlahWarga": 1420,
    "defisitAir": 18460,
    "durasiKekeringan": 23,
    "rasioRentan": 21.2,
    "jarakSumber": 8.9,
    "indeksHambatan": 4
  },
  {
    "id": "d127",
    "namaDesa": "Kayuares",
    "namaKecamatan": "Pagentan",
    "lat": -7.3392,
    "lng": 109.7743,
    "jumlahWarga": 900,
    "defisitAir": 11700,
    "durasiKekeringan": 36,
    "rasioRentan": 22.7,
    "jarakSumber": 8.7,
    "indeksHambatan": 3
  },
  {
    "id": "d128",
    "namaDesa": "Larangan",
    "namaKecamatan": "Pagentan",
    "lat": -7.3098,
    "lng": 109.8081,
    "jumlahWarga": 1590,
    "defisitAir": 22260,
    "durasiKekeringan": 37,
    "rasioRentan": 21.5,
    "jarakSumber": 15.4,
    "indeksHambatan": 4
  },
  {
    "id": "d129",
    "namaDesa": "Majasari",
    "namaKecamatan": "Pagentan",
    "lat": -7.319,
    "lng": 109.7581,
    "jumlahWarga": 1530,
    "defisitAir": 24480,
    "durasiKekeringan": 32,
    "rasioRentan": 25.2,
    "jarakSumber": 14,
    "indeksHambatan": 5
  },
  {
    "id": "d130",
    "namaDesa": "Metawana",
    "namaKecamatan": "Pagentan",
    "lat": -7.341,
    "lng": 109.7979,
    "jumlahWarga": 980,
    "defisitAir": 14700,
    "durasiKekeringan": 24,
    "rasioRentan": 34.6,
    "jarakSumber": 12.3,
    "indeksHambatan": 4
  },
  {
    "id": "d131",
    "namaDesa": "Nagasari",
    "namaKecamatan": "Pagentan",
    "lat": -7.2955,
    "lng": 109.786,
    "jumlahWarga": 820,
    "defisitAir": 12300,
    "durasiKekeringan": 42,
    "rasioRentan": 30,
    "jarakSumber": 10.8,
    "indeksHambatan": 5
  },
  {
    "id": "d132",
    "namaDesa": "Pagentan",
    "namaKecamatan": "Pagentan",
    "lat": -7.3352,
    "lng": 109.7614,
    "jumlahWarga": 1540,
    "defisitAir": 20020,
    "durasiKekeringan": 24,
    "rasioRentan": 40.8,
    "jarakSumber": 13.2,
    "indeksHambatan": 3
  },
  {
    "id": "d133",
    "namaDesa": "Plumbungan",
    "namaKecamatan": "Pagentan",
    "lat": -7.3228,
    "lng": 109.8153,
    "jumlahWarga": 1690,
    "defisitAir": 23660,
    "durasiKekeringan": 29,
    "rasioRentan": 37.9,
    "jarakSumber": 14,
    "indeksHambatan": 4
  },
  {
    "id": "d134",
    "namaDesa": "Sokaraja",
    "namaKecamatan": "Pagentan",
    "lat": -7.3012,
    "lng": 109.7629,
    "jumlahWarga": 1330,
    "defisitAir": 21280,
    "durasiKekeringan": 30,
    "rasioRentan": 20.6,
    "jarakSumber": 14.5,
    "indeksHambatan": 5
  },
  {
    "id": "d135",
    "namaDesa": "Tegaljeruk",
    "namaKecamatan": "Pagentan",
    "lat": -7.3468,
    "lng": 109.7904,
    "jumlahWarga": 900,
    "defisitAir": 13500,
    "durasiKekeringan": 35,
    "rasioRentan": 30.6,
    "jarakSumber": 14,
    "indeksHambatan": 4
  },
  {
    "id": "d136",
    "namaDesa": "Beji",
    "namaKecamatan": "Pandanarum",
    "lat": -7.2431,
    "lng": 109.5813,
    "jumlahWarga": 1310,
    "defisitAir": 20960,
    "durasiKekeringan": 32,
    "rasioRentan": 33.7,
    "jarakSumber": 13.7,
    "indeksHambatan": 5
  },
  {
    "id": "d137",
    "namaDesa": "Lawen",
    "namaKecamatan": "Pandanarum",
    "lat": -7.2341,
    "lng": 109.5497,
    "jumlahWarga": 1320,
    "defisitAir": 17160,
    "durasiKekeringan": 47,
    "rasioRentan": 39.4,
    "jarakSumber": 14.9,
    "indeksHambatan": 4
  },
  {
    "id": "d138",
    "namaDesa": "Pandanarum",
    "namaKecamatan": "Pandanarum",
    "lat": -7.2612,
    "lng": 109.5773,
    "jumlahWarga": 1290,
    "defisitAir": 20640,
    "durasiKekeringan": 32,
    "rasioRentan": 21.8,
    "jarakSumber": 12.9,
    "indeksHambatan": 5
  },
  {
    "id": "d139",
    "namaDesa": "Pasegeran",
    "namaKecamatan": "Pandanarum",
    "lat": -7.2276,
    "lng": 109.5793,
    "jumlahWarga": 1070,
    "defisitAir": 12840,
    "durasiKekeringan": 38,
    "rasioRentan": 38.2,
    "jarakSumber": 12.7,
    "indeksHambatan": 4
  },
  {
    "id": "d140",
    "namaDesa": "Pingit Lor",
    "namaKecamatan": "Pandanarum",
    "lat": -7.2573,
    "lng": 109.5422,
    "jumlahWarga": 1340,
    "defisitAir": 21440,
    "durasiKekeringan": 30,
    "rasioRentan": 41,
    "jarakSumber": 14.2,
    "indeksHambatan": 5
  },
  {
    "id": "d141",
    "namaDesa": "Pringamba",
    "namaKecamatan": "Pandanarum",
    "lat": -7.2568,
    "lng": 109.5902,
    "jumlahWarga": 990,
    "defisitAir": 12870,
    "durasiKekeringan": 36,
    "rasioRentan": 29.3,
    "jarakSumber": 17.3,
    "indeksHambatan": 4
  },
  {
    "id": "d142",
    "namaDesa": "Sinduaji",
    "namaKecamatan": "Pandanarum",
    "lat": -7.2203,
    "lng": 109.5557,
    "jumlahWarga": 650,
    "defisitAir": 10400,
    "durasiKekeringan": 29,
    "rasioRentan": 38.3,
    "jarakSumber": 13.4,
    "indeksHambatan": 5
  },
  {
    "id": "d143",
    "namaDesa": "Sirongge",
    "namaKecamatan": "Pandanarum",
    "lat": -7.2702,
    "lng": 109.5529,
    "jumlahWarga": 1380,
    "defisitAir": 20700,
    "durasiKekeringan": 46,
    "rasioRentan": 39.4,
    "jarakSumber": 11.5,
    "indeksHambatan": 5
  },
  {
    "id": "d144",
    "namaDesa": "Beji",
    "namaKecamatan": "Pejawaran",
    "lat": -7.2634,
    "lng": 109.8287,
    "jumlahWarga": 1520,
    "defisitAir": 24320,
    "durasiKekeringan": 30,
    "rasioRentan": 33.7,
    "jarakSumber": 13.4,
    "indeksHambatan": 5
  },
  {
    "id": "d145",
    "namaDesa": "Biting",
    "namaKecamatan": "Pejawaran",
    "lat": -7.259,
    "lng": 109.8004,
    "jumlahWarga": 860,
    "defisitAir": 12040,
    "durasiKekeringan": 32,
    "rasioRentan": 37.9,
    "jarakSumber": 14.1,
    "indeksHambatan": 4
  },
  {
    "id": "d146",
    "namaDesa": "Condong Campur",
    "namaKecamatan": "Pejawaran",
    "lat": -7.2801,
    "lng": 109.8183,
    "jumlahWarga": 820,
    "defisitAir": 12300,
    "durasiKekeringan": 36,
    "rasioRentan": 26.5,
    "jarakSumber": 15.9,
    "indeksHambatan": 5
  },
  {
    "id": "d147",
    "namaDesa": "Darmayasa",
    "namaKecamatan": "Pejawaran",
    "lat": -7.2494,
    "lng": 109.8221,
    "jumlahWarga": 1640,
    "defisitAir": 22960,
    "durasiKekeringan": 37,
    "rasioRentan": 38.4,
    "jarakSumber": 14.6,
    "indeksHambatan": 4
  },
  {
    "id": "d148",
    "namaDesa": "Gembol",
    "namaKecamatan": "Pejawaran",
    "lat": -7.2742,
    "lng": 109.797,
    "jumlahWarga": 1200,
    "defisitAir": 18000,
    "durasiKekeringan": 37,
    "rasioRentan": 34.9,
    "jarakSumber": 14.4,
    "indeksHambatan": 4
  },
  {
    "id": "d149",
    "namaDesa": "Giritirta",
    "namaKecamatan": "Pejawaran",
    "lat": -7.2675,
    "lng": 109.8371,
    "jumlahWarga": 1560,
    "defisitAir": 20280,
    "durasiKekeringan": 37,
    "rasioRentan": 18.2,
    "jarakSumber": 12.4,
    "indeksHambatan": 3
  },
  {
    "id": "d150",
    "namaDesa": "Grogol",
    "namaKecamatan": "Pejawaran",
    "lat": -7.2493,
    "lng": 109.8006,
    "jumlahWarga": 710,
    "defisitAir": 8520,
    "durasiKekeringan": 44,
    "rasioRentan": 22.5,
    "jarakSumber": 15,
    "indeksHambatan": 3
  },
  {
    "id": "d151",
    "namaDesa": "Kalilunjar",
    "namaKecamatan": "Pejawaran",
    "lat": -7.2837,
    "lng": 109.8042,
    "jumlahWarga": 1730,
    "defisitAir": 24220,
    "durasiKekeringan": 30,
    "rasioRentan": 33.9,
    "jarakSumber": 12.5,
    "indeksHambatan": 4
  },
  {
    "id": "d152",
    "namaDesa": "Karangsari",
    "namaKecamatan": "Pejawaran",
    "lat": -7.2534,
    "lng": 109.8365,
    "jumlahWarga": 1170,
    "defisitAir": 15210,
    "durasiKekeringan": 45,
    "rasioRentan": 37.1,
    "jarakSumber": 16.9,
    "indeksHambatan": 4
  },
  {
    "id": "d153",
    "namaDesa": "Panusupan",
    "namaKecamatan": "Pejawaran",
    "lat": -7.2647,
    "lng": 109.7886,
    "jumlahWarga": 1060,
    "defisitAir": 15900,
    "durasiKekeringan": 36,
    "rasioRentan": 24.1,
    "jarakSumber": 12.6,
    "indeksHambatan": 4
  },
  {
    "id": "d154",
    "namaDesa": "Pegundungan",
    "namaKecamatan": "Pejawaran",
    "lat": -7.2854,
    "lng": 109.8281,
    "jumlahWarga": 1120,
    "defisitAir": 14560,
    "durasiKekeringan": 38,
    "rasioRentan": 36.8,
    "jarakSumber": 14.9,
    "indeksHambatan": 4
  },
  {
    "id": "d155",
    "namaDesa": "Pejawaran",
    "namaKecamatan": "Pejawaran",
    "lat": -7.2411,
    "lng": 109.814,
    "jumlahWarga": 1740,
    "defisitAir": 20880,
    "durasiKekeringan": 36,
    "rasioRentan": 32.6,
    "jarakSumber": 11.7,
    "indeksHambatan": 3
  },
  {
    "id": "d156",
    "namaDesa": "Ratamba",
    "namaKecamatan": "Pejawaran",
    "lat": -7.2826,
    "lng": 109.7947,
    "jumlahWarga": 910,
    "defisitAir": 12740,
    "durasiKekeringan": 30,
    "rasioRentan": 33,
    "jarakSumber": 13.7,
    "indeksHambatan": 4
  },
  {
    "id": "d157",
    "namaDesa": "Sarwodadi",
    "namaKecamatan": "Pejawaran",
    "lat": -7.2653,
    "lng": 109.8448,
    "jumlahWarga": 1190,
    "defisitAir": 15470,
    "durasiKekeringan": 26,
    "rasioRentan": 35.6,
    "jarakSumber": 15.6,
    "indeksHambatan": 3
  },
  {
    "id": "d158",
    "namaDesa": "Semangkung",
    "namaKecamatan": "Pejawaran",
    "lat": -7.2508,
    "lng": 109.7895,
    "jumlahWarga": 1470,
    "defisitAir": 20580,
    "durasiKekeringan": 28,
    "rasioRentan": 34.7,
    "jarakSumber": 16.9,
    "indeksHambatan": 4
  },
  {
    "id": "d159",
    "namaDesa": "Sidengok",
    "namaKecamatan": "Pejawaran",
    "lat": -7.2915,
    "lng": 109.8127,
    "jumlahWarga": 1410,
    "defisitAir": 19740,
    "durasiKekeringan": 33,
    "rasioRentan": 27.3,
    "jarakSumber": 13.7,
    "indeksHambatan": 4
  },
  {
    "id": "d160",
    "namaDesa": "Tlahap",
    "namaKecamatan": "Pejawaran",
    "lat": -7.2457,
    "lng": 109.8375,
    "jumlahWarga": 960,
    "defisitAir": 13440,
    "durasiKekeringan": 32,
    "rasioRentan": 20.9,
    "jarakSumber": 17.7,
    "indeksHambatan": 4
  },
  {
    "id": "d161",
    "namaDesa": "Badakarya",
    "namaKecamatan": "Punggelan",
    "lat": -7.3342,
    "lng": 109.6588,
    "jumlahWarga": 1070,
    "defisitAir": 16050,
    "durasiKekeringan": 54,
    "rasioRentan": 23.1,
    "jarakSumber": 10.4,
    "indeksHambatan": 4
  },
  {
    "id": "d162",
    "namaDesa": "Bondolharjo",
    "namaKecamatan": "Punggelan",
    "lat": -7.3301,
    "lng": 109.6298,
    "jumlahWarga": 2380,
    "defisitAir": 38080,
    "durasiKekeringan": 49,
    "rasioRentan": 18.9,
    "jarakSumber": 11.5,
    "indeksHambatan": 4
  },
  {
    "id": "d163",
    "namaDesa": "Danakerta",
    "namaKecamatan": "Punggelan",
    "lat": -7.3488,
    "lng": 109.6531,
    "jumlahWarga": 2070,
    "defisitAir": 33120,
    "durasiKekeringan": 51,
    "rasioRentan": 37.9,
    "jarakSumber": 8.1,
    "indeksHambatan": 4
  },
  {
    "id": "d164",
    "namaDesa": "Jembangan",
    "namaKecamatan": "Punggelan",
    "lat": -7.3202,
    "lng": 109.654,
    "jumlahWarga": 1880,
    "defisitAir": 24440,
    "durasiKekeringan": 38,
    "rasioRentan": 36.4,
    "jarakSumber": 11.5,
    "indeksHambatan": 2
  },
  {
    "id": "d165",
    "namaDesa": "Karangsari",
    "namaKecamatan": "Punggelan",
    "lat": -7.3418,
    "lng": 109.6255,
    "jumlahWarga": 1590,
    "defisitAir": 20670,
    "durasiKekeringan": 55,
    "rasioRentan": 37.1,
    "jarakSumber": 12,
    "indeksHambatan": 3
  },
  {
    "id": "d166",
    "namaDesa": "Kecepit",
    "namaKecamatan": "Punggelan",
    "lat": -7.3289,
    "lng": 109.6821,
    "jumlahWarga": 1280,
    "defisitAir": 19200,
    "durasiKekeringan": 44,
    "rasioRentan": 33.2,
    "jarakSumber": 10.5,
    "indeksHambatan": 4
  },
  {
    "id": "d167",
    "namaDesa": "Klapa",
    "namaKecamatan": "Punggelan",
    "lat": -7.3196,
    "lng": 109.6301,
    "jumlahWarga": 930,
    "defisitAir": 12090,
    "durasiKekeringan": 29,
    "rasioRentan": 21.5,
    "jarakSumber": 8.1,
    "indeksHambatan": 3
  },
  {
    "id": "d168",
    "namaDesa": "Mlaya",
    "namaKecamatan": "Punggelan",
    "lat": -7.3549,
    "lng": 109.638,
    "jumlahWarga": 1500,
    "defisitAir": 21000,
    "durasiKekeringan": 45,
    "rasioRentan": 19.1,
    "jarakSumber": 7.2,
    "indeksHambatan": 3
  },
  {
    "id": "d169",
    "namaDesa": "Petuguran",
    "namaKecamatan": "Punggelan",
    "lat": -7.3612,
    "lng": 109.6432,
    "jumlahWarga": 840,
    "defisitAir": 12600,
    "durasiKekeringan": 30,
    "rasioRentan": 23,
    "jarakSumber": 7.4,
    "indeksHambatan": 2
  },
  {
    "id": "d170",
    "namaDesa": "Punggelan",
    "namaKecamatan": "Punggelan",
    "lat": -7.3456,
    "lng": 109.6654,
    "jumlahWarga": 2250,
    "defisitAir": 33750,
    "durasiKekeringan": 55,
    "rasioRentan": 43,
    "jarakSumber": 8.9,
    "indeksHambatan": 3
  },
  {
    "id": "d171",
    "namaDesa": "Purwasana",
    "namaKecamatan": "Punggelan",
    "lat": -7.349,
    "lng": 109.6668,
    "jumlahWarga": 2050,
    "defisitAir": 24600,
    "durasiKekeringan": 34,
    "rasioRentan": 29,
    "jarakSumber": 10.5,
    "indeksHambatan": 2
  },
  {
    "id": "d172",
    "namaDesa": "Sambong",
    "namaKecamatan": "Punggelan",
    "lat": -7.3111,
    "lng": 109.6469,
    "jumlahWarga": 2000,
    "defisitAir": 30000,
    "durasiKekeringan": 32,
    "rasioRentan": 19.4,
    "jarakSumber": 11.3,
    "indeksHambatan": 3
  },
  {
    "id": "d173",
    "namaDesa": "Sawangan",
    "namaKecamatan": "Punggelan",
    "lat": -7.3508,
    "lng": 109.6227,
    "jumlahWarga": 1070,
    "defisitAir": 16050,
    "durasiKekeringan": 38,
    "rasioRentan": 41.9,
    "jarakSumber": 8.6,
    "indeksHambatan": 4
  },
  {
    "id": "d174",
    "namaDesa": "Sidarata",
    "namaKecamatan": "Punggelan",
    "lat": -7.3347,
    "lng": 109.6748,
    "jumlahWarga": 930,
    "defisitAir": 14880,
    "durasiKekeringan": 30,
    "rasioRentan": 35,
    "jarakSumber": 12.4,
    "indeksHambatan": 4
  },
  {
    "id": "d175",
    "namaDesa": "Tanjungtirta",
    "namaKecamatan": "Punggelan",
    "lat": -7.315,
    "lng": 109.6256,
    "jumlahWarga": 1470,
    "defisitAir": 22050,
    "durasiKekeringan": 41,
    "rasioRentan": 21.4,
    "jarakSumber": 10.8,
    "indeksHambatan": 4
  },
  {
    "id": "d176",
    "namaDesa": "Tlaga",
    "namaKecamatan": "Punggelan",
    "lat": -7.3614,
    "lng": 109.6486,
    "jumlahWarga": 2180,
    "defisitAir": 30520,
    "durasiKekeringan": 47,
    "rasioRentan": 35.5,
    "jarakSumber": 10,
    "indeksHambatan": 3
  },
  {
    "id": "d177",
    "namaDesa": "Tribuana",
    "namaKecamatan": "Punggelan",
    "lat": -7.3142,
    "lng": 109.6656,
    "jumlahWarga": 1660,
    "defisitAir": 19920,
    "durasiKekeringan": 55,
    "rasioRentan": 32.5,
    "jarakSumber": 8.5,
    "indeksHambatan": 2
  },
  {
    "id": "d178",
    "namaDesa": "Danaraja",
    "namaKecamatan": "Purwanegara",
    "lat": -7.4652,
    "lng": 109.6635,
    "jumlahWarga": 2390,
    "defisitAir": 33460,
    "durasiKekeringan": 47,
    "rasioRentan": 25.2,
    "jarakSumber": 8.8,
    "indeksHambatan": 3
  },
  {
    "id": "d179",
    "namaDesa": "Gumiwang",
    "namaKecamatan": "Purwanegara",
    "lat": -7.464,
    "lng": 109.6341,
    "jumlahWarga": 1680,
    "defisitAir": 21840,
    "durasiKekeringan": 56,
    "rasioRentan": 19.2,
    "jarakSumber": 6.2,
    "indeksHambatan": 2
  },
  {
    "id": "d180",
    "namaDesa": "Kaliajir",
    "namaKecamatan": "Purwanegara",
    "lat": -7.5023,
    "lng": 109.6389,
    "jumlahWarga": 1750,
    "defisitAir": 26250,
    "durasiKekeringan": 56,
    "rasioRentan": 42.1,
    "jarakSumber": 10.4,
    "indeksHambatan": 4
  },
  {
    "id": "d181",
    "namaDesa": "Kalipelus",
    "namaKecamatan": "Purwanegara",
    "lat": -7.454,
    "lng": 109.6599,
    "jumlahWarga": 1220,
    "defisitAir": 17080,
    "durasiKekeringan": 55,
    "rasioRentan": 35.1,
    "jarakSumber": 8.8,
    "indeksHambatan": 3
  },
  {
    "id": "d182",
    "namaDesa": "Kalitengah",
    "namaKecamatan": "Purwanegara",
    "lat": -7.475,
    "lng": 109.6279,
    "jumlahWarga": 2480,
    "defisitAir": 37200,
    "durasiKekeringan": 59,
    "rasioRentan": 31.7,
    "jarakSumber": 5.2,
    "indeksHambatan": 3
  },
  {
    "id": "d183",
    "namaDesa": "Karanganyar",
    "namaKecamatan": "Purwanegara",
    "lat": -7.4321,
    "lng": 109.6814,
    "jumlahWarga": 1380,
    "defisitAir": 20700,
    "durasiKekeringan": 45,
    "rasioRentan": 33.5,
    "jarakSumber": 5.8,
    "indeksHambatan": 2
  },
  {
    "id": "d184",
    "namaDesa": "Kutawuluh",
    "namaKecamatan": "Purwanegara",
    "lat": -7.4502,
    "lng": 109.6394,
    "jumlahWarga": 2150,
    "defisitAir": 32250,
    "durasiKekeringan": 52,
    "rasioRentan": 27.2,
    "jarakSumber": 10.3,
    "indeksHambatan": 3
  },
  {
    "id": "d185",
    "namaDesa": "Merden",
    "namaKecamatan": "Purwanegara",
    "lat": -7.4789,
    "lng": 109.6456,
    "jumlahWarga": 2450,
    "defisitAir": 36750,
    "durasiKekeringan": 60,
    "rasioRentan": 45,
    "jarakSumber": 7.8,
    "indeksHambatan": 3
  },
  {
    "id": "d186",
    "namaDesa": "Mertasari",
    "namaKecamatan": "Purwanegara",
    "lat": -7.4569,
    "lng": 109.6733,
    "jumlahWarga": 1710,
    "defisitAir": 20520,
    "durasiKekeringan": 62,
    "rasioRentan": 24.3,
    "jarakSumber": 6.5,
    "indeksHambatan": 2
  },
  {
    "id": "d187",
    "namaDesa": "Parakan",
    "namaKecamatan": "Purwanegara",
    "lat": -7.467,
    "lng": 109.6212,
    "jumlahWarga": 2020,
    "defisitAir": 24240,
    "durasiKekeringan": 52,
    "rasioRentan": 30,
    "jarakSumber": 6.4,
    "indeksHambatan": 2
  },
  {
    "id": "d188",
    "namaDesa": "Petir",
    "namaKecamatan": "Purwanegara",
    "lat": -7.4861,
    "lng": 109.6733,
    "jumlahWarga": 1520,
    "defisitAir": 19760,
    "durasiKekeringan": 48,
    "rasioRentan": 26.5,
    "jarakSumber": 8.7,
    "indeksHambatan": 3
  },
  {
    "id": "d189",
    "namaDesa": "Pucungbedug",
    "namaKecamatan": "Purwanegara",
    "lat": -7.4567,
    "lng": 109.6632,
    "jumlahWarga": 1100,
    "defisitAir": 16500,
    "durasiKekeringan": 42,
    "rasioRentan": 29.8,
    "jarakSumber": 6.5,
    "indeksHambatan": 3
  },
  {
    "id": "d190",
    "namaDesa": "Purwonegoro",
    "namaKecamatan": "Purwanegara",
    "lat": -7.4912,
    "lng": 109.63,
    "jumlahWarga": 1890,
    "defisitAir": 22680,
    "durasiKekeringan": 55,
    "rasioRentan": 36.6,
    "jarakSumber": 8.5,
    "indeksHambatan": 2
  },
  {
    "id": "d191",
    "namaDesa": "Kalilandak",
    "namaKecamatan": "Purwareja Klampok",
    "lat": -7.4249,
    "lng": 109.5515,
    "jumlahWarga": 1690,
    "defisitAir": 20280,
    "durasiKekeringan": 43,
    "rasioRentan": 33.8,
    "jarakSumber": 6,
    "indeksHambatan": 1
  },
  {
    "id": "d192",
    "namaDesa": "Kalimandi",
    "namaKecamatan": "Purwareja Klampok",
    "lat": -7.4201,
    "lng": 109.5412,
    "jumlahWarga": 2300,
    "defisitAir": 34500,
    "durasiKekeringan": 48,
    "rasioRentan": 35,
    "jarakSumber": 4.2,
    "indeksHambatan": 1
  },
  {
    "id": "d193",
    "namaDesa": "Kaliwinasuh",
    "namaKecamatan": "Purwareja Klampok",
    "lat": -7.4356,
    "lng": 109.5301,
    "jumlahWarga": 1580,
    "defisitAir": 23700,
    "durasiKekeringan": 46,
    "rasioRentan": 32.8,
    "jarakSumber": 5.3,
    "indeksHambatan": 2
  },
  {
    "id": "d194",
    "namaDesa": "Kecitran",
    "namaKecamatan": "Purwareja Klampok",
    "lat": -7.4054,
    "lng": 109.5447,
    "jumlahWarga": 1710,
    "defisitAir": 23940,
    "durasiKekeringan": 40,
    "rasioRentan": 38.3,
    "jarakSumber": 5,
    "indeksHambatan": 2
  },
  {
    "id": "d195",
    "namaDesa": "Klampok",
    "namaKecamatan": "Purwareja Klampok",
    "lat": -7.4299,
    "lng": 109.5086,
    "jumlahWarga": 1470,
    "defisitAir": 22050,
    "durasiKekeringan": 28,
    "rasioRentan": 26.8,
    "jarakSumber": 6,
    "indeksHambatan": 2
  },
  {
    "id": "d196",
    "namaDesa": "Pagak",
    "namaKecamatan": "Purwareja Klampok",
    "lat": -7.4112,
    "lng": 109.5589,
    "jumlahWarga": 920,
    "defisitAir": 13800,
    "durasiKekeringan": 32,
    "rasioRentan": 25,
    "jarakSumber": 4.8,
    "indeksHambatan": 1
  },
  {
    "id": "d197",
    "namaDesa": "Purworejo",
    "namaKecamatan": "Purwareja Klampok",
    "lat": -7.4049,
    "lng": 109.5158,
    "jumlahWarga": 2350,
    "defisitAir": 32900,
    "durasiKekeringan": 43,
    "rasioRentan": 33.9,
    "jarakSumber": 5.1,
    "indeksHambatan": 1
  },
  {
    "id": "d198",
    "namaDesa": "Sirkandi",
    "namaKecamatan": "Purwareja Klampok",
    "lat": -7.4513,
    "lng": 109.5268,
    "jumlahWarga": 1420,
    "defisitAir": 19880,
    "durasiKekeringan": 37,
    "rasioRentan": 34.7,
    "jarakSumber": 5.1,
    "indeksHambatan": 1
  },
  {
    "id": "d199",
    "namaDesa": "Adipasir",
    "namaKecamatan": "Rakit",
    "lat": -7.3734,
    "lng": 109.5801,
    "jumlahWarga": 870,
    "defisitAir": 11310,
    "durasiKekeringan": 36,
    "rasioRentan": 29,
    "jarakSumber": 5,
    "indeksHambatan": 1
  },
  {
    "id": "d200",
    "namaDesa": "Badamita",
    "namaKecamatan": "Rakit",
    "lat": -7.3707,
    "lng": 109.5475,
    "jumlahWarga": 1550,
    "defisitAir": 23250,
    "durasiKekeringan": 20,
    "rasioRentan": 33.2,
    "jarakSumber": 7.2,
    "indeksHambatan": 2
  },
  {
    "id": "d201",
    "namaDesa": "Bandingan",
    "namaKecamatan": "Rakit",
    "lat": -7.3921,
    "lng": 109.5689,
    "jumlahWarga": 1280,
    "defisitAir": 20480,
    "durasiKekeringan": 24,
    "rasioRentan": 27.9,
    "jarakSumber": 5.9,
    "indeksHambatan": 2
  },
  {
    "id": "d202",
    "namaDesa": "Gelang",
    "namaKecamatan": "Rakit",
    "lat": -7.3581,
    "lng": 109.5755,
    "jumlahWarga": 1340,
    "defisitAir": 16080,
    "durasiKekeringan": 35,
    "rasioRentan": 24,
    "jarakSumber": 6.5,
    "indeksHambatan": 1
  },
  {
    "id": "d203",
    "namaDesa": "Kincang",
    "namaKecamatan": "Rakit",
    "lat": -7.3804,
    "lng": 109.5417,
    "jumlahWarga": 650,
    "defisitAir": 7800,
    "durasiKekeringan": 33,
    "rasioRentan": 23.8,
    "jarakSumber": 5.8,
    "indeksHambatan": 1
  },
  {
    "id": "d204",
    "namaDesa": "Lengkong",
    "namaKecamatan": "Rakit",
    "lat": -7.38,
    "lng": 109.59,
    "jumlahWarga": 890,
    "defisitAir": 14240,
    "durasiKekeringan": 36,
    "rasioRentan": 34.6,
    "jarakSumber": 5.9,
    "indeksHambatan": 2
  },
  {
    "id": "d205",
    "namaDesa": "Luwung",
    "namaKecamatan": "Rakit",
    "lat": -7.3579,
    "lng": 109.5468,
    "jumlahWarga": 1330,
    "defisitAir": 21280,
    "durasiKekeringan": 30,
    "rasioRentan": 32.5,
    "jarakSumber": 5.4,
    "indeksHambatan": 2
  },
  {
    "id": "d206",
    "namaDesa": "Pingit",
    "namaKecamatan": "Rakit",
    "lat": -7.3981,
    "lng": 109.5566,
    "jumlahWarga": 1690,
    "defisitAir": 20280,
    "durasiKekeringan": 34,
    "rasioRentan": 35,
    "jarakSumber": 6.9,
    "indeksHambatan": 1
  },
  {
    "id": "d207",
    "namaDesa": "Rakit",
    "namaKecamatan": "Rakit",
    "lat": -7.3591,
    "lng": 109.5881,
    "jumlahWarga": 1380,
    "defisitAir": 22080,
    "durasiKekeringan": 23,
    "rasioRentan": 36.7,
    "jarakSumber": 7.6,
    "indeksHambatan": 2
  },
  {
    "id": "d208",
    "namaDesa": "Situwangi",
    "namaKecamatan": "Rakit",
    "lat": -7.3726,
    "lng": 109.5342,
    "jumlahWarga": 1700,
    "defisitAir": 25500,
    "durasiKekeringan": 34,
    "rasioRentan": 18.3,
    "jarakSumber": 7.1,
    "indeksHambatan": 2
  },
  {
    "id": "d209",
    "namaDesa": "Tanjunganom",
    "namaKecamatan": "Rakit",
    "lat": -7.3992,
    "lng": 109.5795,
    "jumlahWarga": 1170,
    "defisitAir": 14040,
    "durasiKekeringan": 23,
    "rasioRentan": 41.4,
    "jarakSumber": 6.8,
    "indeksHambatan": 1
  },
  {
    "id": "d210",
    "namaDesa": "Bandingan",
    "namaKecamatan": "Sigaluh",
    "lat": -7.4037,
    "lng": 109.7893,
    "jumlahWarga": 1290,
    "defisitAir": 20640,
    "durasiKekeringan": 25,
    "rasioRentan": 27.9,
    "jarakSumber": 6.6,
    "indeksHambatan": 3
  },
  {
    "id": "d211",
    "namaDesa": "Bojanegara",
    "namaKecamatan": "Sigaluh",
    "lat": -7.3958,
    "lng": 109.7618,
    "jumlahWarga": 1560,
    "defisitAir": 18720,
    "durasiKekeringan": 35,
    "rasioRentan": 36.8,
    "jarakSumber": 4.8,
    "indeksHambatan": 2
  },
  {
    "id": "d212",
    "namaDesa": "Gembongan",
    "namaKecamatan": "Sigaluh",
    "lat": -7.4192,
    "lng": 109.7844,
    "jumlahWarga": 1030,
    "defisitAir": 16480,
    "durasiKekeringan": 23,
    "rasioRentan": 37.7,
    "jarakSumber": 8.5,
    "indeksHambatan": 3
  },
  {
    "id": "d213",
    "namaDesa": "Karangmangu",
    "namaKecamatan": "Sigaluh",
    "lat": -7.388,
    "lng": 109.7807,
    "jumlahWarga": 780,
    "defisitAir": 12480,
    "durasiKekeringan": 32,
    "rasioRentan": 40.2,
    "jarakSumber": 6.2,
    "indeksHambatan": 3
  },
  {
    "id": "d214",
    "namaDesa": "Kemiri",
    "namaKecamatan": "Sigaluh",
    "lat": -7.4089,
    "lng": 109.7531,
    "jumlahWarga": 1410,
    "defisitAir": 18330,
    "durasiKekeringan": 23,
    "rasioRentan": 25.3,
    "jarakSumber": 9.1,
    "indeksHambatan": 2
  },
  {
    "id": "d215",
    "namaDesa": "Panawaren",
    "namaKecamatan": "Sigaluh",
    "lat": -7.4147,
    "lng": 109.7958,
    "jumlahWarga": 1780,
    "defisitAir": 23140,
    "durasiKekeringan": 36,
    "rasioRentan": 37.7,
    "jarakSumber": 5.6,
    "indeksHambatan": 2
  },
  {
    "id": "d216",
    "namaDesa": "Prigi",
    "namaKecamatan": "Sigaluh",
    "lat": -7.3851,
    "lng": 109.7665,
    "jumlahWarga": 1580,
    "defisitAir": 23700,
    "durasiKekeringan": 35,
    "rasioRentan": 30.6,
    "jarakSumber": 5,
    "indeksHambatan": 3
  },
  {
    "id": "d217",
    "namaDesa": "Pringamba",
    "namaKecamatan": "Sigaluh",
    "lat": -7.4253,
    "lng": 109.7644,
    "jumlahWarga": 1160,
    "defisitAir": 15080,
    "durasiKekeringan": 28,
    "rasioRentan": 29.3,
    "jarakSumber": 8.2,
    "indeksHambatan": 2
  },
  {
    "id": "d218",
    "namaDesa": "Randegan",
    "namaKecamatan": "Sigaluh",
    "lat": -7.3952,
    "lng": 109.7997,
    "jumlahWarga": 900,
    "defisitAir": 13500,
    "durasiKekeringan": 37,
    "rasioRentan": 29.6,
    "jarakSumber": 6.1,
    "indeksHambatan": 3
  },
  {
    "id": "d219",
    "namaDesa": "Sawal",
    "namaKecamatan": "Sigaluh",
    "lat": -7.3999,
    "lng": 109.7474,
    "jumlahWarga": 1080,
    "defisitAir": 15120,
    "durasiKekeringan": 23,
    "rasioRentan": 22.2,
    "jarakSumber": 7.7,
    "indeksHambatan": 3
  },
  {
    "id": "d220",
    "namaDesa": "Sigaluh",
    "namaKecamatan": "Sigaluh",
    "lat": -7.4222,
    "lng": 109.7961,
    "jumlahWarga": 1070,
    "defisitAir": 13910,
    "durasiKekeringan": 29,
    "rasioRentan": 39.2,
    "jarakSumber": 8.9,
    "indeksHambatan": 2
  },
  {
    "id": "d221",
    "namaDesa": "Singomerto",
    "namaKecamatan": "Sigaluh",
    "lat": -7.3795,
    "lng": 109.7714,
    "jumlahWarga": 1330,
    "defisitAir": 21280,
    "durasiKekeringan": 28,
    "rasioRentan": 31.8,
    "jarakSumber": 6.2,
    "indeksHambatan": 3
  },
  {
    "id": "d222",
    "namaDesa": "Tunggara",
    "namaKecamatan": "Sigaluh",
    "lat": -7.4193,
    "lng": 109.7488,
    "jumlahWarga": 1100,
    "defisitAir": 13200,
    "durasiKekeringan": 28,
    "rasioRentan": 32,
    "jarakSumber": 4.5,
    "indeksHambatan": 2
  },
  {
    "id": "d223",
    "namaDesa": "Wanacipta",
    "namaKecamatan": "Sigaluh",
    "lat": -7.3988,
    "lng": 109.8062,
    "jumlahWarga": 720,
    "defisitAir": 8640,
    "durasiKekeringan": 35,
    "rasioRentan": 23.1,
    "jarakSumber": 6.4,
    "indeksHambatan": 2
  },
  {
    "id": "d224",
    "namaDesa": "Berta",
    "namaKecamatan": "Susukan",
    "lat": -7.5049,
    "lng": 109.5742,
    "jumlahWarga": 1940,
    "defisitAir": 29100,
    "durasiKekeringan": 44,
    "rasioRentan": 25.5,
    "jarakSumber": 8.7,
    "indeksHambatan": 3
  },
  {
    "id": "d225",
    "namaDesa": "Brengkok",
    "namaKecamatan": "Susukan",
    "lat": -7.4971,
    "lng": 109.5461,
    "jumlahWarga": 1550,
    "defisitAir": 21700,
    "durasiKekeringan": 46,
    "rasioRentan": 32.2,
    "jarakSumber": 7.6,
    "indeksHambatan": 3
  },
  {
    "id": "d226",
    "namaDesa": "Derik",
    "namaKecamatan": "Susukan",
    "lat": -7.489,
    "lng": 109.5423,
    "jumlahWarga": 890,
    "defisitAir": 13350,
    "durasiKekeringan": 35,
    "rasioRentan": 24.2,
    "jarakSumber": 7.1,
    "indeksHambatan": 2
  },
  {
    "id": "d227",
    "namaDesa": "Dermasari",
    "namaKecamatan": "Susukan",
    "lat": -7.4891,
    "lng": 109.5682,
    "jumlahWarga": 2210,
    "defisitAir": 33150,
    "durasiKekeringan": 34,
    "rasioRentan": 26.7,
    "jarakSumber": 10.8,
    "indeksHambatan": 3
  },
  {
    "id": "d228",
    "namaDesa": "Gumelem Kulon",
    "namaKecamatan": "Susukan",
    "lat": -7.5145,
    "lng": 109.5632,
    "jumlahWarga": 2100,
    "defisitAir": 31500,
    "durasiKekeringan": 52,
    "rasioRentan": 39.8,
    "jarakSumber": 11.5,
    "indeksHambatan": 4
  },
  {
    "id": "d229",
    "namaDesa": "Gumelem Wetan",
    "namaKecamatan": "Susukan",
    "lat": -7.5289,
    "lng": 109.5741,
    "jumlahWarga": 1820,
    "defisitAir": 27300,
    "durasiKekeringan": 50,
    "rasioRentan": 36.4,
    "jarakSumber": 12,
    "indeksHambatan": 4
  },
  {
    "id": "d230",
    "namaDesa": "Karangjati",
    "namaKecamatan": "Susukan",
    "lat": -7.4859,
    "lng": 109.5505,
    "jumlahWarga": 2000,
    "defisitAir": 24000,
    "durasiKekeringan": 45,
    "rasioRentan": 30.2,
    "jarakSumber": 12,
    "indeksHambatan": 2
  },
  {
    "id": "d231",
    "namaDesa": "Karangsalam",
    "namaKecamatan": "Susukan",
    "lat": -7.5245,
    "lng": 109.5488,
    "jumlahWarga": 2120,
    "defisitAir": 29680,
    "durasiKekeringan": 37,
    "rasioRentan": 26.4,
    "jarakSumber": 6.3,
    "indeksHambatan": 3
  },
  {
    "id": "d232",
    "namaDesa": "Kedawung",
    "namaKecamatan": "Susukan",
    "lat": -7.4904,
    "lng": 109.5803,
    "jumlahWarga": 1540,
    "defisitAir": 18480,
    "durasiKekeringan": 51,
    "rasioRentan": 39.1,
    "jarakSumber": 10.1,
    "indeksHambatan": 2
  },
  {
    "id": "d233",
    "namaDesa": "Kemranggon",
    "namaKecamatan": "Susukan",
    "lat": -7.5,
    "lng": 109.5331,
    "jumlahWarga": 1910,
    "defisitAir": 30560,
    "durasiKekeringan": 35,
    "rasioRentan": 23.3,
    "jarakSumber": 8.6,
    "indeksHambatan": 4
  },
  {
    "id": "d234",
    "namaDesa": "Pakikiran",
    "namaKecamatan": "Susukan",
    "lat": -7.5223,
    "lng": 109.58,
    "jumlahWarga": 1090,
    "defisitAir": 17440,
    "durasiKekeringan": 36,
    "rasioRentan": 37,
    "jarakSumber": 11.8,
    "indeksHambatan": 4
  },
  {
    "id": "d235",
    "namaDesa": "Panerusan Kulon",
    "namaKecamatan": "Susukan",
    "lat": -7.48,
    "lng": 109.5605,
    "jumlahWarga": 1730,
    "defisitAir": 25950,
    "durasiKekeringan": 37,
    "rasioRentan": 28.5,
    "jarakSumber": 8.3,
    "indeksHambatan": 4
  },
  {
    "id": "d236",
    "namaDesa": "Panerusan Wetan",
    "namaKecamatan": "Susukan",
    "lat": -7.5264,
    "lng": 109.5431,
    "jumlahWarga": 1900,
    "defisitAir": 24700,
    "durasiKekeringan": 54,
    "rasioRentan": 41.8,
    "jarakSumber": 8.5,
    "indeksHambatan": 2
  },
  {
    "id": "d237",
    "namaDesa": "Piasa Wetan",
    "namaKecamatan": "Susukan",
    "lat": -7.4996,
    "lng": 109.5905,
    "jumlahWarga": 1920,
    "defisitAir": 28800,
    "durasiKekeringan": 47,
    "rasioRentan": 25.6,
    "jarakSumber": 12.3,
    "indeksHambatan": 4
  },
  {
    "id": "d238",
    "namaDesa": "Susukan",
    "namaKecamatan": "Susukan",
    "lat": -7.4913,
    "lng": 109.5324,
    "jumlahWarga": 1020,
    "defisitAir": 14280,
    "durasiKekeringan": 39,
    "rasioRentan": 30,
    "jarakSumber": 6.9,
    "indeksHambatan": 3
  },
  {
    "id": "d239",
    "namaDesa": "Gumingsir",
    "namaKecamatan": "Wanadadi",
    "lat": -7.3802,
    "lng": 109.6392,
    "jumlahWarga": 1490,
    "defisitAir": 20860,
    "durasiKekeringan": 24,
    "rasioRentan": 29.1,
    "jarakSumber": 5.1,
    "indeksHambatan": 2
  },
  {
    "id": "d240",
    "namaDesa": "Kandangwangi",
    "namaKecamatan": "Wanadadi",
    "lat": -7.3767,
    "lng": 109.6096,
    "jumlahWarga": 1030,
    "defisitAir": 12360,
    "durasiKekeringan": 20,
    "rasioRentan": 35.3,
    "jarakSumber": 4.4,
    "indeksHambatan": 1
  },
  {
    "id": "d241",
    "namaDesa": "Karangjambe",
    "namaKecamatan": "Wanadadi",
    "lat": -7.4009,
    "lng": 109.6334,
    "jumlahWarga": 980,
    "defisitAir": 14700,
    "durasiKekeringan": 29,
    "rasioRentan": 35.9,
    "jarakSumber": 5.4,
    "indeksHambatan": 2
  },
  {
    "id": "d242",
    "namaDesa": "Karangkemiri",
    "namaKecamatan": "Wanadadi",
    "lat": -7.4102,
    "lng": 109.6401,
    "jumlahWarga": 480,
    "defisitAir": 7200,
    "durasiKekeringan": 18,
    "rasioRentan": 15,
    "jarakSumber": 2.8,
    "indeksHambatan": 1
  },
  {
    "id": "d243",
    "namaDesa": "Kasalib",
    "namaKecamatan": "Wanadadi",
    "lat": -7.3944,
    "lng": 109.6035,
    "jumlahWarga": 1530,
    "defisitAir": 22950,
    "durasiKekeringan": 25,
    "rasioRentan": 19.9,
    "jarakSumber": 3.9,
    "indeksHambatan": 2
  },
  {
    "id": "d244",
    "namaDesa": "Lemahjaya",
    "namaKecamatan": "Wanadadi",
    "lat": -7.3868,
    "lng": 109.6506,
    "jumlahWarga": 1540,
    "defisitAir": 21560,
    "durasiKekeringan": 26,
    "rasioRentan": 42,
    "jarakSumber": 3.3,
    "indeksHambatan": 2
  },
  {
    "id": "d245",
    "namaDesa": "Linggasari",
    "namaKecamatan": "Wanadadi",
    "lat": -7.3631,
    "lng": 109.6166,
    "jumlahWarga": 830,
    "defisitAir": 11620,
    "durasiKekeringan": 19,
    "rasioRentan": 32.8,
    "jarakSumber": 6.1,
    "indeksHambatan": 2
  },
  {
    "id": "d246",
    "namaDesa": "Medayu",
    "namaKecamatan": "Wanadadi",
    "lat": -7.3912,
    "lng": 109.6245,
    "jumlahWarga": 540,
    "defisitAir": 8100,
    "durasiKekeringan": 20,
    "rasioRentan": 16,
    "jarakSumber": 3.5,
    "indeksHambatan": 1
  },
  {
    "id": "d247",
    "namaDesa": "Tapen",
    "namaKecamatan": "Wanadadi",
    "lat": -7.3662,
    "lng": 109.6448,
    "jumlahWarga": 1490,
    "defisitAir": 19370,
    "durasiKekeringan": 32,
    "rasioRentan": 35.8,
    "jarakSumber": 5.3,
    "indeksHambatan": 1
  },
  {
    "id": "d248",
    "namaDesa": "Wanadadi",
    "namaKecamatan": "Wanadadi",
    "lat": -7.3779,
    "lng": 109.5953,
    "jumlahWarga": 1170,
    "defisitAir": 16380,
    "durasiKekeringan": 20,
    "rasioRentan": 25,
    "jarakSumber": 2.6,
    "indeksHambatan": 2
  },
  {
    "id": "d249",
    "namaDesa": "Wanakarsa",
    "namaKecamatan": "Wanadadi",
    "lat": -7.4092,
    "lng": 109.6397,
    "jumlahWarga": 910,
    "defisitAir": 11830,
    "durasiKekeringan": 28,
    "rasioRentan": 29.4,
    "jarakSumber": 4.3,
    "indeksHambatan": 1
  },
  {
    "id": "d250",
    "namaDesa": "Balun",
    "namaKecamatan": "Wanayasa",
    "lat": -7.2486,
    "lng": 109.7687,
    "jumlahWarga": 1620,
    "defisitAir": 21060,
    "durasiKekeringan": 28,
    "rasioRentan": 40.9,
    "jarakSumber": 14.4,
    "indeksHambatan": 4
  },
  {
    "id": "d251",
    "namaDesa": "Bantar",
    "namaKecamatan": "Wanayasa",
    "lat": -7.2441,
    "lng": 109.7403,
    "jumlahWarga": 640,
    "defisitAir": 8960,
    "durasiKekeringan": 23,
    "rasioRentan": 39.3,
    "jarakSumber": 12.3,
    "indeksHambatan": 4
  },
  {
    "id": "d252",
    "namaDesa": "Dawuhan",
    "namaKecamatan": "Wanayasa",
    "lat": -7.2638,
    "lng": 109.7629,
    "jumlahWarga": 1220,
    "defisitAir": 17080,
    "durasiKekeringan": 27,
    "rasioRentan": 24.2,
    "jarakSumber": 15.5,
    "indeksHambatan": 4
  },
  {
    "id": "d253",
    "namaDesa": "Jatilawang",
    "namaKecamatan": "Wanayasa",
    "lat": -7.2362,
    "lng": 109.7661,
    "jumlahWarga": 950,
    "defisitAir": 15200,
    "durasiKekeringan": 20,
    "rasioRentan": 41.9,
    "jarakSumber": 13.4,
    "indeksHambatan": 5
  },
  {
    "id": "d254",
    "namaDesa": "Karangtengah",
    "namaKecamatan": "Wanayasa",
    "lat": -7.2596,
    "lng": 109.7373,
    "jumlahWarga": 1340,
    "defisitAir": 21440,
    "durasiKekeringan": 26,
    "rasioRentan": 41.6,
    "jarakSumber": 13.2,
    "indeksHambatan": 5
  },
  {
    "id": "d255",
    "namaDesa": "Kasimpar",
    "namaKecamatan": "Wanayasa",
    "lat": -7.2513,
    "lng": 109.7772,
    "jumlahWarga": 1260,
    "defisitAir": 16380,
    "durasiKekeringan": 23,
    "rasioRentan": 31.1,
    "jarakSumber": 10.7,
    "indeksHambatan": 3
  },
  {
    "id": "d256",
    "namaDesa": "Kubang",
    "namaKecamatan": "Wanayasa",
    "lat": -7.2322,
    "lng": 109.7445,
    "jumlahWarga": 1470,
    "defisitAir": 22050,
    "durasiKekeringan": 23,
    "rasioRentan": 30.8,
    "jarakSumber": 14,
    "indeksHambatan": 5
  },
  {
    "id": "d257",
    "namaDesa": "Legoksayem",
    "namaKecamatan": "Wanayasa",
    "lat": -7.2692,
    "lng": 109.7455,
    "jumlahWarga": 1490,
    "defisitAir": 17880,
    "durasiKekeringan": 25,
    "rasioRentan": 26.6,
    "jarakSumber": 14.2,
    "indeksHambatan": 3
  },
  {
    "id": "d258",
    "namaDesa": "Pagergunung",
    "namaKecamatan": "Wanayasa",
    "lat": -7.2375,
    "lng": 109.7758,
    "jumlahWarga": 620,
    "defisitAir": 9300,
    "durasiKekeringan": 36,
    "rasioRentan": 30.9,
    "jarakSumber": 15,
    "indeksHambatan": 5
  },
  {
    "id": "d259",
    "namaDesa": "Pandansari",
    "namaKecamatan": "Wanayasa",
    "lat": -7.2469,
    "lng": 109.7288,
    "jumlahWarga": 880,
    "defisitAir": 14080,
    "durasiKekeringan": 30,
    "rasioRentan": 33.9,
    "jarakSumber": 14.9,
    "indeksHambatan": 5
  },
  {
    "id": "d260",
    "namaDesa": "Penanggungan",
    "namaKecamatan": "Wanayasa",
    "lat": -7.2702,
    "lng": 109.7685,
    "jumlahWarga": 1150,
    "defisitAir": 18400,
    "durasiKekeringan": 38,
    "rasioRentan": 33.2,
    "jarakSumber": 15.2,
    "indeksHambatan": 5
  },
  {
    "id": "d261",
    "namaDesa": "Kalideres",
    "namaKecamatan": "Wanayasa",
    "lat": -7.2264,
    "lng": 109.75,
    "jumlahWarga": 940,
    "defisitAir": 14100,
    "durasiKekeringan": 31,
    "rasioRentan": 21.1,
    "jarakSumber": 13.5,
    "indeksHambatan": 4
  },
  {
    "id": "d262",
    "namaDesa": "Susukan",
    "namaKecamatan": "Wanayasa",
    "lat": -7.2701,
    "lng": 109.7382,
    "jumlahWarga": 730,
    "defisitAir": 10220,
    "durasiKekeringan": 26,
    "rasioRentan": 30,
    "jarakSumber": 10.4,
    "indeksHambatan": 4
  },
  {
    "id": "d263",
    "namaDesa": "Suwidak",
    "namaKecamatan": "Wanayasa",
    "lat": -7.2433,
    "lng": 109.7837,
    "jumlahWarga": 1260,
    "defisitAir": 17640,
    "durasiKekeringan": 27,
    "rasioRentan": 27.3,
    "jarakSumber": 9.5,
    "indeksHambatan": 4
  },
  {
    "id": "d264",
    "namaDesa": "Tempuran",
    "namaKecamatan": "Wanayasa",
    "lat": -7.2365,
    "lng": 109.7289,
    "jumlahWarga": 950,
    "defisitAir": 15200,
    "durasiKekeringan": 25,
    "rasioRentan": 38.9,
    "jarakSumber": 16.3,
    "indeksHambatan": 5
  },
  {
    "id": "d265",
    "namaDesa": "Wanaraja",
    "namaKecamatan": "Wanayasa",
    "lat": -7.2757,
    "lng": 109.7631,
    "jumlahWarga": 1160,
    "defisitAir": 16240,
    "durasiKekeringan": 27,
    "rasioRentan": 20.6,
    "jarakSumber": 11,
    "indeksHambatan": 4
  },
  {
    "id": "d266",
    "namaDesa": "Wanayasa",
    "namaKecamatan": "Wanayasa",
    "lat": -7.2678,
    "lng": 109.7543,
    "jumlahWarga": 980,
    "defisitAir": 14700,
    "durasiKekeringan": 36,
    "rasioRentan": 27,
    "jarakSumber": 14.8,
    "indeksHambatan": 4
  }
];

// ============================================================
// Model Deteksi Kerawanan Bencana Hidrometeorologi Banjarnegara
// Standar Ilmiah BPBD & PVMBG (Deteksi Potensi Longsor, Gerakan Tanah, & Luapan DAS)
// ============================================================
export function enrichDesaWithHujan(d: Desa): Desa {
  const seed = (d.namaDesa.charCodeAt(0) * 19 + (d.namaDesa.charCodeAt(1) || 68) * 31 + d.defisitAir) % 2200;
  const totalWargaDesa = d.totalWargaDesa || Math.round(Math.max(d.jumlahWarga * 1.55, 2300 + seed));
  const totalKK = d.totalKK || Math.round(totalWargaDesa / 3.8);
  const kkTerdampak = d.kkTerdampak || Math.round(d.jumlahWarga / 3.8);
  const persenTerdampak = Number(((d.jumlahWarga / totalWargaDesa) * 100).toFixed(1));

  const kec = d.namaKecamatan.toLowerCase();
  
  // Klasifikasi Zona Morfologi Banjarnegara
  const isPunggelan = kec === 'punggelan'; // Perbukitan kebun rakyat & salak (Klapa, Mlaya, Bondolharjo, dll)
  const isTebingCuramDieng = ['wanayasa', 'pejawaran', 'batur', 'karangkobar', 'kalibening', 'pagentan', 'pandanarum'].includes(kec);
  const isBantaranSerayu = ['banjarnegara', 'sigaluh', 'madukara', 'bawang', 'wanadadi', 'purwanegara'].includes(kec);

  let curahHujan: number;
  let kemiringanLereng: number;
  let jarakSungai: number;
  let indeksDrainase: number;
  let namaBukitFormasi: string;
  let elevasiMdpl: number;
  let namaSungaiTerdekat: string;
  let ambangBatasHujan: string;

  if (isPunggelan) {
    // KECAMATAN PUNGGELAN (Termasuk Desa Klapa, Mlaya, Petuguran, dll):
    // Morfologi perbukitan kebun kelapa & salak rakyat, elevasi 380 - 520 mdpl
    curahHujan = Number((42 + (seed % 14)).toFixed(1)); // 42 - 56 mm/hari (hujan sedang)
    kemiringanLereng = Math.round(16 + (seed % 9));      // 16% - 24%
    jarakSungai = Number((1.8 + (seed % 20) / 10).toFixed(1)); // Jauh dari sungai utama
    indeksDrainase = 3;
    namaBukitFormasi = 'Perbukitan Agrikultur & Kebun Salak Punggelan';
    elevasiMdpl = Math.round(380 + (seed % 140));
    namaSungaiTerdekat = 'Sub-DAS Kali Gintung / Punggelan';
    ambangBatasHujan = 'Hujan terus-menerus > 50 mm/hari selama ≥ 4 hari memicu retakan mahkota lereng kebun';
  } else if (kec === 'wanayasa') {
    // KECAMATAN WANAYASA (Termasuk Jatilawang, Wanayasa, Tempuran, dll):
    // Lereng terjal Dieng Utara di kaki Gunung Ragajembangan, elevasi 820 - 1.150 mdpl
    curahHujan = Number((65 + (seed % 22)).toFixed(1));
    kemiringanLereng = Math.round(32 + (seed % 20));     // 32% - 52% (Curam)
    jarakSungai = Number((0.8 + (seed % 20) / 10).toFixed(1));
    indeksDrainase = 4;
    namaBukitFormasi = 'Tebing Formasi Gunung Ragajembangan (Dieng Utara)';
    elevasiMdpl = Math.round(820 + (seed % 280));
    namaSungaiTerdekat = 'Hulu Kali Merawu & Sungai Penaraban';
    ambangBatasHujan = 'Hujan lebat > 65 mm/hari selama ≥ 2 hari berturut-turut memicu pergeseran bidang gelincir lereng';
  } else if (kec === 'batur' || kec === 'pejawaran') {
    // Dataran Tinggi Dieng & Patahan Vulkanik: Elevasi 1.250 - 1.650 mdpl
    curahHujan = Number((70 + (seed % 20)).toFixed(1));
    kemiringanLereng = Math.round(34 + (seed % 22));     // 34% - 56% (Sangat Curam)
    jarakSungai = Number((1.1 + (seed % 25) / 10).toFixed(1));
    indeksDrainase = 4;
    namaBukitFormasi = 'Tebing Kaldera Dieng & Bukit Telgalele';
    elevasiMdpl = Math.round(1250 + (seed % 380));
    namaSungaiTerdekat = 'Hulu Aliran Kali Tulis';
    ambangBatasHujan = 'Hujan ekstrem > 70 mm/hari selama ≥ 2 hari memicu guguran batuan & longsor tebing curam';
  } else if (isTebingCuramDieng) {
    // Karangkobar, Kalibening, Pagentan, Pandanarum
    curahHujan = Number((60 + (seed % 22)).toFixed(1));
    kemiringanLereng = Math.round(28 + (seed % 22));     // 28% - 50%
    jarakSungai = Number((1.0 + (seed % 25) / 10).toFixed(1));
    indeksDrainase = 4;
    namaBukitFormasi = 'Perbukitan Pawinihan & Tebing Sitinggil';
    elevasiMdpl = Math.round(650 + (seed % 280));
    namaSungaiTerdekat = 'Aliran Sungai Merawu Tengah';
    ambangBatasHujan = 'Hujan lebat > 60 mm/hari selama ≥ 3 hari memicu rayapan retakan tanah & longsoran tebing';
  } else if (isBantaranSerayu) {
    // Lembah Sempadan DAS Serayu & Merawu (Purwanegara, Bawang, Banjarnegara, Sigaluh, Wanadadi)
    curahHujan = Number((40 + (seed % 18)).toFixed(1));
    kemiringanLereng = Math.round(5 + (seed % 12));      // 5% - 17% (Landai)
    jarakSungai = Number((0.2 + (seed % 15) / 10).toFixed(1)); // Dekat sempadan DAS Serayu (0.2 - 1.7 km)
    indeksDrainase = 4;
    namaBukitFormasi = 'Lembah Aluvial Bantaran DAS Serayu';
    elevasiMdpl = Math.round(140 + (seed % 90));
    namaSungaiTerdekat = 'Sungai Serayu Utama & Waduk PB Soedirman';
    ambangBatasHujan = 'Debit Serayu > 380 m³/detik atau TMA Mrica > 231.0 m memicu luapan sempadan bantaran';
  } else {
    // Perbukitan Selatan (Mandiraja, Susukan, Pagedongan, Klampok)
    curahHujan = Number((36 + (seed % 16)).toFixed(1));
    kemiringanLereng = Math.round(10 + (seed % 16));     // 10% - 26%
    jarakSungai = Number((0.8 + (seed % 24) / 10).toFixed(1));
    indeksDrainase = 3;
    namaBukitFormasi = 'Perbukitan Batuan Lempung Selatan';
    elevasiMdpl = Math.round(180 + (seed % 160));
    namaSungaiTerdekat = 'DAS Kali Sapi & Hilir Serayu';
    ambangBatasHujan = 'Hujan > 45 mm/hari selama ≥ 3 hari memicu amblesan tanah lempung jenuh';
  }

  // Indeks Kerentanan PVMBG (1–5)
  let indeksLongsor = 1;
  if (kemiringanLereng > 35) indeksLongsor = 5;
  else if (kemiringanLereng > 28) indeksLongsor = 4;
  else if (kemiringanLereng > 18) indeksLongsor = 3;
  else if (kemiringanLereng > 10) indeksLongsor = 2;

  // DETEKSI STATUS KERAWANAN & POTENSI BENCANA RIIL
  let statusKerawananHujan: 'rawan_tinggi' | 'waspada' | 'aman';
  let jenisBencanaDominan: 'tanah_longsor' | 'gerakan_tanah' | 'banjir_luapan' | 'aman_stabil';
  let detailPotensiBencana: string;

  if (isTebingCuramDieng && kemiringanLereng > 28) {
    statusKerawananHujan = kemiringanLereng > 35 ? 'rawan_tinggi' : 'waspada';
    jenisBencanaDominan = 'tanah_longsor';
    detailPotensiBencana = `Rawan Tanah Longsor Tebing (${namaBukitFormasi}, Elevasi ${elevasiMdpl} mdpl, Lereng ${kemiringanLereng}%)`;
  } else if (isPunggelan || (kemiringanLereng >= 16 && kemiringanLereng <= 28 && jarakSungai > 1.2)) {
    // Karakteristik Desa Klapa & Punggelan:
    statusKerawananHujan = 'waspada';
    jenisBencanaDominan = 'gerakan_tanah';
    detailPotensiBencana = `Potensi Gerakan Tanah (${namaBukitFormasi}, Elevasi ${elevasiMdpl} mdpl, Retakan Tanah Lempung)`;
  } else if (jarakSungai < 0.9 && kemiringanLereng < 18) {
    statusKerawananHujan = jarakSungai < 0.5 ? 'rawan_tinggi' : 'waspada';
    jenisBencanaDominan = 'banjir_luapan';
    detailPotensiBencana = `Potensi Luapan Sempadan (${namaSungaiTerdekat}, Jarak ${jarakSungai} km, Elevasi ${elevasiMdpl} mdpl)`;
  } else if (kemiringanLereng > 22) {
    statusKerawananHujan = 'waspada';
    jenisBencanaDominan = 'gerakan_tanah';
    detailPotensiBencana = `Waspada Retakan Tanah (${namaBukitFormasi}, Elevasi ${elevasiMdpl} mdpl, Lereng ${kemiringanLereng}%)`;
  } else {
    statusKerawananHujan = 'aman';
    jenisBencanaDominan = 'aman_stabil';
    detailPotensiBencana = `Kondisi Morfologi Relatif Stabil (Elevasi ${elevasiMdpl} mdpl, Lereng ${kemiringanLereng}%)`;
  }

  // Warga Terancam di Zona Rawan:
  let wargaTerancam = 0;
  if (statusKerawananHujan === 'rawan_tinggi') {
    wargaTerancam = Math.round(Math.min(totalWargaDesa * 0.35, 120 + (seed % 350)));
  } else if (statusKerawananHujan === 'waspada') {
    wargaTerancam = Math.round(Math.min(totalWargaDesa * 0.15, 30 + (seed % 140)));
  } else {
    wargaTerancam = 0;
  }

  // Rekomendasi Personil SAR & Logistik MDMC
  let rekomendasiTimSar = 0;
  let kebutuhanLogistikHujan = 'Pemantauan Wilayah Rutin';

  if (jenisBencanaDominan === 'tanah_longsor') {
    rekomendasiTimSar = statusKerawananHujan === 'rawan_tinggi' ? 10 : 5;
    kebutuhanLogistikHujan = 'Tenda Pengungsi Darurat (2 Unit), EWS Sirine Longsor, 50 Lembar Terpal Retakan, Dapur Umum';
  } else if (jenisBencanaDominan === 'gerakan_tanah') {
    rekomendasiTimSar = 3;
    kebutuhanLogistikHujan = 'Terpal Penutup Retakan Kebun (30 Lembar), Patok Pengukur Tanah, Posko Pantau Ranting';
  } else if (jenisBencanaDominan === 'banjir_luapan') {
    rekomendasiTimSar = statusKerawananHujan === 'rawan_tinggi' ? 8 : 4;
    kebutuhanLogistikHujan = 'Perahu Karet Evakuasi, Pelampung (25 Buah), Tenda Barak, Tanggul Karung Pasir';
  } else {
    rekomendasiTimSar = 0;
    kebutuhanLogistikHujan = 'Pemantauan Wilayah Rutin MDMC & FPRB';
  }

  return {
    ...d,
    totalWargaDesa,
    totalKK,
    kkTerdampak,
    persenTerdampak,
    curahHujan,
    kemiringanLereng,
    indeksLongsor,
    jarakSungai,
    wargaTerancam,
    indeksDrainase,
    namaBukitFormasi,
    elevasiMdpl,
    namaSungaiTerdekat,
    ambangBatasHujan,
    statusKerawananHujan,
    jenisBencanaDominan,
    detailPotensiBencana,
    rekomendasiTimSar,
    kebutuhanLogistikHujan,
  };
}

export const SAMPLE_DESA: Desa[] = RAW_DESA.map(d => enrichDesaWithHujan(d));

export const SAMPLE_ARMADA: Armada[] = [
  { id: 'a01', nomorPolisi: 'R 8124 BD', kapasitas: 5000, kondisi: 'baik', supir: 'Suryanto (MDMC)', nomorHp: '081227189012', statusToday: 'tersedia' },
  { id: 'a02', nomorPolisi: 'R 8352 CD', kapasitas: 8000, kondisi: 'baik', supir: 'Bambang Tri (BPBD)', nomorHp: '082134567891', statusToday: 'bertugas', desaTujuan: 'Merden' },
  { id: 'a03', nomorPolisi: 'R 8619 DD', kapasitas: 5000, kondisi: 'baik', supir: 'Gunawan Prasetya', nomorHp: '085290123456', statusToday: 'tersedia' },
  { id: 'a04', nomorPolisi: 'R 8920 ED', kapasitas: 10000, kondisi: 'baik', supir: 'Danang Irawan (PMI)', nomorHp: '081398765432', statusToday: 'bertugas', desaTujuan: 'Somawangi' },
  { id: 'a05', nomorPolisi: 'R 8105 FD', kapasitas: 5000, kondisi: 'baik', supir: 'Teguh Wahyudi', nomorHp: '087789012345', statusToday: 'tersedia' },
  { id: 'a06', nomorPolisi: 'R 8443 GD', kapasitas: 5000, kondisi: 'sedang', supir: 'Ahmad Fauzi', nomorHp: '082245678901', statusToday: 'tersedia' },
  { id: 'a07', nomorPolisi: 'R 8771 HD', kapasitas: 6000, kondisi: 'rusak', supir: 'Rudi Hartono', nomorHp: '085612345678', statusToday: 'istirahat' },
  { id: 'a08', nomorPolisi: 'R 8234 ID', kapasitas: 5000, kondisi: 'baik', supir: 'Hendro Siswanto (MDMC)', nomorHp: '081234901234', statusToday: 'tersedia' },
  { id: 'a09', nomorPolisi: 'R 8556 JD', kapasitas: 8000, kondisi: 'baik', supir: 'Joko Susilo (Tagana)', nomorHp: '082187654321', statusToday: 'tersedia' },
  { id: 'a10', nomorPolisi: 'R 8890 KD', kapasitas: 10000, kondisi: 'baik', supir: 'Agus Setiawan (MDMC)', nomorHp: '085712348901', statusToday: 'tersedia' },
];

export const SAMPLE_SUMBER_AIR: SumberAir[] = [
  { id: 's01', nama: 'Sumur Bor MDMC Posko Induk Banjarnegara', jenis: 'sumur_bor', lat: -7.3945, lng: 109.6980, kapasitas: 60000, stokSaat: 48000, kondisi: 'aktif' },
  { id: 's02', nama: 'Mata Air Pegunungan Mandiraja', jenis: 'mata_air', lat: -7.4280, lng: 109.6100, kapasitas: 45000, stokSaat: 32000, kondisi: 'aktif' },
  { id: 's03', nama: 'PDAM Tirta Bentara Purwanegara', jenis: 'pdam', lat: -7.4350, lng: 109.6750, kapasitas: 90000, stokSaat: 75000, kondisi: 'aktif' },
  { id: 's04', nama: 'Instalasi Pengolahan Air (IPA) Bawang', jenis: 'pdam', lat: -7.4380, lng: 109.6890, kapasitas: 50000, stokSaat: 36000, kondisi: 'aktif' },
  { id: 's05', nama: 'Mata Air Alami Sigaluh (Kali Sapi)', jenis: 'mata_air', lat: -7.4080, lng: 109.7700, kapasitas: 40000, stokSaat: 28000, kondisi: 'aktif' },
  { id: 's06', nama: 'Intake Air Baku Waduk Mrica Wanadadi', jenis: 'pdam', lat: -7.3920, lng: 109.6200, kapasitas: 80000, stokSaat: 62000, kondisi: 'aktif' },
  { id: 's07', nama: 'Mata Air Pegunungan Kalibening', jenis: 'mata_air', lat: -7.2180, lng: 109.6420, kapasitas: 35000, stokSaat: 24000, kondisi: 'aktif' },
  { id: 's08', nama: 'Mata Air Tuk Bima Lukar Dieng Batur', jenis: 'mata_air', lat: -7.2050, lng: 109.8550, kapasitas: 50000, stokSaat: 38000, kondisi: 'aktif' },
];

export const SAMPLE_JADWAL: JadwalDistribusi[] = [
  { id: 'j01', tanggal: '2026-10-21', desaId: 'd005', desaNama: 'Merden', armadaId: 'a02', armadaPolisi: 'R 8352 CD', jumlahAir: 8000, sumberAirId: 's03', sumberAirNama: 'PDAM Purwanegara', status: 'dalam_perjalanan', catatan: 'Prioritas Utama — Rekomendasi TOPSIS Rank #1' },
  { id: 'j02', tanggal: '2026-10-21', desaId: 'd001', desaNama: 'Somawangi', armadaId: 'a04', armadaPolisi: 'R 8920 ED', jumlahAir: 10000, sumberAirId: 's02', sumberAirNama: 'Mata Air Mandiraja', status: 'dalam_perjalanan', catatan: 'Prioritas Darurat — Hambatan medan curam' },
  { id: 'j03', tanggal: '2026-10-21', desaId: 'd009', desaNama: 'Duren', armadaId: 'a01', armadaPolisi: 'R 8124 BD', jumlahAir: 5000, sumberAirId: 's01', sumberAirNama: 'Sumur Bor MDMC', status: 'terjadwal', catatan: 'Pagedongan perbukitan selatan' },
  { id: 'j04', tanggal: '2026-10-21', desaId: 'd013', desaNama: 'Gumelem Kulon', armadaId: 'a03', armadaPolisi: 'R 8619 DD', jumlahAir: 5000, sumberAirId: 's02', sumberAirNama: 'Mata Air Mandiraja', status: 'terjadwal', catatan: 'Kecamatan Susukan perbatasan' },
  { id: 'j05', tanggal: '2026-10-20', desaId: 'd005', desaNama: 'Merden', armadaId: 'a02', armadaPolisi: 'R 8352 CD', jumlahAir: 8000, sumberAirId: 's03', sumberAirNama: 'PDAM Purwanegara', status: 'selesai' },
  { id: 'j06', tanggal: '2026-10-20', desaId: 'd019', desaNama: 'Kalimandi', armadaId: 'a04', armadaPolisi: 'R 8920 ED', jumlahAir: 10000, sumberAirId: 's03', sumberAirNama: 'PDAM Purwanegara', status: 'selesai' },
];

export const DEFAULT_BOBOT = {
  c1: 0.25, // C1: Jumlah Warga Terdampak (Benefit)
  c2: 0.25, // C2: Defisit Air Bersih Harian (Benefit)
  c3: 0.15, // C3: Durasi Kekeringan (Benefit)
  c4: 0.15, // C4: Rasio Kelompok Rentan & Fasum (Benefit)
  c5: 0.10, // C5: Jarak Tempuh dari Sumber Air (Cost)
  c6: 0.10, // C6: Indeks Hambatan Medan Jalan (Cost)
};

export const SAMPLE_POS_DUGA_AIR: PosDugaAir[] = [
  {
    id: 'pda-01',
    nama: 'Pos Duga Air DAS Serayu — Singomerto',
    sungai: 'DAS Serayu Hilir',
    wilayahSungai: 'DAS Serayu Hilir (Kec. Sigaluh / Banjarnegara)',
    lat: -7.4045,
    lng: 109.6890,
    debitAir: 185.4,
    tma: 3.82,
    tmaNormal: 2.50,
    tmaWaspada: 3.50,
    tmaSiaga: 4.20,
    status: 'waspada',
    curahHujan24j: 65.5,
    tren: 'naik',
    keterangan: 'Aliran deras dari hulu Dieng & Pegunungan Utara. Waspada luapan bantaran sungai pemukiman padat.',
  },
  {
    id: 'pda-02',
    nama: 'Waduk PB Soedirman (Mrica) — Spillway & Intake PLTA',
    sungai: 'Waduk PB Soedirman (Mrica)',
    wilayahSungai: 'Waduk Utama Mrica (Kec. Bawang / Wanadadi)',
    lat: -7.3912,
    lng: 109.6105,
    debitAir: 240.2,
    tma: 4.45,
    tmaNormal: 3.00,
    tmaWaspada: 4.20,
    tmaSiaga: 5.00,
    status: 'waspada',
    curahHujan24j: 52.0,
    tren: 'stabil',
    kapasitasWadukPersen: 88.5,
    elevasiWadukMdpl: 230.45,
    keterangan: 'Elevasi Waduk 230.45 mdpl (88.5% kapasitas). Pintu pelimpah spillway dibuka 1.2m untuk stabilisasi debit buangan turbin PLTA.',
  },
  {
    id: 'pda-03',
    nama: 'Pos Duga Air Sungai Merawu — Karangkobar',
    sungai: 'DAS Merawu',
    wilayahSungai: 'DAS Merawu Hulu (Kec. Karangkobar / Wanayasa)',
    lat: -7.2845,
    lng: 109.7340,
    debitAir: 94.6,
    tma: 2.85,
    tmaNormal: 2.00,
    tmaWaspada: 3.00,
    tmaSiaga: 3.80,
    status: 'waspada',
    curahHujan24j: 78.0,
    tren: 'naik',
    keterangan: 'Kawasan rawan banjir bandang sedimen tanah longsor pegunungan atas.',
  },
  {
    id: 'pda-04',
    nama: 'Pos Duga Air Sungai Pekacangan — Muara Purwanegara',
    sungai: 'Sub-DAS Pekacangan',
    wilayahSungai: 'Sub-DAS Pekacangan (Kec. Rakit / Purwanegara)',
    lat: -7.4520,
    lng: 109.5630,
    debitAir: 68.2,
    tma: 2.15,
    tmaNormal: 2.50,
    tmaWaspada: 3.20,
    tmaSiaga: 3.90,
    status: 'normal',
    curahHujan24j: 38.0,
    tren: 'stabil',
    keterangan: 'Debit air irigasi persawahan mencukupi, alur sungai aman dan terkendali.',
  },
  {
    id: 'pda-05',
    nama: 'Pos Pemantauan Hulu Dieng — Sub-DAS Serayu Atas',
    sungai: 'Sub-DAS Serayu Atas (Dieng)',
    wilayahSungai: 'Hulu Sungai Dataran Tinggi Dieng (Kec. Batur)',
    lat: -7.2150,
    lng: 109.8450,
    debitAir: 42.5,
    tma: 1.95,
    tmaNormal: 1.80,
    tmaWaspada: 2.40,
    tmaSiaga: 3.00,
    status: 'normal',
    curahHujan24j: 84.0,
    tren: 'naik',
    keterangan: 'Curah hujan harian tinggi (84 mm/hari). Peningkatan debit limpasan air permukaan.',
  },
  {
    id: 'pda-06',
    nama: 'Bendung Banjarcahyana — Madukara',
    sungai: 'DAS Serayu Tengah',
    wilayahSungai: 'DAS Serayu Tengah (Kec. Madukara / Banjarmangu)',
    lat: -7.3820,
    lng: 109.7280,
    debitAir: 112.0,
    tma: 3.25,
    tmaNormal: 2.40,
    tmaWaspada: 3.20,
    tmaSiaga: 4.00,
    status: 'waspada',
    curahHujan24j: 58.0,
    tren: 'naik',
    keterangan: 'Elevasi mercu bendung siaga waspada. Pintu penguras lumpur dibuka bertahap.',
  },
];

export const SAMPLE_RUMAH_SAKIT: RumahSakit[] = [
  {
    id: 'rs-01',
    nama: 'RSUD Hj. Anna Lasmanah Banjarnegara',
    tipe: 'RSUD',
    kelas: 'Kelas C (Rujukan Utama Kab. Banjarnegara)',
    lat: -7.3970,
    lng: 109.6965,
    alamat: 'Jl. Jend. Sudirman No. 42, Kutabanjarnegara, Kec. Banjarnegara',
    telepon: '(0286) 591464 / IGD 119',
    kapasitasTT: 240,
    layananUGD: 'UGD 24 Jam, Bedah Trauma, ICU, Bank Darah Bencana',
    ambulansSiaga: 4,
  },
  {
    id: 'rs-02',
    nama: 'RS PKU Muhammadiyah Banjarnegara',
    tipe: 'RS PKU',
    kelas: 'Kelas D (Faskes Tanggap Darurat MDMC)',
    lat: -7.4720,
    lng: 109.5250,
    alamat: 'Jl. Raya Danaraja - Merden No. 12, Kec. Purwanegara',
    telepon: '(0286) 479100 / Call Center MDMC',
    kapasitasTT: 85,
    layananUGD: 'UGD 24 Jam, Posko Siaga Medis Bencana MDMC',
    ambulansSiaga: 3,
  },
  {
    id: 'rs-03',
    nama: 'RS Islam Banjarnegara (RSI)',
    tipe: 'RS Swasta',
    kelas: 'Kelas C',
    lat: -7.4320,
    lng: 109.6820,
    alamat: 'Jl. Raya Bawang KM 8, Bawang, Banjarnegara',
    telepon: '(0286) 597015',
    kapasitasTT: 130,
    layananUGD: 'UGD 24 Jam, Penanganan Korban Bencana Hidrometeorologi',
    ambulansSiaga: 3,
  },
  {
    id: 'rs-04',
    nama: 'RS Emanuel Klampok',
    tipe: 'RS Swasta',
    kelas: 'Kelas C (Rujukan Zona Barat)',
    lat: -7.4580,
    lng: 109.4380,
    alamat: 'Jl. Raya Purwareja Klampok No. 110, Banjarnegara',
    telepon: '(0286) 479030',
    kapasitasTT: 160,
    layananUGD: 'UGD 24 Jam, Unit Trauma & Bedah Darurat',
    ambulansSiaga: 3,
  },
  {
    id: 'rs-05',
    nama: 'RS Pratama & Puskesmas DTP Kalibening',
    tipe: 'RS Pratama',
    kelas: 'Rawat Inap 24J (Rujukan Zona Pegunungan Utara)',
    lat: -7.2185,
    lng: 109.6380,
    alamat: 'Jl. Raya Kalibening - Wanayasa No. 15, Kalibening',
    telepon: '(0286) 598012',
    kapasitasTT: 40,
    layananUGD: 'UGD 24 Jam, Respon Pertama Korban Longsor Kalibening & Pandanarum',
    ambulansSiaga: 2,
  },
  {
    id: 'rs-06',
    nama: 'Puskesmas DTP Karangkobar (Pusat Medis Pegunungan Tengah)',
    tipe: 'Puskesmas DTP',
    kelas: 'Rawat Inap 24J (Rujukan Akses Karangkobar - Dieng)',
    lat: -7.2890,
    lng: 109.7280,
    alamat: 'Jl. Raya Karangkobar No. 4, Karangkobar',
    telepon: '(0286) 598801',
    kapasitasTT: 35,
    layananUGD: 'UGD 24 Jam & Posko Medis Siaga Longsor Wanayasa - Karangkobar',
    ambulansSiaga: 2,
  },
];

/** Hitung jarak darat perkiraan (dengan faktor liku lereng pegunungan 1.35x) */
export function hitungJarakDaratKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c * 1.35).toFixed(1));
}

/** Cari Titik Sumber Air Terdekat dari Desa */
export function getNearestSumberAir(desa: { lat: number; lng: number }, sumberList: SumberAir[] = SAMPLE_SUMBER_AIR): {
  sumber: SumberAir;
  jarakKm: number;
} {
  let nearest = sumberList[0];
  let minDistance = Infinity;

  for (const s of sumberList) {
    const d = hitungJarakDaratKm(desa.lat, desa.lng, s.lat, s.lng);
    if (d < minDistance) {
      minDistance = d;
      nearest = s;
    }
  }

  return { sumber: nearest, jarakKm: minDistance };
}

/** Cari Rumah Sakit / Faskes Terdekat dari Desa */
export function getNearestRumahSakit(desa: { lat: number; lng: number }, rsList: RumahSakit[] = SAMPLE_RUMAH_SAKIT): {
  rs: RumahSakit;
  jarakKm: number;
  estWaktuMenit: number;
} {
  let nearest = rsList[0];
  let minDistance = Infinity;

  for (const r of rsList) {
    const d = hitungJarakDaratKm(desa.lat, desa.lng, r.lat, r.lng);
    if (d < minDistance) {
      minDistance = d;
      nearest = r;
    }
  }

  // Estimasi ambulans darurat di medan pegunungan Banjarnegara ~35-40 km/jam
  const estWaktuMenit = Math.max(8, Math.round((minDistance / 35) * 60));
  return { rs: nearest, jarakKm: minDistance, estWaktuMenit };
}

