"use client";
import { useThemeStore } from '@/store/useThemeStore';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import styles from './Portfolio.module.css';
export function ThemeControl(){
 const {theme,toggleTheme}=useThemeStore();
 const [mounted,setMounted]=useState(false);useEffect(()=>setMounted(true),[]);
 const label=mounted&&theme==='dark'?'Switch to day mode':'Switch to night mode';
 return <button disabled={!mounted} className={styles.themeControl} aria-label={label} title={label} onClick={toggleTheme}>{mounted&&theme==='dark'?<Sun size={18} aria-hidden="true"/>:<Moon size={18} aria-hidden="true"/>}</button>;
}
