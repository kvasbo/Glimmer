package com.rettvendt.glimmer;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.imagepicker.ImagePickerPackage;
//import io.invertase.firebase.RNFirebaseAdMobPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.oblador.keychain.KeychainPackage;
import com.dscj.autoheightwebview.AutoHeightWebViewPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

//Change made to add react native navigation
import com.reactnativenavigation.NavigationApplication;

//Firebase change
// Required package
import io.invertase.firebase.RNFirebasePackage; // <-- Add this line
// Optional packages - add as appropriate
//import io.invertase.firebase.admob.RNFirebaseAdMobPackage; //Firebase AdMob
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage; // Firebase Analytics
import io.invertase.firebase.auth.RNFirebaseAuthPackage; // Firebase Auth
import io.invertase.firebase.config.RNFirebaseRemoteConfigPackage; // Firebase Remote Config
import io.invertase.firebase.crash.RNFirebaseCrashPackage; // Firebase Crash Reporting
import io.invertase.firebase.database.RNFirebaseDatabasePackage; // Firebase Realtime Database
//import io.invertase.firebase.messaging.RNFirebaseMessagingPackage; // Firebase Cloud Messaging
import io.invertase.firebase.perf.RNFirebasePerformancePackage; // Firebase Messaging
import io.invertase.firebase.storage.RNFirebaseStoragePackage; // Firebase Storage

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {


    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }


     public boolean isDebug() {
         // Make sure you are using BuildConfig from your own application
         return BuildConfig.DEBUG;
     }

     protected List<ReactPackage> getPackages() {
         // Add additional packages you require here
         // No need to add RnnPackage and MainReactPackage
         return Arrays.<ReactPackage>asList(
             // eg. new VectorIconsPackage()
               new VectorIconsPackage(),
               new AutoHeightWebViewPackage(),
               new KeychainPackage(),

               //Firebase change
                new RNFirebasePackage(),  // <-- Add this line
                 // Add these packages as appropriate
                 //new RNFirebaseAdMobPackage(),
                 new RNFirebaseAnalyticsPackage(),
                 new RNFirebaseAuthPackage(),
                 new RNFirebaseRemoteConfigPackage(),
                 new RNFirebaseCrashPackage(),
                 new RNFirebaseDatabasePackage(),
                 //new RNFirebaseMessagingPackage(),
                 new RNFirebasePerformancePackage(),
                 new RNFirebaseStoragePackage(),
                 new ImagePickerPackage()



         );
     }

     @Override
     public List<ReactPackage> createAdditionalReactPackages() {
         return getPackages();
     }
}
