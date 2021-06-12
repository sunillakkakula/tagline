import asyncHandler from "express-async-handler";
import AvailableInBulk from "../models/availableInBulkModel.js";

// @desc    Fetch all availableInBulk
// @route   GET /api/availableInBulk
// @access  Public
const getAll = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await AvailableInBulk.countDocuments({ ...keyword });
  const availableInBulk = await AvailableInBulk.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ availableInBulk, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single availableInBulk
// @route   GET /api/availableInBulk/:id
// @access  Public
const getById = asyncHandler(async (req, res) => {
  const availableInBulk = await AvailableInBulk.findById(req.params.id);

  if (availableInBulk) {
    res.json(availableInBulk);
  } else {
    res.status(404);
    throw new Error("Available In Bulk not found");
  }
});

// @desc    Fetch single category
// @route   GET /api/categorys/:id
// @access  Public
const getAllByProductId = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  console.log(productId);
  const availableInBulks = await AvailableInBulk.find();
  const filteredBulk = availableInBulks.filter(
    (bulk) => bulk.product+"" === productId
  );
  console.log(filteredBulk);
  if (filteredBulk) {
    res.json(filteredBulk);
  } else {
    res.status(404);
    throw new Error(`Available In Bulk not found ${productId}`);
  }
});

// @desc    Delete a category
// @route   DELETE /api/categorys/:id
// @access  Private/Admin
const remove = asyncHandler(async (req, res) => {
  const availableInBulk = await AvailableInBulk.findById(req.params.id);

  if (availableInBulk) {
    await availableInBulk.remove();
    res.json({ message: "Available In Bulk removed" });
  } else {
    res.status(404);
    throw new Error("Available In Bulk not found");
  }
});

// @desc    Create a category
// @route   POST /api/categorys
// @access  Private/Admin
const create = asyncHandler(async (req, res) => {
  const {} = req.body;
  const {
    unitOfMessure,
    qty,
    unitPrice,
    sellingPrice,
    mrp,
    product,
  } = req.body;

  const availableInBulk = new AvailableInBulk({
    unitOfMessure,
    qty,
    unitPrice,
    sellingPrice,
    mrp,
    product,
  });

  const createdAvailableInBulk = await availableInBulk.save();
  res.status(201).json(createdAvailableInBulk);
});

// @desc    Update a category
// @route   PUT /api/categorys/:idp
// @access  Private/Admin
const update = asyncHandler(async (req, res) => {
  const {
    unitOfMessure,
    sellingPrice,
    // qty,
    // unitPrice,
    // sellingPrice,
    // mrp,
    // product,
  } = req.body;
  console.log("Exec Update...Handler from Controller.!",unitOfMessure,
  sellingPrice
  )

  const availableInBulk = await AvailableInBulk.findById(req.params.id);
  
  if (availableInBulk) {
    console.log("setting value to found Bulk Item ")
    availableInBulk.unitOfMessure = unitOfMessure;
    availableInBulk.sellingPrice = sellingPrice;

    const updatedAvailableInBulk = await availableInBulk.save();
    console.log("Performed save on Bulk Update")
    res.json(updatedAvailableInBulk);
  } else {
    res.status(404);
    throw new Error("Available In Bulk not found");
  }
});

export { getAll, getById, remove, create, update, getAllByProductId };
