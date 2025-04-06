export const logout = () => {
    // Limpar tokens, dados locais, etc.
    localStorage.clear(); // ou SecureStore.deleteItemAsync(), asyncStorage, etc.
  };