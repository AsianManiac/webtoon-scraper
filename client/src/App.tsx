import { Route, Routes } from "react-router-dom";
import "./App.css";
import { WebSocketProvider } from "./contexts/websocket-context";
import AppLayout from "./Layouts/AppLayout";
import {
  ChapterView,
  CompletedDownloads,
  Downloads,
  FailedDownloads,
  Home,
  InProgressDownloads,
  ToonDetails,
} from "./Pages";

function App() {
  return (
    <WebSocketProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/completed" element={<CompletedDownloads />} />
          <Route path="/in-progress" element={<InProgressDownloads />} />
          <Route path="/failed" element={<FailedDownloads />} />
          <Route path="/toon/:id" element={<ToonDetails />} />
          <Route
            path="/toon/:id/chapter/:chapterId"
            element={<ChapterView />}
          />
        </Route>
      </Routes>
    </WebSocketProvider>
  );
}

export default App;
