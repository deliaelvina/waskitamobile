import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../environment/environment';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { IonicImageViewerModule } from 'ionic-img-viewer';

//pages
import { ListingPage } from '../pages/listing/listing';
import { Listing2Page } from '../pages/listing2/listing2';
import { ListingProjectPage } from '../pages/listing/project';
import { FeedPage } from '../pages/feed/feed';
import { CameraPage } from "../pages/camera/camera";

//Project Info
import { ProjectPage } from '../pages/projectInfo/project';
import { ProjectDetailsPage } from '../pages/projectInfo/projectdetails';

//download
import { ProjectDownloadPage } from "../pages/download/project";
import { DownloadPage } from "../pages/download/download";

import { NewsPage } from '../pages/NewsAndPromo/news';
import { PromoPage } from '../pages/NewsAndPromo/promo';
import { NapDetails } from '../pages/NewsAndPromo/napdetails';
import { PromoDetail } from '../pages/NewsAndPromo/promodetail';
// import { ProjectDetailsPage } from '../pages/projectInfo/projectdetails';

//Reservation
import { ReservationProjectPage } from '../pages/reservation/project';
import { ReservationPhasePage } from '../pages/reservation/phase';
import { ReservationBlockPage } from '../pages/reservation/block';
import { ReservationUnitPage } from '../pages/reservation/unit';
import { ReservationReservePage } from '../pages/reservation/reserve';
import { UnitModalPage } from '../pages/reservation/unitModal';

//booking
import { BookingUnitPage } from '../pages/booking/unit';
import { BookingBlockPage } from '../pages/booking/block';
import { BookingPhasePage } from '../pages/booking/phase';
import { BookingPage } from '../pages/booking/project';
import { BookingUnitModalPage } from "../pages/booking/unitModal";
import { BookingPaymentDetailPage } from "../pages/booking/paymentDtl";
import { BookingReservePage } from '../pages/booking/booking';

//myUnit
import { MyUnitPage } from '../pages/MyUnit/myUnit';
import { PaymentSchedulePage } from '../pages/MyUnit/payment';
import { UploadBuktiPage } from '../pages/MyUnit/uploadbukti';
import { SimulasiPage } from '../pages/simulasi/simulasi';
//unit enquiry
import { UnitEnquiryPage } from '../pages/unit-enquiry/unit-enquiry';
//Product Info
// import { ProductInfoPage } from '../pages/productInfo/productInfo';
import { UnitTypePage } from '../pages/productInfo/unitType';
import { CariUnitPage } from '../pages/productInfo/cariUnit';
import { FormSearchPage } from "../pages/productInfo/formSearch";
import { PilihUnitPage } from "../pages/productInfo/pilihUnit";
import { UnitPayPage } from '../pages/productInfo/unitPay';
import { ContactPage } from '../pages/productInfo/contact/contact';
// import { SearchProject } from "../pages/productInfo/search-page/s_project";
// import { SearchTower } from '../pages/productInfo/search-page/s_tower';
import { SearchBlok } from '../pages/productInfo/search-page/s_blok';
import { ProductProjectPage } from '../pages/productInfo/project';
import { ProductPhasePage } from '../pages/productInfo/phase';

import { FollowersPage } from '../pages/followers/followers';
import { LayoutsPage } from '../pages/layouts/layouts';
import { FormsPage } from '../pages/forms/forms';
import { LoginPage } from '../pages/login/login';
import { NotificationsPage } from '../pages/notifications/notifications';
import { ProfilePage } from '../pages/profile/profile';
import { TabsNavigationPage } from '../pages/tabs-navigation/tabs-navigation';
import { WalkthroughPage } from '../pages/walkthrough/walkthrough';
import { SettingsPage } from '../pages/settings/settings';
import { SignupPage } from '../pages/signup/signup';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { SchedulePage } from '../pages/schedule/schedule';
import { AdsPage } from '../pages/ads/ads';
import { List1Page } from '../pages/list-1/list-1';
import { List2Page } from '../pages/list-2/list-2';
import { GridPage } from '../pages/grid/grid';
import { FormLayoutPage } from '../pages/form-layout/form-layout';
import { FiltersPage } from '../pages/filters/filters';
import { TermsOfServicePage } from '../pages/terms-of-service/terms-of-service';
import { PrivacyPolicyPage } from '../pages/privacy-policy/privacy-policy';
import { FormValidationsPage } from '../pages/form-validations/form-validations';
import { FunctionalitiesPage } from '../pages/functionalities/functionalities';
import { MapsPage } from '../pages/maps/maps';
import { FacebookLoginPage } from '../pages/facebook-login/facebook-login';
import { GoogleLoginPage } from '../pages/google-login/google-login';
import { TwitterLoginPage } from '../pages/twitter-login/twitter-login';
import { ContactCardPage } from '../pages/contact-card/contact-card';
import { VideoPlaylistPage } from '../pages/video-playlist/video-playlist';

