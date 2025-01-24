import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { motion, useAnimation } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

interface ChapterContent {
  chapterNumber: number;
  webtoonTitle: string;
  images: string[];
}

interface Chapter {
  id: number;
  chapterNumber: number;
}

const ChapterView = () => {
  const { id, chapterId } = useParams<{ id: string; chapterId: string }>();
  const [chapter, setChapter] = useState<ChapterContent | null>(null);
  const [allChapters, setAllChapters] = useState<Chapter[]>([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    fetchChapterContent();
    fetchAllChapters();
  }, [id, chapterId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAtBottom(entry.isIntersecting);
      },
      { threshold: 1.0 }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, [chapter]);

  const fetchChapterContent = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8001/api/downloads/chapter-contents/${id}/${chapterId}`
      );
      setChapter(response.data);
    } catch (error) {
      console.error("Error fetching chapter content:", error);
      toast.error("Error fetching chapter content", {
        description: "Failed to fetch chapter content. Please try again.",
      });
    }
  };

  const fetchAllChapters = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8001/api/downloads/toon/${id}/chapters`
      );
      const completedChapters = response.data.filter(
        (ch: any) => ch.status === "COMPLETED"
      );
      setAllChapters(completedChapters);
      setCurrentChapterIndex(
        completedChapters.findIndex(
          (ch: Chapter) => ch.id.toString() === chapterId
        )
      );
    } catch (error) {
      console.error("Error fetching all chapters:", error);
      toast.error("Error fetching all chapters", {
        description: "Failed to fetch chapters. Please try again.",
      });
    }
  };

  const navigateToChapter = useCallback(
    (chapterId: number) => {
      navigate(`/toon/${id}/chapter/${chapterId}`);
      window.location.reload();
    },
    [id, navigate]
  );

  const handlePreviousChapter = useCallback(() => {
    if (currentChapterIndex > 0) {
      navigateToChapter(allChapters[currentChapterIndex - 1].id);
    }
  }, [currentChapterIndex, allChapters, navigateToChapter]);

  const handleNextChapter = useCallback(() => {
    if (currentChapterIndex < allChapters.length - 1) {
      window.scrollTo(0, 0);
      navigateToChapter(allChapters[currentChapterIndex + 1].id);
    }
  }, [currentChapterIndex, allChapters, navigateToChapter]);

  const handlePullUp = async (_: any, info: { offset: { y: number } }) => {
    const pullUp = info.offset.y < 0;
    const pullThreshold = -50;

    if (
      isAtBottom &&
      pullUp &&
      info.offset.y < pullThreshold &&
      currentChapterIndex < allChapters.length - 1
    ) {
      await controls.start({ opacity: 0, y: -20 });
      handleNextChapter();
    } else {
      controls.start({ opacity: 1, y: 0 });
    }
  };

  const ChapterNavigation = () => (
    <div className="flex items-center justify-end space-x-1 mb-4">
      <Button
        variant="outline"
        onClick={handlePreviousChapter}
        disabled={currentChapterIndex === 0}
      >
        <ChevronLeft className="size-4" />
      </Button>
      <Select
        value={chapterId}
        onValueChange={(value) => navigateToChapter(parseInt(value))}
      >
        <SelectTrigger className="w-auto">
          <SelectValue placeholder="Select chapter" />
        </SelectTrigger>
        <SelectContent>
          {allChapters.map((ch) => (
            <SelectItem
              key={ch.id}
              value={ch.id.toString()}
              className="cursor-pointer hover:bg-primary"
            >
              Ep - {ch.chapterNumber}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        onClick={handleNextChapter}
        disabled={currentChapterIndex === allChapters.length - 1}
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );

  if (!chapter) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-3/4" />
        <ChapterNavigation />
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="">
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} className="w-full h-96" />
            ))}
          </div>
        </ScrollArea>
      </div>
    );
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
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {chapter.webtoonTitle} - Chapter {chapter.chapterNumber}
          </h1>
          <Link to={`/toon/${id}`}>
            <Button variant="outline" className="items-center">
              <ArrowLeft className="size-4" />
              Back to Toon
            </Button>
          </Link>
        </div>
        <ChapterNavigation />
      </MaxWidthWrapper>

      <ScrollArea className="h-[calc(100vh-8rem)]" ref={scrollRef}>
        <motion.div
          drag="y"
          dragConstraints={scrollRef}
          onDragEnd={handlePullUp}
          animate={controls}
        >
          {chapter.images.map((image, index) => (
            <motion.img
              key={index}
              src={image}
              alt={`Page ${index + 1}`}
              className="w-full "
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            />
          ))}
          <div ref={bottomRef} style={{ height: "1px" }} />
        </motion.div>
      </ScrollArea>

      <MaxWidthWrapper>
        <ChapterNavigation />

        {isAtBottom && currentChapterIndex < allChapters.length - 1 && (
          <div className="text-center text-gray-500 dark:text-gray-400 animate-bounce">
            Pull up to load next chapter
          </div>
        )}
      </MaxWidthWrapper>
    </motion.div>
  );
};

export default ChapterView;
