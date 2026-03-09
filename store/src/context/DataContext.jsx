import { createContext, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../store/slices/dataSlice';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data);

  // 🔹 Common Helper: Jo check karega ke payload function hai ya direct value
  const wrapDispatch = (actionCreator, currentState) => (payload) => {
    const newValue = typeof payload === 'function' ? payload(currentState) : payload;
    dispatch(actionCreator(newValue));
  };

  const value = {
    ...data,
    setMyProducts: wrapDispatch(actions.setMyProducts, data.myProducts),
    setProductOverrides: wrapDispatch(actions.setProductOverrides, data.productOverrides),
    setDeletedProductIds: wrapDispatch(actions.setDeletedProductIds, data.deletedProductIds),
    setMyCategories: wrapDispatch(actions.setMyCategories, data.myCategories),
    setCategoryOverrides: wrapDispatch(actions.setCategoryOverrides, data.categoryOverrides),
    setDeletedCategoryIds: wrapDispatch(actions.setDeletedCategoryIds, data.deletedCategoryIds),
    setNextLocalCategoryId: wrapDispatch(actions.setNextLocalCategoryId, data.nextLocalCategoryId),
    setMyUsers: wrapDispatch(actions.setMyUsers, data.myUsers),
    setDeletedUserIds: wrapDispatch(actions.setDeletedUserIds, data.deletedUserIds),
    setNextLocalUserId: wrapDispatch(actions.setNextLocalUserId, data.nextLocalUserId),
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside DataProvider');
  return ctx;
}
