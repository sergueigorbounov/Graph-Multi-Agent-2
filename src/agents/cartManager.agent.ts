import { DynamicStructuredTool } from "@langchain/core/tools";
import * as fs from "fs";
import { RunnableConfig } from "@langchain/core/runnables";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { SystemMessage } from "@langchain/core/messages";
import { llm } from "./supervisor.agent.js";
import { AgentState } from "../state/agent.state.js";
import { HumanMessage } from "@langchain/core/messages";
import { z } from "zod";
import { END } from "@langchain/langgraph";
import { Redis } from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// File-based storage
const CART_FILE = "cart.json";



const cartManagerTool = new DynamicStructuredTool({
  name: "cart_manager",
  description: "Manage a shopping cart with actions like add, remove, and list products.",
  schema: z.object({
    action: z.enum(["add", "remove", "list"]),
    product: z
      .object({
        id: z.string(),
        name: z.string(),
        url: z.string(),
      })
      .optional(),
  }),
  func: async ({ action, product }: { action: "add" | "remove" | "list"; product?: CartItem }) => {
    try {
      // Try file-based operations first
      return await handleFileOperations(action, product);
    } catch (fileError) {
      console.error("File operation failed, falling back to Redis:", fileError);

      // If file operations fail, fall back to Redis
      return await handleRedisOperations(action, product);
    }
  },
});

// File-based operations
async function handleFileOperations(action: "add" | "remove" | "list", product?: CartItem) {
  let cart: CartItem[] = JSON.parse(
    fs.existsSync(CART_FILE) ? fs.readFileSync(CART_FILE, "utf8") : "[]"
  );

  if (action === "add" && product) {
    cart.push(product);
  } else if (action === "remove" && product) {
    cart = cart.filter((p) => p.id !== product.id);
  } else if (action === "list") {
    return cart.map((p) => `${p.name} - ${p.url}`).join(", ");
  }

  fs.writeFileSync(CART_FILE, JSON.stringify(cart));
  return "Cart updated successfully (File).";
}

// Redis-based operations
async function handleRedisOperations(action: "add" | "remove" | "list", product?: CartItem) {
  const cartKey = "cart";
  const cartData = await redis.get(cartKey);
  let cart: CartItem[] = cartData ? JSON.parse(cartData) : [];

  if (action === "add" && product) {
    cart.push(product);
  } else if (action === "remove" && product) {
    cart = cart.filter((p) => p.id !== product.id);
  } else if (action === "list") {
    return cart.map((p) => `${p.name} - ${p.url}`).join(", ");
  }

  await redis.set(cartKey, JSON.stringify(cart));
  return "Cart updated successfully (Redis).";
}

// Cart manager agent
const cartManagerAgent = createReactAgent({
  llm,
  tools: [cartManagerTool],
  stateModifier: new SystemMessage(
    "You excel at managing add, remove, and list operations on the cart. Use the researcher's information to add new records, the supervisor's information to remove them, and show the cart."
  ),
});

// Cart manager node
export const cartManagerNode = async (
  state: typeof AgentState.State,
  config?: RunnableConfig
) => {
  if (state.messages.some((msg) => (msg.content as string).includes("Unable to retrieve"))) {
    return {
      messages: [
        new HumanMessage({
          content: "Could not add anything to the cart as the required details are unavailable.",
          name: "CartManager",
        }),
      ],
      next: END,
    };
  }

  const result = await cartManagerAgent.invoke(state, config);
  return result;
};

// Define the cart item type
interface CartItem {
  id: string;
  name: string;
  url: string;
}
