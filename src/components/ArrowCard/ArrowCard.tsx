interface ArrowCardProps {
  title: string;
  slug: string;
}

export const ArrowCard = ({ title, slug }: ArrowCardProps) => {

  return <a href={`/blog/${slug}`} className="relative group flex flex-wrap sm:flex-nowrap py-2 sm:py-3 px-3 sm:px-4 pr-8 sm:pr-10 rounded-lg border border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white transition-colors duration-300 ease-in-out">
    <div className="flex flex-col flex-1 min-w-0">
      <div className="font-semibold text-sm sm:text-base line-clamp-1">
        {title}
      </div>
    </div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="absolute top-1/2 right-2 -translate-y-1/2 size-4 sm:size-5 stroke-2 fill-none stroke-current">
      <line x1="5" y1="12" x2="19" y2="12" className="translate-x-3 group-hover:translate-x-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out" />
      <polyline points="12 5 19 12 12 19" className="-translate-x-1 group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
    </svg>
  </a>;
};