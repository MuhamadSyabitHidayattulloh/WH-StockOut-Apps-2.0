// export const apiBaseURL = 'http://10.122.80.8:8700/traceability';
export const apiBaseURL = 'http://10.122.73.131:8700/wh-stockout';

export const checkUserIDAPI = `${apiBaseURL}/api/registration/checkNpk`;
export const registerAccountAPI = `${apiBaseURL}/api/registration/registerNew`;
export const stockoutWithoutInstructionApi = `${apiBaseURL}/api/warehouse/stockOutWithoutInstruction`;
export const getDetailShoppingListApi = `${apiBaseURL}/api/warehouse/getDetailShoppingList`;
export const loginApi = `${apiBaseURL}/api/loginApps/Stockout/confirmLogin`;
export const getCategoryShopping = `${apiBaseURL}/api/warehouse/getCategoryPart`;
export const whStockoutApi = `${apiBaseURL}/api/warehouse/stockoutAndroid`;
