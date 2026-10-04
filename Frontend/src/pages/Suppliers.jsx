import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Suppliers.css";

function Suppliers() {
    const { isAdmin } = useAuth();

    const [suppliers, setSuppliers] = useState([]);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    const [editingSupplier, setEditingSupplier] = useState(null);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // =========================================
    // FETCH SUPPLIERS
    // =========================================

    const fetchSuppliers = async () => {
        try {
            setLoading(true);

            const response = await api.get("/suppliers");

            const data = response.data;

            setSuppliers(
                Array.isArray(data)
                    ? data
                    : data.suppliers || data.data || []
            );
        } catch (error) {
            console.error("Error fetching suppliers:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    // =========================================
    // RESET FORM
    // =========================================

    const resetForm = () => {
        setName("");
        setEmail("");
        setPhone("");
        setAddress("");
        setEditingSupplier(null);
    };

    // =========================================
    // OPEN ADD MODAL
    // =========================================

    const openAddModal = () => {
        resetForm();
        setShowModal(true);
    };

    // =========================================
    // OPEN EDIT MODAL
    // =========================================

    const handleEdit = (supplier) => {
        setEditingSupplier(supplier);

        setName(supplier.name || "");
        setEmail(supplier.email || "");
        setPhone(supplier.phone || "");
        setAddress(supplier.address || "");

        setShowModal(true);
    };

    // =========================================
    // CLOSE MODAL
    // =========================================

    const closeModal = () => {
        if (saving) return;

        setShowModal(false);
        resetForm();
    };

    // =========================================
    // CREATE / UPDATE
    // =========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            alert("Supplier name is required");
            return;
        }

        if (!email.trim()) {
            alert("Supplier email is required");
            return;
        }

        if (!phone.trim()) {
            alert("Supplier phone is required");
            return;
        }

        if (!address.trim()) {
            alert("Supplier address is required");
            return;
        }

        const supplierData = {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            address: address.trim(),
        };

        try {
            setSaving(true);

            if (editingSupplier) {
                await api.put(
                    `/suppliers/${editingSupplier._id}`,
                    supplierData
                );

                alert("Supplier updated successfully");
            } else {
                await api.post("/suppliers", supplierData);

                alert("Supplier created successfully");
            }

            setShowModal(false);
            resetForm();

            await fetchSuppliers();
        } catch (error) {
            console.error("Supplier save error:", error);

            alert(
                error.response?.data?.message ||
                    "Failed to save supplier"
            );
        } finally {
            setSaving(false);
        }
    };

    // =========================================
    // DELETE SUPPLIER
    // =========================================

    const handleDelete = async (supplier) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${supplier.name}"?`
        );

        if (!confirmed) return;

        try {
            await api.delete(`/suppliers/${supplier._id}`);

            alert("Supplier deleted successfully");

            await fetchSuppliers();
        } catch (error) {
            console.error("Delete supplier error:", error);

            alert(
                error.response?.data?.message ||
                    "Failed to delete supplier"
            );
        }
    };

    // =========================================
    // SEARCH
    // =========================================

    const searchText = search.toLowerCase().trim();

    const filteredSuppliers = suppliers.filter((supplier) => {
        const supplierName =
            supplier.name?.toLowerCase() || "";

        const supplierEmail =
            supplier.email?.toLowerCase() || "";

        const supplierPhone =
            supplier.phone?.toLowerCase() || "";

        const supplierAddress =
            supplier.address?.toLowerCase() || "";

        return (
            supplierName.includes(searchText) ||
            supplierEmail.includes(searchText) ||
            supplierPhone.includes(searchText) ||
            supplierAddress.includes(searchText)
        );
    });

    // =========================================
    // LOADING
    // =========================================

    if (loading) {
        return (
            <div className="suppliers-page">
                <div className="suppliers-loading">
                    <div className="supplier-spinner"></div>
                    <p>Loading suppliers...</p>
                </div>
            </div>
        );
    }

    // =========================================
    // MAIN UI
    // =========================================

    return (
        <div className="suppliers-page">

            {/* ================================
                HEADER
            ================================= */}

            <header className="suppliers-header">

                <div className="suppliers-title-section">

                    <span className="page-label">
                        SUPPLY CHAIN
                    </span>

                    <h1>Suppliers</h1>

                    <p>
                        Manage your suppliers and
                        business partners.
                    </p>

                </div>

                <div className="suppliers-header-right">

                    <div className="supplier-total">

                        <span>TOTAL SUPPLIERS</span>

                        <strong>
                            {suppliers.length}
                        </strong>

                    </div>

                    {isAdmin && (
                        <button
                            type="button"
                            className="add-supplier-button"
                            onClick={openAddModal}
                        >
                            <span className="add-icon">
                                +
                            </span>

                            Add Supplier
                        </button>
                    )}

                </div>

            </header>


            {/* ================================
                MAIN CARD
            ================================= */}

            <section className="supplier-list-card">

                {/* PANEL HEADER */}

                <div className="supplier-list-header">

                    <div className="supplier-list-title">

                        <span className="panel-label">
                            SUPPLIER DIRECTORY
                        </span>

                        <h2>All Suppliers</h2>

                        <p>
                            View and manage your supplier
                            relationships.
                        </p>

                    </div>


                    {/* SEARCH */}

                    <div className="supplier-search">

                        <span className="search-icon">
                            ⌕
                        </span>

                        <input
                            type="text"
                            placeholder="Search suppliers..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                        {search && (
                            <button
                                type="button"
                                className="clear-search"
                                onClick={() =>
                                    setSearch("")
                                }
                            >
                                ×
                            </button>
                        )}

                    </div>

                </div>


                {/* ================================
                    SUPPLIER CONTENT
                ================================= */}

                {filteredSuppliers.length === 0 ? (

                    <div className="suppliers-empty">

                        <div className="empty-supplier-icon">
                            ◇
                        </div>

                        <h3>
                            {search
                                ? "No suppliers found"
                                : "No suppliers yet"}
                        </h3>

                        <p>
                            {search
                                ? "Try searching with another keyword."
                                : "Add your first supplier to get started."}
                        </p>

                        {!search && isAdmin && (
                            <button
                                type="button"
                                onClick={openAddModal}
                            >
                                + Add Supplier
                            </button>
                        )}

                    </div>

                ) : (

                    <div className="suppliers-grid">

                        {filteredSuppliers.map(
                            (supplier, index) => (

                                <article
                                    className="supplier-card"
                                    key={supplier._id}
                                >

                                    {/* CARD TOP */}

                                    <div className="supplier-card-top">

                                        <div
                                            className={`supplier-icon supplier-color-${
                                                index % 5
                                            }`}
                                        >
                                            {supplier.name
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        {isAdmin && (
                                            <div className="supplier-actions">

                                                <button
                                                    type="button"
                                                    className="edit-supplier-btn"
                                                    onClick={() =>
                                                        handleEdit(
                                                            supplier
                                                        )
                                                    }
                                                    title="Edit supplier"
                                                >
                                                    ✎
                                                </button>

                                                <button
                                                    type="button"
                                                    className="delete-supplier-btn"
                                                    onClick={() =>
                                                        handleDelete(
                                                            supplier
                                                        )
                                                    }
                                                    title="Delete supplier"
                                                >
                                                    ×
                                                </button>

                                            </div>
                                        )}

                                    </div>


                                    {/* NAME */}

                                    <h3>
                                        {supplier.name}
                                    </h3>


                                    {/* DETAILS */}

                                    <div className="supplier-details">

                                        <div className="supplier-detail">

                                            <span className="detail-icon">
                                                @
                                            </span>

                                            <div>
                                                <small>
                                                    EMAIL
                                                </small>

                                                <p>
                                                    {supplier.email}
                                                </p>
                                            </div>

                                        </div>


                                        <div className="supplier-detail">

                                            <span className="detail-icon">
                                                ☎
                                            </span>

                                            <div>
                                                <small>
                                                    PHONE
                                                </small>

                                                <p>
                                                    {supplier.phone}
                                                </p>
                                            </div>

                                        </div>


                                        <div className="supplier-detail">

                                            <span className="detail-icon">
                                                ⌖
                                            </span>

                                            <div>
                                                <small>
                                                    ADDRESS
                                                </small>

                                                <p>
                                                    {supplier.address}
                                                </p>
                                            </div>

                                        </div>

                                    </div>


                                    {/* FOOTER */}

                                    <div className="supplier-card-footer">

                                        <span>
                                            SUPPLIER
                                        </span>

                                        <span>
                                            #
                                            {String(index + 1).padStart(
                                                2,
                                                "0"
                                            )}
                                        </span>

                                    </div>

                                </article>
                            )
                        )}

                    </div>
                )}

            </section>


            {/* ================================
                ADD / EDIT MODAL
            ================================= */}

            {showModal && isAdmin && (

                <div
                    className="supplier-modal-overlay"
                    onMouseDown={closeModal}
                >

                    <div
                        className="supplier-modal"
                        onMouseDown={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* MODAL HEADER */}

                        <div className="supplier-modal-header">

                            <div>

                                <span>
                                    SUPPLIER MANAGEMENT
                                </span>

                                <h2>
                                    {editingSupplier
                                        ? "Edit Supplier"
                                        : "Add Supplier"}
                                </h2>

                                <p>
                                    {editingSupplier
                                        ? "Update supplier information."
                                        : "Add a new supplier to your directory."}
                                </p>

                            </div>

                            <button
                                type="button"
                                className="supplier-modal-close"
                                onClick={closeModal}
                                disabled={saving}
                            >
                                ×
                            </button>

                        </div>


                        {/* FORM */}

                        <form onSubmit={handleSubmit}>

                            <div className="supplier-field">

                                <label>
                                    Supplier Name
                                </label>

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) =>
                                        setName(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Example: Tech Solutions Pvt Ltd"
                                    autoFocus
                                    required
                                />

                            </div>


                            <div className="supplier-field">

                                <label>
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                    placeholder="supplier@example.com"
                                    required
                                />

                            </div>


                            <div className="supplier-field">

                                <label>
                                    Phone Number
                                </label>

                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) =>
                                        setPhone(
                                            e.target.value
                                        )
                                    }
                                    placeholder="+91 98765 43210"
                                    required
                                />

                            </div>


                            <div className="supplier-field">

                                <label>
                                    Address
                                </label>

                                <textarea
                                    value={address}
                                    onChange={(e) =>
                                        setAddress(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Supplier business address..."
                                    required
                                />

                            </div>


                            {/* ACTIONS */}

                            <div className="supplier-modal-actions">

                                <button
                                    type="button"
                                    className="supplier-cancel"
                                    onClick={closeModal}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="supplier-save"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingSupplier
                                        ? "Save Changes"
                                        : "Create Supplier"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Suppliers;