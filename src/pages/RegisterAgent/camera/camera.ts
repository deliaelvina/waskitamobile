import { Component } from "@angular/core";
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl
} from "@angular/forms";
import {
  NavController,
  NavParams,
  LoadingController,
  Platform,
  ToastController,
  AlertController
} from "ionic-angular";

import "rxjs/Rx";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { environment } from "../../../environment/environment";

import { Camera, CameraOptions } from "@ionic-native/camera";
import { FileTransfer } from "@ionic-native/file-transfer";
import { File } from "@ionic-native/file";
import { normalizeURL } from "ionic-angular";
import { ErrorhandlerService } from "../../../providers/errorhandler/errorhandler.service";

@Component({
  selector: "camera-page",
  templateUrl: "camera.html"
})
export class AgentregistCam {
  ErrorList: any;
  loading: any;
  url_api = environment.Url_API;
  cons = environment.cons_mobile;
  hd = new HttpHeaders({
    Token: localStorage.getItem("Token")
  });
  image: any = {
    base64img: null,
    imgHere: null
  };

  constructor(
    public nav: NavController,
    public alertCtrl: AlertController,
    // private http: HttpClient,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private http: HttpClient,
    public platform: Platform,
    private toastCtrl: ToastController,
    private _errorService: ErrorhandlerService,
    public camera: Camera,
    private trasnfer: FileTransfer,
    private file: File
  ) {
    let tempImg = this.navParams.get("image");
    if (tempImg) {
      this.image.imgHere = tempImg;
    }
    // this.image.for = this.navParams.get('from');
    this.loading = this.loadingCtrl.create();

    this._errorService.getData().then(data => {
      this.ErrorList = data.Error_Status;
    });

    // this.loading.present();
  }

  showAlert(title: any, subTitle: any) {
    let warning = this.alertCtrl.create({
      cssClass: "alert",
      title: title,
      subTitle: subTitle,
      buttons: [{ text: "Ok" }]
    });

    warning.present();
  }

  ionViewDidLoad() {
    // console.log(this.image.for);
  }

  ok() {
    // alert('ok');
    if (this.image.base64img != "" && this.image.base64img) {
      // alert('ok');
      localStorage.setItem("image", JSON.stringify(this.image));
      this.nav.pop();
    } else {
      this.nav.pop();
    }
  }

  takeFoto() {
    // const options: CameraOptions = {
    //   quality: 100,
    //   destinationType: this.camera.DestinationType.DATA_URL,
    //   encodingType: this.camera.EncodingType.JPEG,
    //   mediaType: this.camera.MediaType.PICTURE,
    //   sourceType: this.camera.PictureSourceType.CAMERA,
    //   allowEdit: true,
    //   targetHeight: 300,
    //   targetWidth: 300,
    //   saveToPhotoAlbum: true
    // };
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.platform.is("ios")
        ? this.camera.DestinationType.FILE_URI
        : this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      allowEdit: true,
      targetHeight: 300,
      targetWidth: 300,
      saveToPhotoAlbum: true
    };

    this.camera.getPicture(options).then(
      imageData => {
        // let imgs = 'data:image/jpeg;base64,' + imageData;

        // this.image.base64img = imageData;
        // this.image.imgHere = imgs;

        let base64Image = null;

        //get photo from the camera based on platform type
        if (this.platform.is("ios")) {
          base64Image = normalizeURL(imageData);
        } else {
          base64Image = "data:image/jpeg;base64," + imageData;
        }

        // alert(JSON.stringify(base64Image));
        this.image.base64img = imageData;
        this.image.imgHere = base64Image;
        //add photo to the array of photos
        // this.addPhoto(base64Image);
      },
      err => {
        // Handle error
        //  alert("yah error");
      }
    );
  }

  takeGallery() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      targetHeight: 300,
      targetWidth: 300,
      saveToPhotoAlbum: false
    };

    this.camera.getPicture(options).then(
      imageData => {
        let imgs = "data:image/jpeg;base64," + imageData;

        this.image.base64img = imageData;
        this.image.imgHere = imgs;
      },
      err => {
        // Handle error
        //  alert("yah error");
      }
    );
  }
}
