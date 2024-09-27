import { View, StyleSheet, Platform, ActivityIndicator, Pressable, Alert, Text } from 'react-native';
import React, { useState } from 'react';
import { BlurView } from 'expo-blur';
import { hp, wp } from '@/helpers/common';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { theme } from '@/constants/theme';
import { Entypo } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import Toast from 'react-native-toast-message';

export default function ImageScreen() {
    const router = useRouter();
    const item = useLocalSearchParams();
    const [status, setStatus] = useState('loading');
    let uri = item?.webformatURL;
    const fileName = item?.previewURL?.split('/').pop();
    const imageUrl = uri;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    const getSize = () => {
        const aspectRatio = item?.imageWidth / item?.imageHeight;
        const maxWidth = Platform.OS === 'web' ? wp(50) : wp(92);
        let calculatedHeight = maxWidth / aspectRatio;
        let calculatedWidth = maxWidth;

        if (aspectRatio < 1) {
            calculatedWidth = calculatedHeight * aspectRatio;
        }
        return {
            width: calculatedWidth,
            height: calculatedHeight
        };
    };

    const onLoad = () => {
        setStatus('');
    };

    const requestPermission = async () => {
        const { status } = await MediaLibrary.getPermissionsAsync();

        if (status !== 'granted') {
            const { status: newStatus } = await MediaLibrary.requestPermissionsAsync();
            if (newStatus === 'granted') {
                showToast('Permissão concedida');
            } else {
                showToast('Permissão negada');
                return false;
            }
        }
        return true;
    };

    const handleDownloadImage = async () => {
        const hasPermission = await requestPermission();
        if (!hasPermission) return;

        setStatus('downloading');
        let uri = await downloadFile();
        if (uri) {
            showToast('Imagem baixada');
            await saveImageToGallery(uri);
        }
    };

    const handleShareImage = async (uri) => {
        if (Platform.OS === 'web') {
            showToast('Link copiado');
        } else {
            setStatus('sharing');
            let uri = await downloadFile();
            if (uri) {
                await Sharing.shareAsync(uri);
            }
        }
        try {
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri);
            } else {
                Alert.alert("Compartilhamento não disponível neste dispositivo");
            }
        } catch (error) {
            console.error('Erro ao compartilhar a imagem', error);
            Alert.alert('Erro', 'Falha ao compartilhar a imagem');
        }
    };

    const downloadFile = async () => {
        try {
            const { uri } = await FileSystem.downloadAsync(imageUrl, filePath);
            setStatus('');
            console.log('Download de arquivo', uri);
            return uri;
        } catch (e) {
            console.error(e);
            setStatus('');
            Alert.alert('Erro na imagem', e.message);
            return null;
        }
    };

    const saveImageToGallery = async (uri) => {
        try {
            const asset = await MediaLibrary.createAssetAsync(uri);
            await MediaLibrary.createAlbumAsync('Download', asset, false);
            showToast('Imagem salva na galeria');
        } catch (error) {
            console.error('Erro ao salvar a imagem', error);
            showToast('Erro ao salvar a imagem');
        }
    };

    const showToast = (message) => {
        Toast.show({
            text1: message,
            position: 'top',
            type: 'success',
        });
    };

    const toastConfig = {
        success: ({ text1 }) => {
            return (
                <View style={styles.toast}>
                    <Text style={styles.toastText}>{text1}</Text>
                </View>
            );
        },
    };

    return (
        <BlurView style={styles.container} tint='dark' intensity={60}>
            <View style={getSize()}>
                <View style={styles.loading}>
                    {status === 'loading' && <ActivityIndicator size='large' color='white' />}
                </View>
                <Image transition={100} style={[styles.image, getSize()]} source={uri} onLoad={onLoad} />
            </View>
            <View style={styles.buttons}>
                <Animated.View entering={FadeInDown.springify()}>
                    <Pressable style={styles.button} onPress={() => router.back()}>
                        <Entypo name='cross' size={30} color='white' />
                    </Pressable>
                </Animated.View>

                <Animated.View entering={FadeInDown.springify().delay(100)}>
                    {status === 'downloading' ? (
                        <ActivityIndicator size='small' color='white' />
                    ) : (
                        <Pressable style={styles.button} onPress={handleDownloadImage}>
                            <Entypo name='download' size={30} color='white' />
                        </Pressable>
                    )}
                </Animated.View>

                <Animated.View entering={FadeInDown.springify().delay(200)}>
                    <Pressable style={styles.button} onPress={() => handleShareImage(filePath)}>
                        <Entypo name='share' size={30} color='white' />
                    </Pressable>
                </Animated.View>
            </View>
            <Toast config={toastConfig} visibilityTime={2500} />
        </BlurView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(4),
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    image: {
        borderRadius: theme.radius.lg,
        borderWidth: 2,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderColor: 'rgba(255,255,255,0.1)',
        marginBottom: wp(8),
    },
    loading: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    buttons: {
        marginTop: 40,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 50,
    },
    button: {
        height: hp(6),
        width: hp(6),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: theme.radius.lg,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    toast: {
        padding: 15,
        paddingHorizontal: 30,
        borderRadius: theme.radius.xl,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    toastText: {
        fontSize: hp(1.8),
        fontWeight: theme.fontWeights.semiBold,
        color: theme.colors.white,
    },
});
