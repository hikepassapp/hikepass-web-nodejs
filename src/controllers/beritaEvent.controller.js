const BeritaEvent = require('../models/beritaEvent.model');
const fs = require('fs');
const path = require('path');

exports.getAllBeritaEvent = async (req, res) => {
  try {
    const { jenis, search, penulis, sort } = req.query;
    
    const beritaEvent = await BeritaEvent.findAll({
      jenis,
      search,
      penulis,
      sort
    });

    res.status(200).json({
      success: true,
      count: beritaEvent.length,
      data: beritaEvent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data berita/event',
      error: error.message
    });
  }
};
exports.getBeritaEventById = async (req, res) => {
  try {
    const beritaEvent = await BeritaEvent.findById(req.params.id);

    if (!beritaEvent) {
      return res.status(404).json({
        success: false,
        message: 'Berita/Event tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      data: beritaEvent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data berita/event',
      error: error.message
    });
  }
};
exports.createBeritaEvent = async (req, res) => {
  try {
    const dataBerita = {
      ...req.body,
      image: req.file ? req.file.filename : 'default.jpg'
    };

    const insertId = await BeritaEvent.create(dataBerita);
    const newBerita = await BeritaEvent.findById(insertId);

    res.status(201).json({
      success: true,
      message: 'Berita/Event berhasil dibuat',
      data: newBerita
    });
  } catch (error) {
    // Hapus file yang diupload jika terjadi error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    res.status(400).json({
      success: false,
      message: 'Gagal membuat berita/event',
      error: error.message
    });
  }
};
exports.updateBeritaEvent = async (req, res) => {
  try {
    const beritaEvent = await BeritaEvent.findById(req.params.id);

    if (!beritaEvent) {
      return res.status(404).json({
        success: false,
        message: 'Berita/Event tidak ditemukan'
      });
    }
    
    if (req.file) {
      if (beritaEvent.image !== 'default.jpg') {
        const oldImagePath = path.join(__dirname, '../../uploads/images', beritaEvent.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      req.body.image = req.file.filename;
    }

    await BeritaEvent.update(req.params.id, req.body);
    const updatedBerita = await BeritaEvent.findById(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Berita/Event berhasil diupdate',
      data: updatedBerita
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Gagal mengupdate berita/event',
      error: error.message
    });
  }
};

exports.deleteBeritaEvent = async (req, res) => {
  try {
    const beritaEvent = await BeritaEvent.findById(req.params.id);

    if (!beritaEvent) {
      return res.status(404).json({
        success: false,
        message: 'Berita/Event tidak ditemukan'
      });
    }

    if (beritaEvent.image !== 'default.jpg') {
      const imagePath = path.join(__dirname, '../../uploads/images', beritaEvent.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await BeritaEvent.delete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Berita/Event berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus berita/event',
      error: error.message
    });
  }
};