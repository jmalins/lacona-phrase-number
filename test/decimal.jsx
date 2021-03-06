/** @jsx createElement */
/* eslint-env mocha */

import _ from 'lodash'
import {createElement, Phrase} from 'lacona-phrase'
import {Decimal} from '..'
import {expect} from 'chai'
import {Parser} from 'lacona'

describe('Decimal', () => {
  let parser, data

  before(() => {
    parser = new Parser()
  })

  function test({input, text, placeholder, result, length = 1}) {
    if (text == null)  {
      text = placeholder ? 'number' : input
    }
    
    it(input, () => {
      const data = parser.parseArray(input)
      expect(data, input).to.have.length(length)
      if (length >= 1) {
        expect(data[0].words[0].text, input).to.equal(text)
        expect(data[0].result, input).to.equal(result)
        expect(data[0].words[0].placeholder, input).to.equal(placeholder)
      }
    })
  }

  describe('incomplete', () => {
    before(() => {
      parser.grammar = <Decimal />
    })

    const testCases = [
      {input: '', placeholder: true},
      {input: '-', placeholder: true},
      {input: '+', placeholder: true},
      {input: '.', placeholder: true},
      {input: '-.', placeholder: true},
      {input: '+.', placeholder: true},
      {input: '0', result: 0},
      {input: '-0', result: 0},
      {input: '+0', result: 0},
      {input: '0.', result: 0},
      {input: '-0.', result: 0},
      {input: '+0.', result: 0}
    ]

    _.forEach(testCases, test)
  })

  describe('default', () => {
    before(() => {
      parser.grammar = <Decimal />
    })

    const testCases = [
      {input: '1', result: 1},
      {input: '1.1', result: 1.1},
      {input: '-1', result: -1},
      {input: '-1.1', result: -1.1},
      {input: '123', result: 123},
      {input: '-123', result: -123},
      {input: '+123', result: 123},
      {input: '123.', result: 123},
      {input: '-123.', result: -123},
      {input: '+123.', result: 123},
      {input: '123.45', result: 123.45},
      {input: '-123.45', result: -123.45},
      {input: '+123.45', result: 123.45},
      {input: '0', result: 0},
      {input: '-0', result: 0},
      {input: '+0.0', result: 0},
      {input: '-0.0', result: 0},
      {input: '0.1', result: 0.1},
      {input: '-0.1', result: -0.1},
      {input: '.123', result: 0.123},
      {input: '+.123', result: 0.123},
      {input: '-.123', result: -0.123},
      {input: 'f3', length: 0},
      {input: '-f3', length: 0},
      {input: '3f', length: 0},
      {input: '-3f', length: 0},
      {input: '3+', length: 0},
      {input: '3-', length: 0},
      {input: '3+3', length: 0},
    ]

    _.forEach(testCases, test)
  })

  describe('handles an Decimal with an integer min', () => {
    before(() => {
      parser.grammar = <Decimal min={50} />
    })

    const testCases = [
      {input: '1', placeholder: true},
      {input: '49', placeholder: true},
      {input: '49.9', placeholder: true},
      {input: '-1', length: 0},
      {input: '-51', length: 0},
      {input: '-50.1', length: 0},
      {input: '50', result: 50},
      {input: '50.001', result: 50.001},
      {input: '61', result: 61},
      {input: '500', result: 500}
    ]

    _.forEach(testCases, test)
  })

  describe('handles an Decimal with an decimal min', () => {
    before(() => {
      parser.grammar = <Decimal min={50.1} />
    })

    const testCases = [
      {input: '1', placeholder: true},
      {input: '49', placeholder: true},
      {input: '49.9', placeholder: true},
      {input: '50', placeholder: true},
      {input: '50.0999', placeholder: true},
      {input: '-1', length: 0},
      {input: '-51', length: 0},
      {input: '-50.1', length: 0},
      {input: '50.1', result: 50.1},
      {input: '61', result: 61},
      {input: '500', result: 500},
      {input: '500.1', result: 500.1}
    ]

    _.forEach(testCases, test)
  })

  describe('handles an Decimal with an integer max', () => {
    before(() => {
      parser.grammar = <Decimal max={50} />
    })

    const testCases = [
      {input: '1', result: 1},
      {input: '50', result: 50},
      {input: '50.001', length: 0},
      {input: '51', length: 0},
      {input: '49.9', result: 49.9},
      {input: '-1', result: -1},
      {input: '-51', result: -51}
    ]

    _.forEach(testCases, test)
  })

  describe('handles an Decimal with a decimal max', () => {
    before(() => {
      parser.grammar = <Decimal max={50.1} />
    })

    const testCases = [
      {input: '1', result: 1},
      {input: '50', result: 50},
      {input: '51', length: 0},
      {input: '50.1', result: 50.1},
      {input: '50.001', result: 50.001},
      {input: '49.9', result: 49.9},
      {input: '-1', result: -1},
      {input: '-51', result: -51}
    ]

    _.forEach(testCases, test)
  })

  // TODO add more decimal equivalent tests //
  describe('handles an integer with a min and a max (both positive)', () => {
    before(() => {
      parser.grammar = <Decimal min={30} max={70} />
    })

    const testCases = [
      {input: '1', placeholder: true},
      {input: '0', placeholder: true},
      {input: '8', placeholder: true}, //TODO this could be improved see below
      {input: '30', result: 30},
      {input: '50', result: 50},
      {input: '70', result: 70},
      {input: '71', length: 0},
      {input: '+50', result: 50},
      {input: '+70', result: 70},
      {input: '+71', length: 0},
      {input: '-0', length: 0},
      {input: '-1', length: 0},
      {input: '-51', length: 0},
      {input: '-71', length: 0}
    ]

    _.forEach(testCases, test)
  })

  describe('handles an integer with a min and a max (both negative)', () => {
    before(() => {
      parser.grammar = <Decimal min={-70} max={-30} />
    })

    const testCases = [
      {input: '-1', placeholder: true},
      {input: '-0', placeholder: true},
      {input: '-8', placeholder: true}, //TODO this could be improved see below
      {input: '-30', result: -30},
      {input: '-50', result: -50},
      {input: '-70', result: -70},
      {input: '-71', length: 0},
      {input: '0', length: 0},
      {input: '+0', length: 0},
      {input: '+1', length: 0},
      {input: '1', length: 0},
      {input: '51', length: 0},
      {input: '71', length: 0}
    ]

    _.forEach(testCases, test)
  })

  describe('handles an integer with a min and a max (straddling 0)', () => {
    before(() => {
      parser.grammar = <Decimal min={-50} max={50} />
    })

    const testCases = [
      {input: '1', result: 1},
      {input: '-1', result: -1},
      {input: '-0', result: 0},
      {input: '0', result: 0},
      {input: '-30', result: -30},
      {input: '-50', result: -50},
      {input: '-70', length: 0},
      {input: '30', result: 30},
      {input: '50', result: 50},
      {input: '70', length: 0}
    ]

    _.forEach(testCases, test)
  })
})

