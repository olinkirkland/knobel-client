import avatarDefinitions from '../assets/item-definitions/avatars.json';
import wallpaperDefinitions from '../assets/item-definitions/wallpapers.json';

export default interface Item {
  id: string;
  type: string;
  tags: string[];
  name: string;
  description: string;
  value: any;
}

const itemDefinitions: Item[] = [...avatarDefinitions, ...wallpaperDefinitions];
export function getItemById(id: string): Item | undefined {
  return itemDefinitions.find((item) => item.id === id);
}
