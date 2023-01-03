import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Button } from '@mui/material';

export default {
  title: 'Example/Button',
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children: 'Button',
};

export const Secondary = Template.bind({});
Secondary.args = {
  children: 'Button',
};

export const Outlined = Template.bind({});
Outlined.args = {
  variant: 'outlined',
  children: 'Button',
};

export const Text = Template.bind({});
Text.args = {
  variant: 'text',
  children: 'Button',
};

export const Large = Template.bind({});
Large.args = {
  size: 'large',
  variant: 'contained',
  children: 'Button',
};

export const Small = Template.bind({});
Small.args = {
  size: 'small',
  variant: 'contained',
  children: 'Button',
};
