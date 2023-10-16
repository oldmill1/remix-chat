import { matchSorter } from 'match-sorter';
// @ts-ignore - no types, but it's a tiny function
import sortBy from 'sort-by';
import invariant from 'tiny-invariant';

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
  {
    id: '8f112fb7-e55b-4bb6-b969-bdcbdc7f1905',
    promptText: 'Favorite color?',
    x: 100,
    y: 50,
  },
  {
    id: 'd9a7c8e8-08b7-4d4d-9a9e-35c3d8d0b9b1',
    promptText:
      'Describe your ideal vacation in a tropical paradise. Imagine the sun, the beach, and the endless cocktails.',
    x: 200,
    y: 100,
  },
  {
    id: 'c1a2f3e1-4f5d-6e7a-8b9c-0d1e2f3a4b5c',
    promptText: 'Stress coping?',
    x: 300,
    y: 150,
  },
  {
    id: 'a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890',
    promptText: "What's your go-to comfort food when you're feeling down?",
    x: 400,
    y: 200,
  },
  {
    id: 'f6e5d4c3-b2a1-0987-6f5e-4d3c2b1a0987',
    promptText: 'Name a book that changed your life. How did it impact you?',
    x: 150,
    y: 250,
  },
  {
    id: '1a2b3c4d-5e6f-7a9b-8c0d-1e2f3a4b5c6d',
    promptText: 'Career goals?',
    x: 250,
    y: 300,
  },
  {
    id: '9a8b7c6d-5e4f-3a2b-1c0d-e9f8a7b6c5d4',
    promptText:
      'Do you have any pets? If yes, what are their names and what quirky traits do they have?',
    x: 350,
    y: 350,
  },
  {
    id: '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d',
    promptText: 'Season?',
    x: 450,
    y: 400,
  },
  {
    id: '2a3b4c5d-6e7f-8a9b-0c1d-2e3f4a5b6c7d',
    promptText:
      'How do you define success? Is it money, freedom, influence, creative expression, or something else?',
    x: 100,
    y: 450,
  },
  {
    id: '3a4b5c6d-7e8f-9a0b-1c2d-3e4f5a6b7c8d',
    promptText: 'Skill to learn?',
    x: 200,
    y: 500,
  },
].forEach((prompt) => {
  fakePrompts.create({
    ...prompt,
  });
});
