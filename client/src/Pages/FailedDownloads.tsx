import { ToonCardSkeleton } from "@/components/toon-card-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface FailedDownload {
  id: number;
  webtoon: {
    id: number;
    title: string;
    thumbnailUrl: string;
  };
  error: string;
}

const FailedDownloads = () => {
  const [failedDownloads, setFailedDownloads] = useState<FailedDownload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFailedDownloads();
  }, []);

  const fetchFailedDownloads = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        "http://localhost:8001/api/downloads/failed"
      );
      setFailedDownloads(response.data);
    } catch (error) {
      console.error("Error fetching failed downloads:", error);
      setError("Failed to fetch downloads. Please try again.");
      toast.error("Failed to fetch downloads. Please try again.", {
        description: "Failed to fetch downloads. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async (downloadId: number) => {
    try {
      await axios.post(
        `http://localhost:8001/api/downloads/${downloadId}/retry`
      );
      fetchFailedDownloads();
    } catch (error) {
      console.error("Error retrying download:", error);
      toast.error("Error retrying download", {
        description: "Failed to retry download. Please try again.",
      });
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
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Failed Downloads
      </h1>
      {error && <p className="text-rose-500">{error}</p>}
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="space-y-4">
          {loading
            ? Array.from({ length: 5 }).map((_, index) => (
                <ToonCardSkeleton key={index} />
              ))
            : failedDownloads.map((download) => (
                <motion.div
                  key={download.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
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
                          <p className="text-sm text-red-500">
                            {download.error}
                          </p>
                          <div className="mt-2">
                            <Button
                              size={"sm"}
                              onClick={() => handleRetry(download.id)}
                            >
                              Retry Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
        </div>
      </ScrollArea>
    </motion.div>
  );
};

export default FailedDownloads;
