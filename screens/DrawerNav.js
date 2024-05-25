import * as React from 'react';
import { Drawer } from 'react-native-paper';

const DrawerNav = () => {
  const [active, setActive] = React.useState('');

  return (
    <Drawer.Section title="Some title" style={{ width: '70%' }}>
      <Drawer.Item
     style={{ backgroundColor: '#64ffda' }}
     icon="star"
     label="First Item"
   />
      <Drawer.Item
     style={{ backgroundColor: '#64ffda' }}
     icon="star"
     label="First Item"
   />
    </Drawer.Section>
  );
};

export default DrawerNav;