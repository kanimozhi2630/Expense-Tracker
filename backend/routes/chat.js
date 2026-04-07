const router = require('express').Router();
const Chat = require('../models/Chat');
const Group = require('../models/Group');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const chat = new Chat({ ...req.body, sender: req.user.id });
    await chat.save();
    const populatedChat = await Chat.findById(chat._id).populate('sender', 'name');
    
    // Create notifications for other group members
    const group = await Group.findById(req.body.group);
    const otherMembers = group.members.filter(m => m.toString() !== req.user.id);
    
    for (const memberId of otherMembers) {
      await Notification.create({
        user: memberId,
        type: 'new_message',
        message: `${populatedChat.sender.name}: ${req.body.message}`,
        groupId: group._id,
        groupName: group.name,
        chatMessage: req.body.message
      });
    }
    
    res.json(populatedChat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/group/:groupId', auth, async (req, res) => {
  try {
    const chats = await Chat.find({ 
      group: req.params.groupId,
      deletedFor: { $ne: req.user.id }
    }).populate('sender', 'name').sort({ timestamp: 1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const { deleteType } = req.query;
    if (deleteType === 'forMe') {
      const chat = await Chat.findById(req.params.id);
      if (!chat.deletedFor.includes(req.user.id)) {
        chat.deletedFor.push(req.user.id);
        await chat.save();
      }
    } else {
      await Chat.findByIdAndDelete(req.params.id);
    }
    res.json({ message: 'Chat deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
