import News from "./News";

const API_KEY = process.env.API_KEY;

export default async function FetchNews() {

    const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`, {
      cache: "no-store"
    });
    const data = await response.json();
    const news = data.articles;

  return (
    <News news={news}/>
  )
}
