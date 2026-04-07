const mongoose = require('mongoose');
require('dotenv').config();

const Group = require('./models/Group');
const Expense = require('./models/Expense');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const groups = await Group.find();
    
    for (const group of groups) {
      const expenses = await Expense.find({ group: group._id });
      const correctTotal = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      console.log(`Group: ${group.name}`);
      console.log(`Old totalSpent: ${group.totalSpent}`);
      console.log(`Correct totalSpent: ${correctTotal}`);
      
      group.totalSpent = correctTotal;
      await group.save();
      console.log('Fixed!\n');
    }
    
    console.log('All groups fixed!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
