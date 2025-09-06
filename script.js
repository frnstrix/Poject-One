const screens = {
  landing: document.getElementById('landing'),
  menu: document.getElementById('menu')
};
const bg = document.querySelector('.bg');

function showScreen(name){
  Object.entries(screens).forEach(([key, el])=>{
    el.classList.toggle('is-active', key===name);
  });
  bg.style.opacity = (name==='menu' || name==='landing')?'1':'0';
}

// Buttons
const btnStart = document.getElementById('btn-start');
const btnCloseMenu = document.getElementById('btn-close-menu');
const menuGrid = document.querySelector('.menu-grid');

btnStart.addEventListener('click', ()=>showScreen('menu'));
btnCloseMenu.addEventListener('click', ()=>showScreen('landing'));

// Pilih tampilan → buka halaman photo sphere
menuGrid.addEventListener('click',(e)=>{
  const btn = e.target.closest('button[data-folder]');
  if(!btn) return;
  const folder = btn.getAttribute('data-folder');
  // Untuk percobaan, baru satu foto: exterior
  if(folder==='exterior'){
    window.location.href = 'eksterior.html';
  } else {
    alert('Belum ada foto untuk menu ini.');
  }
});
