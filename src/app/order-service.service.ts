import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderServiceService {

  constructor(private http:HttpClient) { }
  
  placeOrder(data:any){
    console.log('palce order ',data)
    return this.http.post('http://localhost:4000/order-service/',data);
  }
  orderList(){
    return this.http.get('http://localhost:4000/order-service/');
  }
  modifyOrder(data:any){
    console.log(data);
    
    return this.http.put('http://localhost:4000/order-service/',data);
  }
  cancleOrder(id:any)
  {
    return this.http.delete('http://localhost:4000/order-service/'+id);
  }
}
