import { motion } from "framer-motion";
import { Wallet, Code2, Globe, Mail } from "lucide-react";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative mt-16 z-10"
    >
      {/* Top fade bridge from page bg into footer */}
      <div
        className="h-10 w-full"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(109,40,217,0.12))",
        }}
      />

      <div
        style={{
          background:
            "linear-gradient(135deg, #6d28d9 0%, #7c3aed 45%, #4f46e5 100%)",
        }}
      >
        {/* Glass inner container */}
        <div
          className="max-w-5xl mx-auto px-6 py-8"
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="p-1.5 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.18)" }}
                >
                  <Wallet size={18} className="text-white" />
                </div>
                <span className="text-white font-bold text-base tracking-wide">
                  Finance<span className="text-violet-200">Tracker</span>
                </span>
              </div>
              <p className="text-violet-200 text-sm leading-relaxed">
                Track smarter. Spend wiser.
                <br />
                Your personal finance companion.
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-col items-center gap-3">
              <p className="text-violet-200 text-xs font-semibold uppercase tracking-widest mb-1">
                Links
              </p>
              {["Privacy", "Terms", "Contact"].map((item) => (
                <span
                  key={item}
                  className="relative text-white/80 hover:text-white text-sm cursor-pointer transition-colors group"
                >
                  {item}
                  <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-violet-300 transition-all duration-300 group-hover:w-full rounded-full" />
                </span>
              ))}
            </div>

            {/* Right — socials + credit */}
            <div className="flex flex-col items-center md:items-end gap-4">
              {/* Social icons */}
              <div className="flex items-center gap-3">
                {[
                  { icon: <Code2 size={16} />, label: "Code2" },
                  { icon: <Globe size={16} />, label: "Globe" },
                  { icon: <Mail  size={16} />, label: "Mail" },
                ].map(({ icon, label }) => (
                  <motion.button
                    key={label}
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={label}
                    className="p-2 rounded-xl text-white/80 hover:text-white transition-colors"
                    style={{
                      background: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.18)",
                    }}
                  >
                    {icon}
                  </motion.button>
                ))}
              </div>

              <p className="text-violet-200 text-xs text-right">
                © {new Date().getFullYear()} All rights reserved
              </p>
              <p className="text-violet-300/70 text-xs">
                Built with React + Tailwind
              </p>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div
          className="h-[1px] w-full"
          style={{ background: "rgba(255,255,255,0.12)" }}
        />
        <div
          className="py-2 text-center text-xs"
          style={{
            color: "rgba(221,214,254,0.6)",
            background: "rgba(0,0,0,0.08)",
          }}
        >
          Made with ♥ by Ankit
        </div>
      </div>
    </motion.footer>
  );
}