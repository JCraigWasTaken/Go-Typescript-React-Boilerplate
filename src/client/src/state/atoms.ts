// state.ts
import { atom } from 'recoil';

export const apiHealthStatusAtom = atom({
  key: 'apiHealthStatus',
  default: 'LOADING...',
});
