import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../types';

import HoagieListScreen from '../screens/App/HoagieListScreen';
import HoagieDetailsScreen from '../screens/App/HoagieDetailsScreen';
import HoagieCreateScreen from '../screens/App/HoagieCreateScreen';
import HoagieEditScreen from '../screens/App/HoagieEditScreen';

const AppStack = createNativeStackNavigator<AppStackParamList>();

export default function AppNavigator() {
  return (
    <AppStack.Navigator>
      <AppStack.Screen name="HoagieList" component={HoagieListScreen} />
      <AppStack.Screen name="HoagieDetails" component={HoagieDetailsScreen} />
      <AppStack.Screen name="HoagieCreate" component={HoagieCreateScreen} />
      <AppStack.Screen name="HoagieEdit" component={HoagieEditScreen} />
    </AppStack.Navigator>
  );
}