"use client";
import { useRouter } from "next/navigation";
import styles from "../styles/page.module.css";
import Navbar from "@/components/Navbar";
import React, { useEffect } from "react";
import Homepage from "@/components/Homepage";
import { useAppSelector } from "@/redux/providers";

const Home: React.FC = () => {
  const router = useRouter();
  const isAuth = useAppSelector((store) => store.auth.isAuth);

  useEffect(() => {
    if (!isAuth) {
      router.push("/login");
    }
  }, [isAuth]);

  return (
    <main className={styles.main}>
      <Homepage />
    </main>
  );
};

export default Home;
