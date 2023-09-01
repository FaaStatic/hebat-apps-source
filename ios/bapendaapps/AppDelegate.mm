#import <Firebase.h>
#import "AppDelegate.h"
#import <React/RCTLinkingManager.h>
#import <React/RCTBundleURLProvider.h>
#import "RNFBMessagingModule.h"
#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>
#import <GoogleMaps/GoogleMaps.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
   self.moduleName = @"bapendaapps";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
    if ([FIRApp defaultApp] == nil) { [FIRApp configure]; } 
    [GMSServices provideAPIKey:@"AIzaSyDKgULQJ7OAafnepNlic0Np2T-u1d2WxP4"];
  NSDictionary *appProperties = [RNFBMessagingModule addCustomPropsToUserProps:appProperties withLaunchOptions:launchOptions];
   UNUserNotificationCenter *center =
     			[UNUserNotificationCenter currentNotificationCenter];
  			center.delegate = self;
  self.initialProps = @{};
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}


- (void)userNotificationCenter:(UNUserNotificationCenter *)center
       	willPresentNotification:(UNNotification *)notification
         	withCompletionHandler:
             	(void (^)(UNNotificationPresentationOptions options))
                 	completionHandler {
  	completionHandler(UNNotificationPresentationOptionSound | 
UNNotificationPresentationOptionBadge |
                    UNNotificationPresentationOptionAlert);}

- (void)application:(UIApplication *)application
    		 didRegisterForRemoteNotificationsWithDeviceToken:(NSData 
*)deviceToken {
      		[FIRMessaging messaging].APNSToken = deviceToken;
      		NSString *fcmToken = [FIRMessaging messaging].FCMToken;
      		NSLog(@"++APNST deviceToken : %@", deviceToken);
      		NSLog(@"++FCM device token : %@", fcmToken);
 		[RNCPushNotificationIOS
      		didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}


- (void)application:(UIApplication *)application
    didReceiveRemoteNotification:(NSDictionary *)userInfo
          fetchCompletionHandler:
              (void (^)(UIBackgroundFetchResult))completionHandler {
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo
                                fetchCompletionHandler:completionHandler];
}


- (void)application:(UIApplication *)application
    	didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  	[RNCPushNotificationIOS
      	didFailToRegisterForRemoteNotificationsWithError:error];
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center
    didReceiveNotificationResponse:(UNNotificationResponse *)response
             withCompletionHandler:(void (^)(void))completionHandler {
 	[RNCPushNotificationIOS didReceiveNotificationResponse:response];
  	completionHandler();
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
  return true;
}

@end
