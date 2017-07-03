package com.rettvendt.glimmer;

//import com.facebook.react.ReactActivity;
import com.reactnativenavigation.controllers.SplashActivity;

//Bugsnag change
import com.bugsnag.BugsnagReactNative;
import android.os.Bundle;

//React native navi: was:  public class MainActivity extends SplashActivity {
public class MainActivity extends SplashActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    //@Override
    protected String getMainComponentName() {
        return "Glimmer";
    }

    @Override
      public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        BugsnagReactNative.start(this);
      }

}
