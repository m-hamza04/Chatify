import Message from '../model/message.model';
import User from '../model/users.model';

export const getAllContacts = async (req, res) => {
    try {
        const loginUser = req.user._id;
        const filterUserId = await User.find({ _id: { $ne: loginUser } }).select("-password");
        res.status(200).json(filterUserId);
    } catch (error) {
        console.log('Error in getting all contacts');
        res.status(500).json('Internal Server Error', error);
    }
};

export const getMessageByUserId = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id: userToChatId } = req.params;
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        });
    } catch (error) {
        console.log('Error in getting messages loading');
        res.status(500).json('Internal Server Error', error);
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text, image: imageUrl,
        });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        console.log('Error in sending message');
        res.status(500).json('Internal Server Error', error);
    }
}

export const getChatPartners = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const messages = await Message.find({
            $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
        });
        const chatPartnerIds = [
            ...new Set(
                messages.map((msg) => {
                    msg.senderId.toString() === loggedInUserId.toString() ? msg.receiverId.toString() : msg.senderId.toString();
                })
            ),
        ];
        const chatPartners = await User.find({ _id: { $in: chatPartnerIds } }).select("-password")

        res.status(200).json(chatPartners);
    } catch (error) {

    }
}