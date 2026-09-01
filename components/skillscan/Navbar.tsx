"use client";

import Link from "next/link";

const Navbar = () => {
  return (
    <div className="mb-8 flex justify-end">
      <Link href="/skillscan/upload" className="btn-primary w-fit">
        Upload Resume
      </Link>
    </div>
  );
};

export default Navbar;
