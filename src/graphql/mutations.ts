export const createOrder = /* GraphQL */ `
  mutation CreateOrder(
    $input: CreateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    createOrder(input: $input, condition: $condition) {
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

export const updateOrder = /* GraphQL */ `
  mutation UpdateOrder(
    $input: UpdateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    updateOrder(input: $input, condition: $condition) {
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

export const createOrderItem = /* GraphQL */ `
  mutation CreateOrderItem(
    $input: CreateOrderItemInput!
    $condition: ModelOrderItemConditionInput
  ) {
    createOrderItem(input: $input, condition: $condition) {
      id
      orderId
      productId
      productName
      quantity
      unitPrice
      totalPrice
      notes
      createdAt
      updatedAt
    }
  }
`;