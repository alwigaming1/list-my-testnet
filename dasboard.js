/* ========================================================= */
/* STRUKTUR DATA DAN FUNGSI UTAMA */
/* ========================================================= */

// 1. Struktur data awal (Sumber Kebenaran/Source of Truth)
let testnetProjects = [
    { id: 1, name: "Starknet Alpha", link: "https://docs.starknet.io", tier: "Tier 1", funding: "$282M", mainTask: "Swap & Mint NFT", status: "Aktif", isDone: true, icon: "fab fa-ethereum" },
    { id: 2, name: "Fuel Network", link: "https://fuel.network", tier: "Tier 2", funding: "$80M", mainTask: "Ikuti Update", status: "Pending", isDone: false, icon: "fas fa-rocket" },
    { id: 3, name: "ZetaChain Omni", link: "https://www.zetachain.com/", tier: "Tier 2", funding: "$27M", mainTask: "Mingguan Swap", status: "Aktif", isDone: false, icon: "fas fa-link" },
    { id: 4, name: "LayerZero V2", link: "https://layerzero.network/", tier: "Tier 1", funding: "$263M", mainTask: "Semua Selesai", status: "Selesai", isDone: true, icon: "fas fa-code-branch" },
    { id: 5, name: "Celestia Mocha", link: "https://celestia.org/", tier: "Tier 1", funding: "$55M", mainTask: "Jalankan Node", status: "Aktif", isDone: false, icon: "fas fa-cloud" },
    { id: 6, name: "Scroll Alpha", link: "https://scroll.io/", tier: "Tier 2", funding: "$50M", mainTask: "Bridge & dApps", status: "Aktif", isDone: true, icon: "fas fa-scroll" },
    { id: 7, name: "Manta Atlantic", link: "https://manta.network/", tier: "Tier 3", funding: "$35M", mainTask: "Transfer Privat", status: "Aktif", isDone: false, icon: "fas fa-compress" },
    { id: 8, name: "Taiko Katla", link: "https://taiko.xyz/", tier: "Tier 2", funding: "$22M", mainTask: "Daftar Node", status: "Pending", isDone: false, icon: "fas fa-mountain" },
    { id: 9, name: "SUI Wave 3", link: "https://sui.io/", tier: "Tier 1", funding: "$300M", mainTask: "Semua Selesai", status: "Selesai", isDone: true, icon: "fas fa-key" },
    { id: 10, name: "Polygon zkEVM", link: "https://polygon.technology/polygon-zkevm", tier: "Tier 1", funding: "$450M+", mainTask: "Bridge & dApps", status: "Aktif", isDone: false, icon: "fas fa-cube" }
];

// ID untuk proyek baru (mengabaikan logika Firebase untuk fokus pada array lokal)
let nextId = testnetProjects.length > 0 ? Math.max(...testnetProjects.map(p => p.id)) + 1 : 1; 

const listContainer = document.getElementById('testnetListContainer');

// Map ikon default (bisa disesuaikan atau diabaikan)
const iconMap = {
    'Tier 1': 'fas fa-star',
    'Tier 2': 'fas fa-rocket',
    'Tier 3': 'fas fa-leaf',
    'Aktif': 'fas fa-check-circle',
    'Pending': 'fas fa-hourglass-half',
    'Selesai': 'fas fa-archive'
};

// --- FUNGSI UTAMA: RENDER PROYEK KE DOM ---
function renderProjects() {
    listContainer.innerHTML = ''; // Kosongkan tampilan lama
    
    // Tambahkan Header (Diperbaiki agar selalu muncul)
    const headerHTML = `
        <div class="testnet-card header-row" style="background-color: #111; font-weight: 700; padding: 10px 25px; border-bottom: 1px solid rgba(255, 255, 255, 0.2); border-radius: 6px 6px 0 0; margin-bottom: 0;">
            <span style="grid-column: 1 / 2;">NAMA PROYEK</span>
            <span style="grid-column: 2 / 3;">LINK DOKUMENTASI</span>
            <span style="grid-column: 3 / 4; text-align: center;">TIER & FUNDING</span>
            <span style="grid-column: 4 / 5; text-align: center;">TUGAS UTAMA</span>
            <span style="grid-column: 5 / 6; text-align: center;">SELESAI (✓)</span>
            <span style="grid-column: 6 / 7; text-align: center;">AKSI</span>
        </div>`;
    listContainer.innerHTML += headerHTML;

    testnetProjects.forEach(project => {
        const tierIcon = iconMap[project.tier] || 'fas fa-layer-group';
        const cardHTML = `
            <div class="testnet-card" data-status="${project.status}" data-tier="${project.tier}" data-id="${project.id}">
                <div class="card-header">
                    <h3><i class="${project.icon || 'fas fa-code-branch'}"></i> ${project.name}</h3>
                </div>
                <div class="link-info">
                    <a href="${project.link}" target="_blank" title="${project.name} Site"><i class="fas fa-external-link-alt"></i> Link</a>
                </div>
                <div class="metrics">
                    <span><i class="${tierIcon}"></i> ${project.tier}</span>
                    <span><i class="fas fa-money-bill-wave"></i> ${project.funding}</span>
                </div>
                <div class="task-summary">
                    <span>${project.mainTask}</span>
                </div>
                <label class="task-item center-checkbox">
                    <input type="checkbox" ${project.isDone ? 'checked' : ''} onchange="toggleTaskDone(${project.id})">
                </label>
                <a href="#" class="secondary-btn" onclick="alert('Fungsi Edit untuk ID ${project.id}')">Edit</a>
            </div>
        `;
        listContainer.innerHTML += cardHTML;
    });
}


