import { Component, OnInit } from '@angular/core';

import { Product, CreateProductDTO, UpdateProductDTO } from '../../models/product.model';

import { StoreService } from '../../services/store.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  myShoppingCart: Product[] = [];
  total = 0;
  products: Product[] = [];
  showProductDetails = false;
  productChosen: Product = {
    id: '',
    price: 0,
    images: [],
    title: '',
    category: {
      id: '',
      name: '',
    },
    description:''
    };

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    this.productsService.getAllProducts()
    .subscribe(data => {
      this.products = data;
    });
  }

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  toggleProductDetail(){
    this.showProductDetails = !this.showProductDetails;
  }

  onShowDetails(id: string){
    this.productsService.getProducts(id).subscribe( data => {
      //console.log('product', data);
      this.toggleProductDetail();
      this.productChosen = data;
    })
  }

  createNewProduct(){
    const product: CreateProductDTO = {
      title: 'New Product',
      description: 'This is a description',
      images:[''],
      price: 1000,
      categoryId: 2,
    }
    this.productsService.create(product).subscribe( data => {
      this.products.unshift(data);
    })
  }

  updateProduct() {
    const changes: UpdateProductDTO = {
      title: 'change title',
    }
    const id = this.productChosen.id;
    this.productsService.update(changes, id)
    .subscribe(data => {
      const productIndex = this.products.findIndex(item => item.id === this.productChosen.id);
      this.products[productIndex] = data;
      this.productChosen = data;
    });
  }

  deleteProduct(){
    const id = this.productChosen.id;
    this.productsService.delete(id).subscribe(
      () => {
        const productIndex = this.products.findIndex(item => item.id === this.productChosen.id);
        this.products.splice(productIndex,1);
        this.showProductDetails = false;
      }
    )
  }

}
