package com.rettvendt.glimmer;

//import com.facebook.react.ReactActivity;
import com.reactnativenavigation.controllers.SplashActivity;

//Imagepicker change
import com.imagepicker.permissions.OnImagePickerPermissionsCallback; // <- add this import
import com.facebook.react.modules.core.PermissionListener; // <- add this import
//End

//React native navi: was:  public class MainActivity extends SplashActivity {}
//from implements onImage = imagepicker change
public class MainActivity extends SplashActivity implements OnImagePickerPermissionsCallback {

    //Imagepicker change
    private PermissionListener listener; // <- add this attribute

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    //@Override
    protected String getMainComponentName() {
        return "Glimmer";
    }

//Imagepicker start
     @Override
      public void setPermissionListener(PermissionListener listener)
      {
        this.listener = listener;
      }

      @Override
      public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults)
      {
        if (listener != null)
        {
          listener.onRequestPermissionsResult(requestCode, permissions, grantResults);
        }
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
      }

      //Imagepicker end

}
