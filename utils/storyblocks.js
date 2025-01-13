import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const STORYBLOCKS_PUBLIC_KEY = process.env.STORYBLOCKS_PUBLIC_KEY;
const STORYBLOCKS_PRIVATE_KEY = process.env.STORYBLOCKS_PRIVATE_KEY;
const STORYBLOCKS_PROJECT_ID = process.env.STORYBLOCKS_PROJECT_ID;
const STORYBLOCKS_USER_ID = process.env.STORYBLOCKS_USER_ID;

if (!STORYBLOCKS_PUBLIC_KEY || !STORYBLOCKS_PRIVATE_KEY)
  throw new Error("STORYBLOCKS_KEY is undefined");

function getHMAC(resource, expires) {
  const hmacBuilder = crypto.createHmac(
    "sha256",
    STORYBLOCKS_PRIVATE_KEY + expires
  );
  hmacBuilder.update(resource);
  const hmac = hmacBuilder.digest("hex");

  return hmac;
}

const searchImages = async function (query) {
  try {
    const baseUrl = "https://api.graphicstock.com";
    const resource = "/api/v2/images/search";
    const expires = Math.floor(Date.now() / 1000) + 100;
    const hmac = getHMAC(resource, expires);

    const url = `${baseUrl}${resource}?APIKEY=${STORYBLOCKS_PUBLIC_KEY}&keywords=${query}&safe_search=true&EXPIRES=${expires}&HMAC=${hmac}&user_id=${STORYBLOCKS_USER_ID}&project_id=${STORYBLOCKS_PROJECT_ID}`;
    const headers = {
      "Content-Type": "application/json",
    };

    const response = await fetch(url, { method: "GET", headers });
    if (response.ok) {
      const data = await response.json();
      const output = data?.results?.map((item) => ({
        image_ID: item.id,
        thumbnails: item.thumbnail_url,
        preview: item.preview_url,
        title: item.title,
        source: "Storyblocks",
        tags: [],
      }));
      return output;
    } else {
      const message = await response.text();
      console.log(`Error: ${message}`);
      return [];
    }
  } catch (err) {
    console.log(`Fetch Storyblocks api error: ${err}`);
    return [];
  }
};

export { searchImages };
