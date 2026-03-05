import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: 'images/',
    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() +
            '-' +
            Math.round(Math.random() * 1e9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    },
});

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(
            path.extname(file.originalname).toLowerCase(),
        );

        if (mimetype && extname) return cb(null, true);
        cb(new Error('Tylko obrazy są dozwolone!'));
    },
});
