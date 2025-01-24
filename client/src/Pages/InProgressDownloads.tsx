import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface InProgressDownload {
  id: number;
  downloadId: string;
  webtoon: {
    id: number;
    title: string;
    thumbnailUrl: string;
  };
  currentChapter: number;
  totalChapters: number;
}

const InProgressDownloads = () => {
  const [inProgressDownloads, setInProgressDownloads] = useState<
    InProgressDownload[]
  >([]);

  useEffect(() => {
    fetchInProgressDownloads();
    const interval = setInterval(fetchInProgressDownloads, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchInProgressDownloads = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8001/api/downloads/in-progress"
      );
      setInProgressDownloads(response.data);
    } catch (error) {
      console.error("Error fetching in-progress downloads:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <MaxWidthWrapper>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          In-Progress Downloads
        </h1>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-4">
            {inProgressDownloads.map((download) => (
              <motion.div
                key={download.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Link to={`/toon/${download.webtoon.id}`}>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <img
                          // src={download.webtoon.thumbnailUrl || "/placeholder.svg"}
                          src={"/placeholder.svg"}
                          alt={download.webtoon.title}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">
                            {download.webtoon.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Progress: {download.currentChapter} /{" "}
                            {download.totalChapters} chapters
                          </p>
                          <div className="mt-2">
                            <Progress
                              value={
                                (download.currentChapter /
                                  download.totalChapters) *
                                100
                              }
                              className="h-2"
                            />
                          </div>
                        </div>
                      </div>
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

export default InProgressDownloads;
