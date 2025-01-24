import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

export interface DownloadProgress {
  downloadId: string;
  webtoonId: number;
  toonTitle: string;
  chapter: number;
  totalImages: number;
  downloadedImages: number;
  status: "PENDING" | "IN_PROGRESS" | "PAUSED" | "COMPLETED" | "ERROR";
}

interface WebSocketContextType {
  ws: WebSocket | null;
  downloadProgress: Record<string, DownloadProgress>;
  startDownload: (downloadId: string) => void;
  pauseDownload: (downloadId: string) => void;
  resumeDownload: (downloadId: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<
    Record<string, DownloadProgress>
  >({});

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8001/ws");
    socket.onopen = () => console.log("WebSocket connected");
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "START_CHAPTER_DOWNLOAD") {
        // Trigger the download on the client side
        startChapterDownload(data);
      } else if (
        data.type === "PROGRESS_UPDATE" ||
        data.type === "DOWNLOAD_COMPLETED" ||
        data.type === "DOWNLOAD_ERROR"
      ) {
        setDownloadProgress((prev) => ({
          ...prev,
          [data.downloadId]: data,
        }));
      }
    };
    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const startDownload = (downloadId: string) => {
    if (ws) {
      ws.send(
        JSON.stringify({ action: "start_download", download_id: downloadId })
      );
    }
  };

  const pauseDownload = (downloadId: string) => {
    if (ws) {
      ws.send(
        JSON.stringify({ action: "pause_download", download_id: downloadId })
      );
    }
  };

  const resumeDownload = (downloadId: string) => {
    if (ws) {
      ws.send(
        JSON.stringify({ action: "resume_download", download_id: downloadId })
      );
    }
  };

  const startChapterDownload = async (data: {
    downloadId: string;
    webtoonId: number;
    chapterNumber: number;
    totalImages: number;
  }) => {
    // Implement the actual download logic here
    // This is a simplified example, you'll need to implement the actual image downloading
    for (let i = 1; i <= data.totalImages; i++) {
      // Simulate downloading an image
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Update progress
      if (ws) {
        ws.send(
          JSON.stringify({
            action: "update_progress",
            downloadId: data.downloadId,
            chapterNumber: data.chapterNumber,
            downloadedImages: i,
            status: i === data.totalImages ? "COMPLETED" : "IN_PROGRESS",
          })
        );
      }
    }
  };

  return (
    <WebSocketContext.Provider
      value={{
        ws,
        downloadProgress,
        startDownload,
        pauseDownload,
        resumeDownload,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
