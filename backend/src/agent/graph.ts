import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import { type FinancialAgentState, createInitialState } from "./state.js";
import { incomeNode } from "./nodes/income.node.js";
import { patternNode } from "./nodes/pattern.node.js";
import { savingsNode } from "./nodes/savings.node.js";
import { safetyNode } from "./nodes/safety.node.js";
import { goalAllocationNode } from "./nodes/goal-allocation.node.js";
import { recommendationNode } from "./nodes/recommendation.node.js";
import { taxNode } from "./nodes/tax.node.js";
import { explanationNode } from "./nodes/explanation.node.js";
import { logger } from "../utils/logger.js";

const LOG_CTX = "Agent.Graph";

const GraphState = Annotation.Root({
  financial: Annotation<FinancialAgentState>({
    reducer: (_current, update) => update,
    default: () => createInitialState(""),
  }),
});

type GraphStateValue = typeof GraphState.State;

async function runNode(
  state: GraphStateValue,
  node: (financialState: FinancialAgentState) => Promise<Partial<FinancialAgentState>>
): Promise<GraphStateValue> {
  const updates = await node(state.financial);
  return { financial: { ...state.financial, ...updates } };
}

const financialGraph = new StateGraph(GraphState)
  .addNode("income", (state) => runNode(state, incomeNode))
  .addNode("pattern", (state) => runNode(state, patternNode))
  .addNode("savings", (state) => runNode(state, savingsNode))
  .addNode("safety", (state) => runNode(state, safetyNode))
  .addNode("goalAllocation", (state) => runNode(state, goalAllocationNode))
  .addNode("recommendation", (state) => runNode(state, recommendationNode))
  .addNode("tax", (state) => runNode(state, taxNode))
  .addNode("explanation", (state) => runNode(state, explanationNode))
  .addEdge(START, "income")
  .addEdge("income", "pattern")
  .addConditionalEdges("pattern", (state) => state.financial.errors.length > 0 ? "end" : "continue", {
    end: END,
    continue: "savings",
  })
  .addEdge("savings", "safety")
  .addEdge("safety", "goalAllocation")
  .addEdge("goalAllocation", "recommendation")
  .addEdge("recommendation", "tax")
  .addEdge("tax", "explanation")
  .addEdge("explanation", END)
  .compile();

/**
 * Runs the full financial agent graph for a user.
 * Returns the completed state with all computed values and explanations.
 */
export async function runFinancialAgent(userId: string): Promise<FinancialAgentState> {
  logger.info(LOG_CTX, `Starting agent for user ${userId}`);
  const result = await financialGraph.invoke({ financial: createInitialState(userId) });
  const state = { ...result.financial, timestamp: new Date().toISOString() };

  logger.info(LOG_CTX, `Agent complete for ${userId}. Nodes: ${state.completedNodes.join(" → ")}`);

  return state;
}

/**
 * Runs a partial agent graph — only the specified nodes.
 * Useful for the what-if simulator and targeted recalculations.
 */
export async function runPartialAgent(
  userId: string,
  nodeNames: string[]
): Promise<FinancialAgentState> {
  const requested = new Set(nodeNames);
  let state = createInitialState(userId);
  const nodeFunctions = [
    ["income", incomeNode],
    ["pattern", patternNode],
    ["savings", savingsNode],
    ["safety", safetyNode],
    ["goal-allocation", goalAllocationNode],
    ["recommendation", recommendationNode],
    ["tax", taxNode],
    ["explanation", explanationNode],
  ] as const;

  const lastRequestedIndex = Math.max(...nodeFunctions.map(([name], index) => requested.has(name) ? index : -1));
  for (let index = 0; index <= lastRequestedIndex; index++) {
    state = { ...state, ...(await nodeFunctions[index][1](state)) };
  }

  return { ...state, timestamp: new Date().toISOString() };
}

export { financialGraph };
