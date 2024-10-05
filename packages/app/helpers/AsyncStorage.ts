import AsyncStorage from '@react-native-async-storage/async-storage'

type AsyncStorageValue = unknown

export const getItem = async (key: string): Promise<AsyncStorageValue> => {
  const value = (await AsyncStorage.getItem(key)) as string
  try {
    const parsedValue = JSON.parse(value) as AsyncStorageValue
    return parsedValue
  } catch {
    return value
  }
}

export const setItem = async (key: string, value: AsyncStorageValue): Promise<void> => {
  const stringValue = typeof value !== 'string' ? JSON.stringify(value) : value
  await AsyncStorage.setItem(key, stringValue)
}

// export const removeItem = async (key: string): Promise<void> => {
//   await AsyncStorage.removeItem(key)
// }

export const clearStorage = async (): Promise<void> => {
  await AsyncStorage.clear()
}
