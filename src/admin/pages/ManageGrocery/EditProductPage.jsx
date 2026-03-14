import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../../utils/Axios';
import { toast } from 'react-hot-toast';

const EditProductPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    // Local state fields for editing (derived from product)
    const [name, setName] = useState('');
    const [productCode, setProductCode] = useState('');
    const [description, setDescription] = useState('');
    const [brand, setBrand] = useState('');
    const [discount, setDiscount] = useState(0);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [isAvailable, setIsAvailable] = useState(true);
    const [variants, setVariants] = useState([]);
    const [newVariant, setNewVariant] = useState({ unit: '', price: '', stockQty: '', packaging: 'Loose' });

    // Image update states: selected new images and their previews.
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);

    // For simplicity, category options are assumed static here.
    // You can update it to fetch dynamically if needed.
    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await axiosInstance.get('/getAllCategories');
                const all = response.data.categories || [];

                setCategories(all.filter(cat => !cat.parentCategory));
                setSubCategories(all.filter(cat => cat.parentCategory));
            } catch (error) {
                console.error("Failed to fetch categories:", error);
                toast.error("Failed to fetch categories");
            }
        }

        fetchCategories();
    }, []);

    const filteredSubCategories = subCategories.filter(
        (sub) => sub.parentCategory === category
    );

    useEffect(() => {
        setSubCategory('');
    }, [category]);
    // Fetch product details
    const fetchProduct = async () => {
        try {
            const response = await axiosInstance.get(`/getProduct/${id}`);
            if (response.data.success) {
                const data = response.data.product;
                setProduct(data);
                // Initialize fields from fetched product data.
                setName(data.name || '');
                setCategory(data.category?._id || '');
                setSubCategory(data.subCategory?._id || null);
                setProductCode(data.productCode || '');
                setDescription(data.description || '');
                setBrand(data.brand || '');
                setDiscount(data.discount || 0);
                setIsAvailable(data.isAvailable);
                setVariants(data.variants || []);
            } else {
                toast.error(response.data.message || 'Error fetching product details');
            }
        } catch (error) {
            console.error("Error fetching product:", error);
            toast.error(error.response?.data?.message || 'Error fetching product details');
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    // Handle new image file selection for update.
 // Inside handleFileChange:
const handleFileChange = (e) => {
  const files = Array.from(e.target.files);
  const totalSelected = selectedFiles.length + files.length;

  if (totalSelected > 3) {
    toast.error("You can upload a maximum of 3 images.");
    return;
  }

  const newPreviews = files.map(file => URL.createObjectURL(file));

  setSelectedFiles(prev => [...prev, ...files]);
  setPreviews(prev => [...prev, ...newPreviews]);
};

// Inside handleSave (image update part):
if (selectedFiles.length > 0) {
  if (selectedFiles.length === 1 || selectedFiles.length === 3) {
    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('files', file));
    try {
      axiosInstance.post(
        `/products/${id}/images`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      toast.success("Images updated successfully!");
      removeImages();
    } catch (error) {
      toast.error("Failed to update images.");
    }
  } else {
    toast.error("Please select either 1 or 3 images for update.");
    return;
  }
}


    // Remove selected images.
    const removeImages = () => {
        setSelectedFiles([]);
        setPreviews([]);
    };

    // Save updated product details.
    const handleSave = async () => {
        if (!name || !category || variants.length === 0) {
            toast.error('Please fill in all required fields (Name, Category, and at least one Variant).');
            return;
        }

        try {
            // Prepare data to update; update the first variant's price.
            const updatedData = {
                name,
                category,
                subCategory: subCategory === '' ? null : subCategory,
                productCode,
                description,
                discount,
                isAvailable,
                variants: variants.map(v => ({
                    ...v,
                    price: Number(v.price),
                    stockQty: Number(v.stockQty)
                }))
            };

            const response = await axiosInstance.put(`/updateProduct/${id}`, updatedData);
            if (response.data.success) {
                toast.success('Product updated successfully');
            } else {
                toast.error(response.data.message || 'Error updating product');
                return;
            }

            // If new image files are selected, update images.
            if (selectedFiles.length > 0) {
                if (selectedFiles.length === 1 || selectedFiles.length === 3) {
                    const formData = new FormData();
                    selectedFiles.forEach(file => formData.append('files', file));
                    // The backend endpoint should delete previous images from Cloudinary
                    // before uploading the new ones.
                    await axiosInstance.post(
                        `/products/${id}/images`,
                        formData,
                        { headers: { 'Content-Type': 'multipart/form-data' } }
                    );
                    toast.success("Images updated successfully!");
                    removeImages();
                } else {
                    toast.error("Please select either 1 or 3 images for update.");
                }
            }
        } catch (error) {
            console.error("Error updating product:", error);
            toast.error(error.response?.data?.message || 'Error updating product');
        }
    };

    if (!product) return <p className="p-4 text-center">Loading product...</p>;

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto bg-white rounded-lg shadow-md border border-gray-200">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-center">
                Edit Product
            </h1>

            {/* Image Section */}
   {/* Image Section */}
<div className="mb-6">
  <h2 className="text-lg font-semibold text-gray-700 mb-2">Product Images</h2>

  <div className="flex flex-wrap gap-4">
    {/* Existing images with remove option */}
    {product.images?.map((src, index) => (
      <div key={`existing-${index}`} className="relative group">
        <img
          src={src}
          alt={`Product ${index + 1}`}
          className="w-32 h-32 object-cover rounded-lg border"
        />
        <button
          type="button"
          onClick={() => {
            // Remove existing image at index
            const updatedImages = product.images.filter((_, i) => i !== index);
            setProduct({ ...product, images: updatedImages });
          }}
          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Remove image"
        >
          &times;
        </button>
      </div>
    ))}

    {/* New image previews */}
    {previews.map((src, index) => (
      <div key={`new-${index}`} className="relative group">
        <img
          src={src}
          alt={`Preview ${index + 1}`}
          className="w-32 h-32 object-cover rounded-lg border"
        />
        <button
          type="button"
          onClick={() => {
            // Remove new selected image at index
            setSelectedFiles((files) => files.filter((_, i) => i !== index));
            setPreviews((prev) => prev.filter((_, i) => i !== index));
          }}
          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Remove selected image"
        >
          &times;
        </button>
      </div>
    ))}

    {/* Show "Add Image" button only if total images < 3 */}
    {(product.images?.length || 0) + previews.length < 3 && (
      <div className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-orange-400 rounded-lg">
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer text-orange-500 text-sm text-center"
        >
          + Add Image
        </label>
      </div>
    )}
  </div>
</div>



            {/* Edit Form */}
            <form className="mt-6 space-y-6">
                {/* Product Name */}
                <div className="mb-4">
                    <label className="block text-gray-700">Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Category */}
                <div className="mb-4">
                    <label className="block text-gray-700">Category:</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>


                <div className="mb-4">
                    <label className="block text-gray-700">Subcategory:</label>
                    <select
                        disabled={!category}
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >

                        <option value="">None</option>
                        {filteredSubCategories.map((sub) => (
                            <option key={sub._id} value={sub._id}>
                                {sub.name}
                            </option>
                        ))}
                    </select>
                </div>




                {/* Variants Section */}
                <div className="border p-4 rounded-md bg-gray-50">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Variants</h2>
                    
                    {/* List Existing Variants */}
                    <div className="space-y-4 mb-6">
                        {variants.map((v, index) => (
                            <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-white border rounded-lg shadow-sm relative group">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase">Unit</label>
                                    <input
                                        type="text"
                                        value={v.unit}
                                        onChange={(e) => {
                                            const updated = [...variants];
                                            updated[index].unit = e.target.value;
                                            setVariants(updated);
                                        }}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm"
                                        placeholder="e.g. 1kg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase">Price</label>
                                    <input
                                        type="number"
                                        value={v.price}
                                        onChange={(e) => {
                                            const updated = [...variants];
                                            updated[index].price = e.target.value;
                                            setVariants(updated);
                                        }}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm"
                                        placeholder="Price"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase">Stock</label>
                                    <input
                                        type="number"
                                        value={v.stockQty}
                                        onChange={(e) => {
                                            const updated = [...variants];
                                            updated[index].stockQty = e.target.value;
                                            setVariants(updated);
                                        }}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm"
                                        placeholder="Stock"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setVariants(variants.filter((_, i) => i !== index));
                                        }}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                        title="Remove Variant"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add New Variant */}
                    <div className="p-4 border-2 border-dashed border-blue-200 rounded-lg bg-blue-50">
                        <h3 className="text-sm font-semibold text-blue-800 mb-3">Add New Variant</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <input
                                type="text"
                                placeholder="Unit (e.g. 500g)"
                                value={newVariant.unit}
                                onChange={(e) => setNewVariant({ ...newVariant, unit: e.target.value })}
                                className="p-2 border border-gray-300 rounded-md text-sm"
                            />
                            <input
                                type="number"
                                placeholder="Price"
                                value={newVariant.price}
                                onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
                                className="p-2 border border-gray-300 rounded-md text-sm"
                            />
                            <input
                                type="number"
                                placeholder="Stock"
                                value={newVariant.stockQty}
                                onChange={(e) => setNewVariant({ ...newVariant, stockQty: e.target.value })}
                                className="p-2 border border-gray-300 rounded-md text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    if (!newVariant.unit || !newVariant.price || !newVariant.stockQty) {
                                        toast.error("Please fill all fields for the new variant.");
                                        return;
                                    }
                                    setVariants([...variants, newVariant]);
                                    setNewVariant({ unit: '', price: '', stockQty: '', packaging: 'Loose' });
                                }}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                                + Add
                            </button>
                        </div>
                    </div>
                </div>
                {/* Description */}
                <div className="mb-4">
                    <label className="block text-gray-700">Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Brand */}
                <div className="mb-4">
                    <label className="block text-gray-700">Brand:</label>
                    <input
                        type="text"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Discount */}
                <div className="mb-4">
                    <label className="block text-gray-700">Discount (%):</label>
                    <input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Save Button */}
                <div className="flex justify-center sm:justify-start">
                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProductPage;
