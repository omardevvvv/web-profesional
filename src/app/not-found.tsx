import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-[#D4A843] font-bold text-8xl mb-4 font-[var(--font-heading)]">
          404
        </p>
        <h1 className="text-white text-3xl font-bold mb-3 font-[var(--font-heading)]">
          Página no encontrada
        </h1>
        <p className="text-white/60 mb-8 max-w-sm mx-auto">
          La página que busca no existe o ha sido movida.
        </p>
        <Button
          asChild
          className="bg-[#D4A843] hover:bg-[#F0C75E] text-[#0A1628] font-semibold"
        >
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>
        </Button>
      </div>
    </div>
  );
}
