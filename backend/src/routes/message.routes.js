import express from 'express';
import authentification from '../../middleware/authentication';
import arcjetProtection from '../../middleware/arcjet.middleware';
const router = express.Router();

router.use(arcjetProtection, authentification);

router.get('/', getAllContacts);
router.get('/:id', getMessageByUserId);
router.get('/chats', getChatPartners);
router.post('/send/:id', sendMessage);