import { NextResponse } from "next/server";
import { connectToDatabase } from "@app/lib/server";

/**
 * Migration endpoint to drop the old sessionId index
 * This is a one-time migration to fix the duplicate key error
 */
export async function POST() {
  try {
    await connectToDatabase();

    const mongoose = await import("mongoose");
    const db = mongoose.connection.db;

    if (!db) {
      return NextResponse.json(
        { error: "Database connection not established" },
        { status: 500 }
      );
    }

    const collection = db.collection("usersettings");

    // Check if sessionId index exists
    const indexes = await collection.indexes();
    const hasSessionIdIndex = indexes.some(
      (index) => index.name === "sessionId_1"
    );

    if (hasSessionIdIndex) {
      // Drop the old sessionId index
      await collection.dropIndex("sessionId_1");
      console.log("Successfully dropped sessionId_1 index");

      return NextResponse.json({
        success: true,
        message: "sessionId index dropped successfully",
      });
    } else {
      return NextResponse.json({
        success: true,
        message: "sessionId index does not exist, nothing to drop",
      });
    }
  } catch (error) {
    console.error("Error dropping sessionId index:", error);
    return NextResponse.json(
      { error: "Failed to drop index", details: error },
      { status: 500 }
    );
  }
}
