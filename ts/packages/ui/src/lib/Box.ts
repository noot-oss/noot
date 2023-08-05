import { LoremIpsum } from "lorem-ipsum";

export interface Box {
  id: string;
  name: string;
  description: string;
  added: Date;
  updated: Date;
}

export const mockBox = () => {
  const lorem = new LoremIpsum();

  const name = lorem.generateWords(2);

  const FirstFourDigits = Math.floor(1000 + Math.random() * 9000);
  const LastFourDigits = Math.floor(1000 + Math.random() * 9000);

  return {
    id: `nb-gb-${FirstFourDigits}-${LastFourDigits}`,
    name: name,
    added: new Date(),
    updated: new Date(),
    description: lorem.generateSentences(1)
  } satisfies Box;
};
