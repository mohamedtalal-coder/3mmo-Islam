"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/src/lib/api";
import { Card } from "@/src/shared/components/ui/Card";
import { Button } from "@/src/shared/components/ui/Button";
import { Input } from "@/src/shared/components/ui/Input";
import { Loader2, Plus, Edit2, Trash2, Key, Users } from "lucide-react";
import { toast } from "sonner";

type Assistant = {
  id: string;
  email: string;
  fullName: string;
  permissions: string[];
  createdAt: string;
};

const PERMISSIONS_LIST = [
  { id: "DASHBOARD", label: "اللوحة الرئيسية" },
  { id: "COURSE", label: "الدورات" },
  { id: "GRADE", label: "المراحل" },
  { id: "STUDENT", label: "الطلاب" },
  { id: "QUIZ", label: "الاختبارات" },
  { id: "REVIEW", label: "المراجعات" },
  { id: "FAQ", label: "الأسئلة الشائعة" },
  { id: "SETTINGS", label: "الإعدادات" },
];

export function AssistantsClient() {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [permissions, setPermissions] = useState<string[]>([]);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadAssistants();
  }, []);

  const loadAssistants = async () => {
    try {
      setLoading(true);
      const data = await fetchApi("/teacher/assistants");
      setAssistants(data);
    } catch (error) {
      toast.error("حدث خطأ أثناء تحميل المساعدين");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setEmail("");
    setPassword("");
    setFullName("");
    setPermissions([]);
    setIsModalOpen(true);
  };

  const openEditModal = (assistant: Assistant) => {
    setEditingId(assistant.id);
    setEmail(assistant.email);
    setFullName(assistant.fullName);
    setPermissions(assistant.permissions || []);
    setIsModalOpen(true);
  };

  const openPasswordModal = (assistant: Assistant) => {
    setEditingId(assistant.id);
    setPassword("");
    setIsPasswordModalOpen(true);
  };

  const handleTogglePermission = (permId: string) => {
    setPermissions(prev => 
      prev.includes(permId) ? prev.filter(p => p !== permId) : [...prev, permId]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingId) {
        await fetchApi(`/teacher/assistants/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify({ fullName, permissions })
        });
        toast.success("تم التحديث بنجاح");
      } else {
        await fetchApi("/teacher/assistants", {
          method: "POST",
          body: JSON.stringify({ email, password, fullName, permissions })
        });
        toast.success("تم إنشاء الحساب بنجاح");
      }
      setIsModalOpen(false);
      loadAssistants();
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ");
    } finally {
      setFormLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await fetchApi(`/teacher/assistants/${editingId}/password`, {
        method: "PATCH",
        body: JSON.stringify({ password })
      });
      toast.success("تم تغيير كلمة المرور بنجاح");
      setIsPasswordModalOpen(false);
    } catch (error: any) {
      toast.error("حدث خطأ أثناء تغيير كلمة المرور");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المساعد؟")) return;
    try {
      await fetchApi(`/teacher/assistants/${id}`, { method: "DELETE" });
      toast.success("تم الحذف بنجاح");
      loadAssistants();
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-display text-primary flex items-center gap-2">
            <Users className="text-accent" />
            حسابات المساعدين
          </h2>
          <p className="text-muted font-body text-sm mt-1">
            إدارة حسابات المساعدين والصلاحيات المخصصة لهم
          </p>
        </div>
        <Button onClick={openCreateModal} leftIcon={<Plus size={18} />}>
          إضافة مساعد جديد
        </Button>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : assistants.length === 0 ? (
          <div className="text-center py-12 text-muted">
            لا يوجد مساعدين حالياً. قم بإضافة مساعد جديد للبدء.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right font-body">
              <thead className="bg-surface border-b border-surfaceBorder text-muted text-sm">
                <tr>
                  <th className="py-4 px-6 font-semibold">الاسم</th>
                  <th className="py-4 px-6 font-semibold">البريد الإلكتروني</th>
                  <th className="py-4 px-6 font-semibold">الصلاحيات</th>
                  <th className="py-4 px-6 font-semibold text-left">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surfaceBorder text-sm">
                {assistants.map((assistant) => (
                  <tr key={assistant.id} className="hover:bg-surface/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-primary">
                      {assistant.fullName}
                    </td>
                    <td className="py-4 px-6 text-muted font-mono text-xs">
                      {assistant.email}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {assistant.permissions?.length > 0 ? (
                          assistant.permissions.map(p => {
                            const label = PERMISSIONS_LIST.find(x => x.id === p)?.label || p;
                            return (
                              <span key={p} className="bg-accent/10 text-accent px-2 py-0.5 rounded-full text-xs">
                                {label}
                              </span>
                            );
                          })
                        ) : (
                          <span className="text-muted text-xs">لا يوجد صلاحيات</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-left">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openPasswordModal(assistant)}
                          className="p-2 text-warning hover:bg-warning/10 rounded-lg transition-colors"
                          title="تغيير كلمة المرور"
                        >
                          <Key size={16} />
                        </button>
                        <button
                          onClick={() => openEditModal(assistant)}
                          className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
                          title="تعديل الصلاحيات"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(assistant.id)}
                          className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors"
                          title="حذف المساعد"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface border border-surfaceBorder rounded-2xl w-full max-w-lg p-6 shadow-xl">
            <h3 className="text-xl font-display text-primary mb-6">
              {editingId ? "تعديل المساعد" : "إضافة مساعد جديد"}
            </h3>
            <form onSubmit={handleSave} className="space-y-5">
              <Input
                label="الاسم الكامل"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              
              <Input
                label="البريد الإلكتروني"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={!!editingId}
                dir="ltr"
              />
              
              {!editingId && (
                <Input
                  label="كلمة المرور"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  dir="ltr"
                />
              )}

              <div className="space-y-3 pt-2">
                <label className="text-sm font-semibold text-primary">الصلاحيات:</label>
                <div className="grid grid-cols-2 gap-3">
                  {PERMISSIONS_LIST.map(perm => (
                    <label key={perm.id} className="flex items-center gap-2 text-sm text-muted cursor-pointer hover:text-primary transition-colors">
                      <input
                        type="checkbox"
                        checked={permissions.includes(perm.id)}
                        onChange={() => handleTogglePermission(perm.id)}
                        className="w-4 h-4 rounded border-surfaceBorder text-accent focus:ring-accent accent-accent"
                      />
                      {perm.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-surfaceBorder mt-6">
                <Button type="submit" disabled={formLoading} className="flex-1">
                  {formLoading ? <Loader2 size={18} className="animate-spin" /> : "حفظ"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
                  إلغاء
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PASSWORD RESET MODAL */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface border border-surfaceBorder rounded-2xl w-full max-w-sm p-6 shadow-xl">
            <h3 className="text-xl font-display text-primary mb-6">
              تغيير كلمة المرور
            </h3>
            <form onSubmit={handlePasswordReset} className="space-y-5">
              <Input
                label="كلمة المرور الجديدة"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                dir="ltr"
              />

              <div className="flex gap-3 pt-4 border-t border-surfaceBorder mt-6">
                <Button type="submit" disabled={formLoading} className="flex-1">
                  {formLoading ? <Loader2 size={18} className="animate-spin" /> : "تغيير"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsPasswordModalOpen(false)} className="flex-1">
                  إلغاء
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
