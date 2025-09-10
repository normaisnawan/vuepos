(function(){
  const { ref, reactive, computed } = Vue;
  window.Pages = window.Pages || {};
  window.Pages.Kategori = {
    template: `
    <section>
      <div class="flex items-center gap-3 mb-3">
        <div class="relative flex-1">
          <input v-model="q" placeholder="Cari kategori..." class="w-full bg-white rounded-2xl px-4 py-2 shadow-sm focus:outline-none">
          <span class="iconify absolute right-3 top-2.5" data-icon="solar:magnifer-linear" data-width="18"></span>
        </div>
        <button @click="openForm()" class="p-2 rounded-2xl bg-slate-900 text-white shadow-sm">
          <span class="iconify" data-icon="solar:add-square-line-duotone" data-width="20"></span>
        </button>
      </div>

      <div class="bg-white rounded-2xl shadow-sm divide-y">
        <div v-for="c in filtered" :key="c.id" class="p-3 flex items-center justify-between">
          <div>
            <p class="text-sm font-medium">{{ c.nama }}</p>
            <p class="text-[11px] text-slate-500">Produk: {{ countProduk(c.id) }}</p>
          </div>
          <div class="flex items-center gap-2">
            <button @click="openForm(c)" class="p-2 rounded-lg bg-slate-100">
              <span class="iconify" data-icon="solar:pen-linear" data-width="18"></span>
            </button>
            <button @click="remove(c.id)" class="p-2 rounded-lg bg-rose-100 text-rose-600">
              <span class="iconify" data-icon="solar:trash-bin-minimalistic-2-linear" data-width="18"></span>
            </button>
          </div>
        </div>
      </div>

      <div v-if="ui.show" class="fixed inset-0 z-50 bg-black/30" @click.self="ui.show=false">
        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white rounded-t-3xl p-5 shadow-xl">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">{{ form.id? 'Edit' : 'Tambah' }} Kategori</h3>
            <button class="p-2" @click="ui.show=false">
              <span class="iconify" data-icon="solar:close-circle-line-duotone" data-width="22"></span>
            </button>
          </div>
          <label class="block text-sm text-slate-600 mb-1">Nama Kategori</label>
          <input v-model.trim="form.nama" class="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring" placeholder="cth: Minuman"/>
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
      const ui = reactive({ show:false });
      const form = reactive({ id:'', nama:'' });
      const filtered = computed(()=> state.kategori.filter(c=> c.nama.toLowerCase().includes(q.value.toLowerCase())));
      const openForm = (item)=>{ ui.show=true; Object.assign(form, item? JSON.parse(JSON.stringify(item)) : {id:'', nama:''}); };
      const save = ()=>{
        if(!form.nama) return alert('Nama kategori wajib diisi.');
        if(form.id){
          const idx = state.kategori.findIndex(c=> c.id===form.id);
          if(idx>-1) state.kategori[idx] = {...form};
        } else {
          const id = 'k-' + Math.random().toString(36).slice(2,8);
          state.kategori.unshift({ id, nama: form.nama });
        }
        saveState(); ui.show=false;
      };
      const remove = (id)=>{
        if(!confirm('Hapus kategori?')) return;
        state.kategori = state.kategori.filter(c=> c.id!==id);
        saveState();
      };
      const countProduk = (kategoriId)=> state.produk.filter(p=> p.kategoriId===kategoriId).length;
      return { q, ui, form, filtered, openForm, save, remove, countProduk };
    }
  };
})();