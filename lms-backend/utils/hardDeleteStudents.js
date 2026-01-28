import cron from "node-cron";
import mongoose from "mongoose";
import Student from "../models/Student.js";

// Function to hard delete students marked as Softdelete for more than 7 days
async function hardDeleteStudents() {
  //for testing only
  //const ONE_MINUTE_IN_MS = 60 * 1000;
  // for setting 7 days hard delete
  const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
  try {
    const oneDayAgo = new Date(Date.now() - ONE_MINUTE_IN_MS);
    const sevenDaysAgo = new Date(Date.now() - 7 * ONE_DAY_IN_MS); //calculates seven days ago date
    const res = await Student.deleteMany({
      isDeleted: true,
      deletedAt: { $lte: oneDayAgo },
    });
    console.log(
      `Hard-deleted ${res.deletedCount} students at ${new Date().toISOString()}`,
    );
  } catch (error) {
    console.error("[cron] hard delete error", error);
  }
}

//Schedule to run

const task = cron.schedule(
  "*/1 * * * *", //daily at 02:00
  () => {
    if (mongoose.connection.readyState === 1) {
      hardDeleteStudents();
    } else {
      console.warn("[cron] skipping hard-delete. DB not connected");
    }
  },
  {
    timezone: "Asia/Karachi",
  },
);

export default task;
