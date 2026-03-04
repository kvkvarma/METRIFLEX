import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function AccordionDemo() {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="shipping"
      className="w-6xl p-4 overflow-y-auto"
    >
      <AccordionItem value="shipping">
        <AccordionTrigger>What are your shipping options?</AccordionTrigger>
        <AccordionContent className="max-h-20 overflow-y-auto">
          <p>shipping. Free shipping on international orders. shipping. Free</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="returns">
        <AccordionTrigger>What is your return policy?</AccordionTrigger>
        <AccordionContent className="max-h-20 overflow-y-auto">
          <p>shipping. Free shipping on international orders. shipping. Free</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="c">
        <AccordionTrigger>What is your return policy?</AccordionTrigger>
        <AccordionContent className="max-h-20 overflow-y-auto">
          <p>shipping. Free shipping on international orders. shipping. Free</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
export default AccordionDemo;
