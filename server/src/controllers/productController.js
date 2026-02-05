import Product from "../models/Product.js";

// @desc    Get all products with pagination and search
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    // Seller filtering - if sellerId is provided, filter by that seller
    if (req.query.sellerId) {
      query.seller = req.query.sellerId;
    }
    
    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } }
      ];
    }

    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate("seller", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      products,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("seller", "name email");

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private (Seller/Admin only)
export const createProduct = async (req, res) => {
  try {
    const { title, description, price, category, condition, damageCondition, images, videoUrl } = req.body;

    // Ensure at least one image is marked as main, if images provided
    let processedImages = [];
    if (images && images.length > 0) {
      const hasMain = images.some(img => img.isMain);
      processedImages = images.map((img, index) => ({
        url: img.url || img,
        isMain: hasMain ? (img.isMain || false) : (index === 0)
      }));
    }

    const product = await Product.create({
      title,
      description,
      price,
      category,
      condition: condition || 'New',
      damageCondition: damageCondition || { level: 'None', description: '' },
      images: processedImages,
      videoUrl,
      seller: req.user._id
    });

    const populatedProduct = await Product.findById(product._id).populate("seller", "name email");
    res.status(201).json(populatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Owner/Admin only)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user is the seller or admin
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this product" });
    }

    const { title, description, price, category, condition, damageCondition, images, videoUrl } = req.body;

    product.title = title !== undefined ? title : product.title;
    product.description = description !== undefined ? description : product.description;
    product.price = price !== undefined ? price : product.price;
    product.category = category !== undefined ? category : product.category;
    product.condition = condition !== undefined ? condition : product.condition;
    product.damageCondition = damageCondition !== undefined ? damageCondition : product.damageCondition;
    product.videoUrl = videoUrl !== undefined ? videoUrl : product.videoUrl;
    
    if (images !== undefined) {
      product.images = images;
    }

    const updatedProduct = await product.save();
    const populatedProduct = await Product.findById(updatedProduct._id).populate("seller", "name email");
    res.json(populatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Owner/Admin only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user is the seller or admin
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this product" });
    }

    await product.deleteOne();
    res.json({ message: "Product removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get products by seller
// @route   GET /api/products/seller/:sellerId
// @access  Public
export const getProductsBySeller = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.params.sellerId })
      .populate("seller", "name email")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
