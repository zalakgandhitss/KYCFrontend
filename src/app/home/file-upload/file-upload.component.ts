import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { ClassifyServiceService } from '../classify-service.service';
import { ClassifyRequest, ClassifyResponce, ILoaction } from '../classify-DTO';



@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  
  @ViewChild('webcamElement') webcamElement!: ElementRef;
  @ViewChild('heading') heading: ElementRef;
  
  selectedDocument: string | null = null ;  
  webcamImage: WebcamImage | null = null;

  constructor(private service : ClassifyServiceService) {}
  
  ngOnInit(): void {
    this.getLocation(); 
    this.selectedDocument='';
  }


  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
  } 

  @ViewChild('videoElement') videoElement: ElementRef; 

  public flipview:boolean = false; 
  public pancardcontainer:boolean = true; 
  public addressproofcontainer:boolean = true;
  public wetsigncontainer:boolean = true; 
  public selfiecontainer:boolean = true; 

  public showWebcam1 = false;
  public showWebcam2 = false;
  public showWebcam3 = false;
  public showWebcam4 = false;
  public showWebcam5 = false;

  public webcamImage1 = null;
  public webcamImage2 = null;
  public webcamImage3 = null;
  public webcamImage4 = null; 
  public webcamImage5 = null; 

  public frontimage = null; 
  public backimage  = null; 
  public camselect:number = 0; 



  public success = null;
  CurrentLocation:ILoaction = {
    latitude:"",
    longitude:""
  }

  getLocation() {
    if (navigator.geolocation) {
    
      navigator.geolocation.getCurrentPosition(
        position => this.showPosition(position),
        error => this.handleError(error)
      );
    } else { 
      alert("Geolocation is not supported by this browser."); 
      
    }
  }

  showPosition = (position) => {
    this.CurrentLocation.latitude = position.coords.latitude;
    this.CurrentLocation.longitude = position.coords.longitude;
   
    console.log(this.CurrentLocation);
  } 

  handleError(error: GeolocationPositionError) {
    if (error.code === error.PERMISSION_DENIED) {
      alert('Location permission is required for this functionality.');
     this.getLocation();
    } 
  }

   public backbutton(i:number){
    this.flipview = false;
    this.toggleWebcam(i);
   } 

   public funcOnchange(){
    document.getElementById("AddressResponse").innerHTML=""; 
    document.getElementById("AddressResponse2").innerHTML=""; 
    this.showWebcam2=false; 
    this.showWebcam5=false; 
    this.webcamImage2=null; 
    this.webcamImage5=null;
   } 

  public async toggleWebcam(i:number,selectcam?:boolean) { 
    if(!selectcam){

    if(i==1)
    this.showWebcam1 = !this.showWebcam1;   
  
    if(i==2)
    this.showWebcam2=!this.showWebcam2; 

    if(i==3) 
    this.showWebcam3=!this.showWebcam3; 

    if(i==4)
    this.showWebcam4=!this.showWebcam4;

    if(i==5)
    this.showWebcam5=!this.showWebcam5; 

   // document.getElementById("background_black").style.display="block";
  }
    else{
     if(this.camselect==0){
      this.camselect=1;  
      this.flipview=true; 
     this.toggleWebcam(i); 
     await setTimeout(() => {
       this.toggleWebcam(i);
     }, 10);
       }
       else {this.camselect=0 ; 
        this.flipview=true; 
       this.toggleWebcam(i); 
     await setTimeout(() => {
       this.toggleWebcam(i);
     }, 10);
      } 
  
      console.log(this.camselect);
    }

    if (this.showWebcam1 || this.showWebcam2 || this.showWebcam3 || this.showWebcam4 || this.showWebcam5) { 
      WebcamUtil.getAvailableVideoInputs()
        .then((mediaDevices: MediaDeviceInfo[]) => {
          if (mediaDevices && mediaDevices.length > 0) {
            navigator.mediaDevices.getUserMedia({ 
               
                video: {
                  deviceId: mediaDevices[this.camselect].deviceId 
                }
            })
            .then((stream: MediaStream) => {
              this.videoElement.nativeElement.srcObject = stream;
              this.videoElement.nativeElement.play();
            })
            .catch((error: any) => {
              console.error('Error accessing camera:', error);
            });
          } else {
            console.error('No camera devices found.');
          }
        });
    } else {
      this.videoElement.nativeElement.srcObject.getTracks().forEach((track: MediaStreamTrack) => {
        track.stop();
      });
    }
  }
    
  
  public captureImage(i:number) {
    this.flipview = false;
    const canvas = document.createElement('canvas');
    canvas.width = this.videoElement.nativeElement.videoWidth;
    canvas.height = this.videoElement.nativeElement.videoHeight;
    canvas.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0);
    if(i===1){ 
      document.getElementById("Panresponse").innerHTML=""; 
      this.webcamImage1 = {
        imageAsDataUrl: canvas.toDataURL('image/jpeg')
      };     

      const requestData: ClassifyRequest = {
        imageData: this.webcamImage1.imageAsDataUrl.split(",",2)[1] 
      }; 

      this.upload(requestData,"Pan",true);
      this.toggleWebcam(1);
      console.log("toggle");
    } 

    if(i===2){ 
      document.getElementById("AddressResponse").innerHTML="";
    this.webcamImage2 = {
      imageAsDataUrl: canvas.toDataURL('image/jpeg')
    }; 
    this.toggleWebcam(2)
    const requestData: ClassifyRequest = {
      imageData: this.webcamImage2.imageAsDataUrl.split(",",2)[1] 
    }; 
    var Proof = (document.getElementById("AddressProof") as HTMLSelectElement).value;
    console.log("toggle");
    if(Proof == "AadharCard"){
      this.upload(requestData,"Aadhar",true);
    }else if(Proof == "passport"){
      this.upload(requestData,"Passport",true);
    }else if(Proof == "driverLicense"){
      this.upload(requestData,"driverLicense",true);
    }else{
      this.upload(requestData,"VoteridCard",true); 
    }
  } 

  if(i==5){
    document.getElementById("AddressResponse2").innerHTML="";
    this.webcamImage5 = {
      imageAsDataUrl: canvas.toDataURL('image/jpeg')
    }; 
    this.toggleWebcam(5);
    const requestData: ClassifyRequest = {
      imageData: this.webcamImage5.imageAsDataUrl.split(",",2)[1] 
    }; 
    var Proof = (document.getElementById("AddressProof") as HTMLSelectElement).value;
    console.log("toggle");
    if(Proof == "AadharCard"){
      this.upload(requestData,"Aadhar",false);
    }else if(Proof == "passport"){
      this.upload(requestData,"Passport",false);
    }else if(Proof == "driverLicense"){
      this.upload(requestData,"driverLicense",false);
    }else{
      this.upload(requestData,"VoteridCard",false); 
    }
  }
    if(i===3){
    this.webcamImage3 = {
      imageAsDataUrl: canvas.toDataURL('image/jpeg')
    };
    this.toggleWebcam(3)
  }
  if(i===4){
    this.webcamImage4 = {
      imageAsDataUrl: canvas.toDataURL('image/jpeg')
    };
    this.toggleWebcam(4)
  }  
  } 

  upload(requestData:ClassifyRequest,Request:string,pageselect:boolean) { 
   
    this.service.postData(requestData).subscribe(
      (response: ClassifyResponce) => {
        if(Request == "Pan"){
          this.validatePancard(response); 
        }else if(Request == "Aadhar"){
          this.validateAdharcard(response,pageselect);
        }else if(Request == "Passport"){
          this.validatePassport(response,pageselect);
        }
        else if(Request == "driverLicense"){
          this.validateDrivingLicense(response,pageselect);
        } 
        else{
          this.validateVotercard(response,pageselect);
        }},

      (error) => {
        console.error('Error:', error);
      }
    );
    console.log("uploading");  
  }
  
