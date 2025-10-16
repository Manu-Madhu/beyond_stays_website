import React from 'react'
import Button from '../ui/Button'

const HeroSection = () => {
  return (
    <div className=' md:min-h-screen w-full h-full overflow-x-hidden'>
      <div className="container flex flex-col gap-6 md:gap-10 items-center justify-center h-full ">
        <h1 className='uppercase text-center font-[800] leading-[50px] md:leading-[92px] text-[50px] md:text-[100px]'>Discover Your Adventure</h1>
        <Button title="Adventure With Us" link='/' className='border-2' />
      </div>
    </div>
  )
}

export default HeroSection
