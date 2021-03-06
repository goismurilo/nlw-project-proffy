import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { ScrollView, TextInput, BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';

import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';

import api from '../../services/api';
import styles from './styles';

function TeacherList() {
    const [ isFilterVisible, setIsFilterVisible ] = useState(false);

    const [ favorites, setFavorites ] = useState<number[]>([]);

    function loadFavorites() {
        AsyncStorage.getItem('favorites').then(response => {
            if (response) {
                const favoritedTeachers = JSON.parse(response);
                const favoritedTeachersIDs = favoritedTeachers.map( (teacher : Teacher) => {
                    return teacher.id;
                });
    
                setFavorites(favoritedTeachersIDs);
            }
        });
    }


    function handleToggleFiltersVisible(){
        setIsFilterVisible(!isFilterVisible);
    }

    const [ subject, setSubject ] = useState('');
    const [ week_day, setWeekDay ] = useState('');
    const [ time, setTime ] = useState('');

    const [ teachers, setTeachers ] = useState([]);

    async function handleButtonSubmit() {
        loadFavorites();
        const response = await api.get('classes',{
            params: {
                subject,
                week_day,
                time
            }
        });
   
        setIsFilterVisible(false);
        setTeachers(response.data);

    }

    return(
        <View style={styles.container} >
            <PageHeader 
                title="Proffys Disponíveis" 
                headerRight={(
                    <BorderlessButton onPress={handleToggleFiltersVisible} >
                        <Feather name="filter" size={20} color="#FFF"  />
                    </BorderlessButton>
                )}
            >

                { isFilterVisible && (
                    <View style={styles.searchForm}>
                        <Text style={styles.label}>Matéria</Text>
                        <TextInput 
                            style={styles.input}
                            placeholder="Qual a matéria?"
                            placeholderTextColor="#c1bccc"
                            value={subject}
                            onChangeText={ text => setSubject(text) }
                        />

                        <View style={styles.inputGroup}>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Dia da semana</Text>
                                <TextInput 
                                    style={styles.input}
                                    placeholder="Qual o dia??"
                                    placeholderTextColor="#c1bccc"
                                    value={week_day}
                                    onChangeText={ text => setWeekDay(text) }
                                />
                            </View>

                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Horário</Text>
                                <TextInput 
                                    style={styles.input}
                                    placeholder="Qual horário??"
                                    placeholderTextColor="#c1bccc"
                                    value={time}
                                    onChangeText={ text => setTime(text) }
                                />

                            </View>

                        </View>

                        <RectButton style={styles.submitButton} onPress={handleButtonSubmit} >
                            <Text style={styles.submitButtonText}>Filtrar</Text>
                        </RectButton>

                    </View>
                )}

            </PageHeader>
            <ScrollView 
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 16,
                }}
            >
                { teachers.map((teacher: Teacher) =>{
                    return( 
                        <TeacherItem 
                            key={teacher.id} 
                            teacher={teacher} 
                            favorited={ favorites.includes(teacher.id)}
                        />)
                })}
                
            </ScrollView>
        </View>
    );
}

export default TeacherList;