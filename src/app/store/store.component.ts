import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
import { store } from '@angular/core/src/render3/instructions';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {
  title : string = 'Welcome to Gifiti';
  data: any;
  genderSelected: number;
  priceRangeSelected: number;
  filteredData: any;
  flattenedProducts: any [];
  

  mapPriceFilters() {
   return this.data.PriceFilter.map((budget,idx,budgets) => {
     budget.minDisplay = (idx === 0)? '0' :  budgets[idx - 1].DisplayText;
     budget.maxDisplay = budget.DisplayText;
     budget.minVal = (idx === 0)? 0 :  budgets[idx - 1].Value;
     budget.maxVal = budget.Value;
     return budget
    })
  }

  onPriceRangSelect(ev) {
    if (ev === undefined || ev === 'null') ev = null;
    this.priceRangeSelected = ev;
    this.filterData();
  }

  onGenderSelect(ev) {
    if (ev === undefined || ev === 'null') ev = null;
    this.genderSelected = ev;
    this.filterData();
  }

  filterData() {
    this.filteredData = this.data.Stores.map(store => {
      return store.Products.filter(product => {
        return (
          product.ProductTags.includes(Number(this.genderSelected)) ||
          this.genderSelected === null
        );
      }).filter(product => {
         let budgetObj = this.mapPriceFilters().find(budget => {
           return budget.maxVal === Number(this.priceRangeSelected)
         })
        if(!budgetObj){
          budgetObj = {}
          budgetObj.minVal = 0;
          budgetObj.maxVal = Infinity;
        } 
        return budgetObj.minVal <= product.Price && budgetObj.maxVal >= product.Price
      }).map(product => {
        product.storeName = store.StoreName;
        return product;
      });
    });
    this.flattenProducts(); 
  }

  flattenProducts() {
    let flattenedProducts = [];
    this.filteredData.forEach(products => {
      flattenedProducts = flattenedProducts.concat(products);
    });
    this.flattenedProducts = flattenedProducts;
  }

  constructor(private productsData: ProductsService) {}

  ngOnInit() {
    this.genderSelected = null;
    this.priceRangeSelected = null;
    this.data = this.productsData.productsData();
    this.filterData();
  }
}
