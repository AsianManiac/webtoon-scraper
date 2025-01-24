import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

interface Toon {
  id: number;
  url: string;
  title: string;
  author: string;
  genre: string;
  rating: string;
  description: string;
  thumbnailUrl: string;
  heroImage: string;
  coverImage: string;
  status: string;
  releaseDays: string;
  views: string;
  subscribers: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Chapter {
  id: number;
  chapterNumber: number;
  status: "PENDING" | "IN_PROGRESS" | "PAUSED" | "COMPLETED" | "ERROR";
  downloadedImages: number;
  totalImages: number;
  download: Download;
}

interface Download {
  id: number;
  downloadId: string;
  webtoonId: string;
  status: "PENDING" | "IN_PROGRESS" | "PAUSED" | "COMPLETED" | "ERROR";
  currentChapter: number;
  totalChapters: number;
  createdAt: Date;
  updatedAt: Date;
  webtoon: Toon;
}

interface ToonDetails {
  id: number;
  title: string;
  thumbnailUrl: string;
  description: string;
  author: string;
  genre: string;
  status: string;
}

const ToonDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [toon, setToon] = useState<ToonDetails | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchToonDetails();
    fetchChapters();
  }, [id]);

  const fetchToonDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8001/api/downloads/toons/${id}`
      );
      setToon(response.data);
    } catch (error) {
      console.error("Error fetching toon details:", error);
      setError("Failed to fetch toon details. Please try again.");
      toast.error("Error fetching toon details", {
        description: "Failed to fetch toon details. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchChapters = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8001/api/downloads/toon/${id}/chapters`
      );
      setChapters(response.data);
    } catch (error) {
      console.error("Error fetching chapters:", error);
      toast.error("Error fetching chapters", {
        description: "Failed to fetch chapters. Please try again.",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-start space-x-6">
          <Skeleton className="w-48 h-64" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        </div>
        <Skeleton className="h-8 w-1/4" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!toon) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <MaxWidthWrapper>
        <div className="flex items-start space-x-6">
          <img
            //   src={toon.thumbnailUrl || "/placeholder.svg"}
            src={"/placeholder.svg"}
            alt={toon.title}
            className="w-48 h-auto object-cover rounded-lg shadow-lg"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {toon.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
              {toon.description}
            </p>
            <div className="mt-4 space-y-2">
              <p>
                <strong>Author:</strong>{" "}
                {toon.author
                  .replace("author info", "")
                  .replace("...", "")
                  .trim()}
              </p>
              <p>
                <strong>Genre:</strong> {toon.genre}
              </p>
              <div>
                <strong>Status:</strong>{" "}
                <Badge
                  className={`px-2 py-1 rounded-full text-xs ${
                    toon.status === "COMPLETED"
                      ? "bg-green-500 text-white"
                      : toon.status === "IN_PROGRESS"
                      ? "bg-blue-500 text-white"
                      : toon.status === "ERROR"
                      ? "bg-red-500 text-white"
                      : "bg-gray-500 text-white"
                  }`}
                >
                  {toon.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-3">
          Chapters
        </h2>
        <ScrollArea className="h-[calc(100vh-24rem)]">
          <div className="space-y-4">
            {chapters.map((chapter) => (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Link to={`/toon/${id}/chapter/${chapter.id}`}>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">
                          Chapter {chapter.chapterNumber}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            chapter.status === "COMPLETED"
                              ? "bg-green-500 text-white"
                              : chapter.status === "IN_PROGRESS"
                              ? "bg-blue-500 text-white"
                              : chapter.status === "ERROR"
                              ? "bg-red-500 text-white"
                              : "bg-gray-500 text-white"
                          }`}
                        >
                          {chapter.status}
                        </span>
                      </div>
                      {chapter.status === "IN_PROGRESS" && (
                        <div className="mt-2">
                          <progress
                            value={chapter.downloadedImages}
                            max={chapter.totalImages}
                            className="w-full"
                          />
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {chapter.downloadedImages} / {chapter.totalImages}{" "}
                            images
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </MaxWidthWrapper>
    </motion.div>
  );
};

export default ToonDetails;
