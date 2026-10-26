export interface Room {
  id: string; // 'living_room', 'master_bedroom', 'kitchen', 'balcony', 'study'
  name: string; // '거실', '안방', '주방', '베란다', '서재'
  icon: string; // Lucide icon name, e.g. 'Sofa', 'Bed', 'Utensils', 'Flower2', 'Briefcase'
  order: number;
}
