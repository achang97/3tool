import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Button } from '@mui/material';

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['contained', 'raised', 'outlined', 'text'],
      defaultValue: 'contained',
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'error', 'warning', 'info', 'success'],
      defaultValue: 'primary',
    },
    disabled: {
      control: 'boolean',
      defaultValue: false,
    },
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Contained = Template.bind({});
Contained.args = {
  variant: 'contained',
  children: 'Button',
};

export const Raised = Template.bind({});
Raised.args = {
  variant: 'raised',
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
