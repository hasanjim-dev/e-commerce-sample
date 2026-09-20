import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Trash2, X } from "lucide-react";
import api from "../../services/api";
import Loader from "../../components/Loader";

const emptyForm = {
  id: null,
  name: "",
  description: "",
  price: "",
  compare_price: "",
  stock: "",
  category_id: "",
  is_featured: false,
  image_url: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadProducts = () =>
    api.get("/products", { params: { limit: 48 } }).then((res) => setProducts(res.data.products));

  useEffect(() => {
    setLoading(true);
    Promise.all([loadProducts(), api.get("/categories").then((res) => setCategories(res.data))]).finally(() =>
      setLoading(false)
    );
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setImageFile(null);
  };

  const handleEdit = (p) => {
    setForm({
      id: p.id,
      name: p.name,
      description: p.description || "",
      price: p.price,
      compare_price: p.compare_price || "",
      stock: p.stock,
      category_id: p.category_id || "",
      is_featured: !!p.is_featured,
      image_url: p.image_url || "",
    });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      loadProducts();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (key === "id") return;
        fd.append(key, key === "is_featured" ? (val ? "1" : "0") : val);
      });
      if (imageFile) fd.append("image", imageFile);

      if (form.id) {
        await api.put(`/products/${form.id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Product updated");
      } else {
        await api.post("/products", fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Product created");
      }
      resetForm();
      loadProducts();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-mist-50">Products</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-[340px_1fr]">
        {/* Form */}
        <form onSubmit={handleSubmit} className="card-surface h-fit space-y-4 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-mist-50">{form.id ? "Edit Product" : "Add Product"}</h2>
            {form.id && (
              <button type="button" onClick={resetForm} className="text-mist-500 hover:text-red-400">
                <X size={16} />
              </button>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs text-mist-400">Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-mist-400">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-mist-400">Price ($)</label>
              <input type="number" step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-mist-400">Compare Price</label>
              <input type="number" step="0.01" value={form.compare_price} onChange={(e) => setForm({ ...form, compare_price: e.target.value })} className="input-field text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-mist-400">Stock</label>
              <input type="number" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-field text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-mist-400">Category</label>
              <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="input-field text-sm">
                <option value="">— None —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-mist-400">Image</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="text-sm text-mist-400" />
            <input
              placeholder="or paste an image URL"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              className="input-field mt-2 text-sm"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-mist-300">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="h-4 w-4 rounded border-ink-600 bg-ink-900 text-violet-500" />
            Featured product
          </label>

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Saving…" : form.id ? "Update product" : "Add product"}
          </button>
        </form>

        {/* Table */}
        <div className="card-surface overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-700 text-left text-mist-400">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-ink-800 last:border-0">
                  <td className="flex items-center gap-3 p-4 text-mist-50">
                    <img src={p.image_url} alt="" className="h-9 w-9 rounded-lg object-cover" />
                    {p.name}
                  </td>
                  <td className="p-4 text-violet-400">${Number(p.price).toFixed(2)}</td>
                  <td className="p-4 text-mist-300">{p.stock}</td>
                  <td className="p-4 text-mist-400">{p.category_name || "—"}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(p)} className="rounded-lg border border-ink-600 p-1.5 text-mist-300 hover:border-violet-500 hover:text-violet-400">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="rounded-lg border border-ink-600 p-1.5 text-mist-300 hover:border-red-500 hover:text-red-400">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
