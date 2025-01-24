export const BASE_URL = "https://www.webtoons.com";

export const SELECTORS = {
  // Selectors for webtoon cards on the originals page
  webtoonCard: ".card_lst li > a",
  cardTitle: ".subj",
  cardThumbnail: ".img_info img",
  cardGenre: ".genre",
  cardAuthor: ".author",
  cardLikes: ".grade_num",

  // Selectors for webtoon details page
  title: ".detail_header .subj",
  author: ".detail_header .author",
  genre: ".detail_header .genre",
  rating: ".detail_header .grade_num",
  description: ".detail_body .summary",
  thumbnail: ".detail_header .thmb img",
  releaseDays: ".detail_header .day_info",

  // Selectors for episode list
  episodeList: "#_listUl li",
  episodeNumber: ".episode_num",
  episodeTitle: ".episode_title",
  uploadDate: ".date",
  episodeThumbnail: ".thmb img",
  likes: ".like_area .like_num",

  // Selector for next page button
  nextPageButton: ".paginate .next",
};
