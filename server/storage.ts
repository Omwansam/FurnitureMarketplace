import { 
  users, categories, products, cartItems, orders, orderItems, reviews,
  type User, type InsertUser,
  type Category, type InsertCategory,
  type Product, type InsertProduct,
  type CartItem, type InsertCartItem,
  type Order, type InsertOrder,
  type OrderItem, type InsertOrderItem,
  type Review, type InsertReview
} from "@shared/schema";

import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category methods
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Product methods
  getProducts(options?: { 
    categoryId?: number, 
    featured?: boolean, 
    isNew?: boolean,
    search?: string,
    limit?: number,
    offset?: number
  }): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Cart methods
  getCartItems(userId: number): Promise<CartItem[]>;
  getCartItem(id: number): Promise<CartItem | undefined>;
  getUserCartItemByProductId(userId: number, productId: number): Promise<CartItem | undefined>;
  createCartItem(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  deleteCartItem(id: number): Promise<boolean>;
  
  // Order methods
  getOrders(userId?: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, status: string): Promise<Order | undefined>;
  
  // Order item methods
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  
  // Review methods
  getProductReviews(productId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private reviews: Map<number, Review>;
  
  private userId: number;
  private categoryId: number;
  private productId: number;
  private cartItemId: number;
  private orderId: number;
  private orderItemId: number;
  private reviewId: number;
  
  readonly sessionStore: session.Store;
  
  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.reviews = new Map();
    
    this.userId = 1;
    this.categoryId = 1;
    this.productId = 1;
    this.cartItemId = 1;
    this.orderId = 1;
    this.orderItemId = 1;
    this.reviewId = 1;
    
    // Initialize session store
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // Prune expired entries every 24h
    });
    
    this.initializeData();
  }
  
  // Initialize with sample data
  private initializeData() {
    // Create admin user
    const admin: InsertUser = {
      username: "admin",
      password: "admin123", // In real app, would be hashed
      email: "admin@furnishhome.com",
      isAdmin: true,
      firstName: "Admin",
      lastName: "User"
    };
    this.createUser(admin);
    
    // Create categories
    const categories: InsertCategory[] = [
      {
        name: "Living Room",
        slug: "living-room",
        description: "Furniture for your living room",
        imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      },
      {
        name: "Bedroom",
        slug: "bedroom",
        description: "Furniture for your bedroom",
        imageUrl: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      },
      {
        name: "Kitchen & Dining",
        slug: "kitchen-dining",
        description: "Furniture for your kitchen and dining area",
        imageUrl: "https://images.unsplash.com/photo-1556911220-bda9f7f3fe9b?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      },
      {
        name: "Office",
        slug: "office",
        description: "Furniture for your office",
        imageUrl: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      }
    ];
    
    categories.forEach(category => this.createCategory(category));
    
    // Create products
    const products: InsertProduct[] = [
      {
        name: "Minimalist Sofa",
        sku: "PRD-001",
        slug: "minimalist-sofa",
        description: "Modern 3-seater sofa with clean lines and comfortable cushions. Perfect for contemporary living rooms.",
        price: "699.99",
        categoryId: 1,
        stock: 24,
        status: "in_stock",
        featured: true,
        isNew: false,
        images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"]
      },
      {
        name: "Modern Chair",
        sku: "PRD-002",
        slug: "modern-chair",
        description: "Stylish modern chair with comfortable seating and elegant design.",
        price: "249.99",
        categoryId: 1,
        stock: 8,
        status: "low_stock",
        featured: true,
        isNew: false,
        images: ["https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"]
      },
      {
        name: "Wooden Coffee Table",
        sku: "PRD-003",
        slug: "wooden-coffee-table",
        description: "Beautiful wooden coffee table for your living room.",
        price: "349.99",
        discountPrice: "299.99",
        categoryId: 1,
        stock: 0,
        status: "out_of_stock",
        featured: true,
        isNew: false,
        images: ["https://images.unsplash.com/photo-1588200908342-23b585c03e26?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"]
      },
      {
        name: "Bedside Table",
        sku: "PRD-004",
        slug: "bedside-table",
        description: "Elegant bedside table with storage for your bedroom.",
        price: "179.99",
        categoryId: 2,
        stock: 15,
        status: "in_stock",
        featured: true,
        isNew: false,
        images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"]
      },
      {
        name: "Designer Desk Lamp",
        sku: "PRD-005",
        slug: "designer-desk-lamp",
        description: "Modern desk lamp with adjustable arm and dimmer.",
        price: "89.99",
        categoryId: 4,
        stock: 30,
        status: "in_stock",
        featured: false,
        isNew: true,
        images: ["https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"]
      },
      {
        name: "Marble Side Table",
        sku: "PRD-006",
        slug: "marble-side-table",
        description: "Luxurious marble side table for your living room.",
        price: "159.99",
        categoryId: 1,
        stock: 12,
        status: "in_stock",
        featured: false,
        isNew: true,
        images: ["https://images.unsplash.com/photo-1595500038743-38894aede247?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"]
      },
      {
        name: "Modern Bookshelf",
        sku: "PRD-007",
        slug: "modern-bookshelf",
        description: "Spacious modern bookshelf for your books and decorative items.",
        price: "279.99",
        categoryId: 1,
        stock: 5,
        status: "in_stock",
        featured: false,
        isNew: true,
        images: ["https://images.unsplash.com/photo-1581539250439-c96689b516dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"]
      }
    ];
    
    products.forEach(product => this.createProduct(product));
    
    // Create reviews
    const reviews: InsertReview[] = [
      {
        userId: 1,
        productId: 1,
        rating: 5,
        review: "The quality of the furniture exceeded my expectations. The sofa I purchased is not only beautiful but also extremely comfortable and durable."
      },
      {
        userId: 1,
        productId: 2,
        rating: 4,
        review: "The delivery was quick and the assembly was straightforward. The chair looks exactly like the pictures and fits perfectly in my space."
      },
      {
        userId: 1,
        productId: 3,
        rating: 5,
        review: "Customer service was outstanding. When I had an issue with my order, they resolved it immediately. I'll definitely be shopping here again!"
      }
    ];
    
    reviews.forEach(review => this.createReview(review));
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }
  
  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug
    );
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
  
  async updateCategory(id: number, updateData: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    
    const updatedCategory: Category = { ...category, ...updateData };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }
  
  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }
  
  // Product methods
  async getProducts(options: { 
    categoryId?: number, 
    featured?: boolean, 
    isNew?: boolean,
    search?: string,
    limit?: number,
    offset?: number
  } = {}): Promise<Product[]> {
    let filteredProducts = Array.from(this.products.values());
    
    if (options.categoryId !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.categoryId === options.categoryId);
    }
    
    if (options.featured !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.featured === options.featured);
    }
    
    if (options.isNew !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.isNew === options.isNew);
    }
    
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        p => p.name.toLowerCase().includes(searchLower) || 
            (p.description && p.description.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply pagination if specified
    if (options.limit !== undefined) {
      const offset = options.offset || 0;
      filteredProducts = filteredProducts.slice(offset, offset + options.limit);
    }
    
    return filteredProducts;
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.slug === slug
    );
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const now = new Date();
    const product: Product = { 
      ...insertProduct, 
      id,
      rating: "0",
      createdAt: now,
      updatedAt: now
    };
    this.products.set(id, product);
    return product;
  }
  
  async updateProduct(id: number, updateData: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const now = new Date();
    const updatedProduct: Product = { 
      ...product, 
      ...updateData,
      updatedAt: now
    };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }
  
  // Cart methods
  async getCartItems(userId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      (item) => item.userId === userId
    );
  }
  
  async getCartItem(id: number): Promise<CartItem | undefined> {
    return this.cartItems.get(id);
  }
  
  async getUserCartItemByProductId(userId: number, productId: number): Promise<CartItem | undefined> {
    return Array.from(this.cartItems.values()).find(
      (item) => item.userId === userId && item.productId === productId
    );
  }
  
  async createCartItem(insertCartItem: InsertCartItem): Promise<CartItem> {
    const id = this.cartItemId++;
    const now = new Date();
    const cartItem: CartItem = { 
      ...insertCartItem, 
      id,
      createdAt: now
    };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }
  
  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) return undefined;
    
    const updatedCartItem: CartItem = { ...cartItem, quantity };
    this.cartItems.set(id, updatedCartItem);
    return updatedCartItem;
  }
  
  async deleteCartItem(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }
  
  // Order methods
  async getOrders(userId?: number): Promise<Order[]> {
    let orders = Array.from(this.orders.values());
    if (userId !== undefined) {
      orders = orders.filter(order => order.userId === userId);
    }
    return orders;
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.orderId++;
    const now = new Date();
    const order: Order = { 
      ...insertOrder, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.orders.set(id, order);
    return order;
  }
  
  async updateOrder(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const now = new Date();
    const updatedOrder: Order = { 
      ...order, 
      status,
      updatedAt: now
    };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
  
  // Order item methods
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      (item) => item.orderId === orderId
    );
  }
  
  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemId++;
    const now = new Date();
    const orderItem: OrderItem = { 
      ...insertOrderItem, 
      id,
      createdAt: now
    };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }
  
  // Review methods
  async getProductReviews(productId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.productId === productId
    );
  }
  
  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.reviewId++;
    const now = new Date();
    const review: Review = { 
      ...insertReview, 
      id,
      createdAt: now
    };
    this.reviews.set(id, review);
    
    // Update product rating
    const productReviews = await this.getProductReviews(insertReview.productId);
    const product = await this.getProduct(insertReview.productId);
    
    if (product) {
      const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / productReviews.length;
      
      // Update the product rating
      await this.updateProduct(product.id, { 
        rating: averageRating.toFixed(1) as any  // Type conversion due to numeric field
      });
    }
    
    return review;
  }
}

export const storage = new MemStorage();
