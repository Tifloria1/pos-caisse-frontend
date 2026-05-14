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
import { AuthService } from '../../shared/models/auth.service';
import { CustomersService } from '../customers/customers.service';
import { CaisseSessionService } from '../caisse-session/caisse-session.service';
import { TableService } from '../tables/table.service';

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

  customers: any[] = [];
selectedCustomerId: number | null = null;

tables: any[] = [];
selectedTableId: number | null = null;

hasOpenCaisseSession = false;

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private invoiceService: InvoiceService,
    private toastService: ToastService,
    public authService: AuthService,
    private customersService: CustomersService,
    private tableService: TableService,
    private caisseSessionService: CaisseSessionService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCustomers();
    this.loadTables();
    this.checkCaisseSession();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => this.products = data,
      error: () => this.message = 'Erreur lors du chargement des produits'
    });
  }

  loadCustomers(): void {
  this.customersService.getCustomers().subscribe({
    next: (data) => this.customers = data
  });
}

loadTables(): void {
  this.tableService.getTables().subscribe({
    next: (data) => {
      this.tables = data;
      
    }
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

  if (!this.hasOpenCaisseSession) {
    this.message = 'Veuillez ouvrir une session caisse avant de vendre';
    this.toastService.error('Veuillez ouvrir une session caisse');
    return;
  }

  this.message = '';
  this.loading = true;

  if (this.selectedTableId) {
    this.orderService.getActiveOrderByTable(this.selectedTableId)
      .subscribe({
        next: (existingOrder: any) => {
          if (existingOrder) {
            this.addProductsToExistingOrder(existingOrder.id);
          } else {
            this.createNewOrder();
          }
        },
        error: () => {
          this.createNewOrder();
        }
      });

    return;
  }

  this.createNewOrder();
}

createNewOrder(): void {
  this.orderService.createOrder(
    this.selectedCustomerId,
    this.selectedTableId
  ).subscribe({
    next: (order) => {
      this.currentOrderId = order.id;
      this.addProductsToExistingOrder(order.id);
    },
    error: (err) => {
      console.error(err);
      this.loading = false;
this.message = 'Veuillez ouvrir une session caisse';
this.toastService.error('Veuillez ouvrir une session caisse');    }
  });
}

addProductsToExistingOrder(orderId: number): void {

  this.currentOrderId = orderId;

  from(this.cart).pipe(

    concatMap(item =>
      this.orderService.addProductToOrder(
        orderId,
        item.product.id,
        item.quantity
      )
    ),

    finalize(() => {
      this.loading = false;
    })

  ).subscribe({

    next: () => {},

    error: (err) => {

      console.error(err);

      this.message = 'Veuillez ouvrir une session caisse';

      this.toastService.error('Veuillez ouvrir une session caisse');
    },

    complete: () => {

      if (!this.currentOrderId) {
        return;
      }

      this.orderService.generateKitchenTickets(orderId)
        .subscribe({

          next: () => {

            this.toastService.success('Produits ajoutés à la commande');

            this.message = 'Commande mise à jour avec succès';

            this.cart = [];

            this.loadTables();
          },

          error: (err) => {

            console.error(err);

            this.toastService.error(
              'Commande mise à jour mais erreur génération tickets'
            );
          }

        });

    }

  });

}
payOrder(): void {
  if (!this.currentOrderId) {
    this.toastService.error('Veuillez d’abord valider la commande');
    return;
  }

  if (!this.hasOpenCaisseSession) {
    this.message = 'Veuillez ouvrir une session caisse avant le paiement';
    this.toastService.error('Veuillez ouvrir une session caisse');
    return;
  }

  this.loading = true;

  this.paymentService.payOrder(
    this.currentOrderId,
    this.paymentMethod
  ).subscribe({
    next: () => {
      this.invoiceService.createInvoice(this.currentOrderId!)
        .subscribe({
          next: () => {
            this.loadTables();
            this.toastService.success('Paiement effectué avec succès');
            this.invoiceService.downloadInvoicePdf(this.currentOrderId!);
            this.clearCart();
            this.loadProducts();
            this.loading = false;
          },
          error: () => {
            this.loading = false;
            this.toastService.error('Erreur création facture');
          }
        });
    },
    error: () => {
      this.loading = false;
      this.message = 'Veuillez ouvrir une session caisse';
      this.toastService.error('Veuillez ouvrir une session caisse');
    }
  });
}
  getFilteredProducts(): Product[] {
  return this.products.filter(product =>
    product.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
    product.barcode?.toLowerCase().includes(this.searchText.toLowerCase())
  );
}


checkCaisseSession(): void {
  this.caisseSessionService.getOpenSession()
    .subscribe({
      next: (session : any) => {
        this.hasOpenCaisseSession = !!session;
      },
      error: () => {
        this.hasOpenCaisseSession = false;
      }
    });
}
}