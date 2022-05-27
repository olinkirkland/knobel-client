import avatarDefinitions from '../assets/item-definitions/avatars.json';
import miscDefinitions from '../assets/item-definitions/misc.json';
import wallpaperDefinitions from '../assets/item-definitions/wallpapers.json';

export default interface Item {
  id: string;
  type: string;
  tags: string[];
  name: string;
  description: string;
  value: any;
}

const itemDefinitions: Item[] = [
  ...avatarDefinitions,
  ...wallpaperDefinitions,
  ...miscDefinitions
];

export function getItemById(id: string): Item | undefined {
  let item = itemDefinitions.find((item) => item.id === id);
  if (!item) item = miscDefinitions.find((item) => item.name === 'unknown');
  return item;
}
