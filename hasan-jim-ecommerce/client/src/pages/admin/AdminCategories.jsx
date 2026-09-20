import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import api from "../../services/api";
import Loader from "../../components/Loader";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = () => api.get("/categories").then((res) => setCategories(res.data));

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await api.post("/categories", { name });
      setName("");
      toast.success("Category added");
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category? Products in it will become uncategorized.")) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-mist-50">Categories</h1>

      <form onSubmit={handleAdd} className="card-surface mt-6 flex gap-3 p-5">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          className="input-field text-sm"
        />
        <button type="submit" disabled={submitting} className="btn-primary shrink-0 !px-5 !py-2 text-sm">
          Add
        </button>
      </form>

      <div className="card-surface mt-6 divide-y divide-ink-800">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between p-4">
            <div>
              <div className="text-mist-50">{c.name}</div>
              <div className="text-xs text-mist-500">{c.product_count} products</div>
            </div>
            <button onClick={() => handleDelete(c.id)} className="rounded-lg border border-ink-600 p-1.5 text-mist-300 hover:border-red-500 hover:text-red-400">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {categories.length === 0 && <p className="p-8 text-center text-mist-500">No categories yet.</p>}
      </div>
    </div>
  );
}
