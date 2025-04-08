import { atom } from 'recoil';

export const hoagieFormState = atom({
  key: 'hoagieFormState',
  default: {
    name: '',
    image: '',
    ingredients: [''],
  },
});
