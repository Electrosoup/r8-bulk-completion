import React from 'react'
import ReactDOM from 'react-dom'
import AppContainer from './AppContainer'
import {getQualification} from '../reducers/reducer'
import App from './index'
import configureStore from '../store/configure-store'
import Enzyme from 'enzyme'
import { Provider } from 'react-redux'
import testData from '../test-data'
import Adapter from 'enzyme-adapter-react-16'
import { mount, shallow } from 'enzyme'
import { criteriaScore, qualificationCompleteable, criteriaCompletable } from '../reducers/reducer'

Enzyme.configure({ adapter: new Adapter() })

it('renders without crashing', () => {
  const div = document.createElement('div');
  const store = configureStore()
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>, div);
})

it('sets selected qualification', () => {
  const store = configureStore({'defaultReducer':testData})
  const component = mount(<AppContainer store={store} />)
  component.find('select').simulate('change', {target: {value:'12345'}})
  expect(store.getState().defaultReducer.currentQualification).toEqual('12345')
})

it('lists candidates on a selected qualifiaction', () => {
  const store = configureStore({'defaultReducer':testData})
  const component = mount(<AppContainer store={store} />)
  component.find('select').simulate('change', {target: {value:'99999'}})
  expect(component.find('.candidates-list').children().length).toEqual(2)
})

it('chooses a qualification with no candidates', () => {
  const store = configureStore({'defaultReducer':testData})
  const component = mount(<AppContainer store={store} />)
  component.find('select').simulate('change', {target: {value:'66666'}})
  expect(component.find('.candidates-list').children().length).toEqual(0)

})

it('selects a candidate', () => {
  const store = configureStore({'defaultReducer':testData})
  const component = mount(<AppContainer store={store} />)
  let checkbox = () => component.find('.candidateSelected').first().find('input')
  checkbox().simulate('click', {target: {checked: true}});
  let qualification = getQualification(store.getState().defaultReducer)
  expect(qualification.candidates.filter(item => item.selected).length).toEqual(1)
})

it('selects a unit', () => {
  const store = configureStore({'defaultReducer':testData})
  const component = mount(<AppContainer store={store} />)
  let checkbox = () => component.find('.unitSelected').first().find('input')
  checkbox().simulate('click', {target: {checked: true}});
  let qualification = getQualification(store.getState().defaultReducer)
  console.log(store.getState().defaultReducer)
})

it('toggles all candidates', () => {
  const store = configureStore({'defaultReducer':testData})
  const component = mount(<AppContainer store={store} />)
  let checkbox = () => component.find('#toggleAllCandidates').find('input')
  checkbox().simulate('click', {target: {checked: true}});
  let qualificationTogTrue = getQualification(store.getState().defaultReducer)
  expect(qualificationTogTrue.candidates.filter(item => item.selected).length).toEqual(2)
  checkbox().simulate('click', {target: {checked: false}});
  let qualificationTogFalse = getQualification(store.getState().defaultReducer)
  expect(qualificationTogFalse.candidates.filter(item => item.selected).length).toEqual(0)
})

// it('toggles all units', () => {
//   const store = configureStore({'defaultReducer':testData})
//   const component = mount(<AppContainer store={store} />)
//   let checkbox = () => component.find('#toggleAllUnits').find('input')
//   checkbox().simulate('click', {target: {checked: true}});
//   let qualificationTogTrue = getQualification(store.getState().defaultReducer)
//   expect(qualificationTogTrue.units.filter(item => item.selected).length).toEqual(5)
//   checkbox().simulate('click', {target: {checked: false}});
//   let qualificationTogFalse = getQualification(store.getState().defaultReducer)
//   expect(qualificationTogFalse.units.filter(item => item.selected).length).toEqual(0)
// })

it('tests number of credits completed', () => {

  var criteria = {
    criteria: "COMPLETE_ON_CREDITS",
    groups:[
      {units:[
        {credit:6,
        selected:true},
        {credit:2,
        selected:true},
       ]},
      {units:[
          {credit:10,
           selected:true},
          {credit:9,
           selected:false}]}],
    minimumScore:0,
    type:"OPTIONAL"}

  expect(criteriaScore(criteria)).toEqual(18)

})

it('tests number of units completed', () => {

  var criteria = {
    criteria: "COMPLETE_ON_UNITS",
    groups:[
      {units:[
        {credit:6,
        selected:true},
        {credit:2,
         selected:true},
       ]},
      {units:[
         {credit:10,
          selected:true},
         {credit:9,
          selected:false}]}],
    minimumScore:0,
    type:"OPTIONAL"}

  expect(criteriaScore(criteria)).toEqual(3)
})

