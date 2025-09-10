(function(){
  const { createApp, reactive, computed } = Vue;

  const route = Vue.ref(location.hash.replace('#','') || 'home');
  window.addEventListener('hashchange', () => { route.value = location.hash.replace('#','') || 'home'; });

  const App = {
    setup(){
      const ui = reactive({ showSettings:false });
      const currentView = computed(()=> ({
        home: Pages.Home,
        kategori: Pages.Kategori,
        produk: Pages.Produk,
        transaksi: Pages.Transaksi,
        laporan: Pages.Laporan
      }[route.value] || Pages.Home));
      const go = (name)=> { location.hash = name; };
      const tabClass = (name)=> route.value===name ? 'text-slate-900 font-medium' : 'text-slate-500';
      const openSettings = ()=> ui.showSettings = true;
      const resetData = ()=> { resetAll(); };
      const saveStateProxy = ()=> saveState();
      return { state, currentView, go, tabClass, openSettings, ui, resetData, saveState: saveStateProxy };
    }
  };

  const app = createApp(App);
  app.mount('#app');
})();