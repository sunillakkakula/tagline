import mongoose from "mongoose";

const availableInDomesticSchema = mongoose.Schema(
  {
    unitOfMessure: { type: String, required: true },
    qty: { type: Number, required: false },
    unitPrice: { type: Number, required: false },
    sellingPrice: { type: Number, required: true },
    mrp: { type: Number },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
  },
  {
    timestamps: true,
  }
);

const AvailableInDomestic = mongoose.model(
  "AvailableInDomestic",
  availableInDomesticSchema
);

export default AvailableInDomestic;
