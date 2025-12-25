const db = require('../config/database');

class BeritaEvent {
  static async findAll(filters = {}) {
    let query = 'SELECT * FROM berita_event WHERE 1=1';
    const params = [];

    if (filters.jenis) {
      query += ' AND jenis = ?';
      params.push(filters.jenis);
    }

    if (filters.search) {
      query += ' AND (judul LIKE ? OR deskripsi LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }
    if (filters.penulis) {
      query += ' AND penulis LIKE ?';
      params.push(`%${filters.penulis}%`);
    }

    if (filters.sort === 'terbaru') {
      query += ' ORDER BY tanggal_publish DESC';
    } else if (filters.sort === 'terlama') {
      query += ' ORDER BY tanggal_publish ASC';
    } else if (filters.sort === 'judul') {
      query += ' ORDER BY judul ASC';
    } else {
      query += ' ORDER BY tanggal_publish DESC';
    }

    const [rows] = await db.execute(query, params);
    return rows;
  }
  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM berita_event WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async create(data) {
    const query = `
      INSERT INTO berita_event 
      (judul, jenis, tanggal_publish, penulis, deskripsi, image)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.execute(query, [
      data.judul,
      data.jenis,
      data.tanggalPublish,
      data.penulis,
      data.deskripsi,
      data.image
    ]);

    return result.insertId;
  }

  static async update(id, data) {
    const fields = [];
    const values = [];

    Object.keys(data).forEach(key => {
      if (data[key] !== undefined) {
        const dbKey = key === 'tanggalPublish' ? 'tanggal_publish' : key;
        fields.push(`${dbKey} = ?`);
        values.push(data[key]);
      }
    });

    if (fields.length === 0) {
      throw new Error('Tidak ada data untuk diupdate');
    }

    values.push(id);
    const query = `UPDATE berita_event SET ${fields.join(', ')} WHERE id = ?`;
    
    const [result] = await db.execute(query, values);
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await db.execute(
      'DELETE FROM berita_event WHERE id = ?',
      [id]
    );
    return result.affectedRows;
  }
}

module.exports = BeritaEvent;