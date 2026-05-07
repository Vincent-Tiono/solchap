'use client'

import Image from 'next/image'
import nenekImage from '@/assets/solchap_nenek.png'
import supportImage from '@/assets/solchap_support.png'

const Hero = () => {
    return (
        <section className="bg-[#f4efe8] text-slate-950">
            <div className="relative w-full flex justify-center overflow-hidden px-4 py-16 sm:pl-0 sm:pr-6 md:justify-end md:py-20 md:pl-[380px] md:pr-8 lg:min-h-[450px] lg:pl-[520px] xl:pl-[620px] xl:pr-25 2xl:pl-0">

                <Image
                    src={nenekImage}
                    alt="Woman weaving Kain Makna tenun"
                    priority
                    className="pointer-events-none absolute bottom-0 right-0 z-0 w-[340px] max-w-[85%] object-contain opacity-30 sm:left-0 sm:right-auto sm:w-[300px] sm:max-w-[50%] sm:opacity-100 md:w-[360px] lg:w-[500px] xl:w-[560px] 2xl:w-[720px]"
                />
                <Image
                    src={supportImage}
                    alt="Support handcrafted fabrics from Indonesia"
                    priority
                    className="pointer-events-none absolute left-4 top-8 z-0 hidden w-[180px] max-w-[20%] object-contain sm:block sm:left-8 sm:top-10 sm:w-[220px] md:left-14 md:top-14 md:w-[260px] lg:left-20 lg:top-16 lg:w-[340px] xl:w-[360px] 2xl:w-[420px]"
                />
                <div className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center md:max-w-[34rem] md:items-end md:text-right lg:max-w-2xl xl:max-w-[44rem] 2xl:max-w-4xl">
                    <h1 className="text-[#b80b35]">
                        <span className="inline text-3xl font-semibold leading-none sm:block sm:text-xl lg:text-[4rem]">KAIN</span>
                        <span className="ml-2 inline text-3xl font-semibold leading-none sm:ml-0 sm:block sm:text-xl lg:text-[4rem]">MAKNA</span>
                    </h1>

                    <div className="mt-8 max-w-2xl text-base font-semibold leading-tight sm:text-lg lg:text-xl">
                        <p>
                            <em className="text-[#b80b35]">"Kain Makna"</em> (meaning "Purpose") by Solar Chapter celebrates women's voices by showcasing their <em className="text-[#b80b35]">tenun heritage</em>.
                        </p>
                        <p className="mt-5">
                            Handwoven by women in NTT villages, each piece is crafted using traditional wooden looms passed down through generations. The creation of one <em>tenun</em> can take from a week to years, depending on material, pattern, and size.
                        </p>
                        <p className="mt-7 text-3xl font-semibold text-[#b80b35] sm:text-4xl lg:text-5xl">#Ayopakaikain</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
