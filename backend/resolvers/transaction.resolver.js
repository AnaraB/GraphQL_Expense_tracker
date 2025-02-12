import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";

const transactionResolver = {
  Query: {
    transactions: async (_, __, context) => {
      try {
        // console.log('from transactions', context);
        if (!context.getUser()) throw new Error("Unauthorized");
        const userId = await context.getUser()._id;

        const transactions = await Transaction.find({ userId });
        return transactions;
      } catch (err) {
        console.error("Error getting transactions:", err);
        throw new Error("Error getting transactions");
      }
    },
    transaction: async (_, { transactionId }) => {
      try {
        const transaction = await Transaction.findById(transactionId);
        return transaction;
      } catch (err) {
        console.error("Error getting transaction:", err);
        throw new Error("Error getting transaction");
      }
    },

    categoryStatistics: async (_, args, context) => {
      try {
        //console.log("Context in categoryStatistics:", context); // Check what's available

        const userId = await context.getUser()._id;

        //get all transactions of one user by userId
        const transactions = await Transaction.find({ userId });
        const categoryMap = {};
        // const transactions = [
        // 	{ category: "expense", amount: 50 },
        // 	{ category: "expense", amount: 75 },
        // 	{ category: "investment", amount: 100 },
        // 	{ category: "saving", amount: 30 },
        // 	{ category: "saving", amount: 20 }
        // ];

        transactions.forEach((transaction) => {
          //if category doesn't exist initialise it with value 0
          if (!categoryMap[transaction.category]) {
            categoryMap[transaction.category] = 0;
          }
          //if category exist then increment it by amount
          categoryMap[transaction.category] += transaction.amount;
          // categoryMap = { expense: 125, investment: 100, saving: 50 }
        });
        //return and convert categoryMap obj into an array
        //then map an array and destructure category and amount
        //then convert the categoryMap object into an array of [key, value] pairs.
        return Object.entries(categoryMap).map(([key, value]) => ({
          category: key,
          totalAmount: value,
        }));
        // return [ { category: "expense", totalAmount: 125 }, { category: "investment", totalAmount: 100 }, { category: "saving", totalAmount: 50 } ]
      } catch (err) {
        console.error("Error getting category statistics:", err);
        throw new Error("Error getting category statistics");
      }
    },
  },
  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        const user = await context.getUser();
        if (!user) {
          throw new Error("User is not authenticated");
        }
        const newTransaction = new Transaction({
          ...input,
          userId: user._id,
        });

        await newTransaction.save();
        return newTransaction;
      } catch (err) {
        console.error("Error creating transaction:", err);
        throw new Error("Error creating transaction");
      }
    },
    updateTransaction: async (_, { input }) => {
      try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
          input.transactionId,
          input,
          {
            new: true,
          }
        );
        return updatedTransaction;
      } catch (err) {
        console.error("Error updating transaction:", err);
        throw new Error("Error updating transaction");
      }
    },
    deleteTransaction: async (_, { transactionId }) => {
      try {
        const deletedTransaction = await Transaction.findByIdAndDelete(
          transactionId
        );
        return deletedTransaction;
      } catch (err) {
        console.error("Error deleting transaction:", err);
        throw new Error("Error deleting transaction");
      }
    },
  },
  //Relationship with User
  Transaction: {
    user: async (parent) => {
      const userId = parent.userId;
      try {
        const user = await User.findById(userId);
        return user;
      } catch (err) {
        console.error("Error getting user:", err);
        throw new Error("Error getting user");
      }
    },
  },
};

export default transactionResolver;
