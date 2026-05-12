'use client'

import Image from 'next/image'
import { League_Spartan, Montserrat } from 'next/font/google'
import { Heart, Sprout } from 'lucide-react'
import apacMap from '@/assets/apac_map_transparent.png'
import nenekImage from '@/assets/solchap_nenek.png'
import OurProducts from './OurProducts'

const leagueSpartan = League_Spartan({ subsets: ['latin'], weight: ['700'] })
const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '500', '600'] })

const Hero = () => {
    return (
        <>
            <section className="relative overflow-hidden border-t border-[#123f19] bg-[#f4efe8] text-[#484848]">
                <div className="relative mx-auto grid min-h-[520px] max-w-6xl items-center justify-items-center gap-8 px-6 py-10 sm:px-8 lg:grid-cols-[1fr_1fr] lg:justify-items-stretch lg:gap-12 lg:py-14">
                    <div className="mx-auto max-w-lg text-center lg:mx-0 lg:text-left">
                        <p className="mx-auto inline-flex items-center gap-3 rounded-full bg-[#123f19] px-5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#f4efe8] sm:text-sm lg:mx-0">
                            <span aria-hidden="true">🧵</span>
                            <span>Handcrafted from NTT, Indonesia</span>
                        </p>

                        <h1 className={`${leagueSpartan.className} mt-8 text-5xl font-bold leading-[0.95] text-[#a8232f] sm:text-6xl lg:text-7xl`}>
                            Kain
                            <span className="block">Makna</span>
                        </h1>

                        <p className={`${montserrat.className} mt-7 text-base font-semibold leading-loose sm:text-lg`}>
                            <em>"Kain Makna"</em> (meaning "Purpose") celebrates women's voices by showcasing their <em>tenun</em> heritage — handwoven using traditional wooden looms passed down through generations.
                        </p>

                        <p className="mt-8 font-serif text-2xl font-semibold italic text-[#4e8d2f] sm:text-3xl">
                            #Ayopakaikain
                        </p>
                    </div>

                    <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#432312]">
                            <Image
                                src={nenekImage}
                                alt="Woman weaving Kain Makna tenun"
                                priority
                                fill
                                sizes="(min-width: 1024px) 42vw, 90vw"
                                className="object-cover object-[80%_center]"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <OurProducts />

            <section className="bg-[#fbf8f3] text-[#484848]">
                <div className="relative mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:py-20">
                    <div className="max-w-6xl">
                        <p className="inline-flex items-center gap-3 rounded-full bg-[#e8f2df] px-5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#24551d] sm:text-sm">
                            <Sprout size={18} strokeWidth={2.25} />
                            About Solar Chapter APAC
                        </p>

                        <h2 className={`${leagueSpartan.className} mt-8 max-w-3xl text-3xl font-bold leading-tight text-[#173d1f] sm:text-4xl lg:text-5xl`}>
                            Clean water through
                            <span className="block">community &amp; purpose</span>
                        </h2>

                        <p className={`${montserrat.className} mt-7 max-w-6xl text-base font-semibold leading-loose text-[#4c4c4c] sm:text-lg`}>
                            Since 2017, Solar Chapter has brought clean water to underserved communities across Indonesia — building solar-powered systems that use renewable energy to deliver clean water to homes and farms, creating long-term impact.
                        </p>
                    </div>

                    <div className="mt-14 overflow-hidden rounded-2xl border border-[#e2dbcf] bg-[#f1ece4] shadow-[0_16px_45px_rgba(47,74,39,0.12)]">
                        <div className="grid lg:grid-cols-[1.00fr_1.00fr]">
                            <div className="relative min-h-[300px] overflow-hidden bg-[#f8fbf3] p-6 sm:min-h-[360px] sm:p-8 lg:min-h-[400px]">
                                <div className="absolute -left-[17%] top-[6%] h-[120%] w-[140%] overflow-hidden">
                                    <div className="absolute inset-x-0 top-0 h-full">
                                        <Image
                                            src={apacMap}
                                            alt="APAC map showing Solar Chapter APAC regions"
                                            fill
                                            sizes="(min-width: 1024px) 610px, 92vw"
                                            className="object-contain object-top opacity-90"
                                        />
                                    </div>
                                </div>

                                <p className="relative z-10 text-xs font-semibold uppercase tracking-widest text-[#24551d] sm:text-sm">APAC Footprint</p>

                                {/* <span className="absolute left-[54%] top-[18%] z-10 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-[#24551d] shadow-md sm:text-sm">📍 Korea</span>
                                <span className="absolute left-[39%] top-[28%] z-10 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-[#24551d] shadow-md sm:text-sm">📍 China</span>
                                <span className="absolute left-[53%] top-[39%] z-10 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-[#24551d] shadow-md sm:text-sm">📍 Taiwan</span>
                                <span className="absolute left-[45%] top-[48%] z-10 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-[#24551d] shadow-md sm:text-sm">📍 Hong Kong</span>
                                <span className="absolute left-[25%] top-[58%] z-10 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-[#24551d] shadow-md sm:text-sm">📍 Indonesia</span>
                                <span className="absolute left-[35%] top-[67%] z-10 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-[#24551d] shadow-md sm:text-sm">📍 Singapore</span>
                                <span className="absolute left-[13%] top-[77%] z-10 rounded-full bg-[#123f19] px-3 py-1.5 text-[11px] font-semibold text-[#f4efe8] shadow-md sm:text-sm">📍 West Lakekun, NTT</span> */}
                            </div>

                            <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
                                <p className="font-serif text-2xl font-bold leading-tight text-[#4e8d2f] sm:text-3xl">Solar Chapter APAC</p>
                                <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-[#4c4c4c] sm:text-sm">Six Regions, One Mission</p>
                                <p className="mt-7 text-sm font-semibold leading-loose text-[#4c4c4c] sm:text-base">
                                    Youth volunteers across APAC unite to support clean water systems communities can own and maintain.
                                </p>

                                <div className="mt-9 grid gap-4 text-sm font-semibold leading-loose text-[#4c4c4c] sm:text-base">
                                    <p>💧 West Lakekun, NTT — current clean water focus</p>
                                    <p>🙋‍♀️ Indonesia, Singapore, China, Hong Kong, Taiwan &amp; Korea</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#f4efe8] text-[#484848]">
                <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-20">
                    <div>
                        <p className="inline-flex items-center gap-2 rounded-full bg-[#fde7e7] px-5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#a8232f] sm:text-sm">
                            <Heart size={15} fill="currentColor" strokeWidth={0} />
                            Why Your Purchase Matters
                        </p>

                        <h2 className={`${leagueSpartan.className} mt-9 max-w-3xl text-3xl font-bold leading-tight text-[#a8232f] sm:text-4xl lg:text-5xl`}>
                            Every thread carries
                            <span className="block">a story — and a purpose</span>
                        </h2>

                        <div className="mt-10 grid gap-8">
                            <div className="border-l-2 border-[#a8232f] pl-8">
                                <h3 className="font-serif text-2xl font-semibold italic text-[#123f19]">
                                    The Mamas of NTT
                                </h3>
                                <p className={`${montserrat.className} mt-4 max-w-xl text-sm font-semibold leading-loose sm:text-base`}>
                                    During our journey in East Nusa Tenggara, we met the women we call "Mamas" — who support their families by hand-weaving <em>kain tenun</em>. Each piece carries stories, prayers, and traditions passed down through generations.
                                </p>
                            </div>

                            <div className="border-l-2 border-[#a8232f] pl-8">
                                <h3 className="font-serif text-2xl font-semibold italic text-[#123f19]">
                                    The Challenge They Face
                                </h3>
                                <p className={`${montserrat.className} mt-4 max-w-xl text-sm font-semibold leading-loose sm:text-base`}>
                                    Many communities in NTT still struggle with access to clean water, with women and children carrying the heaviest burden — walking hours each day for water that may not even be safe.
                                </p>
                            </div>

                            {/* <div className="border-l-2 border-[#a8232f] pl-8">
                                <h3 className="font-serif text-2xl font-semibold italic text-[#123f19]">
                                    What You're Funding
                                </h3>
                                <p className="mt-4 max-w-xl text-sm font-semibold leading-loose sm:text-base">
                                    Every <em>kain tenun</em> purchase directly funds the 2026 Water for Lakekun Barat program — sustainable, solar-powered water systems that communities can own and maintain themselves.
                                </p>
                            </div> */}
                        </div>
                    </div>

                    <div className="self-end rounded-3xl bg-[#123f19] p-8 text-[#f4efe8] sm:p-10 lg:p-12">
                        <p className="font-serif text-2xl font-semibold italic leading-tight sm:text-3xl">
                            Your purchase journey
                        </p>
                        <p className="mt-4 text-sm font-bold uppercase tracking-widest text-[#b9cdae] sm:text-base">
                            #WaterForLakekunBarat
                        </p>

                        <div className="mt-8 divide-y divide-[#315f35]">
                            {[
                                'You buy a Kain Makna — a handwoven piece from a Mama of NTT',
                                '100% of proceeds support Water for Lakekun Barat 2026',
                                'Solar Chapter builds solar-powered water systems in NTT villages',
                                'Families gain clean water access — owned and run by the community',
                            ].map((step, index) => (
                                <div className="grid grid-cols-[3.25rem_1fr] gap-4 py-6 first:pt-0 last:pb-0" key={step}>
                                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#4e8d2f] text-base font-bold text-[#f4efe8]">
                                        {index + 1}
                                    </span>
                                    <p className={`${montserrat.className} text-sm font-semibold leading-relaxed text-[#d6e5cd] sm:text-base`}>
                                        {step}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Hero
