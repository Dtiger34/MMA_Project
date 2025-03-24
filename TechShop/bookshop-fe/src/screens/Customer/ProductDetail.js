import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import productService from '../../api/productService';
import { useCart } from '../../context/CartContext';

const ProductDetail = ({ route }) => {
    const { productId } = route.params;
    const [product, setProduct] = useState(null);

    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await productService.getProductById(productId);
                if (response?.result) {
                    setProduct(response.result);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleAddToCart = () => {
        addToCart(product);
        Alert.alert('Success', `${product.name} has been added to the cart.`);
    };

    if (!product) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                {/* Product Image */}
                <Image source={{ uri: product.image }} style={styles.productImage} />

                {/* Product Details */}
                <View style={styles.detailsContainer}>
                    <Text style={styles.productTitle}>{product.name}</Text>
                    <Text style={styles.productDescription}>Description: {product.description}</Text>
                    <Text style={styles.productAuthor}>Author: {product.author}</Text>
                    <Text style={styles.productPrice}>Price: ${product.price} / unit</Text>
                    <Text style={styles.productStock}>In Stock: {product.unitInStock}</Text>

                    {/* Product Category */}
                    <View style={styles.categoryContainer}>
                        <Text style={styles.categoryTitle}>Category: {product.category.name}</Text>
                        <Text style={styles.categoryDescription}>{product.category.description}</Text>
                    </View>

                    {/* Add to Cart Button */}
                    <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                        <Text style={styles.addToCartButtonText}>Add to Cart</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f8f8f8',
    },
    scrollView: {
        flexGrow: 1,
        alignItems: 'center',
    },
    productImage: {
        width: '100%',
        height: 350,
        borderRadius: 8,
        marginBottom: 20,
    },
    detailsContainer: {
        width: '100%',
        paddingHorizontal: 15,
    },
    productTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    productPrice: {
        fontSize: 22,
        color: '#007bff',
        marginBottom: 15,
        fontWeight: '600',
    },
    productStock: {
        fontSize: 16,
        color: '#888',
        marginBottom: 20,
    },
    categoryContainer: {
        marginBottom: 25,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    categoryDescription: {
        fontSize: 14,
        color: '#555',
        marginBottom: 15,
    },
    productDescription: {
        fontSize: 16,
        color: '#333',
        marginBottom: 15,

    },
    addToCartButton: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    addToCartButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    productAuthor: {
        fontSize: 16,
        color: '#555',
        marginBottom: 15,
    },
});

export default ProductDetail;