//firebase integration
import { FirebaseFeedPage } from '../pages/firebase-integration/firebase-feed/firebase-feed';
import { FirebaseNewUserModalPage } from '../pages/firebase-integration/firebase-new-user-modal/firebase-new-user-modal';
import { FirebaseDetailsPage } from '../pages/firebase-integration/firebase-details/firebase-details';
import { FirebaseAvatarSelect } from '../pages/firebase-integration/firebase-avatar-select/firebase-avatar-select';
import { FirebaseMenuPage } from '../pages/firebase-integration/firebase-menu/firebase-menu';
import { FirebaseFacebookLoginPage } from '../pages/firebase-integration/firebase-facebook-login/firebase-facebook-login';
//wordpress integration
import { BlogFeedPage } from '../pages/wordpress-integration/blog-feed/blog-feed';
import { BlogPostPage } from '../pages/wordpress-integration/blog-post/blog-post';
import { BlogCustomPagesPage } from '../pages/wordpress-integration/blog-custom-pages/blog-custom-pages';
import { BlogCustomPagePage } from '../pages/wordpress-integration/blog-custom-page/blog-custom-page';
import { BlogCategoriesPage } from '../pages/wordpress-integration/blog-categories/blog-categories';
import { WordpressLoginPage } from '../pages/wordpress-integration/wordpress-login/wordpress-login';
import { WordpressMenuPage } from '../pages/wordpress-integration/wordpress-menu/wordpress-menu';

//custom components
import { PreloadImage } from '../components/preload-image/preload-image';
import { BackgroundImage } from '../components/background-image/background-image';
import { ShowHideContainer } from '../components/show-hide-password/show-hide-container';
import { ShowHideInput } from '../components/show-hide-password/show-hide-input';
import { ColorRadio } from '../components/color-radio/color-radio';
import { CounterInput } from '../components/counter-input/counter-input';
import { Rating } from '../components/rating/rating';
import { GoogleMap } from '../components/google-map/google-map';
import { ChangePasswordPage } from '../pages/profile-change-password/change-password';
import { NextChangePasswordPage } from '../pages/profile-change-password/nextchangepass';
// import { GoogleMaps } from '@ionic-native/google-maps';
import { VideoPlayerModule } from '../components/video-player/video-player.module';
import { ValidatorsModule } from '../components/validators/validators.module';

//services
import { FeedService } from '../pages/feed/feed.service';
import { ListingService } from '../pages/listing/listing.service';
import { Listing2Service } from '../pages/listing2/listing2.service';
import { ProfileService } from '../pages/profile/profile.service';
import { NotificationsService } from '../pages/notifications/notifications.service';
import { List1Service } from '../pages/list-1/list-1.service';
import { List2Service } from '../pages/list-2/list-2.service';
import { ScheduleService } from '../pages/schedule/schedule.service';
import { FacebookLoginService } from '../pages/facebook-login/facebook-login.service';
import { FirebaseFacebookLoginService } from '../pages/firebase-integration/firebase-facebook-login/firebase-facebook-login.service';
import { GoogleLoginService } from '../pages/google-login/google-login.service';
import { TwitterLoginService } from '../pages/twitter-login/twitter-login.service';
import { GoogleMapsService } from '../pages/maps/maps.service';
import { FirebaseService } from '../pages/firebase-integration/firebase-integration.service';
import { WordpressService } from '../pages/wordpress-integration/wordpress-integration.service';
import { LanguageService } from '../providers/language/language.service';
import { ErrorhandlerService } from '../providers/errorhandler/errorhandler.service';

