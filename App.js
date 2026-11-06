import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';

export default function App() {
  const [dishes, setDishes] = useState([
    { id: '1', name: 'Garlic Bread', description: 'Freshly baked garlic bread with herbs', course: 'Starter', price: '45.00' },
    { id: '2', name: 'Grilled Steak', description: 'Juicy beef steak with mushroom sauce', course: 'Main Course', price: '150.00' },
    { id: '3', name: 'Chocolate Brownie', description: 'Warm brownie with vanilla ice cream', course: 'Dessert', price: '65.00' },
  ]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('Starter');
  const [price, setPrice] = useState('');
  const [editId, setEditId] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const handleSaveDish = () => {
    if (!name || !description || !price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (editId) {
      setDishes(dishes.map(item => item.id === editId ? { ...item, name, description, course, price } : item));
      setEditId(null);
    } else {
      const newDish = {
        id: Date.now().toString(),
        name,
        description,
        course,
        price,
      };
      setDishes([...dishes, newDish]);
    }

    setName('');
    setDescription('');
    setPrice('');
    setCourse('Starter');
  };

  const handleEdit = (dish) => {
    setName(dish.name);
    setDescription(dish.description);
    setCourse(dish.course);
    setPrice(dish.price);
    setEditId(dish.id);
  };

  const handleDelete = (id) => {
    setDishes(dishes.filter(item => item.id !== id));
  };

  const totalItems = dishes.length;
  const averagePrice = totalItems > 0 
    ? (dishes.reduce((sum, item) => sum + parseFloat(item.price || 0), 0) / totalItems).toFixed(2) 
    : '0.00';
  const startersCount = dishes.filter(i => i.course === 'Starter').length;
  const mainsCount = dishes.filter(i => i.course === 'Main Course').length;
  const dessertsCount = dishes.filter(i => i.course === 'Dessert').length;

  const filteredDishes = dishes.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || item.course === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerTitle}>Chef's Menu Manager</Text>

      <View style={styles.statsContainer}>
        <Text style={styles.statsHeader}>Menu Overview & Statistics</Text>
        <Text style={styles.statsText}>Total Menu Items: {totalItems}</Text>
        <Text style={styles.statsText}>Average Price: R {averagePrice}</Text>
        <Text style={styles.statsText}>
          Breakdown -> Starters: {startersCount} | Mains: {mainsCount} | Desserts: {dessertsCount}
        </Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>{editId ? 'Edit Dish' : 'Add New Dish'}</Text>
        <TextInput style={styles.input} placeholder="Dish Name" placeholderTextColor="#888" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Description" placeholderTextColor="#888" value={description} onChangeText={setDescription} />
        <TextInput style={styles.input} placeholder="Course (Starter / Main Course / Dessert)" placeholderTextColor="#888" value={course} onChangeText={setCourse} />
        <TextInput style={styles.input} placeholder="Price (e.g., 120.0)" placeholderTextColor="#888" value={price} onChangeText={setPrice} keyboardType="numeric" />
        
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveDish}>
          <Text style={styles.saveButtonText}>{editId ? 'Update Item' : 'Add Item'}</Text>
        </TouchableOpacity>
      </View>

      <TextInput 
        style={styles.input} 
        placeholder="Search menu items by name..." 
        placeholderTextColor="#888" 
        value={searchQuery} 
        onChangeText={setSearchQuery} 
      />

      <View style={styles.filterContainer}>
        {['All', 'Starter', 'Main Course', 'Dessert'].map(filter => (
          <TouchableOpacity 
            key={filter} 
            style={[styles.filterButton, selectedFilter === filter && styles.activeFilter]} 
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[styles.filterText, selectedFilter === filter && styles.activeFilterText]}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredDishes.map(item => (
        <View key={item.id} style={styles.dishCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.dishName}>{item.name}</Text>
            <Text style={styles.dishDesc}>{item.description}</Text>
            <Text style={styles.dishCourse}>Course: {item.course}</Text>
            <Text style={styles.dishPrice}>R {item.price}</Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(item)}>
              <Text style={styles.btnText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
              <Text style={styles.btnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f5f5f5', flexGrow: 1 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 15, color: '#333' },
  statsContainer: { backgroundColor: '#e2e8f0', padding: 12, borderRadius: 8, marginBottom: 15 },
  statsHeader: { fontWeight: 'bold', fontSize: 15, marginBottom: 5, color: '#1e293b' },
  statsText: { fontSize: 13, color: '#334155', marginBottom: 2 },
  formContainer: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, elevation: 2 },
  formTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 6, padding: 10, marginBottom: 10, backgroundColor: '#fff', color: '#000' },
  saveButton: { backgroundColor: '#4f46e5', padding: 12, borderRadius: 6, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  filterContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  filterButton: { paddingVertical: 6, paddingHorizontal: 10, backgroundColor: '#e2e8f0', borderRadius: 6 },
  activeFilter: { backgroundColor: '#4f46e5' },
  filterText: { fontSize: 12, color: '#334155' },
  activeFilterText: { color: '#fff', fontWeight: 'bold' },
  dishCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 10, alignItems: 'center', elevation: 1 },
  dishName: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  dishDesc: { fontSize: 13, color: '#666', marginVertical: 2 },
  dishCourse: { fontSize: 12, color: '#0284c7', fontWeight: '600' },
  dishPrice: { fontSize: 14, fontWeight: 'bold', color: '#16a34a', marginTop: 4 },
  actionButtons: { justifyContent: 'space-around', height: 70 },
  editBtn: { backgroundColor: '#ca8a04', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 4, alignItems: 'center' },
  deleteBtn: { backgroundColor: '#dc2626', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 4, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
});
