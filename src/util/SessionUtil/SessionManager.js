import { StorageInit } from './StorageInit';

export const SessionManager = {
  StoreAsString:  (key, value) => {
    try {
      StorageInit.set(key, value);
    } catch (e) {
      console.log(e);
      console.log('Saving Error');
    }
  },
  StoreAsObject: (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      StorageInit.set(key, jsonValue);
    } catch (e) {
      console.log(e);
      console.log('Saving Error');
    }
  },

  GetAsString:  (key) => {
    try {
      let value = StorageInit.getString(key);
      return value !== null ? value : null;
    } catch (e) {
      console.log(e);
      console.log('Getting Error');
    }
  },

  GetAsObject: (key) => {
    try {
      const jsonValue = StorageInit.getString(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log(e);
      console.log('Getting Error');
    }
  },

  GetAllKeys: () => {
    try {
      let keys = [];
      try {
        keys = StorageInit.getAllKeys();
        console.log(keys);
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      console.log(e);
    }
  },
 RemoveValue: (key) => {
    try {
      StorageInit.delete(key);
    } catch (e) {
      console.log("key delete error :",e);
    }
  },

  ClearAllKeys: () => {
    try {
      StorageInit.clearAll();
    } catch (e) {
      console.log("clear all error :",e);
    }
  },
};
