import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { SocketService } from 'src/app/services/socket.service';
import { environment } from 'src/environments/environment';
import { CHATROOM, MESSAGE } from '../url';
@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss']
})
export class ChatboxComponent implements OnInit {
  @Input() data;
  @Output() public output = new EventEmitter<string>();
  constructor(
    private socket: SocketService,
    private authService:AuthServiceService,
    private apiService : ApiServicesService,
    private http: HttpClient
  ) {
      //Fetch new messages
      this.socket.newMessageReceived().subscribe(data => {       
        console.log(data);
        if(this.roomId && data.roomId == this.roomId)  {
          this.convo.push(data);
          this.ownerTyping = false;
          if(data.sentBy == "customer") {
            this.afterSent();
          }
         }
      });

      //For detect typing
      this.socket.receivedTyping().subscribe(data => {
        if(data.type == 'owner'  && data.roomId.toString() == this.roomId) {
          this.ownerTyping = data.typing;
        }
      });
   }
  message : string = '';
  customerId : string = '';
  roomId: string = ''
  convo = [];
  ownerTyping = false; // Basis for owner typing
  moment: any = moment;
  typeTimer
  ngOnInit(): void {    
    this.customerId = this.authService.getUserData().result._id    
    this.checkConvoHistory()
  }
  seenByCustomer() {
    let body = {
      "roomId": this.roomId,
      "seenBy": "owner"
    }
    this.apiService.patch(`message/seen`, body).subscribe(
      res => {
        console.log(res);
      }
    )
  }
  textAreaAdjust(e) {
    e.target.style.height = "auto";
    e.target.style.height = (e.target.scrollHeight + 25)+"px";
  }

  checkConvoHistory() {
    this.apiService.get(`${CHATROOM}?customerId=${this.customerId}&ownerId=${this.data.ownerid}`).subscribe(res => {
        if(res.result.length > 0) {
          this.roomId = res.result[0]._id
          this.apiService.get(`${MESSAGE}/${res.result[0]._id}`).subscribe(
            res => {
              this.convo = res.result;
            },
            err => {
              console.log(err);
            })
        }   
    })    
  }
  
  files = [];
  previewFile = [];
  addFile(e) {
    Array.from<File>(e).forEach((f: File) => {
      console.log(f);
      var file:any={};
      file.name = f.name,
      file.size = f.size,
      file.type = f.type,
      this.files.push(f)      
      const thefile = f;
      const reader = new FileReader();
      reader.readAsDataURL(thefile);
      reader.onload = () => {
        file.src = reader.result;
      }
      this.previewFile.push(file);
    });
  }
  remove(i) {
    this.previewFile.splice(i, 1);
    this.files.splice(i, 1);
  }
  uploadFile() {   
    let _promise = new Promise((resolve, reject) => {
      let count = 0;
      this.files.forEach((i) => {
        const file: any = new FormData();
        file.set("photos", i);
        this.apiService.postImage('assets/uploadImages', file).subscribe(res => {
            let imgURL = `${environment.image_url}${res.result[0]}`;
            let URLArr = imgURL.split('.');
            let format = URLArr.slice(-1).pop();
            console.log("format: ", format);
            let mediaFormat = ['png', 'jpg', 'jpeg', 'gif', 'mp4', 'webm'];
            if(mediaFormat.includes(format)) {
              this.payload.media.push(imgURL);
            } else {
              this.payload.files.push(imgURL);
            }
            count++;

            if(count == this.files.length) {
              console.log("done");              
              resolve("success")
            }
          });
        
       
      }); 

    })
    return _promise

  }
  payload = {
    roomId: "",
    message: "",
    messageType: "",
    media: [],
    files: [],
    sendStatus: "sent",
    senderId: "",
    recipientId: "",
    sentBy: "customer"
  }
  send(e) {
    this.payload.message = e;
    this.payload.roomId = this.roomId;
    this.payload.senderId = this.customerId;
    this.payload.recipientId = this.data.ownerid;
    
    if(this.files.length > 0){
      this.uploadFile().then(result => {
        if(result == "success") {
          this.socket.sendMessage(this.payload);
        }
      })
    }
    else {
      if (!e.replace(/\s/g, "").length) {
        return;
      } else {
        this.socket.sendMessage(this.payload);
      }
    }
    
  }
  afterSent() {
    this.message = "";
    this.payload = {
      roomId: "",
      message: "",
      messageType: "",
      media: [],
      files: [],
      sendStatus: "sent",
      senderId: "",
      recipientId: "",
      sentBy: "customer"
    }
    this.files = [];
    this.previewFile = [];
  }

  typing() {    
    this.socket.typing({type : 'customer', roomId: this.roomId, typing: true})
    clearTimeout(this.typeTimer); 

    this.typeTimer = setTimeout(() => {
      this.socket.typing({type : 'customer', roomId: this.roomId, typing: false})   
    }, 5000);
  }
  close() {
    this.output.emit("close");
  }
  showEmojiPicker: boolean = false;
  sets = [
    'native',
    'google',
    'twitter',
    'facebook',
    'emojione',
    'apple',
    'messenger'
  ]
  set = 'native';
  addEmoji(event) {
    this.message += event.emoji.native
  }
  onFocus(e) {
    console.log(e);
    this.seenByCustomer();
  }
  fileName(e) {
    let nameArr = e.split('/')
    return nameArr.slice(-1).pop();
  }
  downloadArchiveFile(name: string, url: string) {
    this.http.get(url, { responseType: 'blob' })
    .subscribe((data: any) => {
      console.log(data);
      this.download(name, data);
     }, (error) => {
      console.log(error, "Something Went Wrong");
     });
   }
   
   download(name, blob) {
    let link = document.createElement("a");
    link.download = name;
    link.href = URL.createObjectURL(blob);
    link.click();
   }
}