// Fungsi untuk mengganti status ceklis (isDone)
function toggleTaskDone(id) {
    const project = testnetProjects.find(p => p.id === id);
    if (project) {
        project.isDone = !project.isDone;
        // Opsional: perbarui status berdasarkan isDone
        project.status = project.isDone ? 'Selesai' : 'Aktif'; 
        renderProjects(); // Render ulang untuk melihat perubahan status
    }
}

/* ========================================================= */
/* FUNGSI UNTUK MODAL TAMBAH PROYEK (ADD) - PERBAIKAN LOGIKA */
/* ========================================================= */

// FUNGSI INI DIPANGGIL OLEH TOMBOL TAMBAH PROYEK DI HTML
function openAddModal() {
    const addModal = document.getElementById('addModal');
    if (addModal) {
        addModal.style.display = 'block';
    }
}

function closeAddModal() {
    const addModal = document.getElementById('addModal');
    if (addModal) {
        addModal.style.display = 'none';
        document.getElementById('addTestnetForm').reset();
    }
}

// Fungsi BARU untuk menangani penambahan proyek (CREATE)
function handleAddTestnetLocal(e) {
    e.preventDefault();
    
    // Ambil nilai dari form
    const name = document.getElementById('addTnName').value;
    const link = document.getElementById('addTnLink').value;
    const tier = document.getElementById('addTnTier').value;
    const funding = document.getElementById('addTnFunding').value;
    const mainTask = document.getElementById('addTnTasks').value;
    const status = document.getElementById('addTnStatus').value;

    // Tentukan isDone berdasarkan Status
    const isDone = status === 'Selesai';
    
    // Tentukan icon (bisa disesuaikan lebih lanjut)
    const projectIcon = iconMap[tier] || 'fas fa-code-branch';

    const newProject = {
        id: nextId, // Gunakan nextId
        name: name,
        link: link,
        tier: tier,
        funding: funding,
        mainTask: mainTask,
        status: status,
        isDone: isDone,
        icon: projectIcon
    };

    // 1. Tambahkan ke array
    testnetProjects.push(newProject);
    
    // 2. Naikkan ID untuk proyek berikutnya
    nextId++;

    // 3. Render ulang list untuk menampilkan proyek baru
    renderProjects();

    // 4. Tutup modal dan beri notifikasi
    closeAddModal();
    alert(`Proyek ${name} berhasil ditambahkan!`);
}


// =========================================================
// EVENT LISTENERS TAMBAHAN
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    // Panggil fungsi renderProjects saat DOM siap (tampilan awal)
    renderProjects();

    // Event listener untuk form Add New Project (Submit)
    const addForm = document.getElementById('addTestnetForm');
    if (addForm) {
        // Ganti form.addEventListener('submit', function(e) { ... }) yang terpotong
        addForm.addEventListener('submit', handleAddTestnetLocal);
    }
    
    // Tambahkan event listener untuk tombol Tambah Proyek Baru di bar
    const addBtn = document.getElementById('addProjectBtn');
    if (addBtn) {
        addBtn.addEventListener('click', openAddModal);
    }

    // Menutup modal jika mengklik di luar area modal
    window.onclick = function(event) {
        if (event.target.id === 'addModal') {
            closeAddModal();
        }
        // Tambahkan logic untuk modal edit jika diperlukan
    }
});