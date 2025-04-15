import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertCategorySchema, 
  insertProductSchema, 
  insertCartItemSchema, 
  insertOrderSchema, 
  insertReviewSchema 
} from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Error handler middleware
  const handleError = (err: any, res: Response) => {
    console.error(err);
    if (err instanceof ZodError) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: err.errors 
      });
    }
    return res.status(500).json({ message: "Internal server error" });
  };

  // USERS
  app.post("/api/register", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      // Create the user
      const user = await storage.createUser(userData);
      
      // Don't return the password
      const { password, ...safeUser } = user;
      res.status(201).json(safeUser);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      // Find user by username
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Check password (in a real app, would use bcrypt to compare)
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Don't return the password
      const { password: _, ...safeUser } = user;
      res.json(safeUser);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // CATEGORIES
  app.get("/api/categories", async (_req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.get("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const category = await storage.getCategory(parseInt(req.params.id));
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.post("/api/categories", async (req: Request, res: Response) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.put("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const categoryData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(id, categoryData);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.delete("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCategory(id);
      
      if (!success) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.status(204).end();
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // PRODUCTS
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const featured = req.query.featured ? req.query.featured === 'true' : undefined;
      const isNew = req.query.isNew ? req.query.isNew === 'true' : undefined;
      const search = req.query.search as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
      
      const products = await storage.getProducts({ 
        categoryId, 
        featured, 
        isNew,
        search,
        limit,
        offset
      });
      
      res.json(products);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.get("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const product = await storage.getProduct(parseInt(req.params.id));
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.get("/api/products/slug/:slug", async (req: Request, res: Response) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.post("/api/products", async (req: Request, res: Response) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.put("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const productData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, productData);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.delete("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProduct(id);
      
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.status(204).end();
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // CART
  app.get("/api/cart/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const cartItems = await storage.getCartItems(userId);
      
      // Get product details for each cart item
      const cartWithProducts = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          return {
            ...item,
            product
          };
        })
      );
      
      res.json(cartWithProducts);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.post("/api/cart", async (req: Request, res: Response) => {
    try {
      const cartItemData = insertCartItemSchema.parse(req.body);
      
      // Check if product exists
      const product = await storage.getProduct(cartItemData.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Check if product is in stock
      if (product.stock < cartItemData.quantity) {
        return res.status(400).json({ message: "Not enough stock available" });
      }
      
      // Check if cart item already exists for this user and product
      const existingCartItem = await storage.getUserCartItemByProductId(
        cartItemData.userId, 
        cartItemData.productId
      );
      
      let cartItem;
      
      if (existingCartItem) {
        // Update quantity of existing cart item
        const newQuantity = existingCartItem.quantity + cartItemData.quantity;
        
        // Check stock again with combined quantity
        if (product.stock < newQuantity) {
          return res.status(400).json({ message: "Not enough stock available" });
        }
        
        cartItem = await storage.updateCartItem(existingCartItem.id, newQuantity);
      } else {
        // Create new cart item
        cartItem = await storage.createCartItem(cartItemData);
      }
      
      // Get product details for the cart item
      const cartWithProduct = {
        ...cartItem,
        product
      };
      
      res.status(201).json(cartWithProduct);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.put("/api/cart/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      
      if (typeof quantity !== 'number' || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      
      // Get the cart item
      const cartItem = await storage.getCartItem(id);
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      // Check if product exists and has enough stock
      const product = await storage.getProduct(cartItem.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      if (product.stock < quantity) {
        return res.status(400).json({ message: "Not enough stock available" });
      }
      
      // Update cart item
      const updatedCartItem = await storage.updateCartItem(id, quantity);
      
      // Get product details for the cart item
      const cartWithProduct = {
        ...updatedCartItem,
        product
      };
      
      res.json(cartWithProduct);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.delete("/api/cart/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCartItem(id);
      
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.status(204).end();
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // ORDERS
  app.get("/api/orders", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const orders = await storage.getOrders(userId);
      res.json(orders);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.get("/api/orders/:id", async (req: Request, res: Response) => {
    try {
      const orderId = parseInt(req.params.id);
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Get order items
      const orderItems = await storage.getOrderItems(orderId);
      
      // Get product details for each order item
      const itemsWithProducts = await Promise.all(
        orderItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          return {
            ...item,
            product
          };
        })
      );
      
      res.json({
        ...order,
        items: itemsWithProducts
      });
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.post("/api/orders", async (req: Request, res: Response) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const { items } = req.body;
      
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Order must contain items" });
      }
      
      // Create the order
      const order = await storage.createOrder(orderData);
      
      // Create order items
      const orderItems = await Promise.all(
        items.map(async (item: { productId: number, quantity: number }) => {
          const product = await storage.getProduct(item.productId);
          
          if (!product) {
            throw new Error(`Product with ID ${item.productId} not found`);
          }
          
          if (product.stock < item.quantity) {
            throw new Error(`Not enough stock for product ${product.name}`);
          }
          
          // Update product stock
          await storage.updateProduct(item.productId, {
            stock: product.stock - item.quantity
          });
          
          // Create order item
          return storage.createOrderItem({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: product.discountPrice || product.price
          });
        })
      );
      
      // Remove items from cart
      const userCartItems = await storage.getCartItems(orderData.userId);
      await Promise.all(
        userCartItems.map(item => storage.deleteCartItem(item.id))
      );
      
      res.status(201).json({
        ...order,
        items: orderItems
      });
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.put("/api/orders/:id/status", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || typeof status !== 'string') {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const updatedOrder = await storage.updateOrder(id, status);
      
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(updatedOrder);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // REVIEWS
  app.get("/api/products/:productId/reviews", async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.productId);
      const reviews = await storage.getProductReviews(productId);
      res.json(reviews);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  app.post("/api/reviews", async (req: Request, res: Response) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (err) {
      handleError(err, res);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
