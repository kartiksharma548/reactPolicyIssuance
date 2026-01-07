class LocalService {
    
    get(key:string) {
      // @ts-ignore
      return localStorage.getItem(key);
    }
    // @ts-ignore
    set(key,value) {
      
      localStorage.setItem(key, JSON.stringify(value));
    }
    remove(key:string) {
      localStorage.removeItem(key);
    }
    clear() {
      localStorage.clear();
    }
  }
  export default new LocalService();