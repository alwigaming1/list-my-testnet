// =========================================================
// 1. INISIALISASI FIREBASE & KONFIGURASI PROYEK
// =========================================================

// --- PENTING: GANTI DENGAN KUNCI PROYEK FIREBASE ANDA ---
const firebaseConfig = {
    apiKey: "AIzaSyA6PyEJO87eBadirv_mXfTuqMS8Xrl3eLw", 
    authDomain: "list-tesnet.firebaseapp.com", 
    projectId: "list-tesnet", 
    // Tambahkan kunci lain jika ada (storageBucket, messagingSenderId, dll.)
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let currentUserId = null; 

// =========================================================
// 2. UTILITY UI: NAVIGASI & MODAL
// =========================================================

/** Mengalihkan tampilan antar section */
function showSection(id) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    const target = document.getElementById(id + '-section');
    if (target) {
        target.classList.add('active');
    }
}

/** Membuka Modal */
function openModal(id) {
    document.getElementById(id).style.display = 'block';
}

/** Menutup Modal */
function closeModal(id) {
    document.getElementById(id).style.display = 'none';
    // Bersihkan form saat modal ditutup
    if (id === 'add-modal') {
        document.getElementById('addTestnetForm').reset();
    }
}

// =========================================================
// 3. AUTENTIKASI (LOGIN & REGISTRASI)
// =========================================================

/** Mengalihkan antara form Login dan Register */
function toggleAuthMode(toRegister) {
    const loginBox = document.getElementById('login-box-container');
    const registerBox = document.getElementById('register-box-container');
    if (toRegister) {
        loginBox.classList.add('hidden');
        registerBox.classList.remove('hidden');
    } else {
        loginBox.classList.remove('hidden');
        registerBox.classList.add('hidden');
    }
}

/** Menangani Registrasi Pengguna */
function handleRegister(email, password) {
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            // Simpan profil dasar ke Firestore
            return db.collection("users").doc(user.uid).set({
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .then(() => {
            alert("Registrasi Berhasil! Anda otomatis masuk.");
        })
        .catch((error) => {
            alert("Error Registrasi: " + error.message);
        });
}

/** Menangani Login Pengguna */
function handleLogin(email, password) {
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            alert("Login Berhasil!");
        })
        .catch((error) => {
            alert("Error Login: " + error.message);
        });
}

/** Menangani Logout Pengguna */
function handleLogout() {
    auth.signOut().then(() => {
        alert("Anda telah logout.");
    }).catch((error) => {
        console.error("Logout Error:", error);
    });
}

/** Memperbarui Navigasi berdasarkan status login */
function updateNavUI(isLoggedIn) {
    const authLink = document.getElementById('auth-nav-link');
    if (isLoggedIn) {
        authLink.innerText = 'Logout';
        authLink.setAttribute('onclick', 'handleLogout()');
        authLink.setAttribute('data-target', 'home'); 
    } else {
        authLink.innerText = 'Login / Register';
        authLink.removeAttribute('onclick');
        authLink.setAttribute('data-target', 'auth');
    }
}

// =========================================================
// 4. FIREBASE CRUD (TESTNET)
// =========================================================

/** Memuat dan menampilkan daftar testnet (READ) */
function loadTestnetList(userId) {
    if (!userId) return;

    const listContainer = document.getElementById('testnet-list-container');
    if (!listContainer) return;

    // Real-time listener: data akan otomatis diperbarui di UI
    db.collection("testnets")
        .where("userId", "==", userId)
        .orderBy("lastUpdated", "desc")
        .onSnapshot((snapshot) => {
            listContainer.innerHTML = ''; // Kosongkan sebelum render

            if (snapshot.empty) {
                listContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 50px;">Belum ada proyek testnet ditambahkan. Klik "Tambah Proyek Baru".</p>';
            }

            snapshot.forEach((doc) => {
                const data = doc.data();
                const docId = doc.id;
                
                const iconMap = {
                    'Tier 1': 'fas fa-star',
                    'Tier 2': 'fas fa-rocket',
                    'Tier 3': 'fas fa-leaf'
                };
                const tierIcon = iconMap[data.fundingTier] || 'fas fa-layer-group';

                const cardHtml = `
                    <div class="testnet-card" data-id="${docId}" data-status="${data.isCompleted ? 'Selesai' : 'Aktif'}" data-tier="${data.fundingTier}">
                        <div class="card-header">
                            <h3><i class="fas fa-code-branch"></i> ${data.projectName}</h3>
                        </div>
                        <div class="link-info">
                            <a href="${data.documentationLink}" target="_blank" title="${data.documentationLink}"><i class="fas fa-external-link-alt"></i> Situs</a>
                        </div>
                        <div class="metrics">
                            <span><i class="${tierIcon}"></i> ${data.fundingTier}</span>
                        </div>
                        <div class="task-summary">
                            <span>${data.mainTask}</span>
                        </div>
                        <label class="task-item center-checkbox">
                            <input type="checkbox" data-doc-id="${docId}" ${data.isCompleted ? 'checked' : ''}>
                        </label>
                        <button class="secondary-btn edit-btn" data-doc-id="${docId}" onclick="openEditModal('${docId}')">Edit</button>
                    </div>
                `;
                listContainer.insertAdjacentHTML('beforeend', cardHtml);
            });
            setupListEventListeners();
        });
}

/** Menambahkan data testnet baru (CREATE) */
function handleAddTestnet(formData) {
    if (!currentUserId) return alert("Error: User tidak terautentikasi.");

    const newTestnetData = {
        projectName: formData.get('project-name'),
        documentationLink: formData.get('doc-link'),
        fundingTier: formData.get('tier'),
        mainTask: formData.get('main-task'),
        isCompleted: false, // Selalu false saat pertama kali ditambah
        userId: currentUserId,
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
    };

    db.collection("testnets").add(newTestnetData)
        .then(() => {
            alert("Proyek berhasil ditambahkan!");
            closeModal('add-modal');
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
            alert("Gagal menambahkan proyek: " + error.message);
        });
}

