import { useMemo, useState } from "react";

export interface SearchablePost {
	slug: string;
	title: string;
	description: string;
	pubDate: string;
	pubDateString: string;
	tags: string[];
}

interface BlogSearchListProps {
	title: string;
	posts: SearchablePost[];
	initialVisibleCount: number;
	totalPages: number;
	basePath: string;
}

const getPageHref = (basePath: string, page: number) => {
	return page === 1 ? basePath : `${basePath}/${page}`;
};

const getVisiblePageNumbers = (totalPages: number, currentPage: number) => {
	if (totalPages <= 3) {
		return Array.from({ length: totalPages }, (_, index) => index + 1);
	}

	if (currentPage <= 2) {
		return [1, 2, 3];
	}

	if (currentPage >= totalPages - 1) {
		return [totalPages - 2, totalPages - 1, totalPages];
	}

	return [currentPage - 1, currentPage, currentPage + 1];
};

export default function BlogSearchList({
	title,
	posts,
	initialVisibleCount,
	totalPages,
	basePath,
}: BlogSearchListProps) {
	const [query, setQuery] = useState("");

	const normalizedQuery = query.trim().toLowerCase();
	const currentPage = 1;
	const safeCurrentPage = Math.min(
		Math.max(currentPage, 1),
		Math.max(totalPages, 1)
	);
	const visiblePageNumbers = getVisiblePageNumbers(totalPages, safeCurrentPage);
	const showLeadingEllipsis = totalPages > 3 && visiblePageNumbers[0] > 1;
	const showTrailingEllipsis =
		totalPages > 3 && visiblePageNumbers[visiblePageNumbers.length - 1] < totalPages;

	const filteredPosts = useMemo(() => {
		if (!normalizedQuery) {
			return posts;
		}

		return posts.filter((post) =>
			`${post.title} ${post.description}`.toLowerCase().includes(normalizedQuery)
		);
	}, [normalizedQuery, posts]);

	const visiblePosts = normalizedQuery
		? filteredPosts
		: posts.slice(0, initialVisibleCount);
	const showNoResults = normalizedQuery.length > 0 && filteredPosts.length === 0;
	const defaultVisibleCount = Math.min(initialVisibleCount, posts.length);

	return (
		<section
			id="recent-posts"
			className="flex flex-col items-center justify-center w-[90%] md:w-[35%] m-auto mb-[100px]"
		>
			<h2 className="gradient-heading text-3xl text-center tracking-wide leading-[1.2] bg-gradient-to-r from-[#444] to-primary-dark-text dark:from-primary-dark-text dark:to-[#444] bg-clip-text text-transparent transition-all duration-75 mb-10">
				{title}
			</h2>

			<div className="w-full mb-5">
				<label htmlFor="blog-search" className="sr-only">
					Search posts by title or description
				</label>
				<input
					id="blog-search"
					type="search"
					placeholder="Search posts by title or description..."
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					className="w-full rounded-full border border-primary-dark-border/30 dark:border-primary-light-border/30 bg-transparent px-4 py-2 text-sm md:text-base outline-none focus:border-primary-dark dark:focus:border-primary-light"
				/>
			</div>

			<p aria-live="polite" className="w-full text-xs md:text-sm opacity-75 mb-3">
				{normalizedQuery
					? `${filteredPosts.length} result${filteredPosts.length === 1 ? "" : "s"}`
					: `Showing ${defaultVisibleCount} of ${posts.length} posts`}
			</p>

			<div className="flex flex-col items-center justify-center w-full gap-2">
				{visiblePosts.map((post) => (
					<article key={post.slug} className="w-full py-8">
						<div>
							<a className="flex items-start justify-between gap-4 mb-4" href={`/${post.slug}`}>
								<h3 className="text-base md:text-xl font-semibold leading-snug">{post.title}</h3>
								<time
									dateTime={post.pubDate}
									className="text-sm opacity-70 text-[var(--color-primary-light-text)] dark:text-[var(--color-primary-dark-text)] whitespace-nowrap"
								>
									{post.pubDateString}
								</time>
							</a>
						</div>

						<div className="flex flex-wrap gap-2 mb-6">
							{post.tags.map((tag) => (
								<span
									key={`${post.slug}-${tag}`}
									className="badge rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm border border-[var(--color-primary-light-border)] dark:border-[var(--color-primary-dark-border)] bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.07)] text-[var(--color-primary-dark)] dark:text-[var(--color-primary-light)] shadow-sm"
								>
									{tag}
								</span>
							))}
						</div>

						<div className="border-[0.5px] border-primary-dark-border/25 dark:border-primary-light-border/25 rounded-full w-full my-4" />

						<p className="mb-6 leading-relaxed opacity-90 text-sm md:text-base">
							{post.description}
						</p>

						<a
							href={`/${post.slug}`}
							className="inline-flex items-center gap-1 font-medium hover:underline text-primary-dark dark:text-primary-light text-sm md:text-base"
						>
							Read More →
						</a>
					</article>
				))}
			</div>

			{showNoResults && (
				<p aria-live="polite" className="w-full text-center text-sm md:text-base py-6 opacity-80">
					No posts found for "{query.trim()}".
				</p>
			)}

			{!normalizedQuery && totalPages > 1 && (
				<nav
					aria-label="Blog pagination"
					className="m-8 flex items-center justify-center gap-2 text-sm md:text-base"
				>
					<span
						aria-disabled="true"
						className="px-3 py-1 rounded-md border border-primary-dark-border/20 dark:border-primary-light-border/20 opacity-40 cursor-not-allowed"
					>
						←
					</span>

					{showLeadingEllipsis && <span className="px-1 opacity-60">...</span>}

					{visiblePageNumbers.map((page) =>
						page === safeCurrentPage ? (
							<span
								key={page}
								aria-current="page"
								className="px-3 py-1 rounded-md border border-primary-dark dark:border-primary-light font-semibold"
							>
								{page}
							</span>
						) : (
							<a
								key={page}
								href={getPageHref(basePath, page)}
								className="px-3 py-1 rounded-md border border-primary-dark-border/30 dark:border-primary-light-border/30 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
							>
								{page}
							</a>
						)
					)}

					{showTrailingEllipsis && <span className="px-1 opacity-60">...</span>}

					<a
						href={getPageHref(basePath, safeCurrentPage + 1)}
						aria-label="Next page"
						className="px-3 py-1 rounded-md border border-primary-dark-border/30 dark:border-primary-light-border/30 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
					>
						→
					</a>
				</nav>
			)}
		</section>
	);
}
