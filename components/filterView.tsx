import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { hp } from '@/helpers/common'
import { theme } from '@/constants/theme'
import { capitalize } from 'lodash'

export const SectionView = ({title, content}) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.ssectionTitle}>{title}</Text>
      <View>
        {content}
      </View>
    </View>
  )
}
 export const CommonfilterRow =({data, filterName, filters, setFilters})=>{

const onSelect = (item)=>{
    setFilters({...filters, [filterName]: item})
}
    return(
      <View style={styles.flexRowWrap}>
        {
            data && data.map((item, index)=>{
                let isActive = filters && filters[filterName] == item;
                let backgroundColor = isActive? theme.colors.neutral(0.7): 'white';
                let color = isActive? 'white': theme.colors.neutral(0.7);
                return(
                    <Pressable onPress={()=>{onSelect(item)}} key={item} style={[styles.outlinedButton, {backgroundColor}]}>
                        <Text style={[styles.outlinedButtonText, {color}]}>{capitalize(item)}</Text>
                    </Pressable>
                )
            })
        }
       
      </View>
    )
  }

  export const Colorfilter = ({ data, filterName, filters, setFilters }) => {
    const onSelect = (item) => {
      setFilters({ ...filters, [filterName]: item });
    };
  
    return (
      <View style={styles.flexRowWrap}>
        {data &&
          data.map((item, index) => {
            const isActive = filters && filters[filterName] === item;
            const borderColor = isActive ? theme.colors.neutral(0.4) : 'white';
  
            return (
              <Pressable onPress={() => onSelect(item)} key={index}>
                <View style={[styles.colorWrapper, { borderColor }]}>
                  <View style={[styles.color, { backgroundColor: item.toLowerCase() }]} />
                </View>
              </Pressable>
            );
          })}
      </View>
    );
  };
    

const styles = StyleSheet.create({
    sectionContainer:{
        gap: 8
    },
    ssectionTitle:{
        fontSize: hp(2.4),
        fontWeight: theme.fontWeights.medium,
        color: theme.colors.neutral(0.8)
    },
    flexRowWrap:{
        gap: 10,
        flexDirection: 'row',
        flexWrap:'wrap'
    },
    outlinedButton:{
        padding: 8,
        borderWidth: 1,
        borderColor: theme.colors.grayBG,
        borderRadius: theme.radius.xs,
        borderCurve:'continuous',
        marginHorizontal: 14,
       
    },
    outlinedButtonText:{},

    color:{
        height: 30,
        width: 40,
        borderRadius: 9,
        borderCurve:'continuous'
    },
    
    colorWrapper:{
        padding: 2,
        borderRadius: 15,
        borderWidth: 2,
        borderCurve:'continuous'
    },
})