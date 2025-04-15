import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative bg-neutral-100 overflow-hidden">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Modern Furniture for Modern Living</h1>
            <p className="text-lg text-neutral-700 mb-8">
              Transform your space with our curated collection of contemporary furniture.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop">
                <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-6 rounded-lg font-medium transition">
                  Shop Collection
                </Button>
              </Link>
              <Link href="/shop/living-room">
                <Button variant="outline" className="bg-white hover:bg-neutral-100 text-primary border border-primary px-6 py-6 rounded-lg font-medium transition">
                  Explore Designs
                </Button>
              </Link>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <img 
              src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Modern living room with stylish furniture" 
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
