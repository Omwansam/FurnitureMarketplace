import { useQuery } from "@tanstack/react-query";
import { StarIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Mock reviews data since we don't have a dedicated API for featured reviews
const mockReviews = [
  {
    id: 1,
    rating: 5,
    text: "The quality of the furniture exceeded my expectations. The sofa I purchased is not only beautiful but also extremely comfortable and durable.",
    name: "Sarah Johnson",
    location: "New York, NY",
    avatarUrl: "https://randomuser.me/api/portraits/women/22.jpg"
  },
  {
    id: 2,
    rating: 4.5,
    text: "The delivery was quick and the assembly was straightforward. The dining table looks exactly like the pictures and fits perfectly in my space.",
    name: "Michael Chen",
    location: "San Francisco, CA",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 3,
    rating: 5,
    text: "Customer service was outstanding. When I had an issue with my order, they resolved it immediately. I'll definitely be shopping here again!",
    name: "Emma Thompson",
    location: "Chicago, IL",
    avatarUrl: "https://randomuser.me/api/portraits/women/58.jpg"
  }
];

export default function CustomerReviews() {
  // In a real app, you would fetch this data from the API
  const { data: reviews, isLoading, error } = useQuery({
    queryKey: ['/api/reviews/featured'],
    queryFn: () => new Promise((resolve) => setTimeout(() => resolve(mockReviews), 500)),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Helper function to render stars
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIcon key={`full-${i}`} className="fill-yellow-400 text-yellow-400 h-5 w-5" />
      );
    }
    
    // Half star
    if (hasHalfStar) {
      stars.push(
        <svg 
          key="half" 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-yellow-400"
        >
          <path d="M12 17.8 5.8 21 7 14.1 2 9.3l7-1L12 2" fill="#FACC15" />
        </svg>
      );
    }
    
    // Empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarIcon key={`empty-${i}`} className="text-yellow-400 h-5 w-5" />
      );
    }
    
    return stars;
  };
  
  if (isLoading) {
    return (
      <section className="py-12 bg-neutral-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">What Our Customers Say</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                <Skeleton className="h-5 w-24 mb-3" />
                <Skeleton className="h-20 w-full mb-4" />
                <div className="flex items-center">
                  <Skeleton className="h-10 w-10 rounded-full mr-3" />
                  <div>
                    <Skeleton className="h-5 w-24 mb-1" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  if (error) {
    return (
      <section className="py-12 bg-neutral-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">What Our Customers Say</h2>
          
          <div className="text-center text-red-500 py-8">
            Error loading reviews. Please try again later.
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-12 bg-neutral-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">What Our Customers Say</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review: any) => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex text-yellow-400 mb-3">
                {renderStars(review.rating)}
              </div>
              <p className="text-neutral-700 mb-4">{review.text}</p>
              <div className="flex items-center">
                <img 
                  src={review.avatarUrl} 
                  alt={`${review.name}'s avatar`} 
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <h4 className="font-medium">{review.name}</h4>
                  <p className="text-sm text-neutral-500">{review.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
