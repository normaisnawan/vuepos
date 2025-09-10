(function(){
  const { computed, ref } = Vue;
  window.Pages = window.Pages || {};
  window.Pages.Laporan = {
    template: `
    <section>
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-semibold">Laporan Penjualan</h3>
        <select v-model="range" class="bg-white rounded-2xl px-3 py-2 shadow-sm">
          <option value="today">Hari ini</option>
          <option value="7d">7 hari</option>
          <option value="30d">30 hari</option>
          <option value="all">Semua</option>
        </select>
      </div>
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="bg-white p-4 rounded-2xl shadow-sm">
          <p class="text-xs text-slate-500">Total Transaksi</p>
          <p class="text-2xl font-bold">{{ totalTrx }}</p>
        </div>
        <div class="bg-white p-4 rounded-2xl shadow-sm">
          <p class="text-xs text-slate-500">Total Penjualan</p>
          <p class="text-2xl font-bold">Rp {{ money(totalNominal) }}</p>
        </div>
      </div>
      <div class="bg-white rounded-2xl shadow-sm divide-y">
        <div v-for="tx in txs" :key="tx.id" class="p-3 flex items-center justify-between">
          <div>
            <p class="text-sm font-medium">{{ tx.title }}</p>
            <p class="text-[11px] text-slate-500">{{ new Date(tx.ts).toLocaleString('id-ID') }}</p>
          </div>
          <div class="text-sm font-semibold text-emerald-600">+Rp {{ money(tx.amount) }}</div>
        </div>
        <div v-if="!txs.length" class="p-4 text-center text-slate-500 text-sm">Tidak ada data.</div>
      </div>
    </section>
    `,
    setup(){
      const range = ref('today');
      const fromTs = computed(()=>{
        const now = Date.now();
        if(range.value==='today'){
          const d = new Date(); d.setHours(0,0,0,0); return d.getTime();
        }
        if(range.value==='7d') return now - 7*86400_000;
        if(range.value==='30d') return now - 30*86400_000;
        return 0;
      });
      const txs = computed(()=> state.transaksi.filter(t=> t.amount>0 && t.ts>=fromTs.value));
      const totalTrx = computed(()=> txs.value.length);
      const totalNominal = computed(()=> txs.value.reduce((a,b)=> a+b.amount, 0));
      return { range, txs, totalTrx, totalNominal, money };
    }
  };
})();