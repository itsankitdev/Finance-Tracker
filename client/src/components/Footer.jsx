import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-12"
    >
      <div className="bg-gradient-to-r from-green-700 via-green-600 to-green-500 text-white rounded-t-3xl shadow-inner">
        
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

          {/* 🔹 Brand Section */}
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold tracking-wide">
              Finance Dashboard
            </h2>
            <p className="text-sm text-green-100 mt-1">
              Track smarter. Spend wiser.
            </p>
          </div>

          {/* 🔹 Links Section */}
          <div className="flex justify-center gap-8 text-sm">
            {["Privacy", "Terms", "Contact"].map((item, index) => (
              <span
                key={index}
                className="relative cursor-pointer group"
              >
                {item}

                {/* underline animation */}
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
              </span>
            ))}
          </div>

          {/* 🔹 Right Section */}
          <div className="text-center md:text-right text-sm text-green-100">
            © {new Date().getFullYear()} All rights reserved
            <div className="mt-1 text-xs opacity-80">
              Built with React + Tailwind
            </div>
          </div>

        </div>

        {/* 🔹 Bottom subtle line */}
        <div className="h-[1px] bg-white/20 w-full"></div>

      </div>
    </motion.footer>
  );
}
