import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { zip } from 'rxjs';

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
    limit = 10;
    offset = 0;
    statusDetail: 'loading' | 'success' | 'error'| 'init'  = 'init';

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    this.productsService.getProductsByPage(10,0)
    .subscribe(data => {
      this.products = data;
      this.offset += this.limit;
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
    this.statusDetail = 'loading';
    this.productsService.getProducts(id).subscribe( data => {
      //console.log('product', data);
      this.toggleProductDetail();
      this.productChosen = data;
      this.statusDetail = 'success';
    }, errorMsg => {
      window.alert(errorMsg);
      this.statusDetail = 'error';
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

  loadMore(){
    this.productsService.getProductsByPage(this.limit,this.offset)
    .subscribe(data => {
      this.products = this.products.concat(data);
      this.offset += this.limit;
    });
  }

  readAndUpdate(id: string){
    this.productsService.getProducts(id).pipe(
      switchMap( (product) =>  this.productsService.update({title: 'Chnege'}, product.id))
      // Podemos aqui agregar muchas cosas mas con la misma sintexis de arriba
    ).subscribe( data => {
      console.log(data)
    });
    this.productsService.fetchReadAndUpdate( id, {title: 'Nuevo'})
    .subscribe( response => {
      const read = response[0];
      const update = response[1];
    })
  }

}
