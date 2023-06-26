import { ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators, FormArray, UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'src/app/shared/custom-toaster/toaster.service';
import { ApiServicesService } from 'src/app/services/api-services.service';

@Component({
  selector: 'app-report-bug',
  templateUrl: './report-bug.component.html',
  styleUrls: ['./report-bug.component.scss']
})
export class ReportBugComponent implements OnInit {
  @ViewChild("video")
  public video!: ElementRef;

  @ViewChild("canvas")
  public canvas!: ElementRef;

  public captures: any;
  cameraOn: boolean=false;
  image: any;
  reportBugForm!:UntypedFormGroup
  constructor(private ngbModel:NgbModal,
    private service:ApiServicesService,
    private router:Router,
    private newToast:ToasterService) { }

  ngOnInit(): void {
    this.reportBugForm=new UntypedFormGroup({
      title: new UntypedFormControl('', Validators.required),
      query: new UntypedFormControl('', Validators.required)
    })
  }

  // to open attach modal
  
  attchModal(content:any) {
    this.ngbModel.open(content, { size: 'sm' , centered:true,});
  }

  // for open a camera
  cameraOpen(){
    this.cameraOn=true;
    
    setTimeout(function(){
      
    },50000);
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
          this.video.nativeElement.srcObject = stream;
          this.video.nativeElement.play();
      });
  }
  }

  // for capture a image from camera
  public capture() {
      var context = this.canvas.nativeElement.getContext("2d").drawImage(this.video.nativeElement, 0, 0, 640, 480);
      this.captures.push(this.canvas.nativeElement.toDataURL("image/png"));
      console.log(this.captures);
      this.image=this.captures[0]
      console.log(this.image);
      
      
      this.cameraOn=false;
      this.ngbModel.dismissAll();
      this.video.nativeElement.stop()
      // this.video.nativeElement.hide();
  }

  // api for report a bug
  report(){
    let data={
      title:this.reportBugForm.value.title,
      comment:this.reportBugForm.value.query,
      image:[
        this.image
      ]
    }
    this.service.post('bug', data).subscribe((res:any)=>{
      console.log(res);
      if(res.status==200){
        this.newToast.success("Reported successfully.");
        this.router.navigate(['/']);
      }
    },(err)=>{
      this.newToast.error("something went wrong");
    })
  }


}
