export interface WebtoonData {
  title: string;
  url: string;
  thumbnailUrl: string;
  genre: string;
  author: string;
  likes: string;
  status: "ONGOING" | "COMPLETED";
}

export interface Episode {
  number: string;
  title: string;
  uploadDate: string;
  thumbnailUrl: string;
  likes: string;
  url: string;
}

export interface SuggestedWebtoon {
  title: string;
  url: string;
  thumbnailUrl: string;
  author: string;
  views: string;
}

export interface WebtoonDetails extends Omit<WebtoonData, "likes" | "status"> {
  rating: string;
  description: string;
  status: "ONGOING" | "COMPLETED"|"HAITUS";
  releaseDays: string[];
  views: string;
  subscribers: string;
  episodes: Episode[];
  suggestedWebtoons: SuggestedWebtoon[];
  authorDetail: Author;
}

export interface Author {
  auth: string;
  desc: string;
  writer: string;
  andesc: string;
  anwriter: string;
  authorProfile: string;
}

export interface IConversionLog {
  fileName: string;
  format: "docx" | "pdf" | "txt";
  convertedAt: Date;
}
