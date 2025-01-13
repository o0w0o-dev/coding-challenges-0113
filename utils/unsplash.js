import dotenv from "dotenv";
dotenv.config();

const UNSPLASH_API_KEY = process.env.UNSPLASH_API_KEY;
if (!UNSPLASH_API_KEY) throw new Error("UNSPLASH_API_KEY is undefined");

const searchImages = async function (query) {
  try {
    const url = `https://api.unsplash.com/search/photos?query=${query}`;
    const headers = {
      "Accept-Version": "v1",
      "Content-Type": "application/json",
      Authorization: `Client-ID ${UNSPLASH_API_KEY}`,
    };

    const response = await fetch(url, { method: "GET", headers });
    if (response.ok) {
      const data = await response.json();
      const output = data?.results?.map((item) => ({
        image_ID: item.id,
        thumbnails: item.urls.thumb,
        preview: item.urls.regular,
        title: item.description,
        source: "Unsplash",
        tags: [],
      }));
      return output;
    } else {
      const message = await response.text();
      console.log(`Error: ${message}`);
      return [];
    }
  } catch (err) {
    console.log(`Fetch Unsplash api error: ${err}`);
    return [];
  }
};

export { searchImages };
