export const BASE_URL = (process.env.REACT_APP_API_BASE_URL || '').replace(/\/$/, '');

const apiPath = (path) => (BASE_URL ? path : `/api${path}`);

export const PRODUCTS_URL = apiPath('/products');
export const USERS_URL = apiPath('/users');
export const ORDERS_URL = apiPath('/orders');
export const CATEGORIES_URL = apiPath('/categories');
export const BRANDS_URL = apiPath('/brands');
export const BANNERS_URL = apiPath('/banners');
export const CONTACT_URL = apiPath('/contact');
export const SETTINGS_URL = apiPath('/contact/settings');
export const TUTORIALS_URL = apiPath('/tutorials');
export const UPLOAD_URL = apiPath('/upload');
