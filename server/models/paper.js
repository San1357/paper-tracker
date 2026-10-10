import mongoose from "mongoose";

const paperSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    authors: [{ type: String, trim: true }],
    abstract: { type: String, default: "" },
    arxivId: { type: String, trim: true },
    pdfUrl: { type: String },
    tags: [{ type: String, trim: true, lowercase: true }],
    status: {
      type: String,
      enum: ["to-read", "reading", "done"],
      default: "to-read",
    },
    notes: { type: String, default: "" },
    summary: { type: String, default: "" }, // Phase 6 mein AI bharega
  },
  { timestamps: true }
);

export default mongoose.model("Paper", paperSchema);