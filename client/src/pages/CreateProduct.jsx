import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, uploadImages, getProductById, updateProduct } from '../api';
import { 
  Package, IndianRupee, FileText, Tag, Image as ImageIcon, 
  Upload, X, CheckCircle2, AlertCircle, Loader2, ArrowLeft, Sparkles,
  Video, AlertTriangle, Star
} from 'lucide-react';

function CreateProduct() {
  const { id } = useParams(); // Get product ID from URL if editing
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: 'New',
    damageCondition: {
      level: 'None',
      description: ''
    },
    videoUrl: ''
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const navigate = useNavigate();

  // Load product data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      loadProductData();
    }
  }, [isEditMode, id]);

  const loadProductData = async () => {
    try {
      setInitialLoading(true);
      const product = await getProductById(id);
      
      setFormData({
        title: product.title || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        category: product.category || '',
        condition: product.condition || 'New',
        damageCondition: product.damageCondition || {
          level: 'None',
          description: ''
        },
        videoUrl: product.videoUrl || ''
      });

      // Load existing images
      if (product.images && product.images.length > 0) {
        const previews = product.images.map(img => ({
          url: typeof img === 'string' ? img : img.url,
          publicId: typeof img === 'string' ? null : img.publicId,
          isExisting: true
        }));
        setImagePreviews(previews);
        
        // Find main image index
        const mainIndex = product.images.findIndex(img => img.isMain);
        setMainImageIndex(mainIndex >= 0 ? mainIndex : 0);
      }
    } catch (error) {
      console.error('Failed to load product:', error);
      setErrors({
        submit: 'Failed to load product data. Please try again.'
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const categories = [
    { value: 'Books', label: 'Books & Media', icon: '📚' },
    { value: 'Electronics', label: 'Electronics', icon: '💻' },
    { value: 'Furniture', label: 'Furniture', icon: '🛋️' },
    { value: 'Clothing', label: 'Clothing & Fashion', icon: '👕' },
    { value: 'Sports', label: 'Sports & Fitness', icon: '⚽' },
    { value: 'Home', label: 'Home & Living', icon: '🏠' },
    { value: 'Other', label: 'Other', icon: '📦' }
  ];

  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Used'];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (formData.price === '' || formData.price === null || formData.price === undefined) {
      newErrors.price = 'Price is required';
    } else if (parseFloat(formData.price) < 0) {
      newErrors.price = 'Price cannot be negative';
    } else if (parseFloat(formData.price) > 10000000) {
      newErrors.price = 'Price must be less than ₹1,00,00,000';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'damageLevel') {
      setFormData({
        ...formData,
        damageCondition: {
          ...formData.damageCondition,
          level: value
        }
      });
    } else if (name === 'damageDescription') {
      setFormData({
        ...formData,
        damageCondition: {
          ...formData.damageCondition,
          description: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + imagePreviews.length > 5) {
      setErrors({
        ...errors,
        images: 'Maximum 5 images allowed'
      });
      return;
    }

    const newPreviews = [];
    const newFiles = [];
    
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          images: 'Each image must be less than 5MB'
        });
        return;
      }

      newFiles.push(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push({
          url: reader.result,
          name: file.name,
          isExisting: false // Mark as new image
        });
        if (newPreviews.length === files.length) {
          setImagePreviews([...imagePreviews, ...newPreviews]);
          setImageFiles([...imageFiles, ...newFiles]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Clear image error
    if (errors.images) {
      setErrors({
        ...errors,
        images: ''
      });
    }
  };

  const removeImage = (index) => {
    const imageToRemove = imagePreviews[index];
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
    
    // Only remove from imageFiles if it's a new image (not existing)
    if (!imageToRemove.isExisting) {
      // Find the index in imageFiles array (only new images are in this array)
      const existingImagesCount = imagePreviews.slice(0, index).filter(img => img.isExisting).length;
      const fileIndex = index - existingImagesCount;
      const newFiles = imageFiles.filter((_, i) => i !== fileIndex);
      setImageFiles(newFiles);
    }
    
    // Adjust main image index if needed
    if (mainImageIndex === index) {
      setMainImageIndex(0);
    } else if (mainImageIndex > index) {
      setMainImageIndex(mainImageIndex - 1);
    }
  };

  const setMainImage = (index) => {
    setMainImageIndex(index);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted!');
    console.log('Form data:', formData);
    console.log('Image files:', imageFiles);
    
    if (!validateForm()) {
      console.log('Validation failed');
      return;
    }

    setLoading(true);
    setErrors({}); // Clear previous errors

    try {
      // Separate existing and new images
      const existingImages = imagePreviews
        .filter(img => img.isExisting)
        .map((img, index) => ({
          url: img.url,
          publicId: img.publicId || null,
          isMain: index === mainImageIndex && imageFiles.length === 0 ? true : false
        }));
      
      let newUploadedImages = [];
      
      // Upload new images to Cloudinary if any
      if (imageFiles.length > 0) {
        console.log('Uploading new images to Cloudinary...');
        try {
          const uploadedData = await uploadImages(imageFiles);
          console.log('Images uploaded successfully:', uploadedData);
          
          // Calculate the offset for main image index (after existing images)
          const existingCount = existingImages.length;
          
          newUploadedImages = uploadedData.map((img, index) => ({
            url: img.url,
            publicId: img.publicId,
            isMain: (existingCount + index) === mainImageIndex
          }));
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          setErrors({
            submit: 'Failed to upload images. Please try again.'
          });
          setLoading(false);
          return;
        }
      }
      
      // Combine existing and new images, maintaining order
      const allImages = [...existingImages, ...newUploadedImages];
      
      // Ensure at least one image is marked as main
      if (allImages.length > 0 && !allImages.some(img => img.isMain)) {
        allImages[mainImageIndex] = { ...allImages[mainImageIndex], isMain: true };
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        images: allImages,
        damageCondition: formData.damageCondition.level !== 'None' 
          ? formData.damageCondition 
          : { level: 'None', description: '' }
      };
      
      console.log(isEditMode ? 'Updating product with data:' : 'Creating product with data:', productData);
      
      if (isEditMode) {
        await updateProduct(id, productData);
        console.log('Product updated successfully!');
      } else {
        await createProduct(productData);
        console.log('Product created successfully!');
      }
      
      // Show success message
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        condition: 'New',
        damageCondition: {
          level: 'None',
          description: ''
        },
        videoUrl: ''
      });
      setImagePreviews([]);
      setImageFiles([]);
      
      // Navigate after delay
      setTimeout(() => {
        navigate('/seller/products');
      }, 2000);
    } catch (err) {
      console.error('Product creation error:', err);
      setErrors({
        submit: err.response?.data?.message || err.message || 'Failed to create product. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.title.trim() && 
                       formData.description.trim() && 
                       formData.price !== '' && 
                       formData.category &&
                       parseFloat(formData.price) >= 0;

  const descriptionLength = formData.description.length;
  const maxDescriptionLength = 500;

  // Show loading spinner while fetching product data in edit mode
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading Product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-white rounded-xl shadow-2xl p-4 flex items-center gap-3 animate-fade-in-down z-50 border-2 border-green-500">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold text-gray-900">
              {isEditMode ? 'Product Updated!' : 'Product Created!'}
            </div>
            <div className="text-sm text-gray-600">Redirecting to your products...</div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in-down">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-4 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 mb-2">
            {isEditMode ? 'Edit Product' : 'List a New Product'}
          </h1>
          <p className="text-gray-600 text-lg">
            {isEditMode ? 'Update your product details' : 'Fill in the details to start selling'}
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in-up">
          {/* Submit Error */}
          {errors.submit && (
            <div className="mb-6 flex items-center gap-3 bg-red-50 border-2 border-red-500 rounded-xl p-4">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700 font-medium">{errors.submit}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Title */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <Package className="w-5 h-5 text-primary-500" />
                Product Title *
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g., iPhone 15 Pro Max - 256GB"
                value={formData.title}
                onChange={handleChange}
                maxLength="100"
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none ${
                  errors.title 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-200 focus:border-primary-500'
                }`}
              />
              <div className="flex justify-between mt-1">
                {errors.title && (
                  <span className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.title}
                  </span>
                )}
                <span className="text-gray-400 text-sm ml-auto">
                  {formData.title.length}/100
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <FileText className="w-5 h-5 text-primary-500" />
                Description *
              </label>
              <textarea
                name="description"
                placeholder="Describe your product in detail... Include condition, features, and any other relevant information."
                value={formData.description}
                onChange={handleChange}
                maxLength={maxDescriptionLength}
                rows="5"
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none resize-none ${
                  errors.description 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-200 focus:border-primary-500'
                }`}
              />
              <div className="flex justify-between mt-1">
                {errors.description && (
                  <span className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.description}
                  </span>
                )}
                <span className={`text-sm ml-auto ${
                  descriptionLength > maxDescriptionLength * 0.9 
                    ? 'text-orange-500 font-semibold' 
                    : 'text-gray-400'
                }`}>
                  {descriptionLength}/{maxDescriptionLength}
                </span>
              </div>
            </div>

            {/* Price and Condition Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                  <IndianRupee className="w-5 h-5 text-primary-500" />
                  Price (INR) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="price"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`w-full pl-8 pr-4 py-3 border-2 rounded-xl transition-all focus:outline-none ${
                      errors.price 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-200 focus:border-primary-500'
                    }`}
                  />
                </div>
                {errors.price && (
                  <span className="text-red-500 text-sm flex items-center gap-1 mt-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.price}
                  </span>
                )}
              </div>

              {/* Condition */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                  <Sparkles className="w-5 h-5 text-primary-500" />
                  Condition *
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-all bg-white cursor-pointer"
                >
                  {conditions.map(condition => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <Tag className="w-5 h-5 text-primary-500" />
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none bg-white cursor-pointer ${
                  errors.category 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-200 focus:border-primary-500'
                }`}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <span className="text-red-500 text-sm flex items-center gap-1 mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.category}
                </span>
              )}
            </div>

            {/* Damage Condition */}
            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
              <label className="flex items-center gap-2 text-gray-900 font-bold mb-4">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Damage Condition
              </label>
              
              <div className="space-y-4">
                <div>
                  <label className="text-gray-700 font-medium mb-2 block">Level</label>
                  <select
                    name="damageLevel"
                    value={formData.damageCondition.level}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-all bg-white cursor-pointer"
                  >
                    <option value="None">None - Perfect condition</option>
                    <option value="Minor">Minor - Small scratches or wear</option>
                    <option value="Moderate">Moderate - Visible damage but functional</option>
                    <option value="Heavy">Heavy - Significant damage</option>
                  </select>
                </div>

                {formData.damageCondition.level !== 'None' && (
                  <div>
                    <label className="text-gray-700 font-medium mb-2 block">
                      Describe the damage (optional)
                    </label>
                    <textarea
                      name="damageDescription"
                      value={formData.damageCondition.description}
                      onChange={handleChange}
                      placeholder="Provide details about the damage..."
                      rows="3"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-all resize-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Video URL (Optional) */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <Video className="w-5 h-5 text-primary-500" />
                Product Video
                <span className="text-gray-400 text-sm font-normal">(Optional - YouTube/Vimeo URL)</span>
              </label>
              <input
                type="url"
                name="videoUrl"
                placeholder="https://youtube.com/watch?v=..."
                value={formData.videoUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-all"
              />
              <p className="text-gray-500 text-sm mt-1">
                Add a video link to showcase your product in detail
              </p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <ImageIcon className="w-5 h-5 text-primary-500" />
                Product Images
                <span className="text-gray-400 text-sm font-normal">(Optional - Max 5 images)</span>
              </label>
              
              {/* Upload Button */}
              <label className="block w-full p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-500 transition-all cursor-pointer bg-gray-50 hover:bg-primary-50 group">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={imagePreviews.length >= 5}
                />
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-400 group-hover:text-primary-500 mx-auto mb-3 transition-colors" />
                  <p className="text-gray-600 font-medium mb-1">
                    {imagePreviews.length >= 5 
                      ? 'Maximum images reached' 
                      : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-gray-400 text-sm">PNG, JPG up to 5MB each</p>
                </div>
              </label>

              {errors.images && (
                <span className="text-red-500 text-sm flex items-center gap-1 mt-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.images}
                </span>
              )}

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Click on an image to set it as the main product image
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div 
                        key={index} 
                        className={`relative group cursor-pointer ${
                          index === mainImageIndex ? 'ring-4 ring-primary-500 rounded-xl' : ''
                        }`}
                        onClick={() => setMainImage(index)}
                      >
                        <img
                          src={preview.url}
                          alt={`Preview ${index + 1}`}
                          className={`w-full h-32 object-cover rounded-xl border-2 transition-all ${
                            index === mainImageIndex 
                              ? 'border-primary-500' 
                              : 'border-gray-200 hover:border-primary-300'
                          }`}
                        />
                        
                        {/* Main Image Badge */}
                        {index === mainImageIndex && (
                          <div className="absolute top-2 left-2 bg-primary-500 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            Main
                          </div>
                        )}
                        
                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(index);
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-bold rounded-xl transition-all ${
                  loading || !isFormValid
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:shadow-xl hover:-translate-y-0.5'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {isEditMode ? 'Updating Product...' : 'Creating Product...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {isEditMode ? 'Update Product' : 'Create Product'}
                  </>
                )}
              </button>
            </div>

            {/* Form Validation Hint */}
            {!isFormValid && (
              <p className="text-center text-gray-500 text-sm">
                Please fill in all required fields to enable submission
              </p>
            )}
          </form>
        </div>

        {/* Tips Section */}
        <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-6 animate-fade-in-up">
          <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Tips for a Great Listing
          </h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Use clear, descriptive titles that include key details like brand and model</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Write detailed descriptions highlighting features, condition, and benefits</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Price competitively - research similar items to set a fair price</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Add high-quality images from multiple angles to build buyer trust</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CreateProduct;
