import { StatusBar, ScrollView, View, StyleSheet, Text, Platform } from 'react-native'
import React from 'react'
import moment from 'moment';
import 'moment/locale/id';
import Entypo from 'react-native-vector-icons/Entypo'
import { colorApp, fontsCustom } from '../../../../../util/globalvar';
import { Gap, HeaderSubMenu } from '../../../components';
import { stylesheet } from '../../../assets';
const APPBAR_HEIGHT = Platform.isPad == true ? height / 7 : 110;
export default DetailRiwayatStatusBayarPBB = ({ navigation, route }) => {
    const { data } = route.params;
    const formatDate = (tgl) => {
        let date = moment(tgl).format('hh MMMM YYYY')
        return date
    }
    return (
        <><StatusBar backgroundColor={colorApp.header.primary} /><View style={[stylesheet.container]}>
            <View style={{ height: APPBAR_HEIGHT }} />
            <HeaderSubMenu
                title={"Detail PBB"}
                type="icon-only"
                icon="black"
                background={colorApp.header.secondary}
                onPress={() => navigation.goBack()} />
            <View
                style={{
                    flex: 1,
                    borderTopStartRadius: 45,
                    borderTopEndRadius: 45,
                    backgroundColor: colorApp.primary,
                }}
            >
                <Gap height={30} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={[stylesheet.content]}>
                        <View style={{ flexDirection: 'row', marginHorizontal: 15 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 16, fontFamily: fontsCustom.primary[700], color: colorApp.black }}>{data.bayar == null ? 'Pembayaran Belum' : 'Pembayaran Berhasil'}</Text>
                                <Text style={{ fontSize: 16, fontFamily: fontsCustom.primary[400], color: colorApp.black }}>{formatDate(data.tempo)}</Text>
                            </View>
                            <View style={{ width: 68, height: 68, borderRadius: 120, backgroundColor: colorApp.gradientSatu, justifyContent: 'center', alignItems: 'center' }}>
                                <Entypo name={data.bayar === null ? 'cross' : 'check'} size={60} color={colorApp.primary} />
                            </View>
                        </View>
                        <Gap height={30} />
                        <View
                            style={{
                                backgroundColor: colorApp.secondary,
                                borderRadius: 19,
                                padding: 15,
                            }}
                        >
                            {data.detail.map((item, index) => {
                                return <><Gap height={10} /><View style={styles.cardIn}>
                                    <Text style={styles.title}>{item.label}</Text>
                                    <Text style={styles.description}>{item.value}</Text>
                                </View><Gap height={10} /></>
                            })}
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View></>
    )
}

const styles = StyleSheet.create({
    title: {
        flex: 0.8,
        fontFamily: fontsCustom.primary[700],
        color: colorApp.black,
        fontSize: 12,
    },
    cardIn: {
        flexDirection: 'row',
        borderRadius: 19,
        padding: 15,
        backgroundColor: colorApp.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: Platform.OS == 'android' ? 2 : 0,
        shadowRadius: 13,
        shadowColor: colorApp.black,
        elevation: 2,
    },
    description: {
        flex: 0.8,
        fontFamily: fontsCustom.primary[400],
        color: colorApp.black,
        fontSize: 12,
    },
})