import { View, Text, ScrollView, Alert } from "react-native";
import { HabitDay, DAY_SIZE } from "../components/HabitDay";
import { Header } from "../components/Header";
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { useCallback, useState } from "react";
import { Loading } from "../components/Loading";
import dayjs from "dayjs";
import { api } from "../lib/axios"
import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning"
const weekDays = [
  'D', 'S', 'T', 'Q', 'Q', 'S', 'S'
]

const datesFromYearStart = generateDatesFromYearBeginning()

const minimumSummaryDatesSizes = 18 * 5
const amountOfDaysToFill = minimumSummaryDatesSizes - datesFromYearStart.length


type SummaryProps = {
  id: string,
  date: string,
  amount: number,
  completed: number

}[]
export function Home(){
  const [loading, setLoading] = useState(true)
  const { navigate } = useNavigation()
  const [summary, setSummary] = useState<SummaryProps | null>(null)
  async function fetchData(){
    try{
      setLoading(true)
      const response = await api.get('/summary')
      setSummary(response.data)
    }
    catch(error){
      Alert.alert('Ops', 'Não foi possível carregar os dados')
      console.log(error)
    } finally{
      setLoading(false)
    }
  }

  useFocusEffect(useCallback(() => {
    fetchData()
  }, []))

  if(loading){
    return(
      <Loading />
    )
  }
  return(
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />
      <View className="flex-row mt-6 mb-2">
      {weekDays.map((day, i) => {
        return (
          <Text key={`${day}-${i}`} className="text-zinc-400 text-xl font-bold text-center mx-1"
          style={{width: DAY_SIZE}}
          >{day}</Text>
        )
      })}
      </View>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 100}}
      >
      {
        summary &&
        <View className="flex-row flex-wrap">
        {
          datesFromYearStart.map(date => {
            const dayWithHabits = summary.find(day => {
              return dayjs(date).isSame(day.date, 'day')
            })
            return(
              <HabitDay 
                date={date}
                amount={dayWithHabits?.amount}
                completed={dayWithHabits?.completed}
                onPress={() => navigate('habit', {date: date.toISOString()})}
                key={date.toISOString()} 
              />
            )
          })
        }
        {
          amountOfDaysToFill > 0 && Array.from({
            length: amountOfDaysToFill
          }).map((_, i) => {
            return(
              <View key={i} className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-50"
              style={{ width: DAY_SIZE, height: DAY_SIZE }}>

              </View>
            )
          })
        }
        </View>
      }
      </ScrollView>
    </View>
  )
}