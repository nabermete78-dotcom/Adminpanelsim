// Basit admin panel simülasyonu JS
document.addEventListener('DOMContentLoaded', () => {
  // Örnek veri
  const users = Array.from({length: 34}).map((_,i)=>({
    id: i+1,
    name: `Kullanıcı ${i+1}`,
    email: `user${i+1}@example.com`,
    role: ['Üye','Yönetici','Destek'][i%3],
    status: i%4===0 ? 'Pasif' : 'Aktif'
  }));

  // İstatistikler
  document.getElementById('statUsers').textContent = users.length;
  document.getElementById('statSessions').textContent = Math.floor(15 + Math.random()*120);
  document.getElementById('statRevenue').textContent = `${(12000 + Math.floor(Math.random()*8000)).toLocaleString()} ₺`;
  document.getElementById('statErrors').textContent = Math.floor(Math.random()*10);

  // Chart.js - Aktivite (7 gün)
  const ctx = document.getElementById('activityChart').getContext('2d');
  const labels = ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];
  const data = {
    labels,
    datasets: [{
      label: 'Kayıtlar',
      data: labels.map(()=>Math.floor(10 + Math.random()*120)),
      borderColor: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#2563eb',
      backgroundColor: 'rgba(37,99,235,0.08)',
      fill: true,
      tension: 0.35
    }]
  };
  const chart = new Chart(ctx, {type:'line',data,options:{plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}});

  // Tablo + Sayfalama
  const perPage = 8;
  let currentPage = 1;
  const tbody = document.querySelector('#usersTable tbody');
  const pageInfo = document.getElementById('pageInfo');

  function renderTable(page=1, filter='') {
    const filtered = users.filter(u => {
      const q = filter.trim().toLowerCase();
      if(!q) return true;
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
    });
    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    currentPage = Math.min(Math.max(1, page), totalPages);
    const start = (currentPage-1)*perPage;
    const pageItems = filtered.slice(start, start + perPage);

    tbody.innerHTML = '';
    pageItems.forEach(u=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${u.id}</td><td>${u.name}</td><td>${u.email}</td><td>${u.role}</td><td>${u.status}</td>`;
      tbody.appendChild(tr);
    });
    pageInfo.textContent = `${currentPage} / ${totalPages}`;
  }

  document.getElementById('prevPage').addEventListener('click', ()=>renderTable(currentPage-1, document.getElementById('searchInput').value));
  document.getElementById('nextPage').addEventListener('click', ()=>renderTable(currentPage+1, document.getElementById('searchInput').value));
  document.getElementById('searchInput').addEventListener('input', (e)=>renderTable(1, e.target.value));

  renderTable();

  // Modal - Yeni kullanıcı ekle
  const modal = document.getElementById('modal');
  document.getElementById('openAddUser').addEventListener('click', ()=>modal.style.display='flex');
  document.getElementById('closeModal').addEventListener('click', ()=>modal.style.display='none');
  document.getElementById('addUserForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const fd = new FormData(e.target);
    const newUser = {
      id: users.length+1,
      name: fd.get('name'),
      email: fd.get('email'),
      role: fd.get('role'),
      status: 'Aktif'
    };
    users.unshift(newUser); // başa ekle
    modal.style.display='none';
    e.target.reset();
    renderTable(1);
    showNotif(`Yeni kullanıcı eklendi: ${newUser.name}`);
  });

  // Bildirim (basit)
  function showNotif(text){
    const btn = document.getElementById('notifBtn');
    const badge = document.getElementById('notifBadge');
    badge.style.display = 'inline-block';
    badge.textContent = parseInt(badge.textContent || '0') + 1;
    // kısa toast
    const toast = document.createElement('div');
    toast.textContent = text;
    Object.assign(toast.style,{position:'fixed',right:'20px',bottom:'20px',background:'#111',color:'#fff',padding:'10px 14px',borderRadius:'8px',zIndex:9999,opacity:0,transition:'opacity .2s'});
    document.body.appendChild(toast);
    requestAnimationFrame(()=>toast.style.opacity=1);
    setTimeout(()=>{toast.style.opacity=0;setTimeout(()=>toast.remove(),300)},3000);
  }
  document.getElementById('notifBtn').addEventListener('click', ()=>{
    document.getElementById('notifBadge').textContent = '0';
  });

  // Tema toggle
  const themeBtn = document.getElementById('toggleTheme');
  themeBtn.addEventListener('click', ()=>{
    document.body.classList.toggle('dark');
    themeBtn.textContent = document.body.classList.contains('dark') ? 'Açık Mod' : 'Karanlık Mod';
  });

  // Sidebar collapse (mobilde gizlemek/jq tarzı)
  document.getElementById('collapseSidebar').addEventListener('click', ()=>{
    const sb = document.getElementById('sidebar');
    if(sb.style.width && sb.style.width !== '220px'){ sb.style.width = '220px'; return; }
    sb.style.width = sb.style.width === '64px' ? '220px' : '64px';
    // basit: daraldığında metinleri gizle
    sb.querySelectorAll('nav a').forEach(a=> a.style.padding = sb.style.width === '64px' ? '8px 6px' : '8px');
  });

  // Küçük UX: modal dışına tıklayınca kapat
  modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.style.display='none'; });

  // Küçük başlangıç bildirimi
  showNotif('Pano yüklendi');
});