import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { PropsWithChildren } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'

type PlayerCardProps=PropsWithChildren<{
  actionText:string,
  icon:string,
  onPress: ()=> void
}>

const ActionButton = ({actionText,icon, onPress}:PlayerCardProps) => {
  return (
    <View style={styles.container}>
      <Pressable onPress={onPress}>    
      <Icon name={icon} size={25} color={'white'} style={styles.icon}  /> 
      </Pressable>
      <Text style={styles.cardText}>{actionText}</Text>
    </View>
  )
}

export default ActionButton

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    paddingVertical:5,
  },
  icon:{
    borderRadius:40,
    // borderWidth:1,
    padding:9,
    // borderColor:'#fff',
    backgroundColor:'#bdbdbd61'
    
  },
  cardText:{
    color:'#fff',
    fontSize:16,
    
  }
})