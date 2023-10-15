import { matchSorter } from 'match-sorter';
// @ts-ignore - no types, but it's a tiny function
import sortBy from 'sort-by';
import invariant from 'tiny-invariant';
import { v4 as uuidv4 } from 'uuid';

type PromptMutation = {
  id?: string;
  promptText?: string;
  x?: number;
  y?: number;
};

export type PromptRecord = PromptMutation & {
  id: string;
  createdAt: string;
};

const fakePrompts = {
  records: {} as Record<string, PromptRecord>,

  async getAll(): Promise<PromptRecord[]> {
    return Object.keys(fakePrompts.records)
      .map((key) => fakePrompts.records[key])
      .sort(sortBy('-createdAt', 'promptText'));
  },

  async get(id: string): Promise<PromptRecord | null> {
    return fakePrompts.records[id] || null;
  },

  async create(values: PromptMutation): Promise<PromptRecord> {
    const id = values.id || Math.random().toString(36).substring(2, 9);
    const createdAt = new Date().toISOString();
    const newPrompt = { id, createdAt, ...values };
    fakePrompts.records[id] = newPrompt;
    return newPrompt;
  },

  async set(id: string, values: PromptMutation): Promise<PromptRecord> {
    const prompt = await fakePrompts.get(id);
    invariant(prompt, `No prompt found for ${id}`);
    const updatedPrompt = { ...prompt, ...values };
    fakePrompts.records[id] = updatedPrompt;
    return updatedPrompt;
  },

  destroy(id: string): null {
    delete fakePrompts.records[id];
    return null;
  },
};

export async function getPrompts(query?: string | null) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  let prompts = await fakePrompts.getAll();
  if (query) {
    prompts = matchSorter(prompts, query, {
      keys: ['promptText'],
    });
  }
  return prompts.sort(sortBy('promptText', 'createdAt'));
}

export async function createEmptyPrompt() {
  const prompt = await fakePrompts.create({});
  return prompt;
}

export async function getPrompt(id: string) {
  return fakePrompts.get(id);
}

export async function updatePrompt(id: string, updates: PromptMutation) {
  const prompt = await fakePrompts.get(id);
  if (!prompt) {
    throw new Error(`No prompt found for ${id}`);
  }
  await fakePrompts.set(id, { ...prompt, ...updates });
  return prompt;
}

export async function deletePrompt(id: string) {
  fakePrompts.destroy(id);
}

// Add your mock prompts here
[
  { promptText: 'Favorite color?', x: 100, y: 50 },
  {
    promptText:
      'Describe your ideal vacation in a tropical paradise. Imagine the sun, the beach, and the endless cocktails.',
    x: 200,
    y: 100,
  },
  { promptText: 'Stress coping?', x: 300, y: 150 },
  {
    promptText: "What's your go-to comfort food when you're feeling down?",
    x: 400,
    y: 200,
  },
  {
    promptText: 'Name a book that changed your life. How did it impact you?',
    x: 150,
    y: 250,
  },
  { promptText: 'Career goals?', x: 250, y: 300 },
  {
    promptText:
      'Do you have any pets? If yes, what are their names and what quirky traits do they have?',
    x: 350,
    y: 350,
  },
  { promptText: 'Season?', x: 450, y: 400 },
  {
    promptText:
      'How do you define success? Is it money, freedom, influence, creative expression, or something else?',
    x: 100,
    y: 450,
  },
  { promptText: 'Skill to learn?', x: 200, y: 500 },
  // ... more prompts
].forEach((prompt) => {
  fakePrompts.create({
    ...prompt,
    id: uuidv4(),
  });
});
