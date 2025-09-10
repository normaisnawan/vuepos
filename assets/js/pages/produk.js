(function(){
  const { ref, reactive, computed } = Vue;
  window.Pages = window.Pages || {};
  window.Pages.Produk = {
    template: `
    <section>
      <div class="flex items-center gap-2 mb-3">
        <div class="relative flex-1">
          <input v-model="q" placeholder="Cari produk..." class="w-full bg-white rounded-2xl px-4 py-2 shadow-sm focus:outline-none">
          <span class="iconify absolute right-3 top-2.5" data-icon="solar:magnifer-linear" data-width="18"></span>
        </div>
        <select v-model="filterKategori" class="bg-white rounded-2xl px-3 py-2 shadow-sm">
          <option value="">Semua</option>
          <option v-for="c in kategori" :key="c.id" :value="c.id">{{ c.nama }}</option>
        </select>
        <button @click="openForm()" class="p-2 rounded-2xl bg-slate-900 text-white shadow-sm">
          <span class="iconify" data-icon="solar:add-square-line-duotone" data-width="20"></span>
        </button>
      </div>

      <div class="bg-white rounded-2xl shadow-sm divide-y">
        <div v-for="p in filtered" :key="p.id" class="p-3 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center">
              <span class="iconify" data-icon="solar:box-minimalistic-bold-duotone" data-width="24"></span>
            </div>
            <div>
              <p class="text-sm font-medium">{{ p.nama }}</p>
              <p class="text-[11px] text-slate-500">{{ namaKategori(p.kategoriId) }} • Stok: {{ p.stok }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm font-semibold">Rp {{ money(p.harga) }}</p>
            <div class="flex items-center gap-2 justify-end mt-1">
              <button @click="openForm(p)" class="p-2 rounded-lg bg-slate-100">
                <span class="iconify" data-icon="solar:pen-linear" data-width="18"></span>
              </button>
              <button @click="remove(p.id)" class="p-2 rounded-lg bg-rose-100 text-rose-600">
                <span class="iconify" data-icon="solar:trash-bin-minimalistic-2-linear" data-width="18"></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="ui.show" class="fixed inset-0 z-50 bg-black/30" @click.self="ui.show=false">
        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white rounded-t-3xl p-5 shadow-xl">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">{{ form.id? 'Edit' : 'Tambah' }} Produk</h3>
            <button class="p-2" @click="ui.show=false">
              <span class="iconify" data-icon="solar:close-circle-line-duotone" data-width="22"></span>
            </button>
          </div>
          <div class="grid grid-cols-1 gap-3">
            <div>
              <label class="block text-sm text-slate-600 mb-1">Nama Produk</label>
              <input v-model.trim="form.nama" class="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring" placeholder="cth: Es Teh"/>
            </div>
            <div>
              <label class="block text-sm text-slate-600 mb-1">Kategori</label>
              <select v-model="form.kategoriId" class="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring">
                <option disabled value="">Pilih kategori</option>
                <option v-for="c in kategori" :key="c.id" :value="c.id">{{ c.nama }}</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm text-slate-600 mb-1">Harga</label>
                <input type="number" v-model.number="form.harga" class="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring"/>
              </div>
              <div>
                <label class="block text-sm text-slate-600 mb-1">Stok</label>
                <input type="number" v-model.number="form.stok" class="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring"/>
              </div>
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-4">
            <button class="px-4 py-2 rounded-xl bg-slate-100" @click="ui.show=false">Batal</button>
            <button class="px-4 py-2 rounded-xl bg-slate-900 text-white" @click="save">Simpan</button>
          </div>
        </div>
      </div>
    </section>
    `,
    setup(){
      const q = ref('');
      const filterKategori = ref('');
      const ui = reactive({ show:false });
      const form = reactive({ id:'', nama:'', kategoriId:'', harga:0, stok:0 });
      const kategori = computed(()=> state.kategori);
      const namaKategori = (id)=> kategori.value.find(c=> c.id===id)?.nama || 'Tanpa Kategori';
      const filtered = computed(()=> state.produk.filter(p=>{
        const byQ = p.nama.toLowerCase().includes(q.value.toLowerCase());
        const byK = !filterKategori.value || p.kategoriId===filterKategori.value;
        return byQ && byK;
      }));
      const openForm = (item)=>{ ui.show=true; Object.assign(form, item? JSON.parse(JSON.stringify(item)) : {id:'', nama:'', kategoriId:'', harga:0, stok:0}); };
      const save = ()=>{
        if(!form.nama || !form.kategoriId) return alert('Nama & kategori wajib.');
        if(form.harga<0 || form.stok<0) return alert('Harga/Stok tidak valid.');
        if(form.id){
          const idx = state.produk.findIndex(p=> p.id===form.id);
          if(idx>-1) state.produk[idx] = {...form};
        } else {
          const id = 'p-' + Math.random().toString(36).slice(2,8);
          state.produk.unshift({ id, nama: form.nama, kategoriId: form.kategoriId, harga: Number(form.harga)||0, stok: Number(form.stok)||0 });
        }
        saveState(); ui.show=false;
      };
      const remove = (id)=>{
        if(!confirm('Hapus produk?')) return;
        state.produk = state.produk.filter(p=> p.id!==id);
        saveState();
      };
      return { q, filterKategori, ui, form, kategori, namaKategori, filtered, openForm, save, remove, money };
    }
  };
})();