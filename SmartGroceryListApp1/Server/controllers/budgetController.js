
import Budget from '../models/budgetModel.js';

export const getBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({ user: req.user.id });

    if (!budget) {
      return res.status(200).json({ amount: 0 }); // Default if not set yet
    }

    res.json({ amount: budget.amount });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch budget.' });
  }
};

export const updateBudget = async (req, res) => {
  const { amount } = req.body;

  if (amount == null || isNaN(amount)) {
    return res.status(400).json({ message: 'Invalid budget amount' });
  }

  try {
    let budget = await Budget.findOne({ user: req.user.id });

    if (budget) {
      budget.amount = amount;
      await budget.save();
    } else {
      budget = await Budget.create({ user: req.user.id, amount });
    }

    res.json({ amount: budget.amount });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update budget.' });
  }
};
