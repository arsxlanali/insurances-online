interface Tariff {
  type: string;
  heading: string;
}
export const availableMandants = ['sdk', 'levelnine', 'hallesche', 'vmk'];
export const REACT_APP_TARIFFTYPES: Tariff[] = [
  {
    type: 'Ambulant',
    heading: 'Ambulant',
  },
  {
    type: 'Stationär',
    heading: 'Krankenhaus',
  },
  {
    type: 'Zahn',
    heading: 'Zahn',
  },
];
