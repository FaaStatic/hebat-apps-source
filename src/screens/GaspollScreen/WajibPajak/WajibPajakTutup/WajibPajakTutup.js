import React, { useState, useCallback,  useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  LayoutAnimation,
  UIManager,
  Dimensions,
  InteractionManager
} from 'react-native';
import { Image, Input, Dialog } from '@rneui/themed';
import MapView, { Marker } from 'react-native-maps';
import { Header } from '../../../Komponen/Header';
import { colorApp, stringApp } from '../../../../util/globalvar';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import { Api } from '../../../../util/ApiManager';
import { MessageUtil } from '../../../../util/MessageUtil';
import GapList from '../../../Komponen/GapList';
import { ScrollView } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { PermissionUtil } from '../../../../util/PermissionUtil';
import SignatureScreen from 'react-native-signature-canvas';
import { SessionManager } from '../../../../util/SessionUtil/SessionManager';
import { useFocusEffect } from '@react-navigation/native';


var count = 0;
const limit = 10;
var firstload = true;

const { height: ViewHeight, width: ViewWidth } = Dimensions.get('window');

const WajibPajakTutup = ({ navigation, route }) => {
  const [keyword, setKeyword] = useState('');
  const [responseItem, setResponseItem] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [extraData, setExtraData] = useState(true);
  const [emptyData, setEmptyData] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [loadingFooter, setLoadingFooter] = useState(false);
  const inputText = useRef();
  const signatureRef = useRef();
  const [loadingPicture, setLoadingPicture] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [ttd, setTtd] = useState('');
  const [reason, setReason] = useState('');
  const [fileList, setFileList] = useState([]);
  const [savingFileData, setSavingFileData] = useState([]);

  
  useFocusEffect(useCallback(()=>{
    const task = InteractionManager.runAfterInteractions(()=>{
      count = 0;
      firstLoad = true;
      setResponseItem([]);
      getApi();
    });
    return()=> task.cancel();
  },[]));


  const keywordChange = () => {
    count = 0;
    firstload = true;
    setResponseItem([]);
    getApi();
  };

  const handleOK = (signature) => {
    var data = signature.replace('data:image/png;base64,', '');
    setTtd(data);
    console.log('====================================');
    console.log(data);
    console.log('====================================');
    console.log(signature);
  };

  const clearSignature = () => {
    signatureRef.current.clearSignature();
  };
  const itemSelect = (item) => {
    setSelectedItem(item);
    setOpenModal(true);
  };

  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const layoutAnimConfig = {
    duration: 300,
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
    },
    delete: {
      duration: 100,
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
  };
  const getApi = async () => {
    if (firstload) {
      setLoadingScreen(true);
    }

    const params = {
      start: count,
      count: limit,
      keyword: keyword,
    };
    await Api.post('MerchantTutup/view_merchant_buka/', params)
      .then((res) => {
        var body = res.data;
        var message = body.metadata.message;
        var status = body.metadata.status;
        var response = body.response;
        if (status === 200) {
          if (firstload) {
            setResponseItem(response);
            firstload = false;
          } else {
            setResponseItem(responseItem.concat(response));
          }
          setEmptyData(false);
          if (response.length < limit) {
            setHasNextPage(false);
            setExtraData(false);
          } else {
            setHasNextPage(true);
            setExtraData(true);
          }
          setLoadingScreen(false);
          setLoadingFooter(false);
        } else {
          setEmptyData(true);
          setHasNextPage(false);
          setEmptyData(false);
          setLoadingScreen(false);
          setLoadingFooter(false);
          MessageUtil.warningMessage(message);
        }
      })
      .catch((err) => {
        setEmptyData(true);
        setHasNextPage(false);
        setEmptyData(false);
        setLoadingScreen(false);
        setLoadingFooter(false);
        console.log('====================================');
        console.log(err);
        console.log('====================================');
      });
  };

  const addCloseMerchant = async () => {
    if (reason === '' && ttd === '' && savingFileData === null) {
      MessageUtil.errorMessage('Isi terlebih dahulu data yang kosong !!!');
      return;
    }
    setOpenModal(false);
    setLoadingScreen(true);
    count = 0;
    firstload = true;
    setResponseItem([]);
    var sesi = SessionManager.GetAsObject(stringApp.session);
    const params = {
      id_petugas: sesi.id,
      id_merchant: selectedItem.id,
      t_npwpdwp: selectedItem.id,
      alasan_tutup: reason,
      flag: selectedItem.flag,
      foto: savingFileData,
      ttd: ttd,
    };
    await Api.post('MerchantTutup', params)
      .then((res) => {
        var body = res.data;
        var message = body.metadata.message;
        var status = body.metadata.status;
        var response = body.response;
        if (status === 200) {
          MessageUtil.successMessage(message);
          setTtd('');
          setSavingFileData([]);
          setFileList([]);
          setReason('');
          getApi();
        } else {
          setTtd('');
          setSavingFileData([]);
          setFileList([]);
          setReason('');
          setLoadingScreen(false);
          MessageUtil.errorMessage(message);
        }
      })
      .catch((err) => {
        setTtd('');
        setSavingFileData([]);
        setFileList([]);
        setReason('');
        setLoadingScreen(false);
        console.log('====================================');
        console.log(err);
        console.log('====================================');
      });
  };

  const removeItem = (value) => {
    let arr = fileList.filter((item) => {
      return item.id !== value.id;
    });
    var idx = 0;
    savingFileData.filter((element, index) => {
      if (element === value.image) {
        idx = index;
      }
    });
    let arrImage = savingFileData.splice(idx, 1);
    setSavingFileData(arrImage);
    setFileList(arr);
    LayoutAnimation.configureNext(layoutAnimConfig);
  };

  const pickImage = async () => {
    setLoadingPicture(true);
    let options = {
      mediaType: 'photo',
      maxWidth: 800,
      maxHeight: 800,
      cameraType: 'back',
      includeBase64: true,
      quality: 0.7,
      storageOptions: {
        skipBackup: true,
        path: 'Pictures',
      },
      saveToPhotos: true,
    };
    let cameraPermission = await PermissionUtil.requestCameraPermission();
    let saveStorage = await PermissionUtil.requestExternalWritePermission();
    if (cameraPermission && saveStorage) {
      launchCamera(options, (response) => {
        if (response.didCancel) {
          console.log('Canceled By User');
          setLoadingPicture(false);
        } else {
          var number = Math.floor(Math.random() * 100) + 1;
          var item = [
            {
              id: number,
              image: response.assets[0].base64,
            },
          ];
          if (fileList.length > 0) {
            setFileList(fileList.concat(item));
            setSavingFileData((current) => [...current, response.assets[0].base64]);
          } else {
            setFileList(item);
            setSavingFileData((current) => [...current, response.assets[0].base64]);
          }

          console.log('====================================');
          console.log(savingFileData);
          console.log('====================================');
          console.log(fileList);
          setTimeout(() => {
            setLoadingPicture(false);
            console.log(fileList);
          }, 1000);
        }
      });
    }
  };

  const loadMore = () => {
    if (hasNextPage == true && firstload == false && emptyData == false && extraData == true) {
      setLoadingFooter(true);
      count += limit;
      getApi();
    }
  };

  const itemList = useCallback(({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          itemSelect(item);
        }}
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          justifyContent: 'flex-start',
          padding: 16,
        }}
      >
        <Image
          source={
            item.image.length > 0
              ? { uri: item.image[0].image }
              : require('../../../../../assets/images/store.png')
          }
          style={{
            height: 75,
            width: 75,
          }}
          containerStyle={{
            height: 75,
            width: 75,
            marginEnd: 16,
            borderRadius: 8,
            backgroundColor: 'white',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
          placeholderStyle={{
            height: 75,
            width: 75,
            flexDirection: 'column',
            justifyContent: 'center',
          }}
          resizeMode={'stretch'}
          PlaceholderContent={
            <ActivityIndicator
              size={'large'}
              color={colorApp.primaryGaspoll}
              style={{ alignSelf: 'center' }}
            />
          }
        />

        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-evenly',
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: 'black',
              marginBottom: 16,
              width: 200,
            }}
          >
            {item.nama}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '400',
              color: 'black',
              marginBottom: 16,
              width: 200,
            }}
          >
            {item.alamat}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }, []);
  const itemFooter = useCallback(() => {
    if (loadingFooter) {
      return (
        <View
          style={{
            justifyContent: 'center',
            marginTop: 16,
            height: 100,
            backgroundColor: 'white',
            flexDirection: 'column',
            marginBottom: 16,
            width: '100%',
          }}
        >
          <ActivityIndicator color="'#FC572C'" size={'small'} style={{ alignSelf: 'center' }} />
        </View>
      );
    } else {
      return (
        <View
          Style={{
            height: 100,
            width: '100%',
          }}
        />
      );
    }
  });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column',
      }}
    >
      <Header
        Title={'Wajib Pajak Tutup'}
        back={() => {
          navigation.goBack();
        }}
        action={() => {
          navigation.navigate('RiwayatPajakTutup');
        }}
      />
      <View
        style={{
          backgroundColor: colorApp.backgroundView,
          paddingEnd: 16,
          paddingStart: 16,
          height: 60,
        }}
      >
        <Input
          onChangeText={(txt) => {
            setKeyword(txt);
          }}
          onChange={() => {
            keywordChange();
          }}
          ref={inputText}
          value={keyword}
          leftIcon={<Icon name="search" size={24} color={'black'} />}
          placeholder={'Cari Nama Wajib Pajak'}
          inputStyle={{
            textAlign: 'center',
            borderWidth: 0,
          }}
          containerStyle={{
            margin: 0,
          }}
        />
      </View>
      {loadingScreen ? (
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <ActivityIndicator
            color={'#FC572C'}
            size={'large'}
            style={{
              alignSelf: 'center',
            }}
          />
        </View>
      ) : (
        <FlatList
          data={responseItem}
          extraData={extraData}
          onEndReached={loadMore}
          ItemSeparatorComponent={<GapList />}
          renderItem={itemList}
          ListFooterComponent={itemFooter}
          keyExtractor={(item) => item.id}
        />
      )}

      <Dialog
        isVisible={openModal}
        overlayStyle={{
          height: ViewHeight / 1.05,
          width: ViewWidth / 1.15,
          padding: 0,
          borderRadius: 8,
        }}
        onBackdropPress={() => {
          setOpenModal(false);
        }}
      >
        {selectedItem === null ? (
          <></>
        ) : (
          <>
            <Image
              source={
                selectedItem.image.length > 0
                  ? { uri: selectedItem.image[0].image }
                  : require('../../../../../assets/images/store.png')
              }
              style={{
                height: ViewHeight / 3.5,
              }}
              resizeMode={'stretch'}
              containerStyle={{
                height: ViewHeight / 3.5,
                borderTopRightRadius: 8,
                borderTopLeftRadius: 8,
              }}
              placeholderStyle={{
                height: ViewHeight / 5,
                borderTopRightRadius: 8,
                borderTopLeftRadius: 8,
                justifyContent: 'center',
                backgroundColor: colorApp.backgroundView,
              }}
              PlaceholderContent={
                <ActivityIndicator
                  style={{ alignSelf: 'center' }}
                  size={'large'}
                  color={colorApp.primaryGaspoll}
                />
              }
            />
            <ScrollView
              nestedScrollEnabled={true}
              contentContainerStyle={{
                paddingStart: 8,
                paddingEnd: 8,
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  color: '#290736',
                  alignSelf: 'center',
                  textAlign: 'center',
                  fontWeight: '800',
                  marginBottom: 4,
                  marginTop: 8,
                }}
              >
                {selectedItem.nama}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: 'black',
                  alignSelf: 'center',
                  textAlign: 'center',
                  fontWeight: '400',
                  marginBottom: 16,
                }}
              >
                {selectedItem.alamat}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: 'black',
                  alignSelf: 'center',
                  textAlign: 'center',
                  fontWeight: '400',
                  marginBottom: 8,
                }}
              >
                Apakah wajib pajak tersebut telah berhenti beroperasi?
              </Text>
              <Input
                value={reason}
                onChangeText={(txt) => {
                  setReason(txt);
                }}
                multiline={true}
                placeholder={'Tulis Keterangan mengapa wajib pajak tersebut berhenti beroperasi'}
                placeholderTextColor={'grey'}
                textAlignVertical={'top'}
                textAlign={'left'}
                inputStyle={{
                  fontSize: 14,
                  backgroundColor: 'white',
                  height: ViewHeight / 4,
                }}
              />

              <Text
                style={{
                  fontSize: 18,
                  color: 'black',
                  fontWeight: '800',
                  marginBottom: 4,
                  marginStart: 16,
                }}
              >
                Upload Foto
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: 'grey',
                  fontWeight: '500',
                  marginStart: 16,
                  marginBottom: 16,
                }}
              >
                Tekan ikon kamera untuk menambahkan foto
              </Text>
              {fileList.length > 0 ? (
                <FlatList
                  nestedScrollEnabled={true}
                  ListHeaderComponent={() => {
                    return (
                      <TouchableOpacity
                        onPress={pickImage}
                        style={{
                          width: 150,
                          height: 150,
                          backgroundColor: '#e1e1e1',
                          justifyContent: 'center',
                          marginLeft: 16,
                        }}
                      >
                        <Icon2
                          name="camera-alt"
                          size={100}
                          color={'white'}
                          style={{ alignSelf: 'center' }}
                        />
                      </TouchableOpacity>
                    );
                  }}
                  horizontal={true}
                  style={{
                    marginBottom: 16,
                  }}
                  data={fileList}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => {
                    var image = '';
                    if (item.image.includes('https')) {
                      image = item.image;
                    } else {
                      image = `data:image/png;base64,${item.image}`;
                    }

                    return (
                      <View
                        style={{
                          backgroundColor: 'black',
                          width: 150,
                          height: 150,
                          marginLeft: 16,
                        }}
                      >
                        <Image
                          source={{ uri: image }}
                          PlaceholderContent={<ActivityIndicator />}
                          containerStyle={{
                            width: 150,
                            height: 150,
                            flex: 1,
                          }}
                          resizeMode={'cover'}
                        />
                        <TouchableOpacity
                          onPress={() => {
                            removeItem(item);
                          }}
                          style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            marginTop: 4,
                            marginRight: 4,
                          }}
                        >
                          <Icon name="trash" size={14} color={'red'} />
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                />
              ) : (
                <TouchableOpacity
                  onPress={pickImage}
                  style={{
                    width: 150,
                    height: 150,
                    backgroundColor: '#e1e1e1',
                    justifyContent: 'center',
                    marginLeft: 16,
                    marginBottom: 16,
                  }}
                >
                  <Icon2
                    name="camera-alt"
                    size={100}
                    color={'white'}
                    style={{ alignSelf: 'center' }}
                  />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => {
                  setOpenDialog(true);
                }}
                style={{
                  backgroundColor: colorApp.btnColor2,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  padding: 8,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '800',
                  }}
                >
                  Tambah Tanda Tangan
                </Text>
              </TouchableOpacity>
              <View>
                {ttd === '' ? (
                  <View
                    style={{
                      backgroundColor: 'white',
                      height: 400,
                      width: ViewWidth,
                    }}
                  />
                ) : (
                  <Image
                    source={{ uri: `data:image/png;base64,${ttd}` }}
                    style={{
                      height: 400,
                      width: ViewWidth,
                    }}
                    containerStyle={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                      backgroundColor: 'white',
                    }}
                    placeholderStyle={{
                      height: 400,
                      width: ViewWidth,
                      justifyContent: 'center',
                    }}
                    PlaceholderContent={
                      <ActivityIndicator
                        color={colorApp.primaryGaspoll}
                        size={'large'}
                        style={{
                          alignSelf: 'center',
                        }}
                      />
                    }
                  />
                )}
                <TouchableOpacity
                  onPress={() => {
                    addCloseMerchant();
                  }}
                  style={{
                    backgroundColor: colorApp.primaryGaspoll,
                    padding: 8,
                    borderRadius: 8,
                    marginBottom: 16,
                    justifyContent: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 14,
                      fontWeight: '600',
                      textAlign: 'center',
                    }}
                  >
                    Ya, Wajib pajak telah berhenti beroperasi
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </>
        )}

        <Dialog
          isVisible={openDialog}
          overlayStyle={{
            backgroundColor: 'white',
            paddingTop: 16,
            paddingBottom: 16,
            flexDirection: 'column',
            justifyContent: 'center',
            height: ViewHeight / 2,
          }}
          onBackdropPress={() => {
            setOpenDialog(false);
          }}
        >
          <Text
            numberOfLines={2}
            style={{
              alignSelf: 'center',
              marginEnd: 24,
              marginStart: 24,
              fontSize: 12,
              marginBottom: 8,
              fontWeight: '400',
              color: 'black',
              textAlign: 'center',
            }}
          >
            Untuk melengkapi data mohon dicantumkan tanda tangan wajib pajak
          </Text>
          <SignatureScreen
            ref={signatureRef}
            onOK={handleOK}
            penColor={'black'}
            webStyle={`
            .m-signature-pad{box-shadow: none; border: none; }
            .m-signature-pad--body{border-left: none; border-right:none; border-top:1px solid black; border-bottom:1px solid black;}
            .m-signature-pad--footer{display: none; margin: 0px;}
            body,html {
              height: 220px;}`}
            descriptionText={'Tanda Tangan'}
          />
          <Text
            style={{
              alignSelf: 'center',
              color: '#00FFFF',
              textAlign: 'center',
              fontSize: 16,
              fontWeight: '400',
            }}
          >
            Tanda Tangan Disini
          </Text>
          <Text
            style={{
              alignSelf: 'center',
              color: 'black',
              textAlign: 'center',
              fontSize: 12,
              fontWeight: '400',
            }}
          >
            (Wajib Pajak)
          </Text>

          <TouchableOpacity
            onPress={() => {
              signatureRef.current.readSignature();
              setTimeout(() => {
                setOpenDialog(false);
              }, 1000);
            }}
            style={{
              justifyContent: 'center',
              marginEnd: 8,
              marginStart: 8,
              marginBottom: 8,
              flexDirection: 'column',
              marginTop: 16,
              padding: 8,
              backgroundColor: '#669beb',
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: 'white',
                fontWeight: '600',
                alignSelf: 'center',
              }}
            >
              Simpan
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              clearSignature();
            }}
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              marginEnd: 8,
              marginBottom: ViewHeight / 5,
            }}
          >
            <Icon
              name="undo"
              style={{
                margin: 8,
              }}
              color={'black'}
              size={24}
            />
          </TouchableOpacity>
        </Dialog>
        <Dialog
          isVisible={loadingPicture}
          overlayStyle={{
            height: 200,
            width: 200,
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: 'white',
          }}
        >
          <ActivityIndicator
            size={'large'}
            color={colorApp.primaryGaspoll}
            style={{ alignSelf: 'center' }}
          />
        </Dialog>
      </Dialog>
    </View>
  );
};

export default WajibPajakTutup;
