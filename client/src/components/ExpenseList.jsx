import { motion } from "framer-motion";
import { Trash2, Pencil } from "lucide-react";


export default function ExpenseList({ expenses, onDelete, onEdit }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow mt-6">
      <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>

      {expenses.length === 0 ? (
        <p className="text-gray-500">No expenses yet</p>
      ) : (
        <div className="space-y-3">
          {expenses.map((e) => (
            <motion.div
              key={e._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-between items-center border p-3 rounded-lg"
            >
              <div>
                <p className="font-medium">{e.title}</p>
                <p className="text-sm text-gray-500">{e.category}</p>
              </div>

              <div className="flex items-center gap-4">
                <p className="font-semibold text-green-600">₹{e.amount}</p>

                {/* Delete Button  */}
                <button
                  onClick={() => onDelete(e._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>

                {/* Edit button */}
                <button
                  onClick={() => onEdit(e)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Pencil size={18} />
                </button>
              </div>

            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
