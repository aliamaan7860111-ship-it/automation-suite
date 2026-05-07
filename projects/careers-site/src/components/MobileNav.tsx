"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/** EOS-style mobile nav — hamburger expands to full-screen overlay. */
export function MobileNav() {
    const [open, setOpen] = useState(false);

    return (
        <div className="md:hidden flex items-center gap-3 relative z-10">
            {/* Hamburger dots (minimal) */}
            <button
                onClick={() => setOpen(!open)}
                className="w-12 h-12 flex flex-col items-center justify-center gap-[7px] z-[60]"
                aria-label="Toggle menu"
            >
                <motion.span
                    animate={open ? { rotate: 45, y: 9.5 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="block w-[28px] h-[2px] bg-white rounded-full"
                />
                <motion.span
                    animate={open ? { opacity: 0 } : { opacity: 1 }}
                    transition={{ duration: 0.15 }}
                    className="block w-[28px] h-[2px] bg-white rounded-full"
                />
                <motion.span
                    animate={open ? { rotate: -45, y: -9.5 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="block w-[28px] h-[2px] bg-white rounded-full"
                />
            </button>

            {/* Full-screen menu overlay */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-[55] bg-[#050508]/98 backdrop-blur-3xl"
                    >
                        <motion.nav
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 30 }}
                            transition={{ duration: 0.3, delay: 0.05 }}
                            className="flex flex-col items-center justify-center h-full gap-8"
                        >
                            {[
                                { href: "/", label: "Home" },
                                { href: "/about", label: "About" },
                                { href: "/careers", label: "Careers" },
                            ].map((link, i) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + i * 0.06 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        className="text-3xl font-bold text-white/80 hover:text-white transition-colors tracking-tight"
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}

                        </motion.nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
