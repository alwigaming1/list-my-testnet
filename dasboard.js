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

let nextId = testnetProjects.length + 1;

const listContainer = document.getElementById('testnetListContainer');

// --- FUNGSI UTAMA: RENDER PROYEK KE DOM ---
function renderProjects() {
    listContainer.innerHTML = ''; // Kosongkan tampilan lama
    
    // Tambahkan Header
    listContainer.innerHTML += `
        <div class="testnet-card header-row" style="background-color: #111; font-weight: 700; padding: 10px 25px; border-bottom: 1px solid rgba(255, 255, 255, 0.2); border-radius: 6px 6px 0 0; margin-bottom: 0;">
            <span style="grid-column: 1 / 2;">NAMA PROYEK</span>
            <span style="grid-column: 2 / 3;">LINK DOKUMENTASI</span>
            <span style="grid-column: 3 / 4; text-align: center;">TIER & FUNDING</span>
            <span style="grid-column: 4 / 5; text-align: center;">TUGAS UTAMA</span>
            <span style="grid-column: 5 / 6; text-align: center;">SELESAI (✓)</span>
            <span style="grid-column: 6 / 7; text-align: center;">AKSI</span>
        </div>`;

    testnetProjects.forEach(project => {
        const cardHTML = `
            <div class="testnet-card" data-status="${project.status}" data-tier="${project.tier}" data-id="${project.id}">
                <div class="card-header">
                    <h3><i class="${project.icon}"></i> ${project.name}</h3>
                </div>
                <div class="link-info">
                    <a href="${project.link}" target="_blank" title="${project.name} Site"><i class="fas fa-external-link-alt"></i> Link</a>
                </div>
                <div class="metrics">
                    <span><i class="fas fa-layer-group"></i> ${project.tier}</span>
                    <span><i class="fas fa-money-bill-wave"></i> ${project.funding}</span>
                </div>
                <div class="task-summary">
                    <span>${project.mainTask}</span>
                </div>
                <label class="task-item center-checkbox">
                    <input type="checkbox" ${project.isDone ? 'checked' : ''} onchange="toggleTaskDone(${project.id})">
                </label>
                <a href="#" class="secondary-btn" onclick="openEditModal(${project.id})">Edit</a>
            </div>
        `;
        listContainer.innerHTML += cardHTML;
    });
}

// Panggil fungsi renderProjects saat DOM siap
document.addEventListener('DOMContentLoaded', renderProjects); 

// Fungsi untuk mengganti status ceklis (isDone)
function toggleTaskDone(id) {
    const project = testnetProjects.find(p => p.id === id);
    if (project) {
        project.isDone = !project.isDone;
    }
}

/* ========================================================= */
/* FUNGSI UNTUK MODAL TAMBAH PROYEK (ADD) */
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

// Event listener untuk form Add New Project (Submit)
document.getElementById('addTestnetForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newProject = {
        id: nextId,
        name: document.getElementById('addTnName').value,
        link: document.getElementById('addTnLink').value,
        tier: document.getElementById('addTnTier').value,
        funding: document.getElementById('addTnFunding').value,
        mainTask: document.getElementById('addTnTasks').value,
        status: document.getElementById('addTnStatus').value,
        isDone: false,
        icon: "fas fa-project-diagram" 
    };

    testnetProjects.push(newProject);
    nextId++;

    closeAddModal();
    renderProjects();
    
    alert(`Proyek ${newProject.name} berhasil ditambahkan!`);
});


/* ========================================================= */
/* FUNGSI UNTUK MODAL EDIT PROYEK */
/* ========================================================= */

// FUNGSI INI DIPANGGIL OLEH TOMBOL EDIT DI SETIAP BARIS
function openEditModal(id) {
    const editModal = document.getElementById('editModal');
    editModal.style.display = 'block';

    const project = testnetProjects.find(p => p.id === id);

    if (project) {
        document.getElementById('editTnId').value = project.id;
        document.getElementById('editTnName').value = project.name;
        document.getElementById('editTnLink').value = project.link;
        document.getElementById('editTnTier').value = project.tier;
        document.getElementById('editTnFunding').value = project.funding;
        document.getElementById('editTnTasks').value = project.mainTask;
        document.getElementById('editTnStatus').value = project.status;
    } else {
        alert('Data proyek tidak ditemukan!');
    }
}

function closeEditModal() {
    const editModal = document.getElementById('editModal');
    if (editModal) {
        editModal.style.display = 'none';
    }
}

// Event Listener untuk tombol Simpan Perubahan (Submit)
document.getElementById('editTestnetForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('editTnId').value);
    const index = testnetProjects.findIndex(p => p.id === id);

    if (index !== -1) {
        // Update data di array
        testnetProjects[index].name = document.getElementById('editTnName').value;
        testnetProjects[index].link = document.getElementById('editTnLink').value;
        testnetProjects[index].tier = document.getElementById('editTnTier').value;
        testnetProjects[index].funding = document.getElementById('editTnFunding').value;
        testnetProjects[index].mainTask = document.getElementById('editTnTasks').value;
        testnetProjects[index].status = document.getElementById('editTnStatus').value;
        
        closeEditModal();
        renderProjects();
        alert(`Proyek ${testnetProjects[index].name} berhasil diperbarui!`);
    } else {
        alert('Gagal menemukan proyek untuk diperbarui.');
    }
});

function deleteTestnet() {
    const id = parseInt(document.getElementById('editTnId').value);
    const index = testnetProjects.findIndex(p => p.id === id);

    if (index !== -1) {
        const confirmDelete = confirm(`Apakah Anda yakin ingin menghapus Proyek ${testnetProjects[index].name}?`);
        
        if (confirmDelete) {
            testnetProjects.splice(index, 1);
            
            closeEditModal();
            renderProjects();
            alert(`Proyek berhasil dihapus!`);
        }
    }
}