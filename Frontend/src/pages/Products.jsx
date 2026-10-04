import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Products.css";

function Products() {
    const { isAdmin } = useAuth();

    // =========================
    // PRODUCT DATA
    // =========================

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);


    // =========================
    // SEARCH / FILTER / SORT
    // =========================

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [supplier, setSupplier] = useState("");
    const [sort, setSort] = useState("");


    // =========================
    // PAGINATION
    // =========================

    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);


    // =========================
    // FORM
    // =========================

    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        description: "",
        price: "",
        quantity: "",
        category: "",
        supplier: "",
        minimumStock: ""
    });


    // =========================
    // VIEW
    // =========================

    const [view, setView] = useState("list");


    // =========================
    // LOADING / ERROR
    // =========================

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================
    // LOAD CATEGORIES / SUPPLIERS
    // =========================

    useEffect(() => {
        fetchCategories();
        fetchSuppliers();
    }, []);


    // =========================
    // LOAD PRODUCTS
    // =========================

    useEffect(() => {
        fetchProducts();
    }, [page]);


    // =========================
    // GET PRODUCTS
    // =========================

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/products", {
                params: {
                    search: search || undefined,
                    category: category || undefined,
                    supplier: supplier || undefined,
                    sort: sort || undefined,
                    page: page
                }
            });

            const data = response.data;

            setProducts(
                data.products || data
            );

            setPages(
                data.pages || 1
            );

            setTotal(
                data.total || 0
            );

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load products"
            );

        } finally {
            setLoading(false);
        }
    };


    // =========================
    // GET CATEGORIES
    // =========================

    const fetchCategories = async () => {
        try {
            const response = await api.get(
                "/categories"
            );

            setCategories(
                response.data.categories ||
                response.data.data ||
                response.data
            );

        } catch (error) {
            console.error(
                "Failed to load categories:",
                error
            );
        }
    };


    // =========================
    // GET SUPPLIERS
    // =========================

    const fetchSuppliers = async () => {
        try {
            const response = await api.get(
                "/suppliers"
            );

            setSuppliers(
                response.data.suppliers ||
                response.data.data ||
                response.data
            );

        } catch (error) {
            console.error(
                "Failed to load suppliers:",
                error
            );
        }
    };


    // =========================
    // SEARCH
    // =========================

    const handleSearch = () => {
        setPage(1);

        setTimeout(() => {
            fetchProducts();
        }, 0);
    };


    // =========================
    // CLEAR FILTERS
    // =========================

    const clearFilters = () => {

        setSearch("");
        setCategory("");
        setSupplier("");
        setSort("");
        setPage(1);

        setTimeout(() => {
            fetchProducts();
        }, 0);
    };


    // =========================
    // FORM INPUT
    // =========================

    const handleFormChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    // =========================
    // EDIT PRODUCT
    // =========================

    const handleEditClick = (product) => {

        setEditingProduct(product);

        setFormData({

            name: product.name || "",

            sku: product.sku || "",

            description:
                product.description || "",

            price:
                product.price || "",

            quantity:
                product.quantity || "",

            category:
                product.category?._id ||
                product.category ||
                "",

            supplier:
                product.supplier?._id ||
                product.supplier ||
                "",

            minimumStock:
                product.minimumStock ?? ""
        });

        setShowForm(true);
    };


    // =========================
    // CREATE / UPDATE
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const productData = {

                name: formData.name,

                sku: formData.sku,

                description:
                    formData.description,

                price:
                    Number(formData.price),

                quantity:
                    Number(formData.quantity),

                category:
                    formData.category,

                supplier:
                    formData.supplier,

                minimumStock:
                    Number(formData.minimumStock)
            };


            if (editingProduct) {

                await api.put(
                    `/products/${editingProduct._id}`,
                    productData
                );

                alert(
                    "Product updated successfully!"
                );

            } else {

                await api.post(
                    "/products",
                    productData
                );

                alert(
                    "Product created successfully!"
                );
            }


            resetForm();

            setPage(1);

            fetchProducts();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to save product"
            );
        }
    };


    // =========================
    // DELETE PRODUCT
    // =========================

    const handleDeleteProduct = async (
        productId
    ) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await api.delete(
                `/products/${productId}`
            );

            alert(
                "Product deleted successfully!"
            );

            fetchProducts();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete product"
            );
        }
    };


    // =========================
    // RESET FORM
    // =========================

    const resetForm = () => {

        setFormData({
            name: "",
            sku: "",
            description: "",
            price: "",
            quantity: "",
            category: "",
            supplier: "",
            minimumStock: ""
        });

        setEditingProduct(null);
        setShowForm(false);
    };


    // =========================
    // STOCK STATUS
    // =========================

    const getStockStatus = (product) => {

        const quantity =
            Number(product.quantity) || 0;

        const minimumStock =
            Number(product.minimumStock) || 0;


        if (quantity === 0) {
            return {
                text: "Out of Stock",
                className: "out"
            };
        }


        if (quantity <= minimumStock) {
            return {
                text: "Low Stock",
                className: "low"
            };
        }


        return {
            text: "In Stock",
            className: "in"
        };
    };


    // =========================
    // PRODUCT INITIAL
    // =========================

    const getInitial = (name) => {

        if (!name) {
            return "P";
        }

        return name
            .charAt(0)
            .toUpperCase();
    };


    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="products-loading">

                <div className="products-spinner">
                </div>

                Loading products...

            </div>
        );
    }


    // =========================
    // ERROR
    // =========================

    if (error) {
        return (
            <div className="products-error">

                <h2>
                    {error}
                </h2>

                <button
                    onClick={fetchProducts}
                >
                    Try Again
                </button>

            </div>
        );
    }


    return (
        <div className="products-page">


            {/* =========================
                HEADER
            ========================= */}

            <div className="products-header">

                <div>

                    <span className="page-label">
                        INVENTORY MANAGEMENT
                    </span>

                    <h1>
                        Products
                    </h1>

                    <p>
                        Manage your products,
                        stock and pricing.
                    </p>

                </div>


                {isAdmin && (

                    <button
                        className="add-product-button"
                        onClick={() => {

                            if (showForm) {
                                resetForm();
                            } else {
                                setShowForm(true);
                            }

                        }}
                    >
                        {showForm
                            ? "Close Form"
                            : "+ Add Product"}
                    </button>

                )}

            </div>


            {/* =========================
                ADD / EDIT FORM
            ========================= */}

            {showForm && isAdmin && (

                <div className="product-form-panel">

                    <div className="form-panel-header">

                        <div>

                            <span>
                                PRODUCT
                            </span>

                            <h2>
                                {editingProduct
                                    ? "Edit Product"
                                    : "Add New Product"}
                            </h2>

                        </div>

                        <button
                            className="close-form-button"
                            onClick={resetForm}
                        >
                            ×
                        </button>

                    </div>


                    <form
                        className="product-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="form-field">

                            <label>
                                Product Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={
                                    formData.name
                                }
                                onChange={
                                    handleFormChange
                                }
                                placeholder="Enter product name"
                                required
                            />

                        </div>


                        <div className="form-field">

                            <label>
                                SKU
                            </label>

                            <input
                                type="text"
                                name="sku"
                                value={
                                    formData.sku
                                }
                                onChange={
                                    handleFormChange
                                }
                                placeholder="e.g. LAP-001"
                                required
                            />

                        </div>


                        <div className="form-field form-field-wide">

                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={
                                    handleFormChange
                                }
                                placeholder="Enter product description"
                            />

                        </div>


                        <div className="form-field">

                            <label>
                                Price
                            </label>

                            <input
                                type="number"
                                name="price"
                                value={
                                    formData.price
                                }
                                onChange={
                                    handleFormChange
                                }
                                min="0"
                                placeholder="0"
                                required
                            />

                        </div>


                        <div className="form-field">

                            <label>
                                Quantity
                            </label>

                            <input
                                type="number"
                                name="quantity"
                                value={
                                    formData.quantity
                                }
                                onChange={
                                    handleFormChange
                                }
                                min="0"
                                placeholder="0"
                                required
                            />

                        </div>


                        <div className="form-field">

                            <label>
                                Minimum Stock
                            </label>

                            <input
                                type="number"
                                name="minimumStock"
                                value={
                                    formData.minimumStock
                                }
                                onChange={
                                    handleFormChange
                                }
                                min="0"
                                placeholder="0"
                                required
                            />

                        </div>


                        <div className="form-field">

                            <label>
                                Category
                            </label>

                            <select
                                name="category"
                                value={
                                    formData.category
                                }
                                onChange={
                                    handleFormChange
                                }
                                required
                            >

                                <option value="">
                                    Select Category
                                </option>

                                {categories.map(
                                    (item) => (

                                        <option
                                            key={
                                                item._id
                                            }
                                            value={
                                                item._id
                                            }
                                        >
                                            {
                                                item.name
                                            }
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        <div className="form-field">

                            <label>
                                Supplier
                            </label>

                            <select
                                name="supplier"
                                value={
                                    formData.supplier
                                }
                                onChange={
                                    handleFormChange
                                }
                                required
                            >

                                <option value="">
                                    Select Supplier
                                </option>

                                {suppliers.map(
                                    (item) => (

                                        <option
                                            key={
                                                item._id
                                            }
                                            value={
                                                item._id
                                            }
                                        >
                                            {
                                                item.name
                                            }
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        <div className="form-actions">

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="save-product-button"
                            >
                                {editingProduct
                                    ? "Update Product"
                                    : "Create Product"}
                            </button>

                        </div>

                    </form>

                </div>

            )}


            {/* =========================
                FILTER BAR
            ========================= */}

            <div className="product-toolbar">

                <div className="search-box">

                    <span>
                        ⌕
                    </span>

                    <input
                        type="text"
                        placeholder="Search by name or SKU..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        onKeyDown={(e) => {

                            if (
                                e.key ===
                                "Enter"
                            ) {
                                handleSearch();
                            }

                        }}
                    />

                </div>


                <select
                    value={category}
                    onChange={(e) =>
                        setCategory(
                            e.target.value
                        )
                    }
                >

                    <option value="">
                        All Categories
                    </option>

                    {categories.map(
                        (item) => (

                            <option
                                key={
                                    item._id
                                }
                                value={
                                    item._id
                                }
                            >
                                {
                                    item.name
                                }
                            </option>

                        )
                    )}

                </select>


                <select
                    value={supplier}
                    onChange={(e) =>
                        setSupplier(
                            e.target.value
                        )
                    }
                >

                    <option value="">
                        All Suppliers
                    </option>

                    {suppliers.map(
                        (item) => (

                            <option
                                key={
                                    item._id
                                }
                                value={
                                    item._id
                                }
                            >
                                {
                                    item.name
                                }
                            </option>

                        )
                    )}

                </select>


                <select
                    value={sort}
                    onChange={(e) =>
                        setSort(
                            e.target.value
                        )
                    }
                >

                    <option value="">
                        Sort By
                    </option>

                    <option value="price_asc">
                        Price: Low → High
                    </option>

                    <option value="price_desc">
                        Price: High → Low
                    </option>

                    <option value="quantity_asc">
                        Stock: Low → High
                    </option>

                    <option value="quantity_desc">
                        Stock: High → Low
                    </option>

                    <option value="name_asc">
                        Name: A → Z
                    </option>

                    <option value="name_desc">
                        Name: Z → A
                    </option>

                </select>


                <button
                    className="search-button"
                    onClick={handleSearch}
                >
                    Search
                </button>


                <button
                    className="clear-button"
                    onClick={clearFilters}
                >
                    Clear
                </button>


                <div className="view-toggle">

                    <button
                        className={
                            view === "list"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setView("list")
                        }
                    >
                        ☰
                    </button>

                    <button
                        className={
                            view === "grid"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setView("grid")
                        }
                    >
                        ▦
                    </button>

                </div>

            </div>


            {/* =========================
                RESULTS
            ========================= */}

            <div className="results-bar">

                <div>

                    <strong>
                        {total}
                    </strong>

                    <span>
                        {" "}products found
                    </span>

                </div>


                <span>
                    Page {page} of {pages}
                </span>

            </div>


            {/* =========================
                EMPTY STATE
            ========================= */}

            {products.length === 0 ? (

                <div className="products-empty">

                    <div className="empty-icon">
                        ▣
                    </div>

                    <h2>
                        No products found
                    </h2>

                    <p>
                        Try changing your search
                        or filter settings.
                    </p>

                    <button
                        onClick={clearFilters}
                    >
                        Clear Filters
                    </button>

                </div>

            ) : view === "grid" ? (

                /* =========================
                    GRID
                ========================= */

                <div className="product-grid">

                    {products.map(
                        (product) => {

                            const status =
                                getStockStatus(
                                    product
                                );

                            return (

                                <div
                                    className="product-card"
                                    key={
                                        product._id
                                    }
                                >

                                    <div className="product-card-top">

                                        <div className="product-avatar">
                                            {
                                                getInitial(
                                                    product.name
                                                )
                                            }
                                        </div>

                                        <span
                                            className={
                                                `stock-badge ${status.className}`
                                            }
                                        >
                                            <span>
                                            </span>

                                            {
                                                status.text
                                            }
                                        </span>

                                    </div>


                                    <h3>
                                        {
                                            product.name
                                        }
                                    </h3>


                                    <p className="product-sku">
                                        SKU:{" "}
                                        {
                                            product.sku
                                        }
                                    </p>


                                    <div className="product-card-info">

                                        <div>

                                            <span>
                                                PRICE
                                            </span>

                                            <strong>
                                                ₹
                                                {Number(
                                                    product.price ||
                                                    0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                STOCK
                                            </span>

                                            <strong>
                                                {
                                                    product.quantity
                                                }
                                            </strong>

                                        </div>

                                    </div>


                                    <div className="product-category">

                                        <span>
                                            {product
                                                .category
                                                ?.name ||
                                                "No Category"}
                                        </span>

                                    </div>


                                    {isAdmin && (

                                        <div className="product-actions">

                                            <button
                                                className="edit-button"
                                                onClick={() =>
                                                    handleEditClick(
                                                        product
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-button"
                                                onClick={() =>
                                                    handleDeleteProduct(
                                                        product._id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    )}

                                </div>

                            );
                        }
                    )}

                </div>

            ) : (

                /* =========================
                    LIST
                ========================= */

                <div className="products-table-wrapper">

                    <table className="products-table">

                        <thead>

                            <tr>

                                <th>
                                    Product
                                </th>

                                <th>
                                    SKU
                                </th>

                                <th>
                                    Price
                                </th>

                                <th>
                                    Stock
                                </th>

                                <th>
                                    Category
                                </th>

                                <th>
                                    Supplier
                                </th>

                                <th>
                                    Min. Stock
                                </th>

                                <th>
                                    Status
                                </th>

                                {isAdmin && (
                                    <th>
                                        Actions
                                    </th>
                                )}

                            </tr>

                        </thead>


                        <tbody>

                            {products.map(
                                (product) => {

                                    const status =
                                        getStockStatus(
                                            product
                                        );

                                    return (

                                        <tr
                                            key={
                                                product._id
                                            }
                                        >

                                            <td>

                                                <div className="table-product">

                                                    <div className="product-avatar small">
                                                        {
                                                            getInitial(
                                                                product.name
                                                            )
                                                        }
                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {
                                                                product.name
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                product.description
                                                                    ?.substring(
                                                                        0,
                                                                        35
                                                                    ) ||
                                                                "No description"
                                                            }
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            <td>

                                                <span className="sku">
                                                    {
                                                        product.sku
                                                    }
                                                </span>

                                            </td>


                                            <td>

                                                <strong className="price">
                                                    ₹
                                                    {Number(
                                                        product.price ||
                                                        0
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </strong>

                                            </td>


                                            <td>

                                                <strong className="quantity">
                                                    {
                                                        product.quantity
                                                    }
                                                </strong>

                                            </td>


                                            <td>

                                                {
                                                    product
                                                        .category
                                                        ?.name ||
                                                    "N/A"
                                                }

                                            </td>


                                            <td>

                                                {
                                                    product
                                                        .supplier
                                                        ?.name ||
                                                    product
                                                        .supplier ||
                                                    "N/A"
                                                }

                                            </td>


                                            <td>

                                                {
                                                    product.minimumStock
                                                }

                                            </td>


                                            <td>

                                                <span
                                                    className={
                                                        `stock-badge ${status.className}`
                                                    }
                                                >

                                                    <span>
                                                    </span>

                                                    {
                                                        status.text
                                                    }

                                                </span>

                                            </td>


                                            {isAdmin && (

                                                <td>

                                                    <div className="table-actions">

                                                        <button
                                                            className="edit-button"
                                                            onClick={() =>
                                                                handleEditClick(
                                                                    product
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="delete-button"
                                                            onClick={() =>
                                                                handleDeleteProduct(
                                                                    product._id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            )}

                                        </tr>

                                    );
                                }
                            )}

                        </tbody>

                    </table>

                </div>

            )}


            {/* =========================
                PAGINATION
            ========================= */}

            <div className="pagination">

                <button
                    disabled={
                        page === 1
                    }
                    onClick={() =>
                        setPage(
                            page - 1
                        )
                    }
                >
                    ←
                </button>


                {Array.from(
                    {
                        length: pages
                    },
                    (_, index) => {

                        const pageNumber =
                            index + 1;

                        return (

                            <button
                                key={
                                    pageNumber
                                }
                                className={
                                    page ===
                                    pageNumber
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setPage(
                                        pageNumber
                                    )
                                }
                            >
                                {
                                    pageNumber
                                }
                            </button>

                        );

                    }
                )}


                <button
                    disabled={
                        page >= pages
                    }
                    onClick={() =>
                        setPage(
                            page + 1
                        )
                    }
                >
                    →
                </button>

            </div>

        </div>
    );
}

export default Products;