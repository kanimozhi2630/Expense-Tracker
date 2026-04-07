const router = require('express').Router();
const Expense = require('../models/Expense');
const Group = require('../models/Group');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const expense = new Expense({ ...req.body, paidBy: req.user.id });
    await expense.save();

    const group = await Group.findById(req.body.group);
    group.totalSpent += parseFloat(req.body.amount);
    await group.save();

    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/group/:groupId', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ group: req.params.groupId }).populate('paidBy', 'name');
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    const group = await Group.findById(expense.group);
    group.totalSpent -= expense.amount;
    await group.save();
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
