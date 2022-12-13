#import <UserNotifications/UNUserNotificationCenter.h>
#import <Firebase.h>
#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>


@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, UNUserNotificationCenterDelegate>

@property (nonatomic, strong) UIWindow *window;

@end
