import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function PromoBanner() {
  return (
    <section className="py-12 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-[#D9843A] font-medium mb-2 block">Limited Time Offer</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Summer Sale: Up to 40% Off</h2>
            <p className="text-white/80 mb-6">
              Refresh your space with our curated collection of summer favorites at unbeatable prices.
            </p>
            <Link href="/shop?sale=true">
              <Button className="inline-block bg-white text-primary hover:bg-neutral-100 px-6 py-3 rounded-lg font-medium transition">
                Shop the Sale
              </Button>
            </Link>
          </div>
          <div className="flex justify-center md:justify-end">
            <img 
              src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
              alt="Summer collection furniture" 
              className="rounded-lg max-w-full h-auto shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
