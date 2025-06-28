import React from 'react';
import Image from 'next/image'; 

const Footer = () => {
  return (
    <footer className="text-center py-4 flex flex-col items-center justify-center space-y-2 bg-white mt-40 border-1 border-gray-200 "> 
      <p>Built with Bolt.new</p>
      <a
        href="https://bolt.new/"
        target="_blank" 
        rel="noopener noreferrer" 
        className="inline-block" 
      >
        <Image
          src="/logotext_poweredby_360w.png"
          className='border-8 bg-black rounded-xl' 
          alt="Powered by Bolt.new"
          width={120} 
          height={30} 
        />
      </a>
    </footer>
  );
};

export default Footer;