export const onCreateOrder = /* GraphQL */ `
  subscription OnCreateOrder($filter: ModelSubscriptionOrderFilterInput) {
    onCreateOrder(filter: $filter) {
      id
      orderNumber
      tableId
      customerName
      customerPhone
      orderType
      status
      subtotal
      discount
      total
      guestCount
      notes
      items {
        id
        productId
        productName
        quantity
        unitPrice
        totalPrice
        notes
      }
      createdAt
      updatedAt
    }
  }
`;

export const onUpdateOrder = /* GraphQL */ `
  subscription OnUpdateOrder($filter: ModelSubscriptionOrderFilterInput) {
    onUpdateOrder(filter: $filter) {
      id
      orderNumber
      tableId
      customerName
      customerPhone
      orderType
      status
      subtotal
      discount
      total
      guestCount
      notes
      items {
        id
        productId
        productName
        quantity
        unitPrice
        totalPrice
        notes
      }
      createdAt
      updatedAt
    }
  }
`;