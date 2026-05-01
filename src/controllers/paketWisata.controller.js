const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const fs = require('fs');
const path = require('path');

// GET ALL
exports.getAllPaketWisata = async (req, res) => {
  try {
    const { jenis, search, sort } = req.query;

    const where = {};

    if (jenis) {
      where.jenis = jenis;
    }

    if (search) {
      where.OR = [
        { judul: { contains: search } },
        { deskripsi: { contains: search } }
      ];
    }

    let orderBy = { tanggal: 'asc' };

    if (sort === 'terbaru') {
      orderBy = { created_at: 'desc' };
    } else if (sort === 'biaya') {
      orderBy = { biaya: 'asc' };
    }

    const paketWisata = await prisma.paketWisata.findMany({
      where,
      orderBy
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

// GET BY ID
exports.getPaketWisataById = async (req, res) => {
  try {
    const paketWisata = await prisma.paketWisata.findUnique({
      where: { id: Number(req.params.id) }
    });

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

// CREATE
exports.createPaketWisata = async (req, res) => {
  try {
    const data = {
      ...req.body,
      image: req.file ? req.file.filename : 'default.jpg'
    };

    const newPaket = await prisma.paketWisata.create({
      data: {
        judul: data.judul,
        jenis: data.jenis,
        tanggal: data.tanggal,
        biaya: Number(data.biaya),
        titik_kumpul: data.titikKumpul,
        waktu: data.waktu,
        kontak: data.kontak,
        deskripsi: data.deskripsi,
        image: data.image,
        guide: data.guide
      }
    });

    res.status(201).json({
      success: true,
      message: 'Paket wisata berhasil dibuat',
      data: newPaket
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(400).json({
      success: false,
      message: 'Gagal membuat paket wisata',
      error: error.message
    });
  }
};

// UPDATE
exports.updatePaketWisata = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const paketWisata = await prisma.paketWisata.findUnique({
      where: { id }
    });

    if (!paketWisata) {
      return res.status(404).json({
        success: false,
        message: 'Paket wisata tidak ditemukan'
      });
    }

    // HANDLE IMAGE
    let image = paketWisata.image;

    if (req.file) {
      if (image && image !== 'default.jpg') {
        const oldPath = path.join(__dirname, '../../uploads/images', image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      image = req.file.filename;
    }

    const updated = await prisma.paketWisata.update({
      where: { id },
      data: {
        ...req.body,
        biaya: req.body.biaya ? Number(req.body.biaya) : undefined,
        image
      }
    });

    res.status(200).json({
      success: true,
      message: 'Paket wisata berhasil diupdate',
      data: updated
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Gagal mengupdate paket wisata',
      error: error.message
    });
  }
};

// DELETE
exports.deletePaketWisata = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const paketWisata = await prisma.paketWisata.findUnique({
      where: { id }
    });

    if (!paketWisata) {
      return res.status(404).json({
        success: false,
        message: 'Paket wisata tidak ditemukan'
      });
    }

    // DELETE IMAGE
    if (paketWisata.image && paketWisata.image !== 'default.jpg') {
      const imagePath = path.join(__dirname, '../../uploads/images', paketWisata.image);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await prisma.paketWisata.delete({
      where: { id }
    });

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