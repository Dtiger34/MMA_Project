import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import orderService from '../../api/orderService';

const HistoryOrderScreen = () => {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          Alert.alert('Error', 'User ID not found');
          return;
        }
        const response = await orderService.getAllOrdersByUserId(userId);
        console.log(response);
        if (response.result) {
          setOrders(response.result);
        } else {
          Alert.alert('Error', 'Failed to fetch orders');
        }
      } catch (err) {
        Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderDate}>
          Order Date: {new Date(item.orderDate).toLocaleDateString()}
        </Text>
        <Text
          style={[
            styles.orderStatus,
            { color: item.status === 'Delivered' ? 'green' : 'orange' },
          ]}
        >
          {item.status}
        </Text>
      </View>
      <View style={styles.orderDetails}>
        <FlatList
          data={item.items}
          renderItem={({ item: product }) => (
            <View style={styles.productItem}>
              <Text style={styles.productName}>{product.name}</Text>
              <View style={styles.productInfo}>
                <Text style={styles.productQuantity}>Quantity: {product.quantity}</Text>
                <Text style={styles.productPrice}>Price: ${product.price.toFixed(2)}</Text>
              </View>
            </View>
          )}
          keyExtractor={(product, index) => index.toString()}
        />
        <Text style={styles.orderTotal}>Total: ${item.totalAmount.toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Order History</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : orders.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.ordersList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No order history found</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f9',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  ordersList: {
    paddingBottom: 20,
  },
  orderItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderDate: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
  },
  orderStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
  },
  orderDetails: {
    marginTop: 10,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginVertical: 10,
    alignSelf: 'flex-end',
  },
  productItem: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  productInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productQuantity: {
    fontSize: 14,
    color: '#666',
  },
  productPrice: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});


export default HistoryOrderScreen;
