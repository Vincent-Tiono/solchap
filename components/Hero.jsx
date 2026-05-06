'use client'

import Image from 'next/image'
import nenekImage from '@/assets/solchap_nenek.png'
import supportImage from '@/assets/solchap_support.png'

const Hero = () => {
    return (
        <section className="bg-[#f4efe8] text-slate-950">
            <div className="relative w-full flex justify-center overflow-hidden pl-0 pr-25 py-16 md:justify-end md:py-20 lg:min-h-[450px]">

                <Image
                    src={nenekImage}
                    alt="Woman weaving Kain Makna tenun"
                    priority
                    className="pointer-events-none absolute bottom-0 left-0 z-0 w-[240px] max-w-[50%] object-contain sm:w-[330px] md:w-[420px] lg:w-[500px] xl:w-[720px]"
                />
                <Image
                    src={supportImage}
                    alt="Support handcrafted fabrics from Indonesia"
                    priority
                    className="pointer-events-none absolute left-4 top-8 z-0 w-[180px] max-w-[20%] object-contain sm:left-8 sm:top-10 sm:w-[260px] md:left-14 md:top-14 md:w-[340px] lg:left-20 lg:top-16 lg:w-[420px]"
                />
                <div className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center md:items-end md:text-right">
                    <h1 className="text-[#b80b35]">
                        <span className="block text-xl font-semibold leading-none sm:text-xl lg:text-[4rem]">KAIN</span>
                        <span className="block text-xl font-semibold leading-none sm:text-xl lg:text-[4rem]">MAKNA</span>
                    </h1>

                    <div className="mt-8 max-w-2xl text-xl font-semibold leading-tight sm:text-2xl lg:text-xl">
                        <p>
                            <em className="text-[#b80b35]">"Kain Makna"</em> (meaning "Purpose") by Solar Chapter celebrates women's voices by showcasing their <em className="text-[#b80b35]">tenun heritage</em>.
                        </p>
                        <p className="mt-5">
                            Handwoven by women in NTT villages, each piece is crafted using traditional wooden looms passed down through generations. The creation of one <em>tenun</em> can take from a week to years, depending on material, pattern, and size.
                        </p>
                        <p className="mt-7 text-4xl font-semibold text-[#b80b35] sm:text-5xl">#Ayopakaikain</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
