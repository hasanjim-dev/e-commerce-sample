import { useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address_line: user?.address_line || "",
    city: user?.city || "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.put("/auth/me", form);
      updateUser(data);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-page max-w-lg py-10">
      <h1 className="font-display text-3xl font-semibold text-mist-50">My Profile</h1>
      <p className="mt-1 text-sm text-mist-400">{user?.email}</p>

      <form onSubmit={handleSubmit} className="card-surface mt-8 space-y-4 p-6">
        <div>
          <label className="mb-1.5 block text-sm text-mist-300">Full name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-mist-300">Phone</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-mist-300">Address</label>
          <input value={form.address_line} onChange={(e) => setForm({ ...form, address_line: e.target.value })} className="input-field" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-mist-300">City</label>
          <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-field" />
        </div>
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
