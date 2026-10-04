import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Categories.css";

function Categories() {
    const { isAdmin } = useAuth();

    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: ""
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/categories");

            const data = response.data;

            setCategories(
                Array.isArray(data)
                    ? data
                    : data?.categories || data?.data || []
            );
        } catch (err) {
            console.error("Category loading error:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load categories."
            );
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = () => {
        if (!isAdmin) return;

        setEditingCategory(null);

        setFormData({
            name: "",
            description: ""
        });

        setShowModal(true);
    };

    const openEditModal = (category) => {
        if (!isAdmin) return;

        setEditingCategory(category);

        setFormData({
            name: category.name || "",
            description: category.description || ""
        });

        setShowModal(true);
    };

    const closeModal = () => {
        if (saving) return;

        setShowModal(false);
        setEditingCategory(null);

        setFormData({
            name: "",
            description: ""
        });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAdmin) return;

        const name = formData.name.trim();
        const description = formData.description.trim();

        if (!name) {
            alert("Please enter a category name.");
            return;
        }

        try {
            setSaving(true);

            if (editingCategory) {
                await api.put(
                    `/categories/${editingCategory._id}`,
                    {
                        name,
                        description
                    }
                );

                alert("Category updated successfully.");
            } else {
                await api.post("/categories", {
                    name,
                    description
                });

                alert("Category created successfully.");
            }

            closeModal();
            await loadCategories();
        } catch (err) {
            console.error("Category save error:", err);

            alert(
                err.response?.data?.message ||
                "Failed to save category."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (category) => {
        if (!isAdmin) return;

        const confirmed = window.confirm(
            `Are you sure you want to delete "${category.name}"?`
        );

        if (!confirmed) return;

        try {
            await api.delete(`/categories/${category._id}`);

            alert("Category deleted successfully.");

            await loadCategories();
        } catch (err) {
            console.error("Category delete error:", err);

            alert(
                err.response?.data?.message ||
                "Failed to delete category."
            );
        }
    };

    const getInitial = (name) => {
        if (!name) return "?";

        return name.charAt(0).toUpperCase();
    };

    const getCategoryClass = (index) => {
        const classes = [
            "blue",
            "purple",
            "green",
            "orange",
            "cyan",
            "pink"
        ];

        return classes[index % classes.length];
    };

    const filteredCategories = categories.filter((category) => {
        const searchText = search.toLowerCase().trim();

        const name = category.name?.toLowerCase() || "";
        const description =
            category.description?.toLowerCase() || "";

        return (
            name.includes(searchText) ||
            description.includes(searchText)
        );
    });

    if (loading) {
        return (
            <div className="categories-loading">
                <div className="categories-spinner"></div>
                <span>Loading categories...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="categories-error">
                <div className="categories-error-icon">!</div>

                <h2>Unable to load categories</h2>

                <p>{error}</p>

                <button onClick={loadCategories}>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="categories-page">

            {/* PAGE HEADER */}
            <div className="categories-header">

                <div className="categories-header-content">
                    <span className="categories-label">
                        MANAGEMENT
                    </span>

                    <h1>Categories</h1>

                    <p>
                        {isAdmin
                            ? "Create and manage your product categories."
                            : "Browse your product categories."
                        }
                    </p>
                </div>

                <div className="categories-header-actions">

                    <div className="category-total">
                        <strong>
                            {categories.length}
                        </strong>

                        <span>
                            Total Categories
                        </span>
                    </div>

                    {isAdmin && (
                        <button
                            className="add-category-button"
                            onClick={openAddModal}
                        >
                            <span>+</span>
                            Add Category
                        </button>
                    )}

                </div>
            </div>


            {/* SEARCH / TOOLBAR */}
            <div className="categories-toolbar">

                <div className="categories-toolbar-left">

                    <div className="categories-section-icon">
                        ▦
                    </div>

                    <div>
                        <h2>All Categories</h2>

                        <p>
                            {isAdmin
                                ? "Organize and manage your product groups."
                                : "Explore the categories available in the system."
                            }
                        </p>
                    </div>

                </div>

                <div className="categories-search">

                    <span className="search-icon">
                        ⌕
                    </span>

                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    {search && (
                        <button
                            className="clear-search"
                            onClick={() => setSearch("")}
                        >
                            ×
                        </button>
                    )}

                </div>

            </div>


            {/* CATEGORY GRID */}
            {filteredCategories.length === 0 ? (

                <div className="categories-empty">

                    <div className="categories-empty-icon">
                        ▦
                    </div>

                    <h3>
                        {search
                            ? "No categories found"
                            : "No categories available"
                        }
                    </h3>

                    <p>
                        {search
                            ? "Try searching with a different category name."
                            : isAdmin
                                ? "Create your first category to get started."
                                : "There are currently no categories to display."
                        }
                    </p>

                    {search ? (
                        <button
                            onClick={() => setSearch("")}
                        >
                            Clear Search
                        </button>
                    ) : (
                        isAdmin && (
                            <button
                                onClick={openAddModal}
                            >
                                + Add Category
                            </button>
                        )
                    )}

                </div>

            ) : (

                <div className="categories-grid">

                    {filteredCategories.map(
                        (category, index) => (

                            <div
                                className="category-card"
                                key={category._id}
                            >

                                <div className="category-card-top">

                                    <div
                                        className={`category-letter ${getCategoryClass(
                                            index
                                        )}`}
                                    >
                                        {getInitial(
                                            category.name
                                        )}
                                    </div>

                                    {isAdmin && (
                                        <div className="category-actions">

                                            <button
                                                className="category-edit"
                                                onClick={() =>
                                                    openEditModal(
                                                        category
                                                    )
                                                }
                                                title="Edit category"
                                            >
                                                ✎
                                            </button>

                                            <button
                                                className="category-delete"
                                                onClick={() =>
                                                    handleDelete(
                                                        category
                                                    )
                                                }
                                                title="Delete category"
                                            >
                                                ×
                                            </button>

                                        </div>
                                    )}

                                </div>


                                <div className="category-card-content">

                                    <h3>
                                        {category.name}
                                    </h3>

                                    <p>
                                        {category.description ||
                                            "No description provided."}
                                    </p>

                                </div>


                                <div className="category-card-footer">

                                    <span className="category-status-dot"></span>

                                    <span>
                                        Active Category
                                    </span>

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}


            {/* MODAL */}
            {showModal && isAdmin && (

                <div
                    className="category-modal-overlay"
                    onClick={closeModal}
                >

                    <div
                        className="category-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="category-modal-header">

                            <div>

                                <span>
                                    CATEGORY MANAGEMENT
                                </span>

                                <h2>
                                    {editingCategory
                                        ? "Edit Category"
                                        : "Add Category"
                                    }
                                </h2>

                                <p>
                                    {editingCategory
                                        ? "Update the category information."
                                        : "Create a new product category."
                                    }
                                </p>

                            </div>

                            <button
                                className="category-modal-close"
                                onClick={closeModal}
                                disabled={saving}
                            >
                                ×
                            </button>

                        </div>


                        <form
                            onSubmit={handleSubmit}
                            className="category-form"
                        >

                            <div className="category-form-field">

                                <label>
                                    Category Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter category name"
                                    autoFocus
                                    required
                                />

                            </div>


                            <div className="category-form-field">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe this category..."
                                    rows="4"
                                />

                            </div>


                            <div className="category-modal-actions">

                                <button
                                    type="button"
                                    className="category-cancel-button"
                                    onClick={closeModal}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="category-save-button"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingCategory
                                            ? "Update Category"
                                            : "Create Category"
                                    }
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Categories;