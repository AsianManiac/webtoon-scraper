"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWebSocket } from "@/contexts/websocket-context";
import { cn } from "@/lib/utils";
import axios from "axios";
import { ArrowLeft, Check, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";

interface DownloadedChapter {
  id: number;
  chapterNumber: number;
  chapterImage: string | null;
  totalImages: number;
  downloadedImages: number;
  status: "PENDING" | "IN_PROGRESS" | "PAUSED" | "COMPLETED" | "ERROR";
}

interface Webtoon {
  id: number;
  title: string;
  thumbnailUrl: string;
}

interface DownloadedToon {
  id: number;
  downloadId: string;
  status: "PENDING" | "IN_PROGRESS" | "PAUSED" | "COMPLETED" | "ERROR";
  webtoon: Webtoon;
  downloadChapters: DownloadedChapter[];
  currentChapter: number | null;
  totalChapters: number | null;
}

interface ChapterContent {
  chapterNumber: number;
  webtoonTitle: string;
  images: string[];
}

const DownloadedToons: React.FC = () => {
  const [downloadedToons, setDownloadedToons] = useState<DownloadedToon[]>([]);
  const [selectedToon, setSelectedToon] = useState<DownloadedToon | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<ChapterContent | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { downloadProgress, pauseDownload, resumeDownload } = useWebSocket();

  useEffect(() => {
    fetchDownloadedToons();
    const interval = setInterval(fetchDownloadedToons, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Update downloadedToons with real-time progress
    setDownloadedToons((prevToons) =>
      prevToons.map((toon) => {
        const progress = downloadProgress[toon.downloadId];
        if (progress) {
          return {
            ...toon,
            status: progress.status,
            downloadChapters: toon.downloadChapters.map((chapter) =>
              chapter.chapterNumber === progress.chapter
                ? {
                    ...chapter,
                    downloadedImages: progress.downloadedImages,
                    totalImages: progress.totalImages,
                    status: progress.status,
                  }
                : chapter
            ),
          };
        }
        return toon;
      })
    );
  }, [downloadProgress]);

  const fetchDownloadedToons = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8001/api/downloads/downloaded-toons"
      );
      setDownloadedToons(response.data);
    } catch (error) {
      console.error("Error fetching downloaded toons:", error);
    }
  };

  const openChapter = async (webtoonId: number, chapterId: number) => {
    try {
      const response = await axios.get(
        `http://localhost:8001/api/downloads/chapter-contents/${webtoonId}/${chapterId}`
      );
      setSelectedChapter(response.data);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching chapter contents:", error);
    }
  };

  const handlePauseResume = (downloadId: string, status: string) => {
    if (status === "IN_PROGRESS") {
      pauseDownload(downloadId);
    } else if (status === "PAUSED") {
      resumeDownload(downloadId);
    }
  };

  const ChapterRow: React.FC<{
    chapter: DownloadedChapter;
    webtoonId: number;
    downloadId: string;
    onClick: () => void;
  }> = ({ chapter, webtoonId, downloadId, onClick }) => {
    const progress = (chapter.downloadedImages / chapter.totalImages) * 100;
    console.log(webtoonId);

    return (
      <div className="group relative flex items-center gap-4 p-4 hover:bg-gray-800/50 rounded-lg cursor-pointer transition-colors">
        <div className="relative min-w-[48px] h-12" onClick={onClick}>
          {chapter.chapterImage ? (
            <img
              src={"/placeholder.svg"}
              alt={`Chapter ${chapter.chapterNumber}`}
              className="w-12 h-12 object-cover rounded-md"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-700 rounded-md flex items-center justify-center">
              Ch {chapter.chapterNumber}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0" onClick={onClick}>
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-gray-200">
              Chapter {chapter.chapterNumber}
            </span>
            <span className="text-sm text-gray-400">
              {chapter.downloadedImages}/{chapter.totalImages}
            </span>
          </div>
          <div className="relative h-2 rounded-full bg-gray-700 overflow-hidden">
            <div
              className={cn(
                "absolute left-0 h-full transition-all duration-300",
                chapter.status === "COMPLETED"
                  ? "bg-green-500"
                  : chapter.status === "IN_PROGRESS"
                  ? "bg-orange-500"
                  : chapter.status === "PAUSED"
                  ? "bg-yellow-500"
                  : chapter.status === "ERROR"
                  ? "bg-red-500"
                  : "bg-gray-600"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {chapter.status === "IN_PROGRESS" || chapter.status === "PAUSED" ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handlePauseResume(downloadId, chapter.status)}
            >
              {chapter.status === "IN_PROGRESS" ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
          ) : (
            <div className="w-8 flex items-center justify-center">
              {chapter.status === "COMPLETED" && (
                <Check className="w-5 h-5 text-green-500" />
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const ToonCard: React.FC<{
    toon: DownloadedToon;
    onClick: () => void;
  }> = ({ toon, onClick }) => {
    const completedChapters = toon.downloadChapters.filter(
      (ch) => ch.status === "COMPLETED"
    ).length;
    const totalProgress =
      (toon.downloadChapters.reduce(
        (acc, chapter) => acc + chapter.downloadedImages / chapter.totalImages,
        0
      ) /
        toon.downloadChapters.length) *
      100;

    return (
      <div
        className="flex flex-col md:flex-row items-start gap-4 p-4 hover:bg-gray-800/50 rounded-lg cursor-pointer transition-colors"
        onClick={onClick}
      >
        <img
          src={"/placeholder.svg"}
          alt={toon.webtoon.title}
          className="w-full md:w-24 h-32 md:h-24 object-cover rounded-lg"
        />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-gray-100 text-lg truncate">
              {toon.webtoon.title}
            </h3>
            <span
              className={cn(
                "px-2 py-1 rounded-full text-xs",
                toon.status === "COMPLETED"
                  ? "bg-green-500/20 text-green-500"
                  : toon.status === "IN_PROGRESS"
                  ? "bg-orange-500/20 text-orange-500"
                  : "bg-gray-500/20 text-gray-500"
              )}
            >
              {toon.status.toLowerCase()}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>
              {completedChapters}/{toon.downloadChapters.length} Chapters
            </span>
            <span>•</span>
            <span>{totalProgress.toFixed(1)}% Complete</span>
          </div>
          <Progress value={totalProgress} className="h-2" />
        </div>
      </div>
    );
  };

  return (
    <Card className="border-0 shadow-none bg-gray-900 text-gray-100">
      <CardHeader className="flex flex-row items-center justify-between space-x-4 pb-2 border-b border-gray-800">
        <div className="flex items-center gap-2">
          {selectedToon && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-gray-100"
              onClick={() => setSelectedToon(null)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <CardTitle className="text-xl">
            {selectedToon ? selectedToon.webtoon.title : "Downloaded Toons"}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="p-4 space-y-4">
            {!selectedToon
              ? downloadedToons.map((toon) => (
                  <ToonCard
                    key={toon.id}
                    toon={toon}
                    onClick={() => setSelectedToon(toon)}
                  />
                ))
              : selectedToon.downloadChapters
                  .sort((a, b) => a.chapterNumber - b.chapterNumber)
                  .map((chapter) => (
                    <ChapterRow
                      key={chapter.id}
                      chapter={chapter}
                      webtoonId={selectedToon.webtoon.id}
                      downloadId={selectedToon.downloadId}
                      onClick={() =>
                        openChapter(selectedToon.webtoon.id, chapter.id)
                      }
                    />
                  ))}
          </div>
        </ScrollArea>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl bg-gray-900 text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-gray-100">
              {selectedChapter?.webtoonTitle} - Chapter{" "}
              {selectedChapter?.chapterNumber}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[80vh]">
            <div className="space-y-4">
              {selectedChapter?.images.map((image, index) => (
                <img
                  key={index}
                  src={"/placeholder.svg"}
                  alt={`Page ${index + 1} ${image}`}
                  className="w-full"
                  loading="lazy"
                />
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DownloadedToons;
