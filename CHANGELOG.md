*22 February 2018*
*NEW FEATURES*
-Wordpress Integration
-Firebase Integration using Firestore Database

*Updates*
-Updated to Ionic 3.9.2 and Angular 5.0.1
-Updated Bourbon to version 5.0
-Config variables are now in src/environment/environment.ts
-Google maps now needs a key to work properly (it's free to get one). Get a key in https://developers.google.com/maps/documentation/javascript/get-api-key and put it in index.html

*Bug fixes*
-Fixed a bug in the settings page in the language selector which was not picking up the current language
-Transition direction bug fix.
  The navigation direction was always set to rtl.
  To fix it we updated src/app/app.component.ts file inside the subscription for the language change to be like the following:

  this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
    if(event.lang == 'ar')
    {
      platform.setDir('rtl', true);
    }
    else
    {
      platform.setDir('ltr', true);
    }
    //the rest of the code...
  }

*19 September 2017*
-Updated to Ionic 3.6.0
-Updated resources to match new dimensions
-Added <script src="build/vendor.js"></script> to index.html
-Added some configurations in IonicModule.forRoot() in src/app/app.module.ts
-Fixed some styles in src/pages/notifications/notifications.scss
-Fix an issue with image picker plugin
