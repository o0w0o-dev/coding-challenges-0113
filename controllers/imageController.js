"use strict";

import * as pixabay from "../utils/pixabay.js";
import * as storyblocks from "../utils/storyblocks.js";
import * as unsplash from "../utils/unsplash.js";

const searchImages = async (req, res, next) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid query",
    });
  }

  const fulfilled = await Promise.all([
    pixabay.searchImages(query),
    storyblocks.searchImages(query),
    unsplash.searchImages(query),
  ]);

  const data = [...fulfilled[0], ...fulfilled[1], ...fulfilled[2]];

  res.status(200).json({
    status: "success",
    data,
  });
};

export { searchImages };
