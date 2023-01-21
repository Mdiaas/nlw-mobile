import { ScrollView, View, Text, Alert } from "react-native";
import { useRoute } from '@react-navigation/native'
import { BackButton } from "../components/BackButton";
import dayjs from "dayjs";
import { ProgressBar } from "../components/ProgressBar";
import { Checkbox } from "../components/Checkbox";
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";
import { EmptyHabits } from "../components/EmptyHabits";
import clsx from "clsx";
interface HabitParams{
  date: string
}

interface DayInfoProps{
  completed: string[],
  possibleHabits: {
    id: string,
    title: string,
  }[]
}
export function Habit(){
  const route = useRoute()
  const { date } = route.params as HabitParams
  const parsedDate = dayjs(date)
  const dayOfWeek = parsedDate.format('dddd')
  const dayAndMonth = parsedDate.format('DD/MM')
  const [loading, setLoading] = useState(true)
  const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null)
  const [completedHabits, setCompletedHabits] = useState<String[]>([])
  
  const isDateInPast = parsedDate.endOf('day').isBefore(new Date())
  async function handleToggleHabit(id: string){
    try{
      await api.patch(`/habits/${id}/toggle`)
      if(completedHabits.includes(id)){
        setCompletedHabits(prev => prev.filter(habit => {
          return habit !== id
        }))
      }else{
        setCompletedHabits(
          prevState => {
            return [...prevState, id]
          }
        )
      }
    }catch(error){
      console.log(error)
      Alert.alert('Ops', 'Erro ao alterar status do hábito')
    }
  }
  async function fetchHabits(){
    try{
      setLoading(true)

      const response = await api.get('/day', {
        params:{
          date
        }
      })
      setDayInfo(response.data)
      setCompletedHabits(response.data.completedHabits)
    }catch(error){
      console.log(error)
      Alert.alert('Ops', 'Não foi possível carregar as informações dos hábitos')
    }
    finally{
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchHabits()
  }, [])
  if(loading){
    <Loading />
  }

  const habitProgress = dayInfo?.possibleHabits.length ? generateProgressPercentage(dayInfo.possibleHabits.length, dayInfo.completed.length): 0;
  
  return(
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 100}}
      >
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>
        <Text className="text-white font-extrabold text-3xl">
          {dayOfWeek}
        </Text>
        <ProgressBar progress={habitProgress}/>

        <View
          className={clsx("mt-6", {
          ['opacity-50']: isDateInPast
          })}
        >
          {
            dayInfo?.possibleHabits.map ?
            dayInfo?.possibleHabits.map((habit) => {
              return(
                <Checkbox
                  key={habit.id} 
                  title={habit.title}
                  checked={completedHabits.includes(habit.id)}
                  disabled={isDateInPast}
                  onPress={() => handleToggleHabit(habit.id)}
                />
              )
            }) 
            :
            <EmptyHabits />
          }
          {
            isDateInPast && 
            <Text className="text-white mt-10 text-center">
              Não é possível editar os hábitos de dias anteriores.
            </Text>
          }
        </View>
      </ScrollView>
    </View>
  )
}