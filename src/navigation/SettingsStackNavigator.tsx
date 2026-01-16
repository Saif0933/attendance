import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

// Screens
import SettingScreen from '../../screen/SettingScreen';
import AddPayrollHead from '../settingScreen/AddPayrollHead';
import AddShift from '../settingScreen/AddShift';
import ConpanyShifts from '../settingScreen/ConpanyShifts';
import ExpenseTypes from '../settingScreen/ExpenseTyes';
import HolidaysScreen from '../settingScreen/HolidaysScreen';
import PayConfigurations from '../settingScreen/PayConfigurations';
import PaySlipsScreen from '../settingScreen/PaySlipsScreen';
import PersonalDetails from '../settingScreen/PersonalDetails';
import AddGeofenceScreen from '../settingScreen/location/AddGeofenceScreen';
import GeoFencingLocations from '../settingScreen/location/GeoFencingLocations';

export type SettingsStackParamList = {
  SettingsMain: undefined;
  PersonalDetails: undefined;
  ConpanyShifts: undefined;
  PayConfigurations: undefined;
  HolidaysScreen: undefined;
  PaySlipsScreen: undefined;
  AddPayrollHead: undefined;
  ExpenseTypes: undefined;
  AddShift: undefined;
  GeoFencingLocations: undefined;
  AddGeofenceScreen: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default function SettingsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}
    // initialRouteName="PayConfigurations"
    >
      <Stack.Screen name="SettingsMain" component={SettingScreen} />
      <Stack.Screen name="PersonalDetails" component={PersonalDetails} />
      <Stack.Screen name="ConpanyShifts" component={ConpanyShifts} />
      <Stack.Screen name="PayConfigurations" component={PayConfigurations} />
      <Stack.Screen name="HolidaysScreen" component={HolidaysScreen} />
      <Stack.Screen name="PaySlipsScreen" component={PaySlipsScreen} />
      <Stack.Screen name="AddPayrollHead" component={AddPayrollHead} />
      <Stack.Screen name="ExpenseTypes" component={ExpenseTypes} />
      <Stack.Screen name="AddShift" component={AddShift} />
      <Stack.Screen name="GeoFencingLocations" component={GeoFencingLocations} />
      <Stack.Screen name="AddGeofenceScreen" component={AddGeofenceScreen} />
    </Stack.Navigator>
  );
}
