import dotenv from "dotenv";
dotenv.config();

const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;
if (!PIXABAY_API_KEY) throw new Error("PIXABAY_API_KEY is undefined");

const searchImages = async function (query) {
  try {
    const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${query}&safesearch=true&pretty=true`;
    const headers = {
      "Content-Type": "application/json",
    };

    const response = await fetch(url, { method: "GET", headers });
    if (response.ok) {
      const data = await response.json();
      const output = data?.hits?.map((item) => ({
        image_ID: item.id,
        thumbnails: item.webformatURL,
        preview: item.previewURL,
        title: item.id,
        source: "Pixabay",
        tags: item.tags.split(", "),
      }));
      return output ? output : [];
    } else {
      const message = await response.text();
      console.log(`Error: ${message}`);
      return [];
    }
  } catch (err) {
    console.log(`Fetch Pixabay api error: ${err}`);
    return [];
  }
};

export { searchImages };
