import { View, Text, StyleSheet, Image, Pressable } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { hp, wp } from '@/helpers/common'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { theme } from '@/constants/theme'
import { router } from 'expo-router'

export default function WelcomeScreen() {
    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <Image
                source={require('@/assets/images/welcome.png')}
                style={styles.bgImage}
                resizeMode='cover' />
            <Animated.View entering={FadeInDown.duration(1000)} style={{ flex: 1 }}>
                <LinearGradient
                    colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.5)', 'white', 'white']}
                    style={styles.gradient}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 0.8 }} />
                    <View style={styles.contentContainer}>
                        <Animated.Text entering={FadeInDown.delay(400).springify()} style={styles.title}>Pixel</Animated.Text>
                        <Animated.Text entering={FadeInDown.delay(500).springify()} style={styles.punchline}>
                        Cada pixel conta uma história
                        </Animated.Text>
                        <View>
                            <Pressable onPress={()=>router.push('home')} style={styles.startButton}>
                                <Animated.Text entering={FadeInDown.delay(600).springify()} style={styles.startText}>Começe a Explorar</Animated.Text>
                            </Pressable>
                        </View>
                    </View>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bgImage: {
        width: wp(200),
        height: wp(210),
        position: 'absolute',

    },
    gradient: {
        width: wp(200),
        height: wp(105),
        bottom: 0,
        position: 'absolute',
        
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 14,
       
    },
    title: {
        fontSize:hp(7),
        color: theme.colors.neutral(0.9),
        fontWeight: theme.fontWeights.bold,
    },
   
    punchline: {
        fontSize:hp(2),
        marginBottom:5,
        letterSpacing:1,
        fontWeight: theme.fontWeights.bold,
    },
    startButton: {
        marginBottom: 50,
        backgroundColor: theme.colors.neutral(0.9),
        padding:15,
        paddingHorizontal:50,
        borderRadius: theme.radius.xl,
        borderCurve: 'continuous'
    },
    startText: {
        color: theme.colors.white,
        fontSize: hp(2),
        fontWeight: theme.fontWeights.medium,
        letterSpacing:1,
    },

})

