import { PrismaClient, QueueStatus } from "@prisma/client";
import { emailService } from "../services/emailService";

const prisma = new PrismaClient();

async function processQueue() {
  try {
    const queueItem = await prisma.queue.findFirst({
      where: { status: QueueStatus.PENDING },
    });

    if (queueItem) {
      await prisma.queue.update({
        where: { id: queueItem.id },
        data: { status: QueueStatus.PROCESSING },
      });

      // Process the queue item based on its type
      if (queueItem.type === "DOWNLOAD") {
        // Call the download processing function
        // You'll need to implement this function or import it from tester.ts
        // await processDownload(queueItem.id, queueItem.payload)
      }

      await prisma.queue.update({
        where: { id: queueItem.id },
        data: { status: QueueStatus.COMPLETED },
      });
    }
  } catch (error) {
    console.error("Error processing queue:", error);
  }

  // Schedule next queue processing
  setTimeout(processQueue, 5000);
}

async function processEmailQueue() {
  await emailService.processEmailQueue();
  // Schedule next email queue processing
  setTimeout(processEmailQueue, 60000);
}

export function startBackgroundTasks() {
  processQueue();
  processEmailQueue();
}
