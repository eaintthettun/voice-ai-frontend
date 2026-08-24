import * as React from 'react';
import { createStaticNavigation } from '@react-navigation/native';
import RootStack from './navigation';
import './global.css';

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}