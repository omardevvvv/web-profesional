"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteService } from "@/actions/services";
import { toast } from "sonner";

export function DeleteButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("¿Está seguro de que desea eliminar este elemento?")) return;
    setLoading(true);
    try {
      await deleteService(id);
      toast.success("Eliminado correctamente");
    } catch {
      toast.error("Error al eliminar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
      className="text-red-500 hover:text-red-700 hover:bg-red-50"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
