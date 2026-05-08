'use client'
import BestSelling from "@/components/BestSelling";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import OurSpecs from "@/components/OurSpec";
import OurProducts from "@/components/OurProducts";

export default function Home() {
    return (
        <div>
            <Hero />
            <section className="px-6 mt-12 mb-10 max-w-6xl mx-auto">
                <a
                    href="/shop"
                    className="mx-auto flex w-fit flex-row items-center gap-x-3 rounded-3xl border border-slate-200 px-4 py-2 text-sm shadow-sm transition-all hover:shadow-md"
                >
                    <span className="relative flex items-center justify-center">
                        <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full border border-green-400 bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400"></span>
                    </span>

                    <p className="text-base font-medium text-slate-800 sm:text-lg">Pre-Order Period: May 9 &ndash; May 23, 2026</p>
                </a>
            </section>
            <OurProducts />
            {/* <BestSelling /> */}
            {/* <OurSpecs /> */}
            {/* <Newsletter /> */}
        </div>
    );
}
