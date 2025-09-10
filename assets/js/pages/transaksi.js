(function(){
  const { ref, reactive, computed } = Vue;
  window.Pages = window.Pages || {};
  window.Pages.Transaksi = {
    template: `
    <section>
      <div class="flex items-center gap-2 mb-3">
        <div class="relative flex-1">
          <input v-model="q" placeholder="Cari / scan produk..." class="w-full bg-white rounded-2xl px-4 py-2 shadow-sm focus:outline-none">
          <span class="iconify absolute right-3 top-2.5" data-icon="solar:magnifer-linear" data-width="18"></span>
        </div>
        <select v-model="filterKategori" class="bg-white rounded-2xl px-3 py-2 shadow-sm">
          <option value="">Semua</option>
          <option v-for="c in kategori" :key="c.id" :value="c.id">{{ c.nama }}</option>
        </select>
      </div>

      <div class="grid grid-cols-3 gap-2 mb-4">
        <button v-for="p in filteredProduk" :key="p.id" @click="addToCart(p)"
          class="bg-white rounded-xl p-2 shadow-sm active:scale-95 transition text-left">
          <p class="text-[13px] font-medium line-clamp-2">{{ p.nama }}</p>
          <p class="text-[11px] text-slate-500">{{ namaKategori(p.kategoriId) }}</p>
          <p class="text-sm font-semibold mt-1">Rp {{ money(p.harga) }}</p>
        </button>
      </div>

      <div class="bg-white rounded-2xl shadow-sm">
        <div class="p-3 border-b flex items-center justify-between">
          <h3 class="font-semibold">Keranjang</h3>
          <button class="text-sm text-rose-600" @click="clearCart" v-if="items.length">Kosongkan</button>
        </div>
        <div v-if="!items.length" class="p-4 text-center text-slate-500 text-sm">Belum ada item.</div>
        <div v-else class="divide-y">
          <div v-for="it in items" :key="it.id" class="p-3 flex items-center justify-between">
            <div>
              <p class="text-sm font-medium">{{ it.nama }}</p>
              <p class="text-[11px] text-slate-500">Rp {{ money(it.harga) }}</p>
            </div>
            <div class="flex items-center gap-2">
              <button class="px-2 py-1 rounded-lg bg-slate-100" @click="dec(it)">-</button>
              <span class="w-6 text-center">{{ it.qty }}</span>
              <button class="px-2 py-1 rounded-lg bg-slate-100" @click="inc(it)">+</button>
              <span class="w-20 text-right font-semibold">Rp {{ money(it.qty * it.harga) }}</span>
              <button class="p-2 rounded-lg bg-rose-100 text-rose-600" @click="remove(it.id)">
                <span class="iconify" data-icon="solar:trash-bin-minimalistic-2-linear" data-width="18"></span>
              </button>
            </div>
          </div>
        </div>
        <div class="p-3 flex items-center justify-between border-t">
          <div class="text-sm">
            <p class="text-slate-500">Total</p>
            <p class="text-lg font-bold">Rp {{ money(total) }}</p>
          </div>
          <button class="px-4 py-3 rounded-xl bg-emerald-600 text-white font-semibold disabled:opacity-50"
                  :disabled="!items.length" @click="bayar">Bayar</button>
        </div>
      </div>
    </section>
    `,
    setup(){
      const q = ref('');
      const filterKategori = ref('');
      const kategori = computed(()=> state.kategori);
      const namaKategori = (id)=> kategori.value.find(c=> c.id===id)?.nama || 'Tanpa Kategori';
      const filteredProduk = computed(()=> state.produk.filter(p=>{
        const byQ = p.nama.toLowerCase().includes(q.value.toLowerCase());
        const byK = !filterKategori.value || p.kategoriId===filterKategori.value;
        return byQ && byK;
      }));
      const items = reactive([]);
      const addToCart = (p)=>{
        const f = items.find(i=> i.id===p.id);
        if(f) f.qty++; else items.push({ id:p.id, nama:p.nama, harga:p.harga, qty:1 });
      };
      const inc = (it)=> it.qty++;
      const dec = (it)=> { it.qty = Math.max(1, it.qty-1); };
      const remove = (id)=> { const idx = items.findIndex(i=> i.id===id); if(idx>-1) items.splice(idx,1); };
      const clearCart = ()=> { items.splice(0, items.length); };
      const total = computed(()=> items.reduce((a,b)=> a + b.qty*b.harga, 0));
      const bayar = ()=>{
        const newId = Date.now();
        state.transaksi.unshift({
          id: newId, title:`Penjualan #INV-${String(newId).slice(-4)}`,
          subtitle:'Tunai', amount: total.value, icon:'solar:bill-list-bold-duotone', ts: Date.now(),
          items: JSON.parse(JSON.stringify(items))
        });
        saveState();
        clearCart();
        alert('Pembayaran berhasil (simulasi).');
      };
      return { q, filterKategori, kategori, namaKategori, filteredProduk, items, addToCart, inc, dec, remove, clearCart, total, bayar, money };
    }
  };
})();