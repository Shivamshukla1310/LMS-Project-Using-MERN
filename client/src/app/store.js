import { configureStore } from "@reduxjs/toolkit"
import rootReducer from "./rootReducer";
import { authApi } from "features/apis/authApi";
import { courseApi } from "features/apis/courseApi";
import { purchaseApi } from "features/apis/purchaseApi";
import { courseProgressApi } from "features/apis/courseProgressApi";

export const appStore = configureStore({
  reducer: rootReducer,
  middleware: (defaultMiddleware) => defaultMiddleware().concat(authApi.middleware, courseApi.middleware, purchaseApi.middleware, courseProgressApi.middleware)
});

const initializeApp = async () => {
  await appStore.dispatch(authApi.endpoints.loadUser.initiate({}, { forceRefetch: true }))
}
initializeApp();