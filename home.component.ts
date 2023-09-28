import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService, Options } from '../service/data.service';
// import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Opportunity } from '../service/pojo/opportunity';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // selectedDate: Date;
  opportunityArray: any = [];
  opportunityObject: Opportunity = new Opportunity();
  options: Options = new Options();
  stage: any = "";
  flag: string = "";
  ELEMENT_DATA: Opportunity[] = new Array();
  displayedColumns: string[] = ['Action', 'id', 'name', 'closeDate', 'amount', 'stage'];
  dataSource = new MatTableDataSource<Opportunity>(this.ELEMENT_DATA);
  @ViewChild(MatPaginator, { static: true }) paginator: any;
  deleteSelection: any[] = [];
  //  data: any;

  // push(item: any) {
  //   this.data.push(item);
  // }
  // toArray() {
  //   return this.data;
  // }
  constructor(private dataService: DataService, private modalService: NgbModal, public dialog: MatDialog) {
    // this.options;
    // this.selectedDate = new Date();
  }

  ngOnInit(): void {
    this.fillList();
    // this.getOpportunityByStage(this.stage);

  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  fillList() {
    //   alert("hii");
    this.dataService.getData("opportunity", this.options).subscribe(data => { this.ELEMENT_DATA = data; /*alert(JSON.stringify(this.ELEMENT_DATA));*/ this.dataSource = new MatTableDataSource<Opportunity>(this.ELEMENT_DATA); this.dataSource.paginator = this.paginator; });
    // this.clearData();
  }
  save() {
    if (this.flag == "Add")
      this.dataService.insertData("opportunity", this.opportunityObject, this.options).subscribe(data => { this.fillList(); })
    else
      this.dataService.updateData("opportunity", this.opportunityObject, this.options).subscribe(data => { this.fillList(); })
  }
  add() {
    this.flag = "Add";
  }

  update(id: number) {
    this.flag = "update";
    this.dataService.getData("opportunity/" + id, this.options).subscribe(data => { this.opportunityObject = data; })
  }

  edit() {
    this.dataService.updateData("opportunity", this.opportunityObject, this.options).subscribe(data => { this.fillList(); })
  }

  deleteMultiple() {
    let ans = confirm("R u sure u wanna all delete this record?");
    console.log('ids to be deleted', this.deleteSelection);

    // this.dataService.deleteDataAll("opportunity/delete", this.options, this.deleteSelection).subscribe(data => { this.fillList(); })
    // this.dataService.deleteDataAll("opportunity/delete",this.options,this.deleteSelection).subscribe(data=>{this.fillList();})
  }

  delete(id: number) {
    let ans = confirm("R u sure u wanna delete this record?");

    if (ans)
      this.dataService.deleteData("opportunity/" + id, this.options).subscribe(data => { this.fillList(); })
  }
  // deleteAllByidIn(id:any)
  // {
  //   let ans = confirm("R u sure u wanna all delete this record?");

  //   if(ans)
  //   this.dataService.deleteData("opportunity/"+id,this.options).subscribe(data=>{this.fillList();})

  // }


  openPopUp(content: any) {
    this.dialog.open(content, {
      width: '60vw'
    });
    // this.modalService.open(content, { size: 'lg' });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with:${reason}`;
    }
  }


  /**
   * @description: method updates the user selection and stores them in local variable
   * @param ev : element id selected/unselected by user
   * @returns: void
   */
  changeSelection(ev: any, id: any): void {

    if (ev.target.checked) {
      this.deleteSelection.push(id);
      this.deleteSelection = [...new Set(this.deleteSelection)]; // removes duplicate from array

    } else {
      this.deleteSelection = this.deleteSelection.filter(ele => ele !== id); // removes unchecked id from selection
    }

  }

}




