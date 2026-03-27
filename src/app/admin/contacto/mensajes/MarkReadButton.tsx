"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { markSubmissionAsRead } from "@/actions/contact";
import { toast } from "sonner";
export function MarkReadButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    setLoading(true);
    try { await markSubmissionAsRead(id); toast.success("Marcado como leído"); }
    catch { toast.error("Error"); }
    finally { setLoading(false); }
  };
  return (
    <Button variant="outline" size="sm" onClick={handleClick} disabled={loading} className="shrink-0 text-xs">
      Marcar leído
    </Button>
  );
}
