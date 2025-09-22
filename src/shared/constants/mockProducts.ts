import { Product } from '../../types';

export const mockProducts: Product[] = [
  // Hamburgers
  {
    id: '1',
    name: 'Classic Burger',
    description: 'Hambúrguer artesanal, queijo, alface, tomate e maionese especial',
    price: 25.90,
    category: 'Hamburgers',
    available: true,
    preparationTime: 15
  },
  {
    id: '2',
    name: 'Bacon Deluxe',
    description: 'Hambúrguer duplo, bacon crocante, queijo cheddar e molho barbecue',
    price: 32.90,
    category: 'Hamburgers',
    available: true,
    preparationTime: 18
  },
  {
    id: '3',
    name: 'Veggie Burger',
    description: 'Hambúrguer vegetal, queijo, rúcula, tomate seco e aioli',
    price: 28.90,
    category: 'Hamburgers',
    available: true,
    preparationTime: 12
  },
  
  // Sides
  {
    id: '4',
    name: 'Batata Frita',
    description: 'Batatas fritas crocantes temperadas com sal e ervas',
    price: 12.90,
    category: 'Acompanhamentos',
    available: true,
    preparationTime: 8
  },
  {
    id: '5',
    name: 'Onion Rings',
    description: 'Anéis de cebola empanados e fritos',
    price: 15.90,
    category: 'Acompanhamentos',
    available: true,
    preparationTime: 10
  },
  {
    id: '6',
    name: 'Nuggets',
    description: '8 unidades de nuggets de frango crocantes',
    price: 18.90,
    category: 'Acompanhamentos',
    available: true,
    preparationTime: 12
  },

  // Drinks
  {
    id: '7',
    name: 'Coca-Cola',
    description: 'Refrigerante Coca-Cola 350ml',
    price: 6.90,
    category: 'Bebidas',
    available: true,
    preparationTime: 1
  },
  {
    id: '8',
    name: 'Suco Natural',
    description: 'Suco natural de laranja 300ml',
    price: 8.90,
    category: 'Bebidas',
    available: true,
    preparationTime: 3
  },
  {
    id: '9',
    name: 'Milkshake',
    description: 'Milkshake cremoso de chocolate ou morango',
    price: 14.90,
    category: 'Bebidas',
    available: true,
    preparationTime: 5
  },

  // Desserts
  {
    id: '10',
    name: 'Brownie',
    description: 'Brownie de chocolate com sorvete de baunilha',
    price: 12.90,
    category: 'Sobremesas',
    available: true,
    preparationTime: 5
  },
  {
    id: '11',
    name: 'Petit Gateau',
    description: 'Petit gateau com sorvete e calda de chocolate',
    price: 16.90,
    category: 'Sobremesas',
    available: true,
    preparationTime: 8
  }
];