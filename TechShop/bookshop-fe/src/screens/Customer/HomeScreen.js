import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import productService from '../../api/productService';
import { useCart } from '../../context/CartContext';

const HomeScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);  // Add the product to the cart
    Alert.alert('Success', `${product.name} has been added to the cart.`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAll();
        if (response?.result) {
          setProducts(response.result);
          setFilteredProducts(response.result);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (search) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [search, products]);

  // Group products by category
  const groupByCategory = (products) => {
    return products.reduce((acc, product) => {
      const categoryName = product.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(product);
      return acc;
    }, {});
  };

  const groupedProducts = groupByCategory(filteredProducts);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Welcome to Tech Shop</Text>

        {/* Search Bar Below Title */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {Object.keys(groupedProducts).map((categoryName) => (
          <View key={categoryName} style={styles.categorySection}>
            <Text style={styles.sectionTitle}>{categoryName}</Text>

            <View style={styles.row}>
              {groupedProducts[categoryName].map((product, index) => (
                <TouchableOpacity
                  key={product._id}
                  style={[styles.productContainer, { marginRight: index % 2 === 0 ? 15 : 0 }]}
                  onPress={() => navigation.navigate('ProductDetail', { productId: product._id })}
                >
                  <Image source={{ uri: product.image }} style={styles.productImage} />

                  <View style={styles.productDetails}>
                    <Text style={styles.productTitle}>{product.name}</Text>
                    <Text style={styles.productPrice}>Price: ${product.price}</Text>
                    <Text style={styles.productStock}>In Stock: {product.unitInStock}</Text>
                    <Text style={styles.productAuthor}>Brand: {product.brand}</Text>
                  </View>

                  {/* 'Add to Cart' button */}
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleAddToCart(product)}  // Pass product to handleAddToCart
                  >
                    <Text style={styles.addButtonText}>Add to Cart</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    marginHorizontal: 15,
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
  },
  scrollView: {
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  categorySection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productContainer: {
    width: '45%', // Ensures two products per row
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  productDetails: {
    flex: 1,
    marginHorizontal: 5,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    height: 40,
  },
  productPrice: {
    fontSize: 14,
    color: '#007bff',
    marginVertical: 8,
  },
  productStock: {
    fontSize: 14,
    color: '#888',
  },
  productAuthor: {
    fontSize: 14,
    color: '#555',
    marginVertical: 5,
    height: 40,
  },
  addButton: {
    marginTop: 10,
    backgroundColor: '#9e2c80',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    width: '100%',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;
