import About from '@/components/About';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Nav from '@/components/Nav';
import React from 'react'

const styles = `
  @keyframes scanline {
    0% { top: -2px; }
    100% { top: 100%; }
  }
  @keyframes float1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(20px, -30px) scale(1.05); }
  }
  @keyframes float2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(-25px, 20px) scale(0.95); }
  }
  @keyframes shimmer {
    0% { background-position: 0% center; }
    100% { background-position: 200% center; }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
`;

const Landing = () => {
  return (
    <>
    <style> {styles} </style>
    <div className='bg-black min-h-screen font-sans'>
        <Nav/>
        <Hero />
        <About/>
        <Footer/>
    </div>
    </>
  )
}

export default Landing