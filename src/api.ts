const API_KEY = "cc8420233ac5f72514887650d025cf6a";
const BASE_PATH = "https://api.themoviedb.org/3";
const LANGUAGE_REGION = "language=ko-KR&page=1&region=kr";

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetMovies {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface ITv {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
}

export interface IGetTvs {
  page: number;
  results: ITv[];
  total_pages: number;
  total_results: number;
}

export async function getMovies() {
  const response = await fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&${LANGUAGE_REGION}`
  );
  return await response.json();
}

export async function getPopMovies() {
  const data = await (
    await fetch(
      `${BASE_PATH}/movie/popular?api_key=${API_KEY}&${LANGUAGE_REGION}`
    )
  ).json();
  return data;
}

export async function getTopMovies() {
  const data = await (
    await fetch(
      `${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&${LANGUAGE_REGION}`
    )
  ).json();
  return data;
}

export async function getPopTv() {
  const data = await (
    await fetch(
      `${BASE_PATH}/tv/popular?api_key=${API_KEY}&language=ko-KR&page=1`
    )
  ).json();
  return data;
}

export async function getTopTv() {
  const data = await (
    await fetch(
      `${BASE_PATH}/tv/top_rated?api_key=${API_KEY}&language=ko-KR&page=1`
    )
  ).json();
  return data;
}

export async function getNowTv() {
  const data = await (
    await fetch(
      `${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}&language=ko-KR&page=1`
    )
  ).json();
  return data;
}
