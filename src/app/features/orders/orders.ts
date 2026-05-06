import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../../shared/models/product';
import { ProductService } from '../products/product.service';
import { InvoiceService } from './invoice.service';
import { OrderService } from './order.service';
import { PaymentService } from './payment.service';
import { from } from 'rxjs';
import { concatMap, finalize } from 'rxjs/operators';
import { ToastService } from '../../core/services/toast.service';

interface CartItem {
  product: Product;
  quantity: number;
}
@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit {

  products: Product[] = [];
  cart: CartItem[] = [];

  currentOrderId: number | null = null;
  paymentMethod: 'ESPECES' | 'CARTE' = 'ESPECES';

  loading = false;
  message = '';

  searchText = '';

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private invoiceService: InvoiceService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => this.products = data,
      error: () => this.message = 'Erreur lors du chargement des produits'
    });
  }

  addToCart(product: Product): void {
    const existingItem = this.cart.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cart.push({
        product: product,
        quantity: 1
      });
    }
  }

  increaseQuantity(item: CartItem): void {
    item.quantity++;
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.removeFromCart(item.product.id);
    }
  }

  removeFromCart(productId: number): void {
    this.cart = this.cart.filter(item => item.product.id !== productId);
  }

  getTotal(): number {
    return this.cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  clearCart(): void {
    this.cart = [];
    this.currentOrderId = null;
    this.message = '';
  }

validateOrder(): void {
  if (this.cart.length === 0) {
    this.toastService.error('Le panier est vide');
    return;
  }

  this.loading = true;

  this.orderService.createOrder().subscribe({
    next: (order) => {
      this.currentOrderId = order.id;

      from(this.cart).pipe(
        concatMap(item =>
          this.orderService.addProductToOrder(
            order.id,
            item.product.id,
            item.quantity
          )
        ),
        finalize(() => {
          this.loading = false;
        })
      ).subscribe({
        next: () => {},
        complete: () => {
          this.toastService.success('Commande créée avec succès');
          this.message = 'Commande créée avec succès';
        },
        error: (err) => {
          console.error(err);
          this.toastService.error('Erreur lors de l’ajout des produits à la commande');
        }
      });
    },
    error: (err) => {
      console.error(err);
      this.loading = false;
      this.toastService.error('Erreur lors de la création de la commande');
    }
  });
}

  payOrder(): void {
    if (!this.currentOrderId) {
      this.toastService.error('Veuillez d’abord valider la commande');
      return;
    }

    this.paymentService.payOrder(this.currentOrderId, this.paymentMethod).subscribe({
      next: () => {
        this.toastService.success('Paiement effectué avec succès');
        this.message = 'Paiement effectué avec succès';
        this.invoiceService.downloadInvoicePdf(this.currentOrderId!);
        this.clearCart();
        this.loadProducts();
      },
      error: () => {
        this.toastService.error('Erreur lors du paiement');
      }
    });
  }

  getFilteredProducts(): Product[] {
  return this.products.filter(product =>
    product.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
    product.barcode?.toLowerCase().includes(this.searchText.toLowerCase())
  );
}
}