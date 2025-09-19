import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Tables = Database['public']['Tables'];

// Products
export const productService = {
  async getAll() {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          color
        )
      `)
      .eq('available', true)
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async create(product: Tables['products']['Insert']) {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, product: Tables['products']['Update']) {
    const { data, error } = await supabase
      .from('products')
      .update({ ...product, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Categories
export const categoryService = {
  async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('active', true)
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async create(category: Tables['categories']['Insert']) {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Orders
export const orderService = {
  async create(order: Tables['orders']['Insert'], items: any[]) {
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
    
    if (orderError) throw orderError;

    const orderItems = items.map(item => ({
      order_id: orderData.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
      notes: item.notes
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) throw itemsError;

    return orderData;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            name,
            price
          )
        ),
        tables (
          number
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Tables
export const tableService = {
  async getAll() {
    const { data, error } = await supabase
      .from('tables')
      .select('*')
      .order('number');
    
    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: string, orderId?: string) {
    const updates: any = { 
      status, 
      updated_at: new Date().toISOString() 
    };

    if (status === 'occupied') {
      updates.occupied_at = new Date().toISOString();
      updates.current_order_id = orderId;
    } else if (status === 'available') {
      updates.occupied_at = null;
      updates.current_order_id = null;
      updates.reserved_by = null;
      updates.reserved_at = null;
    }

    const { data, error } = await supabase
      .from('tables')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Payment Methods
export const paymentMethodService = {
  async getAll() {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('active', true)
      .order('name');
    
    if (error) throw error;
    return data;
  }
};

// Integrations
export const integrationService = {
  async getAll() {
    const { data, error } = await supabase
      .from('integrations')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async updateConfig(id: string, config: any) {
    const { data, error } = await supabase
      .from('integrations')
      .update({ 
        config, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async toggleActive(id: string, active: boolean) {
    const { data, error } = await supabase
      .from('integrations')
      .update({ 
        active, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};