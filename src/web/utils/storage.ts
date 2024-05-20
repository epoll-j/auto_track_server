import { StorageEnum } from '@/types/enum';

export const getItem = <T>(key: StorageEnum, session = false): T | null => {
  let value = null;
  try {
    let result: string
    if (session) {
      result = window.sessionStorage.getItem(key);
    } else {
      result = window.localStorage.getItem(key);
    }
    
    if (result) {
      value = JSON.parse(result);
    }
  } catch (error) {
    console.error(error);
  }
  return value;
};

export const getStringItem = (key: StorageEnum, session = false): string | null => {
  if (session) {
    return sessionStorage.getItem(key);
  }
  return localStorage.getItem(key);
};
export const setItem = <T>(key: StorageEnum, value: T, session = false): void => {
  if (session) {
    sessionStorage.setItem(key, JSON.stringify(value));
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
};
export const removeItem = (key: StorageEnum, session = false): void => {
  if (session) {
    sessionStorage.removeItem(key);
  } else {
    localStorage.removeItem(key);
  }
};
export const clearItems = (session = false) => {
  if (session) {
    sessionStorage.clear();
  } else {
    localStorage.clear();
  }
};
