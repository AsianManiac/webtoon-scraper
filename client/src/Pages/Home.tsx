import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useWebSocket } from "@/contexts/websocket-context";
import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

interface WebtoonDownloadOptions {
  webtoonIds: number[];
  downloadLatestChapter: boolean;
  separateChapters: boolean;
  startChapter?: number;
  endChapter?: number;
  imagesFormat: "jpg" | "png";
}

const Home = () => {
  const { startDownload } = useWebSocket();
  const [formData, setFormData] = useState<WebtoonDownloadOptions>({
    webtoonIds: [],
    downloadLatestChapter: true,
    separateChapters: true,
    imagesFormat: "jpg",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:8001/download",
        formData
      );
      if (data.downloads) {
        data.downloads.forEach((download: { downloadId: string }) => {
          startDownload(download.downloadId);
        });
        toast.success("Download started successfully.");
      }
    } catch (error) {
      console.error("Failed to start download:", error);
      alert("Failed to start download. Please check your input.");
      toast.error("Failed to start download", {
        description: "Failed to start download. Please check your input.",
      });
    } finally {
      setLoading(false);
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
      <Card>
        <CardHeader>
          <CardTitle>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Start a New Download
            </h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="webtoonIds">Webtoon IDs (comma-separated)</Label>
              <Input
                id="webtoonIds"
                value={formData.webtoonIds.join(",")}
                onChange={(e) =>
                  handleChange(
                    "webtoonIds",
                    e.target.value.split(",").map(Number)
                  )
                }
                placeholder="e.g. 1, 2, 3"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="downloadLatestChapter"
                checked={formData.downloadLatestChapter}
                onCheckedChange={(checked) =>
                  handleChange("downloadLatestChapter", checked)
                }
              />
              <Label htmlFor="downloadLatestChapter">
                Download Latest Chapter Only
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="separateChapters"
                checked={formData.separateChapters}
                onCheckedChange={(checked) =>
                  handleChange("separateChapters", checked)
                }
              />
              <Label htmlFor="separateChapters">Separate Chapters</Label>
            </div>
            {!formData.downloadLatestChapter && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startChapter">Start Chapter</Label>
                  <Input
                    id="startChapter"
                    type="number"
                    value={formData.startChapter || ""}
                    onChange={(e) =>
                      handleChange("startChapter", Number(e.target.value))
                    }
                    placeholder="e.g. 1"
                  />
                </div>
                <div>
                  <Label htmlFor="endChapter">End Chapter</Label>
                  <Input
                    id="endChapter"
                    type="number"
                    value={formData.endChapter || ""}
                    onChange={(e) =>
                      handleChange("endChapter", Number(e.target.value))
                    }
                    placeholder="e.g. 10"
                  />
                </div>
              </div>
            )}
            <div>
              <Label htmlFor="imagesFormat">Image Format</Label>
              <Select
                value={formData.imagesFormat}
                onValueChange={(value) => handleChange("imagesFormat", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select image format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jpg">JPG</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Starting Download..." : "Start Download"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Home;
