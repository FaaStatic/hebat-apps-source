import {
  IcMainMenuLacakLayanan,
  IcMainMenuStatusBayar,
  IcMainMenuRegistrasi,
  IcStsOnline,
  IcMainMenuSumpah,
  IcMainMenuSPTPD,
  IcMainMenuPembayaran,
  IcMainMenuPersyaratan,
  SupportWA,
  SupportIG,
  SupportFB,
  SupportWeb,
  IcStatusSKDP,
  IcStatusPBB,
  IcBankPartner,
  IcAgenPartner,
  IcPosPelayanan,
  IcAntrianOnline,
  CharacterSatu,
  CharacterDua,
  IcRegisPribadi,
  BgRegisPribadi,
  IcRegisBU,
  BgRegisBU,
  IcLacakPelayanan,
  BgLacakPelayanan,
  IcESPPTPBB,
  BgESPPTPBB,
} from '../assets';

const menuPakdeSemar = [
  {
    logo: IcMainMenuLacakLayanan,
    name: 'Pelayanan',
    link: '',
  },
  {
    logo: IcMainMenuStatusBayar,
    name: 'Status Bayar',
    link: '',
  },
  {
    logo: IcMainMenuRegistrasi,
    name: 'E-Register',
    link: '',
  },
  {
    logo: IcStsOnline,
    name: 'STS Online',
    link: 'https://eretribusi.semarangkota.go.id',
  },
  {
    logo: IcMainMenuSumpah,
    name: 'E-Sumpah',
    link: 'https://esumpah.semarangkota.go.id/pemakais/sign_in',
  },
  {
    logo: IcMainMenuSPTPD,
    name: 'E-SPTPD',
    link: 'https://esptpd.semarangkota.go.id/',
  },
  {
    logo: IcMainMenuPembayaran,
    name: 'Pembayaran',
    link: '',
  },
  {
    logo: IcMainMenuPersyaratan,
    name: 'Persyaratan',
    link: '',
  },
];

const sosmed = [
  {
    name: 'Whatsapp',
    logo: SupportWA,
    description: '082221221400',
    link_sosmed: '',
  },
  {
    name: 'Intagram',
    logo: SupportIG,
    description: 'BAPENDA.SMG',
    link_sosmed: '',
  },
  {
    name: 'Facebook',
    logo: SupportFB,
    description: 'BAPENDA SEMARANG',
    link_sosmed: '',
  },
  {
    name: 'Website',
    logo: SupportWeb,
    description: 'bapenda.semarangkota.go.id',
    link_sosmed: '',
  },
];

const menuStatusBayar = [
  {
    id: 'StatusPBB',
    name: 'Status PBB',
    logo: IcStatusPBB,
    image: CharacterSatu,
    description:
      'Pajak bumi dan bangunan adalah pajak yang dipungut atas tanah dan bangunan karena adanya keuntungan dan/atau kedudukan sosial ekonomi yang lebih baik bagi orang atau badan yang mempunyai suatu hak atasnya atau memperoleh manfaat dari padanya',
  },
  {
    id: 'StatusSKDP',
    name: 'Status SKPD & SPTPD',
    logo: IcStatusSKDP,
    image: CharacterDua,
    description:
      'Satuan Kerja Perangkat Daerah adalah perangkat Pemerintah Daerah di Indonesia. SKPD adalah pelaksana fungsi eksekutif yang harus berkoordinasi agar penyelenggaraan pemerintahan berjalan dengan baik.',
  },
];

const menuPelayanan = [
  {
    id: 'LacakPelayanan',
    name: 'Lacak Pelayanan',
    logo: IcLacakPelayanan,
    image: BgLacakPelayanan,
    description:
      'Lacak status pelayanan sistem perpakajan usaha hanya dengan memasukan Nomor pelayanan anda untuk mengetahui status terbarunya.',
  },
  {
    id: 'ESPPTPBB',
    name: 'ESPPT PBB',
    logo: IcESPPTPBB,
    image: BgESPPTPBB,
    description:
      'Pajak Bumi dan Bangunan Perdesaan dan Perkotaan (PBB-P2) adalah salah satu jenis Pajak yang diselenggarakan pemungutannya oleh Badan Pendapatan Daerah.',
  },
];

const menuRegistrasi = [
  {
    id: 'Pribadi',
    name: 'Pribadi',
    logo: IcRegisPribadi,
    image: BgRegisPribadi,
    description:
      'Pribadi, atau Perusahaan perseorangan adalah badan usaha perusahaan yang dimiliki oleh satu orang saja.',
  },
  {
    id: 'BU',
    name: 'Badan Usaha',
    logo: IcRegisBU,
    image: BgRegisBU,
    description:
      'Badan Usaha, atau adalah kesatuan hukum, teknis, dan ekonomi yang bertujuan mencari laba atau keuntungan.',
  },
];

const menuPercetakan = [
  {
    id: 'CetakPBB',
    name: 'Cetak SKL PBB',
  },
  {
    id: 'CetakKodeBayar',
    name: 'Cetak Kode Bayar',
  },
];

const menuMetodeBayar = [
  {
    status: 'Pilih metode bayar untuk kamu gunakan!',
    detail: [
      {
        id: 'BankPartner',
        name: 'Bank Partner',
        logo: IcBankPartner,
        list: [],
      },
      {
        id: 'AgenPartner',
        name: 'Agen Partner',
        logo: IcAgenPartner,
        list: [],
      },
      {
        id: 'PosPelayanan',
        name: 'Pos Pelayanan',
        logo: IcPosPelayanan,
        list: [],
      },
    ],
  },
  {
    status: 'Metode Lainnya',
    detail: [
      {
        id: 'AntrianOnline',
        name: 'Antrian Online',
        logo: IcAntrianOnline,
        list: [],
      },
    ],
  },
];

export {
  menuPakdeSemar,
  sosmed,
  menuStatusBayar,
  menuPercetakan,
  menuMetodeBayar,
  menuRegistrasi,
  menuPelayanan,
};
