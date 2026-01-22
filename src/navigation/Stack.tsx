import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

// import AuthNavigator from './AuthNavigator';
// import AdminNavigator from './AdminNavigator';
// import EmployeeNavigator from './EmployeeNavigator';
import PunchScreen from '../../screen/PunchScreen';
import { RequestScreen } from '../../screen/RequestScreen';
import SalaryScreen from '../../screen/SalaryScreen';
import SettingScreen from '../../screen/SettingScreen';
import { WorkScreen } from '../../screen/WorkScreen';
import YouScreen from '../../screen/YouScreen';

import PaySlip from '../../screen/salarySlip/PaySlip';
import AddDesignationScreen from '../settingScreen/AddDesignationScreen';
import AddPayrollHead from '../settingScreen/AddPayrollHead';
import AddShift from '../settingScreen/AddShift';
import CompanyDetails from '../settingScreen/CompanyDetails';
import ConpanyShifts from '../settingScreen/ConpanyShifts';
import DesignationsScreen from '../settingScreen/DesignationsScreen';
import ExpenseTypes from '../settingScreen/ExpenseTyes';
import HolidaysScreen from '../settingScreen/HolidaysScreen';
import AddGeofenceScreen from '../settingScreen/location/AddGeofenceScreen';
import GeoFencingLocations from '../settingScreen/location/GeoFencingLocations';
import PayConfigurations from '../settingScreen/PayConfigurations';
import PaySlipScreen from '../settingScreen/PaySlipsScreen';
import PersonalDetails from '../settingScreen/PersonalDetails';
import PopUpDesignationScreen from '../settingScreen/PopUpDesignationScreen';
import ReportsScreen from '../settingScreen/ReportsScreen';

//Admin
import AdminHomeScreen from '../../Admin/src/screen/homeScreen/AdminHomeScreen';
import AdminPunching from '../../Admin/src/screen/homeScreen/AdminPunching';
import Others from '../../Admin/src/screen/homeScreen/Others';

import LoginScreen from '../../Admin/src/auth/LoginScreen';
import BottomTabNavigation from '../../Admin/src/navigation/BottomTabNavigation';
import { AdminWork } from '../../Admin/src/screen/AdminWork';
import AllRequestsScreen from '../../Admin/src/screen/AllRequestsScreen';
import AdminSettingScreen from '../../Admin/src/screen/setting/AdminSettingScreen';
import AddStaffScreen from '../../Admin/src/screen/staff/AddStaffScreen';
import NewCategoryScreen from '../../Admin/src/screen/staff/NewCategoryScreen';
import SearchStaff from '../../Admin/src/screen/staff/SearchStaff';
import StaffHomeScreen from '../../Admin/src/screen/staff/StaffHomeScreen';
import TodaysAbsentScreen from '../../Admin/src/screen/staff/TodaysAbsentScreen';

export type RootStackParamList = {
  Auth: undefined;
  Admin: undefined;
  Employee: undefined;
  PunchScreen: undefined;
  RequestScreen: undefined;
  SalaryScreen: undefined;
  SettingScreen: undefined;
  WorkScreen: undefined;
  YouScreen: undefined;
  PaySlip:undefined;
  PersonalDetails:undefined;
  CompanyDetails:undefined;
  ConpanyShifts:undefined;
  AddShift:undefined;
  PayConfigurations:undefined;
  ExpenseTypes:undefined;
  GeoFencingLocations:undefined;
  AddGeofenceScreen:undefined;
  HolidaysScreen:undefined;
  PaySlipScreen:undefined;
  AddPayrollHead:undefined;
  EmployeeBottomTab:undefined;
  ReportsScreen:undefined;
  DesignationsScreen:undefined;
  AddDesignationsScreen:undefined;
  PopUpDesignationScreen:undefined;

  //Admin
  AdminHomeScreen:undefined;
  Others:undefined;
  AdminPunching:undefined;
  StaffHomeScreen:undefined;
  NewCategoryScreen:undefined;
  SearchStaff:undefined;
  TodaysAbsentScreen:undefined;
  AddStaffScreen:undefined;
  AdminWork:undefined;
  AllRequestsScreen:undefined;
  AdminSettingScreen:undefined; 
  AdminBottomTabNavigation:undefined;  

  LoginScreen:undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const user = {
    isLoggedIn: false, // change true to test
    role: 'ADMIN', // ADMIN | EMPLOYEE
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}
    initialRouteName='AdminBottomTabNavigation'
    >

      {/* Emplyee screen */}
      {/* <Stack.Screen name="HomeScreen" component={HomeScreen} /> */}


      <Stack.Screen name="PunchScreen" component={PunchScreen} />
      <Stack.Screen name="RequestScreen" component={RequestScreen} />
      <Stack.Screen name="SalaryScreen" component={SalaryScreen} />
      <Stack.Screen name="SettingScreen" component={SettingScreen} />
      <Stack.Screen name="WorkScreen" component={WorkScreen} />
      <Stack.Screen name="YouScreen" component={YouScreen} />

      <Stack.Screen name="PaySlip" component={PaySlip} />
      <Stack.Screen name="PersonalDetails" component={PersonalDetails} />
      <Stack.Screen name="CompanyDetails" component={CompanyDetails} />
      <Stack.Screen name="ConpanyShifts" component={ConpanyShifts} />
      <Stack.Screen name="AddShift" component={AddShift} />
      <Stack.Screen name="PayConfigurations" component={PayConfigurations} />
      <Stack.Screen name="AddPayrollHead" component={AddPayrollHead} />
      <Stack.Screen name="ExpenseTypes" component={ExpenseTypes} />
      <Stack.Screen name="GeoFencingLocations" component={GeoFencingLocations} />
      <Stack.Screen name="AddGeofenceScreen" component={AddGeofenceScreen} />
      <Stack.Screen name="HolidaysScreen" component={HolidaysScreen} />
      <Stack.Screen name="PaySlipScreen" component={PaySlipScreen} />
      <Stack.Screen name="ReportsScreen" component={ReportsScreen} />
      <Stack.Screen name="DesignationsScreen" component={DesignationsScreen} />
      <Stack.Screen name="AddDesignationsScreen" component={AddDesignationScreen} />
      <Stack.Screen 
        name="PopUpDesignationScreen" 
        component={PopUpDesignationScreen}
        options={{
          presentation: 'transparentModal',
          animation: 'slide_from_bottom',
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />



      {/* Admin screen */}
      <Stack.Screen name="AdminHomeScreen" component={AdminHomeScreen} />
      <Stack.Screen name="Others" component={Others} />
      <Stack.Screen name="AdminPunching" component={AdminPunching} />
      <Stack.Screen name="StaffHomeScreen" component={StaffHomeScreen} />
      <Stack.Screen name="NewCategoryScreen" component={NewCategoryScreen} />
      <Stack.Screen name="SearchStaff" component={SearchStaff} />
      <Stack.Screen name="TodaysAbsentScreen" component={TodaysAbsentScreen} />
      <Stack.Screen name="AddStaffScreen" component={AddStaffScreen} />
      <Stack.Screen name="AdminWork" component={AdminWork} />
      <Stack.Screen name="AllRequestsScreen" component={AllRequestsScreen} />
      <Stack.Screen name="AdminSettingScreen" component={AdminSettingScreen} />

      <Stack.Screen name="AdminBottomTabNavigation" component={BottomTabNavigation} />


      {/* login screen */}
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      

    </Stack.Navigator>
  );
};

export default RootNavigator;