//---Validation---

  validatePancard(response:ClassifyResponce) {
    let res = document.getElementById("Panresponse") as HTMLDivElement; 
    res.innerText = ""  

   // console.log('Response:', response.data.ovdType); 
    if(response.data.ovdType == "PanCard"){
     //this.success = "Success";
     // console.log(this.success); 
      res.style.color = "green";
      res.innerText = "PanCard verified!" ; 
    } else{
      this.success = "Is not a Pancard";
      res.style.color = "red";
      res.innerText = "Pancard could not be verified!" 
      console.log(this.success);
     }
  }

  validateAdharcard(response:ClassifyResponce ,valselect:boolean){ 
    let res;
    if(valselect){
     res = document.getElementById("AddressResponse") as HTMLDivElement; 
    }
    else{
      res = document.getElementById("AddressResponse2") as HTMLDivElement; 
    } 
    res.innerText = "" 
        if(response.data.ovdType == "AadhaarRegular"){
          console.log(this.success); 
          res.style.color = "green";
          res.innerText = "Aadharcard verified!" ;
        }
        else if(response.data.ovdType == "AadhaarFront" ){
                console.log("only AdharcardFront"); 
                res.style.color = "green";
                res.innerText = "Aadharcard front page detected"; 
        }
        else if(response.data.ovdType == "AadhaarBack"){
          console.log("only AdharcardBack"); 
          res.style.color = "green";
          res.innerText = "Aadharcard back page detected" ;
        }
      
        else{
          this.success = "Is not a Aadharcard";
          res.style.color = "red";
          res.innerText = "Aadharcard could not be verified!" ;
          console.log(this.success);
         }
  } 

  validatePassport(response:ClassifyResponce,valselect:boolean){
    let res;
    if(valselect){
     res = document.getElementById("AddressResponse") as HTMLDivElement; 
    res.innerText = ""  
    }
    else{
       res = document.getElementById("AddressResponse2") as HTMLDivElement; 
    res.innerText = ""  
    } 
        if(response.data.ovdType == "PassportRegular"){
          console.log(this.success); 
          res.style.color = "green";
          res.innerText = "Passport verified!" ;
        }
        else if(response.data.ovdType == "PassportFirst" ){
                console.log("only PassportFirst"); 
                res.style.color = "red";
                res.innerText = "Passport front page detected";  
        }
        else if(response.data.ovdType == "PassportLast"){
          console.log("only PassportBack"); 
          res.style.color = "red";
          res.innerText = "Passport last page detected" ;
        }
      
        else{
          res.style.color = "red";
          res.innerText = "Passport could not be verified!" 
          console.log(this.success);
         }
  } 

  validateDrivingLicense(response:ClassifyResponce,valselect:boolean){ 
    let res;
    if(valselect){
     res = document.getElementById("AddressResponse") as HTMLDivElement; 
    res.innerText = ""  
    }
    else{
       res = document.getElementById("AddressResponse2") as HTMLDivElement; 
    res.innerText = ""  
    }  
        if(response.data.ovdType == "DrivingLicense"){
          console.log(this.success); 
          res.style.color = "green";
          res.innerText = "Driving License verified!";
        }
        else if(response.data.ovdType == "DrivingLicenseOld" ){
                res.style.color = "red";
                res.innerText = "Driving License Old!";  
        }
        else{
          res.style.color = "red";
          res.innerText = "Driving License could not be verified!" 
          console.log(this.success);
         }
  } 

  validateVotercard(response:ClassifyResponce,valselect:boolean){
    let res;
    if(valselect){
     res = document.getElementById("AddressResponse") as HTMLDivElement; 
    res.innerText = ""  
    }
    else{
       res = document.getElementById("AddressResponse2") as HTMLDivElement; 
    res.innerText = ""  
    }
      if(response.data.ovdType == "VoterCardRegular"){
          console.log(this.success); 
          res.style.color = "green";
          res.innerText = "VoterCard verified!" ;
        }
        else if(response.data.ovdType == "VoterCardFront" ){
                console.log("only VoterCardFront"); 
                res.style.color = "green";
                res.innerText = "VoterCard front page detected";  
        }
        else if(response.data.ovdType == "VoterCardBack"){
          console.log("only AdharcardBack"); 
          res.style.color = "green";
          res.innerText = "Votercard back page detected" ;
        }
      
        else{
          res.style.color = "red";
          res.innerText = "Votercard could not be verified!" 
          console.log(this.success);
         }
  }
}
