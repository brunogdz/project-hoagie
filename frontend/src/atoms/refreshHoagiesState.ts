import { atom } from 'recoil';

export const refreshHoagiesState = atom<number>({
  key: 'refreshHoagiesState',
  default: 0,
});