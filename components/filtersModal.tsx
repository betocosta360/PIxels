import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Button, Pressable } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,

} from '@gorhom/bottom-sheet';
//import { Animated} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import Animated, { Extrapolation, FadeInDown, interpolate, useAnimatedStyle } from 'react-native-reanimated'; // Corrigido o uso de Animated
import { capitalize, hp } from '@/helpers/common';
import { theme } from '@/constants/theme';
import { Colorfilter, CommonfilterRow, SectionView } from './filterView';
import { data } from '@/constants/data';

export default function FiltersModal({
  modalRef,
  onClose,
  onApply,
  onReset,
  filters,
  setFilters }) {

  const snapPoints = useMemo(() => ['75%'], []);
  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={CustomBackDrop}
    //onChange={handleSheetChanges}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.content}>
          <Text style={styles.filterText}>Filter</Text>

          {
            Object.keys(sections).map((sectionName, index) => {
              let sectionView = sections[sectionName]
              let sectionData = data.filters[sectionName]
              let title = capitalize(sectionName)

              return (
                <Animated.View entering={FadeInDown.delay((index*100)+100).springify().damping(11)} key={sectionName}>
                  <SectionView
                    title={title}
                    content={sectionView({
                      data: sectionData,
                      filters,
                      setFilters,
                      filterName: sectionName
                    })} />
                </Animated.View>
              )
            })
          }

          <Animated.View entering={FadeInDown.delay(500).springify().damping(11)}style={styles.buttons}>
            <Pressable style={styles.resetButton} onPress={onReset}>
              <Text style={[styles.buttonText, {color: theme.colors.neutral(0.9)}]}>Limpar</Text>
            </Pressable>
            <Pressable style={styles.applyButton} onPress={onApply}>
              <Text style={[styles.buttonText,  {color: theme.colors.white}]}>Aplicar</Text>
            </Pressable>
          </Animated.View>

        </View>
      </BottomSheetView>
    </BottomSheetModal>
  )
}

const sections = {
  "order": (props) => <CommonfilterRow {...props} />,
  "orientation": (props) => <CommonfilterRow {...props} />,
  "type": (props) => <CommonfilterRow {...props} />,
  "colors": (props) => <Colorfilter {...props} />
}


const CustomBackDrop = ({ animatedIndex, style }) => {

  const containerAnimatedStyle = useAnimatedStyle(() => {
    let opacity = interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 1],
      Extrapolation.CLAMP
    )
    return {
      opacity
    }
  })
  const containerStyle = [
    StyleSheet.absoluteFill,
    style,
    styles.overlay,
    containerAnimatedStyle,
  ]
  return (
    <Animated.View style={containerStyle}>
      <BlurView style={StyleSheet.absoluteFill}
        tint="dark"
        intensity={25} />
    </Animated.View>
  )
}
const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  filterText: {
    fontSize: hp(3),  // Corrigida a vírgula faltante
    color: theme.colors.neutral(0.8),  // Corrigida a vírgula faltante
    fontWeight: theme.fontWeights.semiBold,
  },
  content: {
    flex: 1, // Descomente se necessário
    //width: '100%',
    gap: 15,
    padding: 20,
    paddingVertical: 10,
  },
  buttons: {
    flex: 1,
    flexDirection:'row',
    alignItems: 'center',
    gap:10
  },
  applyButton:{
    flex: 1,
    backgroundColor: theme.colors.neutral(0.8),
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderCurve: 'continuos',
  },
  resetButton: {
    flex: 1,
    backgroundColor: theme.colors.neutral(0.03),
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderCurve: 'continuos',
    borderWidth: 2,
    borderColor: theme.colors.grayBG
  },
  buttonText: {
    fontSize: hp(2.2),
    color: theme.colors.white,
    fontWeight: theme.fontWeights.semiBold,
  },
  
});
