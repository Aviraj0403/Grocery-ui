import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Button, Box, Typography, TextField, MenuItem } from '@mui/material';
import axiosInstance from '../../../utils/Axios';
import { toast } from 'react-hot-toast';

// Validation schema for the product form
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Product name is required"),
  category: Yup.string().required("Category is required"),
  description: Yup.string().required("Description is required"),
  // Add more validations as needed
});

// Initial form values
const initialValues = {
  name: "",
  productCode: "",
  category: "",
  subCategory: "",
  brand: "",
  description: "",
  discount: 0,
  multilingualName: { en: "", hi: "" },
  meta: { origin: "", expiryDate: "", ingredients: "" },
};

const AddProduct = () => {
  // State for the product (images remains as an array)
  const [product, setProduct] = useState({
    name: '',
    slug: '',
    multilingualName: { en: '', hi: '' },
    productCode: '',
    category: '',
    subCategory: '',
    brand: '',
    description: '',
    variants: [],
    activeVariant: '',
    tags: '',
    images: [],
    discount: 0,
    rating: 0,
    reviewCount: 0,
    bestBeforeDays: '',
    isAvailable: true,
    isFeatured: false,
    meta: { origin: '', expiryDate: '', ingredients: '' }
  });

  // For handling a variant before adding it to product.variants.
  const [variant, setVariant] = useState({
    unit: '',
    price: '',
    stockQty: '',
    packaging: ''
  });

  // States for image file selection and preview URLs.
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  // Categories for the dropdown – fetched from backend.
  const [categories, setCategories] = useState([]);

  // Fetch categories on mount.
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axiosInstance.get('/getAllCategories');
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to fetch categories");
      }
    }
    fetchCategories();
  }, []);

  // Handle general input changes.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Convert empty subCategory to null so Mongoose can cast it properly.
    setProduct(prev => ({ ...prev, [name]: name === "subCategory" && value === "" ? null : value }));
  };

  // Handle multilingual input changes.
  const handleMultilingualChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      multilingualName: { ...prev.multilingualName, [name]: value }
    }));
  };

  // Handle meta data inputs.
  const handleMetaChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      meta: { ...prev.meta, [name]: value }
    }));
  };

  // Handle changes in the variant inputs.
  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    setVariant(prev => ({ ...prev, [name]: value }));
  };

  // Append variant to list.
  const addVariant = () => {
    if (!variant.unit || !variant.price || !variant.stockQty) {
      toast.error("Please fill in all variant fields (unit, price, stock).");
      return;
    }
    setProduct(prev => ({
      ...prev,
      variants: [...prev.variants, variant]
    }));
    setVariant({ unit: '', price: '', stockQty: '', packaging: '' });
  };

  // Handle file selection for image upload.
