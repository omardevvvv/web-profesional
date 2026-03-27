import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AnimatedSection } from "./AnimatedSection";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqSectionProps {
  items: FaqItem[];
}

export function FaqSection({ items }: FaqSectionProps) {
  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <span className="text-[#D4A843] font-medium text-sm uppercase tracking-widest">
            Preguntas Frecuentes
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0A1628] mt-3 mb-4 font-[var(--font-heading)]">
            Resolvemos Sus Dudas
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Estas son algunas de las preguntas que nos hacen con más frecuencia
            nuestros clientes.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <Accordion className="space-y-3">
            {items.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border border-gray-100 rounded-xl px-6 shadow-sm"
              >
                <AccordionTrigger className="text-[#0A1628] font-medium text-left hover:text-[#D4A843] hover:no-underline py-5">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-500 leading-relaxed pb-5">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AnimatedSection>
      </div>
    </section>
  );
}
