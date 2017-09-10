import React from 'react'
import App from '../../src/components/App.jsx'
import {mount} from 'enzyme'

test('welcomes the user to React', function () {
  const wrapper = mount(<App />)
  expect(wrapper.text()).toContain('Coded by Steve Zelek using React')
})