// Ionic Native Plugins
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SocialSharing } from '@ionic-native/social-sharing';
import { NativeStorage } from '@ionic-native/native-storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { Keyboard } from '@ionic-native/keyboard';
import { Geolocation } from '@ionic-native/geolocation';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { AdMobFree } from '@ionic-native/admob-free';
import { AppRate } from '@ionic-native/app-rate';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';
import { EmailComposer } from '@ionic-native/email-composer';
import { Camera } from '@ionic-native/camera';

//Angular Fire
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthService } from '../auth/auth.service';
import { FormService } from '../auth/form.service';
import { SearchAgentPage } from '../pages/search-agent/search-agent';
import { MyReservationProjectPage } from '../pages/reservation/myReservation';

//file transfer
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { importExpr } from '@angular/compiler/src/output/output_ast';
// import { PipeModule } from '../tools/pipe.module';


//unit filter
import { UnitFilterPipe } from '../pages/unit-enquiry/unit-filter.pipe';
import { UnitEnquiryProjectPage } from '../pages/unitEnquiryMenu/project';
import { UnitEnquiryPhasePage } from '../pages/unitEnquiryMenu/phase';
// import { UnitFilterModule } from '../tools/pipe.module';
// PipeModule
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    MyApp,
    ListingPage,
    Listing2Page,
    ListingProjectPage,
    FeedPage,
    ProjectPage,
    ProjectDetailsPage,
    CameraPage,
    ProjectDownloadPage,
    DownloadPage,

    //reservation
    ReservationProjectPage,
    ReservationPhasePage,
    ReservationBlockPage,
    ReservationUnitPage,
    ReservationReservePage,
    UnitModalPage,
    MyReservationProjectPage,

    //booking
    BookingPage,
    BookingPhasePage,
    BookingBlockPage,
    BookingUnitPage,
    BookingUnitModalPage,
    BookingPaymentDetailPage,
    BookingReservePage,

    //myunit
    PaymentSchedulePage,
    MyUnitPage,
    UploadBuktiPage,
    SimulasiPage,
    //unit enquiry
    UnitEnquiryPage,
    UnitEnquiryProjectPage,
    UnitEnquiryPhasePage,
    //Product Info
    // ProductInfoPage,
    UnitTypePage,
    CariUnitPage,
    FormSearchPage,
    PilihUnitPage,
    UnitPayPage,
    ContactPage,
    // SearchProject,
    // SearchTower,
    SearchBlok,
    ProductProjectPage,
    ProductPhasePage,

    //news
    NewsPage,

    //promo
    PromoPage,
    NapDetails,
    PromoDetail,

    FollowersPage,
    ChangePasswordPage,
    NextChangePasswordPage,
    LayoutsPage,
    FormsPage,
    LoginPage,
    NotificationsPage,
    ProfilePage,
    TabsNavigationPage,
    WalkthroughPage,
    SettingsPage,
    SignupPage,
    ForgotPasswordPage,
    ResetPasswordPage,
    SchedulePage,
    List1Page,
    List2Page,
    GridPage,
    FormLayoutPage,
    FiltersPage,
    TermsOfServicePage,
    PrivacyPolicyPage,
    SearchAgentPage,

    //functionalities
    MapsPage,
    FunctionalitiesPage,
    FacebookLoginPage,
    GoogleLoginPage,
    ContactCardPage,
    TwitterLoginPage,
		AdsPage,
		FormValidationsPage,
		VideoPlaylistPage,

    //firebase integration
    FirebaseFeedPage,
    FirebaseNewUserModalPage,
		FirebaseDetailsPage,
		FirebaseAvatarSelect,
		FirebaseFacebookLoginPage,
		FirebaseMenuPage,

    //wordpress integration
    BlogFeedPage,
    BlogPostPage,
    BlogCustomPagesPage,
    BlogCustomPagePage,
		WordpressLoginPage,
    WordpressMenuPage,
    BlogCategoriesPage,

    //custom components
    PreloadImage,
    BackgroundImage,
    ShowHideContainer,
    ShowHideInput,
    ColorRadio,
    CounterInput,
    Rating,
    GoogleMap
    ,UnitFilterPipe
  ],
  imports: [
    // PipeModule.forRoot(),
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicImageViewerModule,
    IonicModule.forRoot(MyApp, {
			modalEnter: 'modal-slide-in',
			modalLeave: 'modal-slide-out',
			pageTransition: 'ios-transition',
      swipeBackEnabled: false,
      mode:'ios',
      iconmode:'ios',
      backButtonIcon:'ios-arrow-back'
		}),
		TranslateModule.forRoot({
    loader: {
				provide: TranslateLoader,
				useFactory: (createTranslateLoader),
				deps: [HttpClient]
			}
		}),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
		VideoPlayerModule,
    ValidatorsModule,
    // PipeModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ListingPage,
    Listing2Page,
    ListingProjectPage,
    FeedPage,
    ProjectPage,
    ProjectDetailsPage,
    CameraPage,
    ProjectDownloadPage,
    DownloadPage,

    //Reservation
    ReservationProjectPage,
    ReservationPhasePage,
    ReservationBlockPage,
    ReservationUnitPage,
    ReservationReservePage,
    UnitModalPage,
    MyReservationProjectPage,

    //booking
    BookingPage,
    BookingPhasePage,
    BookingBlockPage,
    BookingUnitPage,
    BookingUnitModalPage,
    BookingPaymentDetailPage,
    BookingReservePage,

    //myunit
    SimulasiPage,
    MyUnitPage,
    PaymentSchedulePage,
    UploadBuktiPage,
    //unit enquiry
    UnitEnquiryPage,
    UnitEnquiryProjectPage,
    UnitEnquiryPhasePage,
    //Product Info
    // ProductInfoPage,
    UnitTypePage,
    CariUnitPage,
    FormSearchPage,
    PilihUnitPage,
    UnitPayPage,
    ContactPage,
    // SearchProject,
    // SearchTower,
    SearchBlok,
    ProductProjectPage,
    ProductPhasePage,

    NewsPage,
    PromoPage,
    NapDetails,
    PromoDetail,
    FollowersPage,
    ChangePasswordPage,
    NextChangePasswordPage,
    LayoutsPage,
    FormsPage,
    LoginPage,
    NotificationsPage,
    ProfilePage,
    TabsNavigationPage,
    WalkthroughPage,
    SettingsPage,
    ForgotPasswordPage,
    ResetPasswordPage,
    SignupPage,
    SchedulePage,
    List1Page,
    List2Page,
    GridPage,
    FormLayoutPage,
    FiltersPage,
    TermsOfServicePage,
    PrivacyPolicyPage,
    MapsPage,
    FunctionalitiesPage,
    FacebookLoginPage,
    GoogleLoginPage,
    ContactCardPage,
    TwitterLoginPage,
		AdsPage,
		FormValidationsPage,
    VideoPlaylistPage,
    SearchAgentPage,
    //firebase integration
    FirebaseFeedPage,
    FirebaseNewUserModalPage,
		FirebaseDetailsPage,
		FirebaseAvatarSelect,
		FirebaseFacebookLoginPage,
		FirebaseMenuPage,
    //wordpress integration
    BlogFeedPage,
    BlogPostPage,
    BlogCustomPagesPage,
    BlogCustomPagePage,
		WordpressLoginPage,
    WordpressMenuPage,
    BlogCategoriesPage
  ],
  providers: [
    FeedService,
    ListingService,
    Listing2Service,
    ProfileService,
    ErrorhandlerService,
    NotificationsService,
    List1Service,
    List2Service,
    ScheduleService,
    // GoogleMaps,
    //functionalities
    FacebookLoginService,
    GoogleLoginService,
    TwitterLoginService,
    GoogleMapsService,
		LanguageService,
		WordpressService,
    FirebaseFacebookLoginService,
		FirebaseService,
    //ionic native plugins
	  SplashScreen,
	  StatusBar,
    SocialSharing,
    NativeStorage,
    InAppBrowser,
    Facebook,
    GooglePlus,
    Camera,
    Keyboard,
    Geolocation,
    TwitterConnect,
		AdMobFree,
		AppRate,
		ImagePicker,
		Crop,
    EmailComposer,
    AuthService,
    FormService,
    FileTransfer,
    FileTransferObject,
    File,
    FileOpener,
    PhotoViewer
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {}
