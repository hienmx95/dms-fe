import React, { useState } from 'reactn';
import InputTag from 'views/ProductView/ProductDetail/PriceAndVariations/InputTag/InputTag';
import { storiesOf } from '@storybook/react';
import nameof from 'ts-nameof.macro';

export const title: string = 'InputTag';

function Default() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <InputTag
      value={value}
      onChange={(value: string[]) => {
        setValue(value);
      }}
    />
  );
}

storiesOf('TagInput', module)
  .add(nameof(Default), Default);

