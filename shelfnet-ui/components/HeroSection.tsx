export default function HeroSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="flex min-h-[80] flex-col items-center justify-center gap-8 text-center">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-black tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Discover, Read, Connect.
          </h1>
          <h2 className="mx-auto max-w-2xl text-base font-normal text-gray-600 dark:text-slate-400 md:text-lg">
            ShelfNet is a community for book lovers to find new books and share
            their thoughts.
          </h2>
        </div>
        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center rounded-lg h-12 px-5 bg-primary text-white text-base font-bold tracking-wide transition-colors hover:bg-primary/90">
          Join the community
        </button>
      </div>
    </section>
  );
}
