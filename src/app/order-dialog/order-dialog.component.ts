import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { OrderServiceService } from '../order-service.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-order-dialog',
  templateUrl: './order-dialog.component.html',
  styleUrls: ['./order-dialog.component.css']
})
export class OrderDialogComponent implements OnInit {
  quantityValue: any;
  updateObject: any
  orderForm !: FormGroup;
  selectReadonly: any
  actionbtn: string = "Submit"
  constructor(private formBuilder: FormBuilder,
    private orderService: OrderServiceService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dilogRef: MatDialogRef<OrderDialogComponent>,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.orderForm = this.formBuilder.group({
      symbol: ['', Validators.required],
      quantity: ['', Validators.required]
    });

    if (this.editData) {
      this.selectReadonly = true;
      this.actionbtn = "Update";
      this.orderForm.controls['symbol'].setValue(this.editData.symbol);
      this.orderForm.controls['quantity'].setValue(this.editData.quantity);
      this.updateObject = this.editData;
    }


  }

  addOrder() {
    if (!this.editData) {
      if (this.orderForm.valid) {
        console.log(this.orderForm.value)
        console.log(this.orderForm.value.quantity);
        if (this.orderForm.value.quantity <= 500) {
          this.orderService.placeOrder(this.orderForm.value).subscribe({
            next: (resp: any) => {
              if (resp.success) {

                this.toastr.success(resp.msg, 'Success',{timeOut:1700});

                this.orderForm.reset();
                this.dilogRef.close('save');
              }
              else {
                this.toastr.error(resp.msg, 'Error',{timeOut:1700});
                this.orderForm.reset();
                this.dilogRef.close('error');
              }
            },
            error: () => {
              this.toastr.error("some type of error while Place Order", 'Error',{timeOut:1700});
            }
          })
        }
        else {
          this.toastr.error("order quantity should be less than 500 ", 'Error',{timeOut:1700});
        }
      }
    }
    else {
      this.modOrder()
    }
  }
  modOrder() {
    console.log(this.updateObject.quantity);
    if (this.updateObject.order_status === 'complete') {
      this.toastr.error("sorry only open orders can be modify", 'Error',{timeOut:1700});
      this.orderForm.reset();
      this.dilogRef.close('update');
    }
    else if (this.updateObject.order_status === 'error') {
      this.toastr.error("sorry only open orders can be modify", 'Error',{timeOut:1700});
      this.orderForm.reset();
      this.dilogRef.close('update');
    }
    else {

      let myUpdateObject: any = {};
      for (let key of Object.keys(this.orderForm.value)) {
        if (key == "quantity") {
          myUpdateObject[key] = this.orderForm.value[key];
          myUpdateObject.identifier = this.updateObject.identifier
        }
      }
      console.log(myUpdateObject.quantity);
      if (myUpdateObject.quantity <= 500) {
        this.orderService.modifyOrder(myUpdateObject).subscribe({
          next: async (resp: any) => {
            if (resp.success) {
              this.toastr.success(resp.msg, 'Success',{timeOut:1700});
              this.orderForm.reset();
              this.dilogRef.close('update');
            }
            else {
              this.toastr.error(resp.msg, 'Error',{timeOut:1700});
              this.orderForm.reset();
              this.dilogRef.close('error');
            }
            this.orderForm.reset();
            this.dilogRef.close('update');
          },
          error: () => {
            this.toastr.error("some type of error while modify order", 'Error',{timeOut:1700});
          }
        })
      }
      else {
        this.toastr.error("order quantity should be less than 500 ", 'Error',{timeOut:1700});
      }
    }

  }
}
