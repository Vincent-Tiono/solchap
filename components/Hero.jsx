'use client'

import Image from 'next/image'
import nenekImage from '@/assets/solchap_nenek.png'
import supportImage from '@/assets/solchap_support.png'

const Hero = () => {
    return (
        <section className="bg-[#f4efe8] text-slate-950">
            <div className="relative w-full flex justify-center overflow-hidden px-4 py-16 min-[1000px]:justify-end min-[1000px]:py-20 min-[1000px]:pl-[380px] min-[1000px]:pr-8 lg:min-h-[450px] lg:pl-[520px] xl:pl-[620px] xl:pr-25 2xl:pl-0">

                <Image
                    src={nenekImage}
                    alt="Woman weaving Kain Makna tenun"
                    priority
                    className="pointer-events-none absolute bottom-0 right-0 z-0 w-[340px] max-w-[85%] object-contain opacity-30 min-[1000px]:left-0 min-[1000px]:right-auto min-[1000px]:w-[360px] min-[1000px]:max-w-[50%] min-[1000px]:opacity-100 lg:w-[500px] xl:w-[560px] 2xl:w-[720px]"
                />
                <Image
                    src={supportImage}
                    alt="Support handcrafted fabrics from Indonesia"
                    priority
                    className="pointer-events-none absolute left-4 top-8 z-0 hidden w-[180px] max-w-[20%] object-contain min-[1000px]:block min-[1000px]:left-14 min-[1000px]:top-14 min-[1000px]:w-[260px] lg:left-20 lg:top-16 lg:w-[340px] xl:w-[360px] 2xl:w-[420px]"
                />
                <div className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center min-[1000px]:max-w-[34rem] min-[1000px]:items-end min-[1000px]:text-right lg:max-w-2xl xl:max-w-[44rem] 2xl:max-w-4xl">
                    <h1 className="text-[#b80b35]">
                        <span className="inline text-3xl font-semibold leading-none min-[1000px]:block min-[1000px]:text-xl lg:text-[4rem]">KAIN</span>
                        <span className="ml-2 inline text-3xl font-semibold leading-none min-[1000px]:ml-0 min-[1000px]:block min-[1000px]:text-xl lg:text-[4rem]">MAKNA</span>
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
