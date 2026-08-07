'use client'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { League_Spartan } from 'next/font/google'

const leagueSpartan = League_Spartan({ subsets: ['latin'], weight: ['700'] })

const Title = ({ title, description, visibleButton = true, href = '' }) => {

    return (
        <div className='flex flex-col items-center'>
            <h2 className={`${leagueSpartan.className} text-2xl font-bold text-[#173d1f]`}>{title}</h2>
            <Link href={href} className='flex items-center gap-5 text-sm text-[#6b6255] mt-2'>
                <p className='max-w-lg text-center'>{description}</p>
                {visibleButton && <span className='text-[#468025] flex items-center gap-1 font-semibold'>View more <ArrowRight size={14} /></span>}
            </Link>
        </div>
    )
}

export default Title
