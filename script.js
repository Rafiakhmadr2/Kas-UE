// Format angka menjadi Rupiah
function formatRupiah(angka) {
    return "Rp " + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Menghapus angka '0' saat input di-klik (agar mudah diketik)
document.querySelectorAll('.input-box').forEach(input => {
    input.addEventListener('focus', function() { 
        if (this.value === '0' || this.value === '') {
            this.value = ''; 
        }
    });
});

// Fitur Scan Kamera (Simulasi membaca angka dari nota)
function prosesScan(event) {
    if(event.target.files.length > 0) {
        const statusText = document.getElementById('statusScan');
        statusText.innerText = "Membaca nota... ⏳";
        statusText.style.color = "#DAA520";
        
        setTimeout(() => {
            let totalA = parseInt(document.getElementById('inputTotalA').value) || 0;
            // Jika Uang Fisik kosong, kita beri angka acak, jika ada isinya, kita buat sama
            let angkaSimulasi = totalA > 0 ? totalA : 150000;
            
            document.getElementById('inputTotalB').value = angkaSimulasi;
            statusText.innerText = "Angka berhasil diambil! ✦";
            statusText.style.color = "#DAA520";
        }, 1500);
    }
}

// Validasi sebelum membuat laporan
function validasiDanPindah() {
    const totalA = parseInt(document.getElementById('inputTotalA').value) || 0;
    const totalB = parseInt(document.getElementById('inputTotalB').value) || 0;
    const areaInvestigasi = document.getElementById('area-investigasi');
    const catatan = document.getElementById('inputCatatan').value;
    const barang = document.getElementById('inputBarang').value;

    if (totalA === 0 && totalB === 0) {
        alert("Isi dulu nominal uangnya ya!");
        return;
    }

    if (totalA !== totalB && areaInvestigasi.style.display === "none") {
        areaInvestigasi.style.display = "block";
        document.getElementById('btnProses').innerText = "✦ Simpan Alasan & Bikin Laporan ✦";
        areaInvestigasi.scrollIntoView({ behavior: 'smooth' });
        return; 
    }

    if (totalA !== totalB && catatan.trim() === "") {
        alert("Tulis alasannya dulu di kotak merah ya!");
        return;
    }

    buatLaporan(totalA, totalB, barang, catatan);
}

// Memproses dan memunculkan Halaman 2 (Laporan)
function buatLaporan(totalA, totalB, barang, catatan) {
    document.getElementById('halaman-input').style.display = 'none';
    document.getElementById('halaman-laporan').style.display = 'block';

    const selisih = Math.abs(totalA - totalB);
    
    // Waktu saat ini
    const waktuSekarang = new Date().toLocaleString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    document.getElementById('lapWaktu').innerText = waktuSekarang;
    
    document.getElementById('lapTotalA').innerText = formatRupiah(totalA);
    document.getElementById('lapTotalB').innerText = formatRupiah(totalB);
    document.getElementById('lapCatatan').innerText = catatan || "Semua aman, tidak ada selisih uang.";

    // Munculkan barang di laporan jika ada
    const rowBarang = document.getElementById('rowBarang');
    if (barang.trim() !== "") {
        rowBarang.style.display = "flex";
        document.getElementById('lapBarang').innerText = barang;
    } else {
        rowBarang.style.display = "none";
    }

    // Status Selisih
    const statusElement = document.getElementById('lapStatus');
    const selisihElement = document.getElementById('lapSelisih');
    
    if (totalA === totalB) {
        statusElement.innerText = "PAS & COCOK ✦";
        statusElement.className = "status-badge bg-sukses";
        selisihElement.innerText = "Rp 0 (Aman)";
        selisihElement.style.color = "#DAA520";
    } else {
        const jenisSelisih = totalA > totalB ? "LEBIH (Fisik > POS)" : "KURANG (Fisik < POS)";
        statusElement.innerText = `TIDAK PAS: ${jenisSelisih}`;
        statusElement.className = "status-badge bg-error";
        selisihElement.innerText = formatRupiah(selisih);
        selisihElement.style.color = "#ef4444"; 
    }
    
    // Scroll kembali ke atas
    window.scrollTo(0, 0);
}