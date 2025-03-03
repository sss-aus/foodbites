import mongoose from "mongoose";

const ExtraSchema = new mongoose.Schema({
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

const Extra = mongoose.models.Extra || mongoose.model("Extra", ExtraSchema);
export default Extra;
