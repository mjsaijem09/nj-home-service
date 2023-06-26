import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiServicesService } from 'src/app/services/api-services.service';
@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent {
  @ViewChild('videoElement', { static: true }) videoElement: ElementRef<HTMLVideoElement>;
  @ViewChild('videoOutput', { static: true }) videoOutput: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement', { static: true }) canvasElement: ElementRef<HTMLCanvasElement>;

  captureURL: string;
  type = 'photo';
  private stream: MediaStream;
  private facingMode = 'environment';
  isFlashOn: boolean = false;
  constructor(
    public activeModal: NgbActiveModal,
    private _api: ApiServicesService, 
    ) { }

  ngOnInit() {
    this.startCamera();
  }

  async ngAfterViewInit() {
    if(this.type === 'video') {
      // Get access to the camera stream
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      // Set the video element source to the camera stream
      this.videoElement.nativeElement.srcObject = stream;
      this.videoElement.nativeElement.play();
    }
  }

  toggleCamera() {
    this.facingMode = (this.facingMode === 'environment') ? 'user' : 'environment'; // toggle the camera mode
    this.stopCamera();
    this.startCamera();
  }

  startCamera() {
    if(this.type === 'photo') {
      navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: this.facingMode
        }
      })
      .then(stream => {
        this.stream = stream;
        this.videoElement.nativeElement.srcObject = stream;
        this.videoElement.nativeElement.play();
      })
      .catch(error => console.log(error));
    } else if(this.type === 'video') {
      this.videoElement.nativeElement.play();
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.videoElement.nativeElement.srcObject = null;
    }
  }

  async toggleFillLight() {
    const constraints = { video: true };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const [track] = stream.getVideoTracks();
    const imageCapture = new ImageCapture(track);
    const photoCapabilities = await imageCapture.getPhotoCapabilities();
    const fillLightModes = photoCapabilities.fillLightMode;
    // Check if device has flashlight before toggling fill light mode
    if (!fillLightModes.includes('flash')) {
      console.log('Device does not have a flashlight.');
      return;
    }

    // Toggle fill light mode
    const currentPhotoSettings = await imageCapture.getPhotoSettings();
    const currentFillLightMode = currentPhotoSettings.fillLightMode;
    let newFillLightMode: FillLightMode;
    if (currentFillLightMode === 'off') {
      newFillLightMode = fillLightModes.includes('flash') ? 'flash' : fillLightModes[0];
    } else {
      newFillLightMode = 'off';
    }
    const newPhotoSettings = { fillLightMode: newFillLightMode };
    await imageCapture.takePhoto(newPhotoSettings);
  }
  
  // for video capture
  dashArrayValue: string = '0 297';
  elapsedTime = 0; // elapsed time in milliseconds
  progress = 0; // progress as a percentage (0-100)
  mediaLoaded: boolean = false;
  interval: any;
  isRecording: boolean = false;
  recordState: string = "inactive"
  clicks: number = 0;
  capture() {
    this.mediaLoaded = false;
    if (this.type === 'photo') {
      // Get the canvas context and set its size to match the video element
      const canvas = this.canvasElement.nativeElement;
      const context = canvas.getContext('2d');
      canvas.width = this.videoElement.nativeElement.videoWidth;
      canvas.height = this.videoElement.nativeElement.videoHeight;

      // Draw the video frame onto the canvas
      context.drawImage(this.videoElement.nativeElement, 0, 0, canvas.width, canvas.height);

      // Convert the canvas contents to a data URL that can be displayed as an image
      this.captureURL = canvas.toDataURL('image/png');
      this.mediaLoaded = true;
    } else if (this.type === 'video') {
      let totalTime = 15000; // total time in milliseconds
      this.clicks++
      // Set up the MediaRecorder to capture video
      const stream = this.videoElement.nativeElement.srcObject as MediaStream;
      const mediaRecorder = new MediaRecorder(stream);
      
      let videoChunks = [];
      
      // Set up a callback function for when the video  is complete
      mediaRecorder.ondataavailable = (event) => {
        console.log(event.data);
        videoChunks.push(event.data);
      }
      
      mediaRecorder.onstop
      mediaRecorder.onstart = () => {

        
        // Count video progress
        this.interval = setInterval(() => {
          this.recordState = mediaRecorder.state
          this.elapsedTime += 100; // update elapsed time every second
          this.progress = Math.floor(this.elapsedTime / totalTime * 293); // calculate progress percentage
          this.dashArrayValue = `${this.progress} 297`;
          console.log("clicks:", this.clicks);
          if (this.recordState === 'recording' && this.clicks >= 2) {
            mediaRecorder.stop();
          }
        }, 100);

        
        // Stop recording the video after a few seconds (you can change the duration)
        setTimeout(() => {
          if (this.progress == 0) return;
          if (mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
          }
        }, totalTime);

      };
      mediaRecorder.onstop = () => {
        console.log("stopped!");
        clearInterval(this.interval);
        this.elapsedTime = 0;
        this.progress = 0;
        this.dashArrayValue = `0 297`;
        this.clicks = 0;
        // Combine the video chunks into a single Blob
        const videoBlob = new Blob(videoChunks, { type: 'video/webm' });

        // Create a URL for the Blob
        this.captureURL = URL.createObjectURL(videoBlob);

        // Set the video element source to the URL
        this.videoOutput.nativeElement.src = this.captureURL;
        // Wait for the metadata to be loaded before playing the video
        this.videoOutput.nativeElement.addEventListener('loadedmetadata', () => {
          this.mediaLoaded = true;
          this.videoOutput.nativeElement.play();
        });
        
      };

      // Start recording the video
      // mediaRecorder.start();

      // if (this.progress >=1 ) {
      //   mediaRecorder.stop();
      // }
      console.log("Checkpoint1 recordState: ",this.recordState)
      if (this.recordState === 'inactive') {
        // Start recording
        mediaRecorder.start();
        // isRecording = true;
      }
    }
  }
  
  deleteCapture() {
    this.captureURL = null;
  }
  upload() {
    fetch(this.captureURL)
    .then(response => response.arrayBuffer())
    .then(buffer => {
      // Upload the binary data to the server using an XMLHttpRequest or a fetch() call
      if(buffer) {
        const formData = new FormData();
        if(this.captureURL.includes('data:image')) {
          formData.append('photos', new Blob([buffer], { type: 'image/png' }), 'image.png');
        } else {
          formData.append('photos', new Blob([buffer], { type: 'video/webm' }), 'video.webm');
        }
        console.log(formData)
        this._api.postImage("assets/uploadImages", formData).subscribe(
          res => {
            console.log(res);
            let uploadURL = res.result[0];
            this.activeModal.close(uploadURL);
          },
          err => {
            console.error(err);
          }
        )
      }
    })
    .catch(error => {
      console.log(error);
      // Handle the error
    });
  }

  selectMedia(event) {
    const media = event.target.files[0];
    if (media) {
      const reader = new FileReader();
      reader.readAsDataURL(media);
      reader.onload = () => {
        if (this.type === 'photo') {
          this.captureURL = reader.result.toString();
          this.mediaLoaded = true;
        } else if (this.type === 'video') {
          const videoBlob = this.dataURItoBlob(reader.result);
          this.captureURL = URL.createObjectURL(videoBlob);
          this.videoOutput.nativeElement.src = this.captureURL;
          // Wait for the metadata to be loaded before playing the video
          this.videoOutput.nativeElement.addEventListener('loadedmetadata', () => {
            this.mediaLoaded = true;
            this.videoOutput.nativeElement.play();
          });
        }
      };
    }
  }

  dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }  
}