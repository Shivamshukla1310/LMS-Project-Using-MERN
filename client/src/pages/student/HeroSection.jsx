import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const HeroSection = () => {
  const placeholders = [
    "Search for Web Development",
    "Search for Data Science",
    "Search for Graphic Design",
    "Search for Business Management",
    "Search for AI & Machine Learning",
    "Search for Cloud Computing",
  ]

  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % placeholders.length)
    }, 2000) // change every 2s
    return () => clearInterval(interval)
  }, [placeholders.length])

  return (
    <div className='relative bg-gradient-to-r from-rose-400 to-pink-200 
    dark:from-gray-950 dark:to-rose-900 py-8 px-6 text-center mt-15'>
      <div className='max-w-5xl mx-auto'>
        <h1 className='text-white text-4xl font-bold mb-1 mt-3'>
          Learning that matches your mood.
        </h1>
        <p className='text-gray-250 dark:text-gray-450 mb-6'>
          From curiosity to mastery — learn the way you feel today
        </p>

        {/* Search form */}
        <form
          action=""
          className='flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden max-w-xl mx-auto mb-8'
        >
          {/* Animate only the placeholder */}
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 1 }}
              animate={{ opacity: 2, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.6 }}
              className="flex-grow"
            >
              <Input
                type="text"
                placeholder={placeholders[index]}
                className='w-full border-none focus-visible:ring-0 px-6 py-3 
                text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent'
              />
            </motion.div>
          </AnimatePresence>

          <Button className='bg-rose-600 dark:bg-rose-700 text-white px-6 py-3 rounded-r-full hover:bg-rose-700 dark:hover:bg-rose-800'>
            Search
          </Button>
        </form>
        <Button className="bg-white dark:bg-gray-800 text-rose-600 rounded-full hover:bg-pink-100">Explore Courses</Button>
      </div>
    </div >
  )
}

export default HeroSection
