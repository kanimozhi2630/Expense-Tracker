const router = require('express').Router();
const Group = require('../models/Group');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const group = new Group({ ...req.body, createdBy: req.user.id, members: [req.user.id] });
    await group.save();
    
    // Create notification for creator
    await Notification.create({
      user: req.user.id,
      type: 'group_created',
      message: `You created group "${group.name}"`,
      groupId: group._id
    });
    
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user.id }).populate('members', 'name email');
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate('members', 'name email');
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const group = await Group.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/members', auth, async (req, res) => {
  try {
    console.log('Adding member to group:', req.params.id, 'userId:', req.body.userId);
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    if (!group.members.includes(req.body.userId)) {
      group.members.push(req.body.userId);
      await group.save();
      console.log('Member added successfully');
      
      // Create notification for new member
      await Notification.create({
        user: req.body.userId,
        type: 'group_created',
        message: `You were added to group "${group.name}"`,
        groupId: group._id
      });
    } else {
      console.log('Member already exists in group');
    }
    const updatedGroup = await Group.findById(req.params.id).populate('members', 'name email');
    res.json(updatedGroup);
  } catch (err) {
    console.error('Error adding member:', err);
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id/members/:memberId', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    group.members = group.members.filter(m => m.toString() !== req.params.memberId);
    await group.save();
    const updatedGroup = await Group.findById(req.params.id).populate('members', 'name email');
    res.json(updatedGroup);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Group.findByIdAndDelete(req.params.id);
    res.json({ message: 'Group deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