it('tests mandatory criteria not completable ', () => {

  var criteria = {
    criteria: "COMPLETE_ON_UNITS",
    groups:[
      {units:[
        {credit:6,
        selected:true},
        {credit:2,
         selected:true},
       ]},
      {units:[
         {credit:10,
          selected:true},
         {credit:9,
          selected:false}]}],
    minimumScore:0,
    type:"MANDATORY"}

  expect(criteriaCompletable(criteria)).toBeFalsy()

})

it('tests mandatory criteria is completable ', () => {

  var criteria = {
    criteria: "COMPLETE_ON_UNITS",
    groups:[
      {units:[
        {credit:6,
        selected:true},
        {credit:2,
         selected:true},
       ]},
      {units:[
         {credit:10,
          selected:true},
         {credit:9,
          selected:true}]}],
    minimumScore:0,
    type:"MANDATORY"}

  expect(criteriaCompletable(criteria)).toBeTruthy()

})

it('optional criteria units is completable ', () => {

  var criteria = {
    criteria: "COMPLETE_ON_UNITS",
    groups:[
      {units:[
        {credit:6,
        selected:true},
        {credit:2,
         selected:true},
       ]},
      {units:[
         {credit:10,
          selected:true},
         {credit:9,
          selected:true}]}],
    minimumScore:2,
    type:"OPTIONAL"}

  expect(criteriaCompletable(criteria)).toBeTruthy()

})

it('optional criteria units isnt completable ', () => {

  var criteria = {
    criteria: "COMPLETE_ON_UNITS",
    groups:[
      {units:[
        {credit:6,
        selected:false},
        {credit:2,
         selected:true},
       ]},
      {
       units:[
         {credit:10,
          selected:false},
         {credit:9,
          selected:true}]}],
    minimumScore:3,
    type:"OPTIONAL"}

  expect(criteriaCompletable(criteria)).toBeFalsy()

})


it('optional criteria credits is completable ', () => {

  var criteria = {
    criteria: "COMPLETE_ON_CREDITS",
    groups:[
      {units:[
        {credit:6,
        selected:true},
        {credit:2,
         selected:false},
       ]},
      {units:[
         {credit:10,
          selected:true},
         {credit:9,
          selected:false}]}],
    minimumScore:16,
    type:"OPTIONAL"}

  expect(criteriaCompletable(criteria)).toBeTruthy()

})

it('optional criteria credits isnt completable ', () => {

  var criteria = {
    criteria: "COMPLETE_ON_CREDITS",
    groups:[
      {units:[
        {credit:6,
        selected:true},
        {credit:2,
         selected:false},
       ]},
      {units:[
         {credit:10,
          selected:true},
         {credit:9,
          selected:false}]}],
    minimumScore:20,
    type:"OPTIONAL"}

  expect(criteriaCompletable(criteria)).toBeFalsy()

})

it('invalid criteria type ', () => {

  var criteria = {
    criteria: "BULL SHIT",
    groups:[
      {units:[
        {credit:6,
        selected:true},
        {credit:2,
         selected:false},
       ]},
      {units:[
         {credit:10,
          selected:true},
         {credit:9,
          selected:false}]}],
    minimumScore:20,
    type:"OPTIONAL"}

  expect(criteriaCompletable(criteria)).toBeFalsy()

})

it('test qualification is completable', () => {

  var criterias = [
    {criteria: "COMPLETE_ON_CREDITS",
     groups:[
        {units:[
            {credit:6,
             selected:true},
            {credit:2,
             selected:true},
          ]},
        {units:[
           {credit:10,
            selected:true},
           {credit:9,
            selected:true}]}],
      minimumScore:0,
      type:"MANDATORY"},
    {criteria: "COMPLETE_ON_CREDITS",
     groups:[
        {units:[
          {credit:6,
           selected:true},
          {credit:2,
           selected:false}]},
      {units:[
         {credit:10,
          selected:true},
         {credit:9,
          selected:false}]}],
    minimumScore:10,
    type:"OPTIONAL"}]

  expect(qualificationCompleteable(criterias)).toBeTruthy()
})

it('test qualification is not completable', () => {

  var criterias = [
    {criteria: "COMPLETE_ON_CREDITS",
     groups:[
        {units:[
            {credit:6,
             selected:true},
            {credit:2,
             selected:true},
          ]},
        {units:[
           {credit:10,
            selected:true},
           {credit:9,
            selected:false}]}],
      minimumScore:0,
      type:"MANDATORY"},
    {criteria: "COMPLETE_ON_CREDITS",
     groups:[
        {units:[
          {credit:6,
           selected:true},
          {credit:2,
           selected:false}]},
      {units:[
         {credit:10,
          selected:true},
         {credit:9,
          selected:false}]}],
    minimumScore:10,
    type:"OPTIONAL"}]
  expect(qualificationCompleteable(criterias)).toBeFalsy()
})



