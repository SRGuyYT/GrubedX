import { HomeContent } from "@/components/home/HomeContent";
import { getServerMediaPage, getTrendingHero } from "@/lib/tmdb/server";

export const revalidate = 300;

export default async function HomePage() {
  const [hero, popularMovies, popularTv, topRatedMovies] = await Promise.all([
    getTrendingHero(),
    getServerMediaPage({ mediaType: "movie", category: "popular" }),
    getServerMediaPage({ mediaType: "tv", category: "popular" }),
    getServerMediaPage({ mediaType: "movie", category: "top_rated" }),
  ]);

  return <HomeContent hero={hero.results} popularMovies={popularMovies.results} popularTv={popularTv.results} topRatedMovies={topRatedMovies.results} />;
}
