import { OrderServiceService } from './order-service.service';
import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderDialogComponent } from './order-dialog/order-dialog.component';
import { ToastrService } from 'ngx-toastr';

export interface orderData {
  symbol: string;
  filled_quantity: number;
  order_status: string;
  quantity: number;
  Action: string;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'Sensibull';
  displayColumn: string[] = ['symbol', 'filled_quantity', 'order_status', 'quantity', 'Action']
  dataSource !: MatTableDataSource<orderData>;
  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort
  post: any
  constructor(private service: OrderServiceService,
    public dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef,
    private toastr: ToastrService
  ) { }

  openDialog() {
    const dialogRef = this.dialog.open(OrderDialogComponent, {
      width: '40%'
    }).afterClosed().subscribe(val => {
      if (val === 'save') {
        this.Ordersdata();
      }
    })

  }

  ngOnInit(): void {


    this.Ordersdata();
  }

  Ordersdata() {

    this.service.orderList().subscribe((data: any) => {
      console.log(data);

      this.post = data;
      console.log(data[0].order_status);
      this.dataSource = new MatTableDataSource(this.post);
      this.changeDetectorRefs.detectChanges();
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
      data.map((ele: any) => {
        if (ele.order_status === 'complete' || ele.order_status === 'error') {
          ele.hideControls = true
        }
        else {
          ele.hideControls = false
        }
      })
      console.log(data);
    })
  }

  editOrder(row: any) {

    this.dialog.open(OrderDialogComponent, {
      width: '40%',
      data: row
    }).afterClosed().subscribe(val => {

      if (val === 'update') {
        this.Ordersdata();
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase()

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }

  }

  cancleOrder(row: any) {

    console.log(row.identifier);
    this.service.cancleOrder(row.identifier).subscribe({
      next: async (resp: any) => {
        console.log(resp);

        if (resp.success) {
          this.toastr.success(resp.msg, 'Success',{timeOut:1700});
          this.Ordersdata();
        }
        else {
          this.toastr.error(resp.msg, 'Error',{timeOut:1700});
          this.Ordersdata();
        }
      },
      error: (err) => {
        this.toastr.error("some type of error while cancle order", 'Error',{timeOut:1700});
      }
    })

  }

}
