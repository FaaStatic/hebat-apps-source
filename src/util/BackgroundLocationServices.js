import BackgroundService from 'react-native-background-actions';
import { GeolocationUtil } from './GeolocationUtil';
import { PermissionUtil } from './PermissionUtil';
import { AppState } from 'react-native';

const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

const taskGeo = async (taskDataArguments) => {
  const { delay } = taskDataArguments;
  await new Promise(async (resolve) => {
    while (BackgroundService.isRunning()) {
      try {
        await GeolocationUtil.locationService();
      } catch (error) {
        console.log(error);
      }
      await sleep(delay);
    }
  });
};

const options = {
  taskName: 'Background Services',
  taskTitle: 'HEBAT!',
  taskDesc: 'HEBAT! Using Background Service To Collect Location',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
    package: 'co.id.nexagroup.hebat'
  },
  color: '#ffff',
  linkingURI: 'hebatapp://mitra', // See Deep Linking for more info
  parameters: {
    delay: 300000,
  },
};

export const BackgroundLocationServices = {
  startBackgroundServices: async () => {
    PermissionUtil.accessLocation();
    await BackgroundService.start(taskGeo, options);
    await BackgroundService.updateNotification({
      taskDesc: 'HEBAT! Using Background Service For Collect Your Location',
    });
  },
  stopBackroundServices: async () => {
    await BackgroundService.stop();
  },
};
