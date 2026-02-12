import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

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

import EmployeeLoginScreen from '../employee/employeeAuth/EmployeeLoginScreen';
import EmployeeVerificationScreen from '../employee/employeeAuth/VerificationScreen';
import SelectRoleScreen from '../roleScreen/SelectRoleScreen';
import { useAuthStore } from '../store/useAuthStore';
import { useEmployeeAuthStore } from '../store/useEmployeeAuthStore';
import BottomTabNavigator from './BottomTabNavigator';

//Admin
import AdminHomeScreen from '../../Admin/src/screen/homeScreen/AdminHomeScreen';
import AdminPunching from '../../Admin/src/screen/homeScreen/AdminPunching';
import Others from '../../Admin/src/screen/homeScreen/Others';


import LoginScreen from '../../Admin/src/auth/LoginScreen';
import RegisterBusinessScreen from '../../Admin/src/auth/RegisterBusinessScreen';
// import SelectAccountTypeScreen from '../../Admin/src/auth/SelectAccountTypeScreen';
import VerificationScreen from '../../Admin/src/auth/VerificationScreen';
import BottomTabNavigation from '../../Admin/src/navigation/BottomTabNavigation';
import { AdminWork } from '../../Admin/src/screen/AdminWork';
import AllRequestsScreen from '../../Admin/src/screen/AllRequestsScreen';
import PermissionsScreen from '../../Admin/src/screen/homeScreen/PermissionsScreen';
import AdminSettingScreen from '../../Admin/src/screen/setting/AdminSettingScreen';
import AddStaffScreen from '../../Admin/src/screen/staff/AddStaffScreen';
import EmployeeDetailsScreen from '../../Admin/src/screen/staff/EmployeeDetailsScreen';
import NewCategoryScreen from '../../Admin/src/screen/staff/NewCategoryScreen';
import SearchStaff from '../../Admin/src/screen/staff/SearchStaff';
import StaffHomeScreen from '../../Admin/src/screen/staff/StaffHomeScreen';
import TodaysAbsentScreen from '../../Admin/src/screen/staff/TodaysAbsentScreen';
import AdminHolidaysScreen from '../../Admin/src/screen/holidayScreen/AdminHolidayScreen';

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
  PaySlipsScreen:undefined;
  AddPayrollHead:undefined;
  EmployeeBottomTab:undefined;
  ReportsScreen:undefined;
  DesignationsScreen:undefined;
  AddDesignationsScreen:undefined;
  PopUpDesignationScreen:undefined;

  EmployeeLoginScreen:undefined;
  EmployeeVerificationScreen: { mobile: string };
  SelectRoleScreen: undefined;

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
  PermissionsScreen: undefined;

  LoginScreen:undefined;
  VerificationScreen: { mobile: string };
  // SelectAccountTypeScreen: undefined;
  RegisterBusinessScreen: undefined;
  EmployeeDetailsScreen: { employeeId: string };
  AdminHolidaysScreen:undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>('SelectRoleScreen');

  useEffect(() => {
    const checkLoginStatus = () => {
      const adminStore = useAuthStore.getState();
      const employeeStore = useEmployeeAuthStore.getState();

      if (employeeStore.isLoggedIn && employeeStore.token && employeeStore.employee) {
        // Employee login prioritized
        setInitialRoute('EmployeeBottomTab');
      } else if (adminStore.isLoggedIn && adminStore.token && adminStore.company) {
        // Admin/Company login
        if (adminStore.company.name) {
          setInitialRoute('AdminBottomTabNavigation');
        } else {
          setInitialRoute('RegisterBusinessScreen');
        }
      } else {
        setInitialRoute('SelectRoleScreen');
      }
      setIsLoading(false);
    };

    const isHydrated = useAuthStore.persist.hasHydrated() && useEmployeeAuthStore.persist.hasHydrated();

    if (!isHydrated) {
      let adminHydrated = useAuthStore.persist.hasHydrated();
      let employeeHydrated = useEmployeeAuthStore.persist.hasHydrated();

      const checkBoth = () => {
        if (adminHydrated && employeeHydrated) {
          checkLoginStatus();
        }
      };

      if (!adminHydrated) {
        const unsubAdmin = useAuthStore.persist.onFinishHydration(() => {
          adminHydrated = true;
          checkBoth();
          unsubAdmin();
        });
      }

      if (!employeeHydrated) {
        const unsubEmployee = useEmployeeAuthStore.persist.onFinishHydration(() => {
          employeeHydrated = true;
          checkBoth();
          unsubEmployee();
        });
      }
    } else {
      checkLoginStatus();
    }
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2FAED7" />
      </View>
    );
  }

  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRoute}
    >

      {/* Role Selection Screen */}
      <Stack.Screen name="SelectRoleScreen" component={SelectRoleScreen} />

      {/* Emplyee screen */}
      {/* <Stack.Screen name="HomeScreen" component={HomeScreen} 
      AdminBottomTabNavigation/> */}


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
      <Stack.Screen name="PaySlipsScreen" component={PaySlipScreen} />
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
      <Stack.Screen name="EmployeeLoginScreen" component={EmployeeLoginScreen} />
      <Stack.Screen name="EmployeeVerificationScreen" component={EmployeeVerificationScreen} />
      <Stack.Screen name="EmployeeBottomTab" component={BottomTabNavigator} />



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
      <Stack.Screen name="PermissionsScreen" component={PermissionsScreen} />

      <Stack.Screen name="AdminBottomTabNavigation" component={BottomTabNavigation} />
      <Stack.Screen name="AdminHolidaysScreen" component={AdminHolidaysScreen} />


      {/* login screen */}
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
      {/* <Stack.Screen name="SelectAccountTypeScreen" component={SelectAccountTypeScreen} /> */}
      <Stack.Screen name="RegisterBusinessScreen" component={RegisterBusinessScreen} />
      <Stack.Screen name="EmployeeDetailsScreen" component={EmployeeDetailsScreen} />
      

    </Stack.Navigator>
  );
};

export default RootNavigator;
