const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

app.post('/send-mail', upload.single('pdf'), async (req, res) => {
    const { email } = req.body;
    const file = req.file;

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'your_email@gmail.com',
            pass: 'your_app_password'  // Use Gmail App Password
        }
    });

    const mailOptions = {
        from: 'neeshu8795@gmail.com',
        to: email,
        subject: 'PDF Document',
        text: 'Please find attached PDF.',
        attachments: [
            {
                filename: file.originalname,
                path: file.path
            }
        ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
        fs.unlink(file.path, () => {}); // delete file after sending
        if (error) {
            console.error(error);
            return res.status(500).send('Failed to send email.');
        }
        res.send('Email sent!');
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));
