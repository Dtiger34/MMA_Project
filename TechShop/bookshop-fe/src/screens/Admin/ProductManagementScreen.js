import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Modal, TextInput, ScrollView, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import productService from '../../api/productService';
import categoryService from '../../api/categorySevice';

const ProductManagementScreen = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [addProductModalVisible, setAddProductModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    unitInStock: '',
    image: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await productService.getAll();
        const categoryData = await categoryService.getAll();
        console.log(categoryData.result);

        if (productData.result) {
          setProducts(productData.result);
        }
        if (categoryData.result) {
          setCategories(categoryData.result);
        }
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const openAddProductModal = () => {
    setAddProductModalVisible(true);
  };

  const closeModals = () => {
    setModalVisible(false);
    setAddProductModalVisible(false);
  };

  const handleEditProduct = async () => {
    try {
      const updatedProduct = await productService.update(selectedProduct._id, selectedProduct);
      if (updatedProduct.result) {
        const updatedProducts = products.map((product) =>
          product._id === selectedProduct._id ? updatedProduct.result : product
        );
        setProducts(updatedProducts);
        Alert.alert('Success', 'Product updated successfully');
        closeModals();
      }
    } catch (error) {
      console.error('Error editing product', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await productService.delete(id);
      const updatedProducts = products.filter((product) => product._id !== id);
      setProducts(updatedProducts);
      Alert.alert('Success', 'Product deleted successfully');
      closeModals();
    } catch (error) {
      console.error('Error deleting product', error);
    }
  };

  const handleAddProduct = async () => {
    try {
      if(!newProduct.name || !newProduct.price || !newProduct.description || !newProduct.category || !newProduct.unitInStock || !newProduct.image) {
        return Alert.alert('Error', 'Please fill in all fields');
      }
      const newProductData = await productService.create(newProduct);
      if (newProductData) {
        setProducts([newProductData.result, ...products]);
        setNewProduct({
          name: '',
          price: '',
          description: '',
          category: '',
          unitInStock: '',
          image: '',
        });
        Alert.alert('Success', 'Product added successfully');
        setAddProductModalVisible(false);
      }
    } catch (error) {
      console.error('Error adding product', error);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProductItem = ({ item }) => (
    <TouchableOpacity style={styles.productItem} onPress={() => openProductDetails(item)}>
      <View style={styles.productImageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
        <View style={styles.productMeta}>
          <Text style={styles.productStock}>Stock: {item.unitInStock}</Text>
          <Text style={styles.productCategory}>{item.category.name}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#999" />
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.productList}
        />

        <TouchableOpacity style={styles.addButton} onPress={openAddProductModal}>
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>

        {/* Product Details Modal */}
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeModals}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Edit Product Details</Text>
              {selectedProduct && (
                <ScrollView contentContainerStyle={styles.modalContent}>
                  <View style={styles.modalImageContainer}>
                    <Image source={{ uri: selectedProduct.image }} style={styles.modalImage} />
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Name:</Text>
                    <TextInput
                      style={styles.detailTextInput}
                      value={selectedProduct.name}
                      onChangeText={(text) => setSelectedProduct({ ...selectedProduct, name: text })}
                    />
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Price:</Text>
                    <TextInput
                      style={styles.detailTextInput}
                      value={selectedProduct.price.toString()}
                      onChangeText={(text) => setSelectedProduct({ ...selectedProduct, price: text })}
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Stock:</Text>
                    <TextInput
                      style={styles.detailTextInput}
                      value={selectedProduct.unitInStock.toString()}
                      onChangeText={(text) => setSelectedProduct({ ...selectedProduct, unitInStock: text })}
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Description:</Text>
                    <TextInput
                      style={styles.detailTextInput}
                      value={selectedProduct.description}
                      onChangeText={(text) => setSelectedProduct({ ...selectedProduct, description: text })}
                    />
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Category:</Text>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={selectedProduct?.category?._id || selectedProduct?.category || ''}
                        onValueChange={(itemValue) => {
                          const selectedCategory = categories.find((cat) => cat._id === itemValue);
                          setSelectedProduct({ ...selectedProduct, category: selectedCategory });
                        }}
                        style={styles.picker}
                        mode="dropdown"
                        itemStyle={styles.pickerItem}
                      >
                        <Picker.Item label="Select Category" value="" />
                        {categories.map((category) => (
                          <Picker.Item key={category._id} label={category.name} value={category._id} />
                        ))}
                      </Picker>
                    </View>
                  </View>

                </ScrollView>
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => handleDeleteProduct(selectedProduct._id)}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleEditProduct}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.closeButton} onPress={closeModals}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Add Product Modal */}
        <Modal animationType="slide" transparent={true} visible={addProductModalVisible} onRequestClose={closeModals}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Add New Product</Text>
              <ScrollView contentContainerStyle={styles.modalContent}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Name:</Text>
                  <TextInput
                    style={styles.detailTextInput}
                    value={newProduct.name}
                    onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
                    placeholder="Enter product name"
                  />
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Price:</Text>
                  <TextInput
                    style={styles.detailTextInput}
                    value={newProduct.price}
                    onChangeText={(text) => setNewProduct({ ...newProduct, price: text })}
                    keyboardType="numeric"
                    placeholder="Enter price"
                  />
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Stock:</Text>
                  <TextInput
                    style={styles.detailTextInput}
                    value={newProduct.unitInStock}
                    onChangeText={(text) => setNewProduct({ ...newProduct, unitInStock: text })}
                    keyboardType="numeric"
                    placeholder="Enter stock quantity"
                  />
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Description:</Text>
                  <TextInput
                    style={styles.detailTextInput}
                    value={newProduct.description}
                    onChangeText={(text) => setNewProduct({ ...newProduct, description: text })}
                    placeholder="Enter description"
                  />
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Category:</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={newProduct.category}
                      onValueChange={(itemValue) => setNewProduct({ ...newProduct, category: itemValue })}
                      style={styles.picker}
                      mode="dropdown"
                      itemStyle={styles.pickerItem}
                    >
                      <Picker.Item label="Select Category" value="" />
                      {categories.map((category) => (
                        <Picker.Item key={category._id} label={category.name} value={category._id} />
                      ))}
                    </Picker>
                  </View>
                </View>
                <View style={{ height: 40 }}></View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Image URL:</Text>
                  <TextInput
                    style={styles.detailTextInput}
                    value={newProduct.image}
                    onChangeText={(text) => setNewProduct({ ...newProduct, image: text })}
                    placeholder="Enter image URL"
                  />
                </View>
              </ScrollView>

              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={closeModals}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleAddProduct}>
                  <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};


export default ProductManagementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  productList: {
    paddingHorizontal: 16,
  },
  productItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productImageContainer: {
    marginRight: 12,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 15,
    color: '#007bff',
    fontWeight: '500',
    marginVertical: 4,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productStock: {
    fontSize: 13,
    color: '#666',
  },
  productCategory: {
    fontSize: 13,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalContent: {
    paddingBottom: 10,
  },
  modalImageContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  modalImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
    marginRight: 10,
  },
  detailLabel: {

    fontSize: 16,
    fontWeight: 'bold',
    width: 100,
  },
  detailText: {
    fontSize: 16,
    flex: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    marginHorizontal: 5,
  },
  editButton: {
    backgroundColor: '#007bff',
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeButtonText: {
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
  },
  detailTextInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  pickerContainer: {
    width: '100%',
    height: 150,
  },
  picker: {
    width: '100%',
    height: 200,
    backgroundColor: '#e0e0e0',
  },
  pickerItem: {
    color: '#000',
    fontSize: 16,
  },

});

