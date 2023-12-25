import React from "react";
import Link from "next/link";
const Navbar = () => {
  return (
    <nav>
      <div>
        <Link href="/login">Login</Link>
        <Link href="/">Homepage</Link>
        <Link href="/signup">signup</Link>
      </div>
    </nav>
  );
};

export default Navbar;
