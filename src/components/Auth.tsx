import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { LogIn, LogOut, UserPlus } from 'lucide-react';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Error de autenticación:', error);
      alert('Error de autenticación');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Error al cerrar sesión');
    }
  };

  if (auth.currentUser) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-gray-300">Conectado como {auth.currentUser.email}</span>
        <button
          onClick={handleSignOut}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Cerrar Sesión
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleAuth} className="flex items-center gap-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Correo"
        className="rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        className="rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
        required
      />
      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
      >
        {isSignUp ? (
          <>
            <UserPlus className="h-5 w-5 mr-2" />
            Registrarse
          </>
        ) : (
          <>
            <LogIn className="h-5 w-5 mr-2" />
            Iniciar Sesión
          </>
        )}
      </button>
      <button
        type="button"
        onClick={() => setIsSignUp(!isSignUp)}
        className="text-purple-400 hover:text-purple-300"
      >
        {isSignUp ? '¿Ya tienes cuenta? Inicia Sesión' : '¿Necesitas una cuenta? Regístrate'}
      </button>
    </form>
  );
};

export default Auth;