import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

const initialState = {
  items: [],
  total: 0,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItemIndex = state.items.findIndex(
        item => item.product._id === action.payload._id
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };

        return {
          ...state,
          items: updatedItems,
          total: state.total + action.payload.price
        };
      } else {
        return {
          ...state,
          items: [...state.items, { product: action.payload, quantity: 1 }],
          total: state.total + action.payload.price
        };
      }
    }

    case 'REMOVE_FROM_CART': {
      const existingItemIndex = state.items.findIndex(
        item => item.product._id === action.payload
      );

      if (existingItemIndex >= 0) {
        const item = state.items[existingItemIndex];
        if (item.quantity > 1) {
          const updatedItems = [...state.items];
          updatedItems[existingItemIndex] = {
            ...item,
            quantity: item.quantity - 1
          };

          return {
            ...state,
            items: updatedItems,
            total: state.total - item.product.price
          };
        } else {
          return {
            ...state,
            items: state.items.filter(item => item.product._id !== action.payload),
            total: state.total - item.product.price
          };
        }
      }
      return state;
    }

    case 'CLEAR_CART':
      return initialState;

    case 'LOAD_CART':
      return action.payload || initialState;

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem('cart');
        if (savedCart) {
          dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
        }
      } catch (error) {
        console.error('Error loading cart from storage', error);
      }
    };

    loadCart();
  }, []);

  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem('cart', JSON.stringify(state));
      } catch (error) {
        console.error('Error saving cart to storage', error);
      }
    };

    saveCart();
  }, [state]);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ ...state, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
