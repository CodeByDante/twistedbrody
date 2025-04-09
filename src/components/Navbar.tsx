import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Search, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../lib/store';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { categories, addCategory, removeCategory } = useStore();
  const navigate = useNavigate();

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      addCategory({
        id: crypto.randomUUID(),
        name: newCategory.trim(),
        userId: 'temp-user'
      });
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      removeCategory(categoryId);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="bg-surface px-4 py-3 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <Camera className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">TwistedBrody</span>
          </Link>
          
          <div className="relative">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center space-x-1 text-gray-300 hover:text-primary"
            >
              <span>Categorías</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 rounded-md bg-surface-light shadow-lg overflow-hidden">
                <form onSubmit={handleAddCategory} className="p-2 border-b border-gray-700">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Agregar nueva categoría"
                      className="flex-1 px-3 py-1.5 bg-surface rounded-md border border-gray-600 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                    <button
                      type="submit"
                      className="bg-primary hover:bg-primary/90 text-white p-1.5 rounded-md"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </form>
                
                <div className="max-h-64 overflow-y-auto">
                  {categories.length === 0 ? (
                    <div className="p-4 text-center text-gray-400 text-sm">
                      No hay categorías aún
                    </div>
                  ) : (
                    categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center justify-between px-4 py-2 hover:bg-surface"
                      >
                        <Link
                          to={`/?category=${category.id}`}
                          className="flex-1 text-sm text-gray-300 hover:text-white"
                          onClick={() => setIsOpen(false)}
                        >
                          {category.name}
                        </Link>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar videos..."
              className="w-64 rounded-full bg-surface-light py-2 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </form>
        </div>
      </div>
    </nav>
  );
}