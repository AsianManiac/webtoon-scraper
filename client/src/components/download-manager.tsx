"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWebSocket } from "@/contexts/websocket-context";
import axios from "axios";
import { CheckCircle, Download, Pause, Play, XCircle } from "lucide-react";
import type React from "react";
import { useState } from "react";
import DownloadedToons from "./downloaded-toon";

interface WebtoonDownloadOptions {
  webtoonIds: number[];
  downloadLatestChapter: boolean;
  separateChapters: boolean;
  startChapter?: number;
  endChapter?: number;
  imagesFormat: "jpg" | "png";
}

const DownloadManager: React.FC = () => {
  const { startDownload, pauseDownload, resumeDownload, downloadProgress } =
    useWebSocket();
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

  console.log(downloadProgress);

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
      }
    } catch (error) {
      console.error("Failed to start download:", error);
      alert("Failed to start download. Please check your input.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "in-progress":
        return <Download className="w-5 h-5 text-blue-500 animate-pulse" />;
      case "paused":
        return <Pause className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="downloaded" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="download">Download Options</TabsTrigger>
          <TabsTrigger value="progress">Download Progress</TabsTrigger>
          <TabsTrigger value="downloaded">Downloaded Toons</TabsTrigger>
        </TabsList>
        <TabsContent value="download">
          <Card>
            <CardHeader>
              <CardTitle>Download Options</CardTitle>
              <CardDescription>
                Configure your webtoon download settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="webtoonIds">
                    Webtoon IDs (comma-separated)
                  </Label>
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
                    onValueChange={(value) =>
                      handleChange("imagesFormat", value)
                    }
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
        </TabsContent>
        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Download Progress</CardTitle>
              <CardDescription>
                Track the progress of your webtoon downloads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                {Object.values(downloadProgress).length === 0 ? (
                  <p className="text-center text-gray-500">
                    No active downloads
                  </p>
                ) : (
                  Object.values(downloadProgress).map((progress) => (
                    <Card key={progress.downloadId} className="mb-4">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">
                            {progress.toonTitle}
                          </h3>
                          {getStatusIcon(progress.status)}
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          Chapter: {progress.chapter}
                        </p>
                        <Progress
                          value={
                            (progress.downloadedImages / progress.totalImages) *
                            100
                          }
                          className="h-2 mb-2"
                        />
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>
                            {progress.downloadedImages}/{progress.totalImages}{" "}
                            Images
                          </span>
                          <span>
                            {(
                              (progress.downloadedImages /
                                progress.totalImages) *
                              100
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                        <div className="mt-4">
                          {progress.status === "IN_PROGRESS" && (
                            <Button
                              onClick={() => pauseDownload(progress.downloadId)}
                              size="sm"
                              variant="outline"
                              className="w-full"
                            >
                              <Pause className="w-4 h-4 mr-2" />
                              Pause
                            </Button>
                          )}
                          {progress.status === "PAUSED" && (
                            <Button
                              onClick={() =>
                                resumeDownload(progress.downloadId)
                              }
                              size="sm"
                              variant="outline"
                              className="w-full"
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Resume
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="downloaded">
          <DownloadedToons />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DownloadManager;
