export const getOrder = /* GraphQL */ `
  query GetOrder($id: ID!) {
    getOrder(id: $id) {
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

export const listOrders = /* GraphQL */ `
  query ListOrders(
    $filter: ModelOrderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOrders(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const ordersByStatus = /* GraphQL */ `
  query OrdersByStatus(
    $status: OrderStatus!
    $sortDirection: ModelSortDirection
    $filter: ModelOrderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    ordersByStatus(
      status: $status
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;