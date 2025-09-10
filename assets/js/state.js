// Global state + persistence
const { reactive } = Vue;

const STORAGE_KEY = 'pos-vue-cdn-state-v1';
const load = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null; } catch { return null; } };
const save = (obj) => localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));

const initialState = {
  profile: { namaOutlet: 'GrowthMind Mart' },
  kategori: [
    { id: 'k-minuman', nama: 'Minuman' },
    { id: 'k-makanan', nama: 'Makanan' },
    { id: 'k-snack', nama: 'Snack' },
  ],
  produk: [
    { id: 'p-esteh', nama: 'Es Teh', kategoriId: 'k-minuman', harga: 5000, stok: 30 },
    { id: 'p-kopi', nama: 'Kopi Hitam', kategoriId: 'k-minuman', harga: 8000, stok: 20 },
    { id: 'p-miegoreng', nama: 'Mie Goreng', kategoriId: 'k-makanan', harga: 15000, stok: 10 },
  ],
  transaksi: [
    { id: 1, title: 'Penjualan #INV-001', subtitle: 'Tunai', amount: 65000, icon: 'solar:bill-list-bold-duotone', ts: Date.now()-3600_000, items:[{id:'p-esteh', qty:2, harga:5000}] },
    { id: 2, title: 'Retur #RT-002', subtitle: 'Produk: Snack', amount: -12000, icon: 'solar:undo-left-round-bold-duotone', ts: Date.now()-7600_000, items:[] },
  ]
};

const persisted = load();
window.state = reactive(persisted || initialState);
window.money = (n)=> (n||0).toLocaleString('id-ID');
window.saveState = ()=> save(state);
window.resetAll = ()=> { Object.assign(state, JSON.parse(JSON.stringify(initialState))); saveState(); };
