const PaketWisata = require('../models/paketWisata.model');
const fs = require('fs');
const path = require('path');

exports.getAllPaketWisata = async (req, res) => {
  try {
    const { jenis, search, sort } = req.query;
    
    const paketWisata = await PaketWisata.findAll({
      jenis,
      search,
      sort
    });

    res.status(200).json({
      success: true,
      count: paketWisata.length,
      data: paketWisata
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data paket wisata',
      error: error.message
    });
  }
};
exports.getPaketWisataById = async (req, res) => {
  try {
    const paketWisata = await PaketWisata.findById(req.params.id);

    if (!paketWisata) {
      return res.status(404).json({
        success: false,
        message: 'Paket wisata tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      data: paketWisata
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data paket wisata',
      error: error.message
    });
  }
};

exports.createPaketWisata = async (req, res) => {
  try {
    const dataPaket = {
      ...req.body,
      image: req.file ? req.file.filename : 'default.jpg'
    };

    const insertId = await PaketWisata.create(dataPaket);
    const newPaket = await PaketWisata.findById(insertId);

    res.status(201).json({
      success: true,
      message: 'Paket wisata berhasil dibuat',
      data: newPaket
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    res.status(400).json({
      success: false,
      message: 'Gagal membuat paket wisata',
      error: error.message
    });
  }
};

exports.updatePaketWisata = async (req, res) => {
  try {
    const paketWisata = await PaketWisata.findById(req.params.id);

    if (!paketWisata) {
      return res.status(404).json({
        success: false,
        message: 'Paket wisata tidak ditemukan'
      });
    }

    if (req.file) {
      if (paketWisata.image !== 'default.jpg') {
        const oldImagePath = path.join(__dirname, '../../uploads/images', paketWisata.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      req.body.image = req.file.filename;
    }

    await PaketWisata.update(req.params.id, req.body);
    const updatedPaket = await PaketWisata.findById(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Paket wisata berhasil diupdate',
      data: updatedPaket
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Gagal mengupdate paket wisata',
      error: error.message
    });
  }
};

exports.deletePaketWisata = async (req, res) => {
  try {
    const paketWisata = await PaketWisata.findById(req.params.id);

    if (!paketWisata) {
      return res.status(404).json({
        success: false,
        message: 'Paket wisata tidak ditemukan'
      });
    }

    if (paketWisata.image !== 'default.jpg') {
      const imagePath = path.join(__dirname, '../../uploads/images', paketWisata.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await PaketWisata.delete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Paket wisata berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus paket wisata',
      error: error.message
    });
  }
};
