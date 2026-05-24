export default function Banner() {
    return (
        <div className="w-full bg-[#123f19] px-4 py-5 text-[#f4efe8]">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center text-sm font-semibold leading-tight sm:text-base lg:text-lg">
                <span>Pre-Order Period Open</span>
                <span className="hidden text-[#d9d1c5] sm:inline">·</span>
                <span>May 9 - May 31, 2026</span>
                <span className="hidden text-[#d9d1c5] sm:inline">·</span>
                <span>Limited pieces available</span>
            </div>
        </div>
    );
}
