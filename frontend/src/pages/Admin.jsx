import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Admin() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: 0, stock: 0, category: '' });

  if (!user) return <Navigate to="/login" />;

  const fetchProducts = () => {
    api.get('/products').then(res => setProducts(res.data));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();
    await api.post('/products', newProduct);
    setNewProduct({ name: '', price: 0, stock: 0, category: '' });
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <form onSubmit={addProduct}>
        <input value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} placeholder="Name" />
        <input type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} placeholder="Price" />
        <input type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value)})} placeholder="Stock" />
        <input value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} placeholder="Category" />
        <button type="submit">Add</button>
      </form>
      <ul>
        {products.map(p => (
          <li key={p.id}>{p.name} - <button onClick={() => deleteProduct(p.id)}>Delete</button></li>
        ))}
      </ul>
    </div>
  );
}