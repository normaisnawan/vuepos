(function(){
  const { computed } = Vue;
  window.Pages = window.Pages || {};
  window.Pages.Home = {
    template: `
    <section>
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white p-5 shadow-lg">
        <div class="flex items-center gap-3">
          <img class="w-10 h-10 rounded-full ring-2 ring-white/40" src="https://i.pravatar.cc/80?img=13" alt="avatar"/>
          <div>
            <p class="text-sm/4 text-white/80">Welcome Back,</p>
            <p class="font-semibold">Kasir</p>
          </div>
        </div>
        <div class="mt-5">
          <p class="text-xs text-white/80">Penjualan Hari Ini</p>
          <p class="text-3xl font-bold">Rp {{ money(todaySales) }}</p>
        </div>
        <button class="absolute top-4 right-4 p-2 rounded-full bg-white/20">
          <span class="iconify" data-icon="solar:bell-bing-bold-duotone" data-width="20"></span>
        </button>
      </div>

      <div class="mt-4 grid grid-cols-4 gap-3">
        <div v-for="qa in quickActions" :key="qa.key" @click="navigate(qa.to)"
             class="bg-white rounded-2xl p-3 shadow-sm active:scale-95 transition flex flex-col items-center">
          <span class="iconify" :data-icon="qa.icon" data-width="22"></span>
          <span class="text-xs mt-1 text-center">{{ qa.label }}</span>
        </div>
      </div>

      <div class="mt-6">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-semibold">Aktivitas Terakhir</h3>
          <button class="text-sm text-indigo-600" @click="navigate('laporan')">Lihat semua</button>
        </div>
        <div class="bg-white rounded-2xl divide-y shadow-sm">
          <div v-for="tx in recentTx" :key="tx.id" class="flex items-center justify-between p-3">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
                <span class="iconify" :data-icon="tx.icon" data-width="18"></span>
              </div>
              <div>
                <p class="text-sm font-medium">{{ tx.title }}</p>
                <p class="text-[11px] text-slate-500">{{ tx.subtitle }}</p>
              </div>
            </div>
            <div class="text-sm font-semibold" :class="tx.amount>0?'text-emerald-600':'text-slate-700'">
              {{ tx.amount>0? '+':'' }}Rp {{ money(Math.abs(tx.amount)) }}
            </div>
          </div>
        </div>
      </div>
    </section>
    `,
    setup(){
      const quickActions = [
        { key:'trx', label:'Transaksi', icon:'solar:card-transfer-line-duotone', to:'transaksi' },
        { key:'produk', label:'Produk', icon:'solar:box-linear', to:'produk' },
        { key:'kategori', label:'Kategori', icon:'solar:archive-line-duotone', to:'kategori' },
        { key:'laporan', label:'Laporan', icon:'solar:chart-2-line-duotone', to:'laporan' },
      ];
      const todaySales = computed(()=> state.transaksi
        .filter(t=> new Date(t.ts).toDateString() === new Date().toDateString())
        .reduce((a,b)=> a + Math.max(0,b.amount), 0));
      const recentTx = computed(()=> state.transaksi.slice(0,6));
      const navigate = (to)=> { location.hash = to; };
      return { quickActions, todaySales, recentTx, money, navigate };
    }
  };
})();