export interface Episode {
  number: string;
  title: string;
  uploadDate: string;
  thumbnailUrl: string;
  url: string;
  likes: any;
}

export interface SuggestedWebtoon {
  title: string;
  url: string;
  thumbnailUrl: string;
  author: string;
  views: string;
}

export interface WebtoonData {
  title: string;
  url: string;
  thumbnailUrl: string;
  genre: string;
  author: string;
  likes: any;
  status: "ONGOING" | "COMPLETED" | "HIATUS";
}

export interface Author {
  authorProfile: string;
  auth: string;
  desc: string;
  writer: string;
  andesc: string;
  anwriter: string;
}

export interface WebtoonDetails extends Omit<WebtoonData, "likes"> {
  authorDetail: Author;
  rating: number;
  description: string;
  releaseDays: string[];
  views: number;
  subscribers: number;
  episodes: Episode[];
  suggestedWebtoons: SuggestedWebtoon[];
}

export interface TrackingInfo {
  lastEpisode: string;
  lastUpdateDate: string;
}
