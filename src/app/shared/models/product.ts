export interface Product {
  id: number;
  name: string;
  price: number;
  barcode: string;
  imageUrl: string;
  stockQuantity: number;
  active: boolean;
  categoryName?: string;
}