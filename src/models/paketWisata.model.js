const db = require('../config/database');

class PaketWisata {
  static async findAll(filters = {}) {
    let query = 'SELECT * FROM paket_wisata WHERE 1=1';
    const params = [];

    if (filters.jenis) {
      query += ' AND jenis = ?';
      params.push(filters.jenis);
    }

    if (filters.search) {
      query += ' AND (judul LIKE ? OR deskripsi LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.sort === 'terbaru') {
      query += ' ORDER BY created_at DESC';
    } else if (filters.sort === 'biaya') {
      query += ' ORDER BY biaya ASC';
    } else {
      query += ' ORDER BY tanggal ASC';
    }

    const [rows] = await db.execute(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM paket_wisata WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async create(data) {
    const query = `
      INSERT INTO paket_wisata 
      (judul, jenis, tanggal, biaya, titik_kumpul, waktu, kontak, deskripsi, image, guide)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.execute(query, [
      data.judul,
      data.jenis,
      data.tanggal,
      data.biaya,
      data.titikKumpul,
      data.waktu,
      data.kontak,
      data.deskripsi,
      data.image,
      data.guide
    ]);

    return result.insertId;
  }

  static async update(id, data) {
    const fields = [];
    const values = [];

    Object.keys(data).forEach(key => {
      if (data[key] !== undefined) {
        const dbKey = key === 'titikKumpul' ? 'titik_kumpul' : key;
        fields.push(`${dbKey} = ?`);
        values.push(data[key]);
      }
    });

    if (fields.length === 0) {
      throw new Error('Tidak ada data untuk diupdate');
    }

    values.push(id);
    const query = `UPDATE paket_wisata SET ${fields.join(', ')} WHERE id = ?`;
    
    const [result] = await db.execute(query, values);
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.execute(
      'DELETE FROM paket_wisata WHERE id = ?',
      [id]
    );
    return result.affectedRows;
  }
}

module.exports = PaketWisata;