const handleFileChange = (e) => {
  const files = Array.from(e.target.files);

  if (files.length + selectedFiles.length > 3) {
    toast.error("You can upload a maximum of 3 images.");
    return;
  }

  const newPreviews = files.map(file => URL.createObjectURL(file));
  setSelectedFiles(prev => [...prev, ...files]);
  setPreviews(prev => [...prev, ...newPreviews]);
};


  // Remove selected images.
  const removeImages = () => {
    setSelectedFiles([]);
    setPreviews([]);
  };

  // Handle form submission:
  // 1. Create the product (without images).
  // 2. Upload images using a separate API call.
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create product without images.
      const response = await axiosInstance.post('/createProduct', product);
      const createdProduct = response.data.product;
      toast.success("Product created successfully!");

      // Upload images if the selection is valid.
      if (selectedFiles.length === 1 || selectedFiles.length === 3) {
        const formData = new FormData();
        selectedFiles.forEach(file => {
          formData.append('files', file);
        });
        await axiosInstance.post(
          `/products/${createdProduct._id}/images`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        toast.success("Images uploaded successfully!");
        removeImages();
      } else {
        toast.error("Please select either 1 or 3 images before submitting.");
      }

      // Reset product state (clear the form).
      setProduct({
        name: '',
        slug: '',
        multilingualName: { en: '', hi: '' },
        productCode: '',
        category: '',
        subCategory: '',
        brand: '',
        description: '',
        variants: [],
        activeVariant: '',
        tags: '',
        images: [],
        discount: 0,
        rating: 0,
        reviewCount: 0,
        bestBeforeDays: '',
        isAvailable: true,
        isFeatured: false,
        meta: { origin: '', expiryDate: '', ingredients: '' }
      });
    } catch (error) {
      console.error("Failed to add product:", error);
      toast.error("Failed to add product");
    }
  };

  return (
    <Box className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200">
      <Typography variant="h4" className="text-center text-2xl font-bold mb-6">
        Add New Product
      </Typography>

      {/* Image Upload Section */}
      <Box className="flex justify-center mb-6">
  <Box className="relative w-full max-w-md bg-yellow-50 border-2 border-orange-400 border-dashed rounded-lg p-4 flex flex-col items-center">
    {previews.length > 0 && (
      <>
        {previews.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Preview ${index + 1}`}
            className="max-w-full max-h-48 rounded-lg mb-2"
          />
        ))}
        <Button
          type="button"
          onClick={removeImages}
          variant="contained"
          color="error"
          className="mt-2"
        >
          Remove All
        </Button>
      </>
    )}

    {/* Show Add Image icon if less than 3 images uploaded */}
    {previews.length < 3 && (
      <>
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor="image-upload"
          className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg cursor-pointer"
        >
          Add Image
        </label>
      </>
    )}
  </Box>
</Box>


      {/* Product Details Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-2">Product Name</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              className="w-full border p-3 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Slug</label>
            <input
              type="text"
              name="slug"
              value={product.slug}
              onChange={handleInputChange}
              className="w-full border p-3 rounded"
              required
            />
          </div>
        </Box>

        <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-2">Category</label>
            <select
              name="category"
              value={product.category}
              onChange={handleInputChange}
              required
              className="w-full border p-3 rounded"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-2">Sub Category</label>
            <select
              name="subCategory"
              value={product.subCategory || ""}
              onChange={handleInputChange}
              className="w-full border p-3 rounded"
            >
              <option value="">None</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </Box>

        <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-2">Brand</label>
            <input
              type="text"
              name="brand"
              value={product.brand}
              onChange={handleInputChange}
              className="w-full border p-3 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Discount (%)</label>
            <input
              type="number"
              name="discount"
              value={product.discount}
              onChange={handleInputChange}
              className="w-full border p-3 rounded"
              placeholder="0"
            />
          </div>
        </Box>

        <div>
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleInputChange}
            className="w-full border p-3 rounded"
            required
          ></textarea>
        </div>

        <div className="border p-4 rounded-md">
          <Typography variant="h6" className="mb-2 font-bold">
            Multilingual Name
          </Typography>
          <label className="block">English:</label>
          <input
            type="text"
            name="en"
            value={product.multilingualName.en}
            onChange={(e) => handleMultilingualChange(e)}
            className="w-full border p-3 rounded mb-2"
          />
          <label className="block">Hindi:</label>
          <input
            type="text"
            name="hi"
            value={product.multilingualName.hi}
            onChange={(e) => handleMultilingualChange(e)}
            className="w-full border p-3 rounded"
          />
        </div>

        <div className="border p-4 rounded-md">
          <Typography variant="h6" className="mb-2 font-bold">
            Variants
          </Typography>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Unit (e.g., 1kg)"
              name="unit"
              value={variant.unit}
              onChange={handleVariantChange}
              className="border p-3 rounded"
            />
            <input
              type="number"
              placeholder="Price"
              name="price"
              value={variant.price}
              onChange={handleVariantChange}
              className="border p-3 rounded"
            />
            <input
              type="number"
              placeholder="Stock Quantity"
              name="stockQty"
              value={variant.stockQty}
              onChange={handleVariantChange}
              className="border p-3 rounded"
            />
            <input
              type="text"
              placeholder="Packaging"
              name="packaging"
              value={variant.packaging}
              onChange={handleVariantChange}
              className="border p-3 rounded"
            />
          </div>
          <button
            type="button"
            onClick={addVariant}
            className="mt-3 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Variant
          </button>
          {product.variants.length > 0 && (
            <ul className="mt-3 border p-3 rounded">
              {product.variants.map((v, index) => (
                <li key={index} className="mb-2">
                  {v.unit} - ${v.price} - Stock: {v.stockQty} - Packaging: {v.packaging}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border p-4 rounded-md">
          <Typography variant="h6" className="mb-3 font-bold">
            Meta Data
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold">Origin</label>
              <input
                type="text"
                name="origin"
                value={product.meta.origin}
                onChange={handleMetaChange}
                className="w-full border p-3 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">Expiry Date</label>
              <input
                type="date"
                name="expiryDate"
                value={product.meta.expiryDate}
                onChange={handleMetaChange}
                className="w-full border p-3 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">Ingredients</label>
              <textarea
                name="ingredients"
                value={product.meta.ingredients}
                onChange={handleMetaChange}
                className="w-full border p-3 rounded"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit Product
          </Button>
        </div>
      </form>
    </Box>
  );
};

export default AddProduct;
