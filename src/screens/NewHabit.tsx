import { useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity } from "react-native";
import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";
import {Feather } from '@expo/vector-icons'
import colors from "tailwindcss/colors";
const availableWeekDays = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado'
]
export function NewHabit(){
  const [weekDays, setWeekDays] = useState<number[]>([])

  function handleToggleWeekDay(weekDayIndex: number){
   if(weekDays.includes(weekDayIndex)){
    setWeekDays((state) => state.filter((day) => {
      return day != weekDayIndex
    }))
   }else{
    setWeekDays((state) => [...state, weekDayIndex])
   } 
  }
  return(
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 100}}
      >
        <BackButton />
        <Text className="mt-6 text-white font-extrabold text-3xl">
          Criar hábito
        </Text>
        <Text className="mt-6 text-white font-semibold text-base">
          Qual seu comprometimento?
        </Text>
        <TextInput 
          className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white focus:border-2 border-2 border-zinc-800 focus:border-green-600 "
          placeholder="Ex.: Exercício físico"
          placeholderTextColor={colors.zinc[400]}
        />
        <Text className="text-white font-semibold mt-4 mb-3 text-base">
          Qual a recorrência?
        </Text>
        {availableWeekDays.map((day, index) => {
          return (
            <Checkbox 
              key={day}
              checked = {weekDays.includes(index)}
              title={day}
              onPress={() => handleToggleWeekDay(index)}
            />
          )})
        }
        <TouchableOpacity
          className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
          activeOpacity={0.7}
        >
          <Feather 
            name="check"
            size={20}
            color={colors.white}
          />
          <Text className="font-semibold text-base text-white ml-2">Confirmar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}