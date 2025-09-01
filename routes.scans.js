const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const PDFDocument = require('pdfkit');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload scan (Technician only)
router.post('/upload', authMiddleware(['Technician']), upload.single('scan'), async (req, res) => {
  const { patient_name, patient_id, scan_type, region } = req.body;
  const file = req.file;

  if (!file) return res.status(400).json({ message: 'No file uploaded' });

  try {
    const result = await cloudinary.uploader.upload_stream({ resource_type: 'image' }, async (err, uploaded) => {
      if (err) return res.status(500).json({ message: 'Upload failed' });

      const upload_date = new Date().toISOString();
      db.run(`INSERT INTO scans (patient_name, patient_id, scan_type, region, image_url, upload_date) VALUES (?, ?, ?, ?, ?, ?)`,
        [patient_name, patient_id, scan_type, region, uploaded.secure_url, upload_date],
        function(err) {
          if (err) return res.status(500).json({ message: err.message });
          res.json({ message: 'Scan uploaded successfully', scanId: this.lastID });
        });
    });
    file.stream.pipe(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all scans (Dentist only)
router.get('/', authMiddleware(['Dentist']), (req, res) => {
  db.all('SELECT * FROM scans ORDER BY upload_date DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

// Generate PDF for a scan
router.get('/pdf/:id', authMiddleware(['Dentist']), (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM scans WHERE id = ?', [id], (err, scan) => {
    if (!scan) return res.status(404).json({ message: 'Scan not found' });

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=scan_${scan.id}.pdf`);

    doc.fontSize(20).text(`Patient Name: ${scan.patient_name}`);
    doc.fontSize(16).text(`Patient ID: ${scan.patient_id}`);
    doc.text(`Scan Type: ${scan.scan_type}`);
    doc.text(`Region: ${scan.region}`);
    doc.text(`Upload Date: ${scan.upload_date}`);
    doc.moveDown();
    doc.image(scan.image_url, { fit: [400, 400] });
    doc.pipe(res);
    doc.end();
  });
});

module.exports = router;
