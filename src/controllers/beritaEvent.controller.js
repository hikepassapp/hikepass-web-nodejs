const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const fs = require('fs');
const path = require('path');

// GET ALL
exports.getAllBeritaEvent = async (req, res) => {
  try {
    const { jenis, search, penulis, sort } = req.query;

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

    if (penulis) {
      where.penulis = {
        contains: penulis
      };
    }

    let orderBy = { tanggal_publish: 'desc' };

    if (sort === 'terlama') {
      orderBy = { tanggal_publish: 'asc' };
    } else if (sort === 'judul') {
      orderBy = { judul: 'asc' };
    }

    const beritaEvent = await prisma.beritaEvent.findMany({
      where,
      orderBy
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

// GET BY ID
exports.getBeritaEventById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const beritaEvent = await prisma.beritaEvent.findUnique({
      where: { id }
    });

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

// CREATE
exports.createBeritaEvent = async (req, res) => {
  try {
    const data = {
      ...req.body,
      image: req.file ? req.file.filename : 'default.jpg'
    };

    const newBerita = await prisma.beritaEvent.create({
      data: {
        judul: data.judul,
        jenis: data.jenis,
        tanggal_publish: data.tanggalPublish,
        penulis: data.penulis,
        deskripsi: data.deskripsi,
        image: data.image
      }
    });

    res.status(201).json({
      success: true,
      message: 'Berita/Event berhasil dibuat',
      data: newBerita
    });
  } catch (error) {
    // rollback file
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(400).json({
      success: false,
      message: 'Gagal membuat berita/event',
      error: error.message
    });
  }
};

// UPDATE
exports.updateBeritaEvent = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const beritaEvent = await prisma.beritaEvent.findUnique({
      where: { id }
    });

    if (!beritaEvent) {
      return res.status(404).json({
        success: false,
        message: 'Berita/Event tidak ditemukan'
      });
    }

    let image = beritaEvent.image;

    if (req.file) {
      if (image && image !== 'default.jpg') {
        const oldPath = path.join(__dirname, '../../uploads/images', image);

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      image = req.file.filename;
    }

    const updated = await prisma.beritaEvent.update({
      where: { id },
      data: {
        judul: req.body.judul,
        jenis: req.body.jenis,
        tanggal_publish: req.body.tanggalPublish,
        penulis: req.body.penulis,
        deskripsi: req.body.deskripsi,
        image
      }
    });

    res.status(200).json({
      success: true,
      message: 'Berita/Event berhasil diupdate',
      data: updated
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Gagal mengupdate berita/event',
      error: error.message
    });
  }
};

// DELETE
exports.deleteBeritaEvent = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const beritaEvent = await prisma.beritaEvent.findUnique({
      where: { id }
    });

    if (!beritaEvent) {
      return res.status(404).json({
        success: false,
        message: 'Berita/Event tidak ditemukan'
      });
    }

    // delete image
    if (beritaEvent.image && beritaEvent.image !== 'default.jpg') {
      const imagePath = path.join(__dirname, '../../uploads/images', beritaEvent.image);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await prisma.beritaEvent.delete({
      where: { id }
    });

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