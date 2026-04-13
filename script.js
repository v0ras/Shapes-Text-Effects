(function() {
  // DOM elementai
  const parametruSkydelis = document.getElementById('parametruSkydelis');
  const atvaizdavimas = document.getElementById('atvaizdavimas');
  const tvirtinti = document.getElementById('tvirtinti');
  const plotisInput = document.getElementById('plotis');
  const aukstisInput = document.getElementById('aukstis');
  const fonasSpalvaInput = document.getElementById('fonasSpalva');
  const remelisStorisInput = document.getElementById('remelisStoris');
  const remelioSpalvaInput = document.getElementById('remelioSpalva');
  const apvalinimasInput = document.getElementById('apvalinimas');
  const tekstoLaukas = document.getElementById('tekstoLaukas');
  const sriftoDydisInput = document.getElementById('sriftoDydis');
  const tekstoSpalvaInput = document.getElementById('tekstoSpalva');
  const fonoSpalvaInput = document.getElementById('fonoSpalva');
  const containerBgDiv = document.getElementById('containerBg');
  const istrintiZona = document.getElementById('istrintiZona');
  const needHelpCheck = document.getElementById('needHelp');
  const pagalbaDiv = document.getElementById('pagalba');
  const elementuKiekisSpan = document.getElementById('elementuKiekis');

  let elementuSkaicius = 0;
  let aktyvusElementas = null;
  let sukimasAktyvus = false;

  // Pagalba – vilkimas pagalbos langui
  $(pagalbaDiv).draggable ? $(pagalbaDiv).draggable() : null;
  $(parametruSkydelis).draggable ? $(parametruSkydelis).draggable() : null;

  // Pagalbos checkbox'as
  needHelpCheck.addEventListener('change', (e) => {
    pagalbaDiv.style.display = e.target.checked ? 'block' : 'none';
  });

  // .if – alert + facebook
  document.querySelectorAll('.if').forEach(el => {
    el.addEventListener('click', () => {
      alert('✨ Daugiau kūrybos? Spausk OK ir atsivers langas');
      window.open('https://www.facebook.com/v0ras', '_blank');
    });
  });

  // Fono keitimas (darbo zonos)
  containerBgDiv.addEventListener('click', () => {
    const spalva = fonoSpalvaInput.value;
    atvaizdavimas.style.backgroundColor = spalva;
  });

  // Funkcija sukurti elementą
  function sukurtiElementa() {
    const plotis = plotisInput.value ? parseInt(plotisInput.value) : 0;
    const aukstis = aukstisInput.value ? parseInt(aukstisInput.value) : 0;
    const remelis = remelisStorisInput.value ? parseInt(remelisStorisInput.value) : 0;
    const remSpalva = remelioSpalvaInput.value;
    const radius = apvalinimasInput.value ? parseInt(apvalinimasInput.value) : 0;
    const fonoSpalva = fonasSpalvaInput.value;
    const tekstas = tekstoLaukas.value.trim();
    const fontSize = sriftoDydisInput.value ? parseInt(sriftoDydisInput.value) : 16;
    const textSpalva = tekstoSpalvaInput.value;

    if ((plotis === 0 || aukstis === 0) && tekstas === '') {
      alert('❌ Įvesk plotį/aukštį (formai) arba parašyk tekstą!');
      return;
    }

    const elementas = document.createElement('div');
    elementas.className = 'elementas';
    elementas.style.position = 'relative';
    if (plotis > 0) elementas.style.width = plotis + 'px';
    if (aukstis > 0) elementas.style.height = aukstis + 'px';
    elementas.style.backgroundColor = fonoSpalva;
    elementas.style.border = `${remelis}px solid ${remSpalva}`;
    elementas.style.borderRadius = radius + '%';
    elementas.style.color = textSpalva;
    elementas.style.fontSize = fontSize + 'px';
    elementas.style.fontFamily = 'monospace';
    elementas.style.padding = '12px';
    elementas.style.fontWeight = 'bold';
    elementas.innerText = tekstas !== '' ? tekstas : '🔷';

    // Pridedam į atvaizdavimo zoną
    atvaizdavimas.appendChild(elementas);
    elementuSkaicius++;
    elementuKiekisSpan.innerText = elementuSkaicius;

    // Padarom vilkima (naudojam modernų drag and drop, bet patogiau per jQuery UI? Ne, padarysim su mygtuku?
    // Kad nenaudot jQuery UI, bet naudosim paprastą drag? Na, tavo sename kode buvo .draggable()
    // jQuery UI nėra mūsų naujam variante – bet galima implementuoti mygtuko vilkimą pele.
    // Kadangi esi pripratęs prie drag, pridėsiu paprastą drag funkciją.
    padarytiVilkima(elementas);

    // Sukimas (dvigubas click + ratukas)
    let rotacija = 0;
    elementas.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      aktyvusElementas = elementas;
      sukimasAktyvus = true;
    });

    elementas.addEventListener('wheel', (e) => {
      if (!sukimasAktyvus || aktyvusElementas !== elementas) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? -5 : 5;
      rotacija += delta;
      elementas.style.transform = `rotate(${rotacija}deg)`;
      elementas.style.transition = 'transform 0.05s linear';
    });

    // Paspaudus bet kur kitur – sukimas išsijungia
    document.body.addEventListener('click', (e) => {
      if (e.target !== elementas) sukimasAktyvus = false;
    });

    // Animacija hover – švelnus sukimas (ne privaloma, bet smagu)
    elementas.addEventListener('mouseenter', () => {
      elementas.style.transition = 'transform 0.6s ease';
    });
  }

  // Paprastas vilkimas (be papildomų bibliotekų)
  function padarytiVilkima(el) {
    let offsetX = 0, offsetY = 0, mouseX = 0, mouseY = 0;
    el.addEventListener('mousedown', (e) => {
      e.preventDefault();
      offsetX = e.clientX - el.offsetLeft;
      offsetY = e.clientY - el.offsetTop;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
      let left = e.clientX - offsetX;
      let top = e.clientY - offsetY;
      el.style.position = 'absolute';
      el.style.left = left + 'px';
      el.style.top = top + 'px';
      el.style.zIndex = 999;

      // Ištrinimo zona – patikrinti ar centras elementas patenka į šiukšliadėžę
      const trashRect = istrintiZona.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const centerX = (elRect.left + elRect.right) / 2;
      const centerY = (elRect.top + elRect.bottom) / 2;
      if (centerX > trashRect.left && centerX < trashRect.right && centerY > trashRect.top && centerY < trashRect.bottom) {
        el.style.opacity = '0.4';
      } else {
        el.style.opacity = '1';
      }
    }

    function onMouseUp(e) {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      const trashRect = istrintiZona.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const centerX = (elRect.left + elRect.right) / 2;
      const centerY = (elRect.top + elRect.bottom) / 2;
      if (centerX > trashRect.left && centerX < trashRect.right && centerY > trashRect.top && centerY < trashRect.bottom) {
        el.remove();
        elementuSkaicius--;
        elementuKiekisSpan.innerText = elementuSkaicius;
      }
      el.style.opacity = '1';
      el.style.position = '';
      el.style.left = '';
      el.style.top = '';
    }
  }

  tvirtinti.addEventListener('click', sukurtiElementa);
})();
