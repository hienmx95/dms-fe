import {addDecorator} from '@storybook/react';
import Card from "antd/lib/card";
import React from 'react';
import '../src/styles';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

addDecorator((storyFn) => (
  <Card>
    {storyFn()}
  </Card>
));