/** Memperbarui status selesai (UPDATE status) */
function toggleCompletionStatus(docId, newStatus) {
    db.collection("testnets").doc(docId).update({
        isCompleted: newStatus, 
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
    })
    .catch((error) => {
        console.error("Error updating status: ", error);
    });
}

/** Membuka modal edit dan mengisi data (READ by ID) */
async function openEditModal(docId) {
    try {
        const doc = await db.collection("testnets").doc(docId).get();
        if (!doc.exists) {
            alert("Dokumen tidak ditemukan!");
            return;
        }
        const data = doc.data();

        // Mengisi formulir edit
        document.getElementById('edit-doc-id').value = docId;
        document.getElementById('edit-project-name').value = data.projectName;
        document.getElementById('edit-doc-link').value = data.documentationLink;
        document.getElementById('edit-tier').value = data.fundingTier;
        document.getElementById('edit-main-task').value = data.mainTask;

        openModal('edit-modal');
    } catch (error) {
        console.error("Error getting document:", error);
    }
}

/** Menangani submit formulir Edit (UPDATE semua field) */
function handleEditTestnet(formData) {
    const docId = formData.get('doc-id');
    
    db.collection("testnets").doc(docId).update({
        projectName: formData.get('project-name'),
        documentationLink: formData.get('doc-link'),
        fundingTier: formData.get('tier'),
        mainTask: formData.get('main-task'),
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        alert("Proyek berhasil diperbarui!");
        closeModal('edit-modal');
    })
    .catch((error) => {
        console.error("Error updating document: ", error);
        alert("Gagal memperbarui proyek: " + error.message);
    });
}

/** Menghapus proyek (DELETE) */
function handleDeleteTestnet(docId) {
    if (!confirm("Apakah Anda yakin ingin menghapus proyek ini secara permanen?")) {
        return;
    }
    
    db.collection("testnets").doc(docId).delete()
        .then(() => {
            alert("Proyek berhasil dihapus.");
            closeModal('edit-modal');
        })
        .catch((error) => {
            console.error("Error removing document: ", error);
            alert("Gagal menghapus proyek: " + error.message);
        });
}


// =========================================================
// 5. EVENT LISTENERS UTAMA
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

    // --- A. NAVIGASI UTAMA ---
    document.querySelectorAll('.nav-menu a, .hero-section a[data-target]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.target.dataset.target;
            if (targetId) {
                // Tambahkan pengecekan jika mengklik Dashboard tanpa login
                if (targetId === 'dashboard' && !currentUserId) {
                    alert('Anda harus Login untuk mengakses Dashboard.');
                    showSection('auth');
                } else {
                    showSection(targetId);
                }
            }
        });
    });

    // --- B. AUTHENTIKASI ---
    
    // Toggle Login/Register
    document.getElementById('show-register').addEventListener('click', (e) => { e.preventDefault(); toggleAuthMode(true); });
    document.getElementById('show-login').addEventListener('click', (e) => { e.preventDefault(); toggleAuthMode(false); });
    
    // Form Login
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.elements['log-email'].value;
        const password = e.target.elements['log-password'].value;
        handleLogin(email, password);
    });

    // Form Register
    document.getElementById('register-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.elements['reg-email'].value;
        const password = e.target.elements['reg-password'].value;
        const confirmPassword = e.target.elements['confirm-password'].value;
        
        if (password !== confirmPassword) {
            alert("Konfirmasi password tidak cocok.");
            return;
        }
        handleRegister(email, password);
    });

    // --- C. MANAJEMEN TESTNET ---

    // Form Tambah Proyek
    document.getElementById('addTestnetForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        handleAddTestnet(formData);
    });

    // Form Edit Proyek
    document.getElementById('editTestnetForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        handleEditTestnet(formData);
    });
    
    // Tombol Hapus Proyek
    document.getElementById('delete-btn').addEventListener('click', (e) => {
        const docId = document.getElementById('edit-doc-id').value;
        handleDeleteTestnet(docId);
    });

    // Fungsi untuk Event Listeners pada List (Checkbox) yang dimuat dinamis
    function setupListEventListeners() {
        // Event Listener untuk Checkbox (update status)
        document.querySelectorAll('#testnet-list-container input[type="checkbox"]').forEach(checkbox => {
            checkbox.removeEventListener('change', handleCheckboxChange); // Hapus listener lama
            checkbox.addEventListener('change', handleCheckboxChange); // Tambahkan listener baru
        });
        // Tombol Edit sudah menggunakan onclick="openEditModal(docId)" di HTML injection
    }

    // Handler untuk perubahan status checkbox
    function handleCheckboxChange(e) {
        const docId = e.target.dataset.docId;
        const newStatus = e.target.checked;
        toggleCompletionStatus(docId, newStatus);
    }
    
    // --- D. STATUS AUTENTIKASI UTAMA ---
    auth.onAuthStateChanged((user) => {
        updateNavUI(!!user); // Update tombol Login/Logout
        
        if (user) {
            currentUserId = user.uid;
            console.log("User Logged In:", currentUserId);
            
            // Pindah ke Dashboard jika user baru login dari halaman auth
            if (document.getElementById('auth-section').classList.contains('active')) {
                showSection('dashboard');
            }
            
            loadTestnetList(currentUserId); // Muat data
        } else {
            currentUserId = null;
            console.log("User Logged Out");
            // Pindah ke Home jika user logout
            showSection('home');
        }
    });

    // Menutup modal jika mengklik di luar area modal
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = "none";
        }
    }
});