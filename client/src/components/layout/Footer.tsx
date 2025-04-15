import { Link } from "wouter";
import { FacebookIcon, InstagramIcon, Facebook, TwitterIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold">Furnish<span className="text-[#D9843A]">Home</span></span>
            </Link>
            <p className="text-neutral-400 mb-4">
              Transform your space with modern, high-quality furniture that combines style, comfort, and durability.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white transition">
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition">
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition">
                <TwitterIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shop/living-room" className="text-neutral-400 hover:text-white transition">
                  Living Room
                </Link>
              </li>
              <li>
                <Link href="/shop/bedroom" className="text-neutral-400 hover:text-white transition">
                  Bedroom
                </Link>
              </li>
              <li>
                <Link href="/shop/kitchen-dining" className="text-neutral-400 hover:text-white transition">
                  Dining Room
                </Link>
              </li>
              <li>
                <Link href="/shop/office" className="text-neutral-400 hover:text-white transition">
                  Office
                </Link>
              </li>
              <li>
                <Link href="/shop/outdoor" className="text-neutral-400 hover:text-white transition">
                  Outdoor
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">About</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-neutral-400 hover:text-white transition">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-neutral-400 hover:text-white transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-neutral-400 hover:text-white transition">
                  Press
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-neutral-400 hover:text-white transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="text-neutral-400 hover:text-white transition">
                  Sustainability
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-neutral-400 hover:text-white transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-neutral-400 hover:text-white transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-neutral-400 hover:text-white transition">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="text-neutral-400 hover:text-white transition">
                  Warranty
                </Link>
              </li>
              <li>
                <Link href="/care" className="text-neutral-400 hover:text-white transition">
                  Care Instructions
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-neutral-800 mt-8">
          <div className="grid md:grid-cols-2 gap-4">
            <p className="text-neutral-500 text-sm">© 2023 FurnishHome. All rights reserved.</p>
            <div className="flex md:justify-end space-x-4 text-sm text-neutral-500">
              <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
              <Link href="/cookies" className="hover:text-white transition">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
